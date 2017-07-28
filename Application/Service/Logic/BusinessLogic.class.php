<?php
namespace  Service\Logic;

class BusinessLogic extends  \Think\Model{
	protected $requestModel,$receiveModel,$poiModel;
	protected  function _initialize(){
		$this->requestModel=new \Service\Model\RequestModel();
		$this->receiveModel=new \Service\Model\ReceiveModel();
		$this->poiModel=new \Service\Model\PoiModel();
	}
	
	  
	/**
	 * Description: 用户--修改商家接收请求表记录
	 * Param:  userId=>'用户ID'，status=>'状态位'
	 * Author： ward
	 * Date:2015-12-14
	 */
	public  function  changeStatusByUserId($userId,$status=null){
		
		$userId=intval($userId);
		$data['USER_STATUS']=empty($status)?3:$status;
// 		if('mysql'===C('DB_TYPE')){
// 			$where="USER_STATUS not in (2,3,4,5) and REQUEST_ID in (select ID from K_USER_REQUEST where USER_ID={$userId})";
// 		}elseif('dm'===C('DB_TYPE')){
// 			$where="USER_STATUS not in (2,3,4,5) and REQUEST_ID in (select ID from __K_USER_REQUEST__ where USER_ID={$userId})";
// 		}
		$requestArr=$this->requestModel->where(array('USER_ID'=>$userId))->getField('ID',true);
		if(!empty($requestArr)){
			$where['USER_STATUS']=array('not in',array(2,3,4,5));
			$where['REQUEST_ID']=array('in',$requestArr);
			$res=$this->receiveModel->where($where)->save($data);
		}else{
			return 0;
		}
		
    }
    
    /**
     * Description: 商家--点击争先响应-用户发送的请求
     * Param:  $recevieId,$status,$limit
     * Author： ward
     * Date:2015-12-15
     */
    public function changeStatusByReceiveId($recevieId,$status,$limit=1){
    	$wx_worker=session('wx_worker');
    	$poi_id=$wx_worker['poi_id'];
   
    	$info=$this->receiveModel->find($recevieId);
    	
    	if(empty($info)){
    		$this->setError('参数错误！');
    		return false;
    		//return array('status'=>false,'info'=>'参数错误！');
    	}
    	if($info['status']>$status){
    		$this->setError('非法操作！');
    		return false;
    		//return array('status'=>false,'info'=>'非法操作！');
    	}
    	if($info['status']==6){
    		$this->setError('请求已经被其它人抢得！');
    		return false;
    		//return array('status'=>false,'info'=>'请求已经被其它人抢得！');
    	}
    	if($info['status']==2){
    		$this->setError('请求已达成协议');
    		return false;
    		//return array('status'=>false,'info'=>'请求已达成协议');
    	}
    	if($info['status']==1&&$status==0){
    		$this->setError('非法操作');
    		return false;
    		//return array('status'=>false,'info'=>'非法操作');
    	}
    	if($status==1&&$info['status']==1)
    	{
    		$this->setError('该请求已被贵方其他管理员抢单，请勿重复联系客户');
    		return false;
    		//return array('status'=>false,'info'=>'该请求已被贵方其他管理员抢单，请勿重复联系客户');
    	}
    	
    	$this->receiveModel->startTrans();//开启事务--用于连贯操作加锁
    	
    	if($status==1)
    	{
    		$where['REQUEST_ID']=$info['request_id'];
    		$where['ADMIN_STATUS']=array('in',array(1,2,4,5));// 1抢单成功 2达成意向  4到店消费    5最终未到店
    		$where['USER_STATUS']=array('neq',3);
    		$num=$this->receiveModel->lock(true)->where($where)->count();
    	
    		if($num>=$limit)
    		{
    			//只要有一个人抢到单   则其它请求订单则处于  待抢单状态
    			$this->receiveModel->rollback();//回滚
    			$this->setError('该请求已被抢完！');
    			return false;
    			//return array('status'=>false,'info'=>'该请求已被抢完！');
    		}
    		
    		$res1=$this->receiveModel->where(array('REQUEST_ID'=>$info['request_id'],'ADMIN_STATUS'=>0))->save(array('ADMIN_STATUS'=>6));
    		
    		//$info['did_status']=1;
    	}
    	$where1['ID']=$info['id'];
    	unset($info['id']);
    	$where1['POI_ID']=$poi_id;
//     	$info['manager_id']=$wx_worker['id'];
//     	$info['admin_status']=$status;
//   	$res=$this->receiveModel->where($where1)->save($info);
    	$update=array('ADMIN_STATUS'=>$status,'MANAGER_ID'=>$wx_worker['id'],'DID_STATUS'=>1);
    	$res=$this->receiveModel->where($where1)->save($update);
    	 
    	if(intval($res)){
    		$this->receiveModel->commit();//提交--解锁
    	}else{
    		$this->receiveModel->rollback();//回滚--解锁
    	}
    	return $res;
    	//return array('status'=>$res);
    }
    
    
    public  function  changeReceiveStatus($poiId,$status,$requestId){
		$userId=intval($userId);
		$where['POI_ID']=$poiId;
		$where['REQUEST_ID']=$requestId;
		$data['USER_STATUS']=$status;
		return  $this->receiveModel->where($where)->save($data);
	}
    
    /**
     * Description: 用户请求--给商家接收请求表添加记录
     * Param:  data=>array(array(...),...)，msg=>'通知信息'
     * Author： ward
     * Date:2015-12-14
     */
    public function addReceiveRecord($data,$msg){
    	$res= $this->receiveModel->addAll($data);
    	$msgArr=array(
    			"first" => array(
    					"value" => "您有一个未处理业务,请尽快处理!",
    					"color" => "#173177"
    			),
    			"keyword1" => array(
    					"value" => '您有一个未处理业务,请尽快处理!',
    					"color" => "#173177"
    			),
    			"keyword2" => array(
    					"value" => '红权科技',
    					"color" => "#173177"
    			),
    			"keyword3" => array(
    					"value" => toDate(),
    					"color" => "#173177"),
    			'remark'=>array(
    					"value" => '请点击详情进行处理',
    					"color" => "#173177")
    	);
    	if(!empty($msg)){
    		$msgArr['keyword1']['value']=$msg;
    	}   	
    	if($res){
    		$oauthLogic=new \Service\Logic\OauthLogic();
    		$wx=new \Common\Lib\Api\WxChat();
    		foreach($data as $key=>$val){
    			$poi_id=$val['POI_ID'];
    			$open_ids=$oauthLogic->getPoiManager($poi_id);
    			foreach($open_ids as $open_info){
    				$wx->templateMsg($msgArr,$open_info['openid'],'notice',$_SERVER['HTTP_HOST'].'/Service/Oauth/getRequests');
    			}
    		}
    	}
    	return $res;
    }
    
    
    /**
     * 用户点击下一家(或者商家点击拒绝)
     * @param int $requestId  请求id
     * @param int $receiveId  请求下的详细记录id
     * @param int $type       0表示用户操作1表示商家点操作
     */
    public  function getNextPoi($requestId,$receiveId,$type){
    	//修改该条相应的状态
    	if(0==$type){
    		$flag=$this->receiveModel->where('ID='.$receiveId)->save(array('USER_STATUS'=>3));
    	}elseif(1==$type){
    		$flag=$this->receiveModel->where('ID='.$receiveId)->save(array('ADMIN_STATUS'=>3));
    	}
    	//重新推送信息
    	$where['ADMIN_STATUS']=array('in',array('0','6'));
    	$where['USER_STATUS']=array('neq',3);
    	$where['REQUEST_ID']=$requestId;
    	$poiData=$this->receiveModel->where($where)->select();
    	$oauthLogic=new \Service\Logic\OauthLogic();
    	$wx=new \Common\Lib\Api\WxChat();
    	foreach ($poiData as $val){
    		$poi_id=$val['poi_id'];
    		$open_ids=$oauthLogic->getPoiManager($poi_id);
    		$data=array(
    				"first" => array(
    						"value" => "未处理业务！",
    						"color" => "#173177"
    				),
    				"keyword1" => array(
    						"value" => '您有一个未处理业务,请尽快处理!',
    						"color" => "#173177"
    				),
    				"keyword2" => array(
    						"value" => '红权科技',
    						"color" => "#173177"
    				),
    				"keyword3" => array(
    						"value" => toDate(),
    						"color" => "#173177"),
    				'remark'=>array(
    						"value" => '请点击详情进行处理',
    						"color" => "#173177")
    		);
    		foreach($open_ids as $open_info){
    			$wx->templateMsg($data,$open_info['openid'],'notice',$_SERVER['HTTP_HOST'].'/Service/Oauth/getRequests');
    		}
    
    	}
    	$map['ADMIN_STATUS']=array('in',array('0','6'));
    	$map['USER_STATUS']=array('neq',3);
    	$map['REQUEST_ID']=$requestId;
    	$time=time();
    	$res=$this->receiveModel->where($map)->save(array('ADMIN_STATUS'=>0,'UNIX_TIME'=>$time));
    	return $res;
    }
    /**
     * 
     */
    public function getBusinessResponse($receiveId,$requestId,$status){
    	
    	if(empty($receiveId)||empty($requestId)||empty($status)){
    		$this->setError('参数为空！');
    		return false;
    	}
    	
    	//更改did_status 说明该请求有商家响应
    	$userLogic=new \Service\Logic\UserLogic();
    	$userLogic->changeDidStatus($requestId);
    	if(3==$status){//当status==3时表示poi 点击未达成协议时   会触发 推荐下一家
    		$res=$this->getNextPoi($requestId, $receiveId,$type=1);
    	}else{
    		$res=$this->changeStatusByReceiveId($receiveId,$status);
    		//var_dump($res);exit();
    	}
    	
    	return $res;
    }
    
    /**
     * 
     */
    public function switchReceive($poiId){
    	$info=$this->poiModel->field('id,receive_status')->find($poiId);
    	if($info['receive_status']==1){
    		$info['receive_status']=0;
    	}else{
    		$info['receive_status']=1;
    	}
    	$update=array('ID'=>$info['id'],'RECEIVE_STATUS'=>$info['receive_status']);
    	$this->poiModel->save($update);
    	return array('status'=>1,'receive_status'=>$info['receive_status']);
    }
    
    /**
     * 
     */
    public function new_response($poiId){
    	$data=$this->receiveModel->alias('a')->field('a.ID,b.NAME,b.MOBILE as phone,c.DATE_TIME,c.REQUEST_TYPE,a.AUTO_STATUS,a.FLAG')
    		->join('__K_USER_REQUEST__ c on a.REQUEST_ID=c.ID','left')
    		->join('__USER__ b on c.USER_ID=b.ID','left')
    		->where('a.POI_ID='.intval($poiId).' and a.FLAG=1')
    		->order('c.DATE_TIME desc')->select();
    	$update['FLAG']=0;
    	$this->receiveModel->where('POI_ID='.intval($poiId).' and FLAG=1')->save($update);
    	return $data;
    }
    
    /**
     * 
     */
    
    public function lists($poiId,$page=1){
    	$pageNum=5;
    	$start=($page-1)*$pageNum;
    	$where['a.POI_ID']=intval($poiId);
    	$where['c.DATE_TIME']=array('lt',date('Y-m-d 00:00:00'));
    	$field='a.ID,a.BOOK_TIME,b.NICKNAME as name,b.MOBILE as phone,d.NAME as poi_name,c.DATE_TIME,a.ADMIN_STATUS,a.USER_STATUS,c.REQUEST_TYPE,a.FLAG,c.LAT,c.LON,d.LAT as p_lat,d.LON as p_lon';
    	$data=$this->receiveModel->alias('a')->field($field)
    	->join('__K_USER_REQUEST__ c on a.REQUEST_ID=c.ID','left')
    	->join('__USER__ b on c.USER_ID=b.ID','left')
    	->join('__POI__ d on d.ID=a.POI_ID','left')
    	->where($where)
    	->limit($start.','.$pageNum)
    	->order('c.DATE_TIME desc')->select();
    	$update['FLAG']=0;
    	$this->receiveModel->where('POI_ID='.intval($poiId).' and FLAG=1')->save($update);
    	
    	return $data;
    }
    
    
    
    function today_lists($poi_id){
    	$where['a.POI_ID']=intval($poi_id);
    	$where['a.ADMIN_STATUS']=array('not in',array(6,9));//6表示待抢单 9表示请求失效
    	$where['a.USER_STATUS']=array('not in',array(9));//3表示用户未达成 9表示请求失效
    	$where['c.DATE_TIME']=array('egt',date('Y-m-d 00:00:00'));
    	$field='a.ID,a.BOOK_TIME,a.REQUEST_ID,b.NICKNAME as name,b.MOBILE as phone,d.NAME as poi_name,c.DATE_TIME,';
    	$field.='a.ADMIN_STATUS,a.USER_STATUS,c.REQUEST_TYPE,c.AUTO_STATUS,a.FLAG,c.LAT,c.LON,d.LAT as p_lat,d.LON as p_lon';
    	$data=$this->receiveModel->alias('a')->field($field)
    	->join('__K_USER_REQUEST__ c on a.REQUEST_ID=c.ID','left')
    	->join('__USER__ b on c.USER_ID=b.ID','left')
    	->join('__POI__ d on d.ID=a.POI_ID','left')
    	->where($where)
    	->order('c.DATE_TIME desc')->select();
    	$update['FLAG']=0;
    	$this->receiveModel->where('POI_ID='.intval($poi_id).' and FLAG=1')->save($update);
    
    	return $data;
    }
    
    function last_order($poi_id){
    	$where['a.POI_ID']=intval($poi_id);
    	$where['c.DATE_TIME']=array('egt',date('Y-m-d 00:00:00'));
    	$field='a.ID,a.BOOK_TIME,a.REQUEST_ID,b.NICKNAME as name,b.MOBILE as phone,d.NAME as poi_name,c.DATE_TIME,';
    	$field.='a.ADMIN_STATUS,a.USER_STATUS,c.REQUEST_TYPE,c.AUTO_STATUS,a.FLAG,c.LAT,c.LON,d.LAT as p_lat,d.LON as p_lon';
    	$data=$this->receiveModel->alias('a')->field($field)
    	->join('__K_USER_REQUEST__ c on a.REQUEST_ID=c.ID','left')
    	->join('__USER__ b on c.USER_ID=b.ID','left')
    	->join('__POI__ d on d.ID=a.POI_ID','left')
    	->where($where)
    	->order('c.DATE_TIME desc')->find();
    	return $data;
    }
    
    
    /**
     * 商家实时获得当天接到系统推荐的吃（住）请求消息的 总数
     */
    public function getTodaySum($poiId){
    	$unixTime=strtotime(date('Y-M-d'));
    	$where['POI_ID']=$poiId;
    	$where['UNIX_TIME']=array('egt',$unixTime);
    	return $this->receiveModel->where($where)->count();
    	 
    }
    /**
     * 商家实时获得当天响应 系统发送来的请求数量
     */
    public function getTodayDid($poiId){
    	$unixTime=strtotime(date('Y-M-d'));
    	$where['POI_ID']=$poiId;
    	$where['UNIX_TIME']=array('egt',$unixTime);
    	$where['ADMIN_STATUS']=array('in',array(1,2,3,4,5));
    	return $this->receiveModel->where($where)->count();
    
    }
    
   /**
    * Description:定时器执行--关闭一定时间内未得到任何相应的请求
    * @return boolean
    */ 
    public function endService(){
    	$wx=new \Common\Lib\Api\WxChat();
    	$userModel=new \Service\Model\OauthModel();
    	$openids=$userModel->where('ROLE=2')->getField('OPENID',true);
    	$where['a.DID_STATUS']=0;
    	$now=date('Y-m-d H:i:s',time()-3*60);
    	// $now=date('Y-m-d H:i:s',time()-30);
    	$where['a.DATE_TIME']=array('elt',$now);
    	$date=date('Y:m:d H:i:s');
    	$data=$this->requestModel->alias('a')->field('a.*,b.MOBILE')
    	->join('__USER__ b on a.USER_ID=b.ID','left')->where($where)->select();
  
    	foreach($data as $row)
    	{
    		$data=array(
    				"first" => array(
    						"value" => "手机号为".$row['mobile']."的用户已有3分钟未得到响应！",
    						"color" => "#173177"
    				),
    				"keyword1" => array(
    						"value" => "手机号为".$row['mobile']."的用户已有3分钟未得到响应！",
    						"color" => "#173177"
    				),
    				"keyword2" => array(
    						"value" => '红权科技',
    						"color" => "#173177"
    				),
    				"keyword3" => array(
    						"value" => $date,
    						"color" => "#173177"),
    				'remark'=>array(
    						"value" => '请点击详情进行处理',
    						"color" => "#173177")
    		);
    		foreach($openids as $openid)
    		{
    			//暂时不推送消息--20151217--ward
    			//$wx->templateMsg($data,$openid,'notice','');
    		}
    		$ids[]=$row['id'];
    	}
    	
    	if(isset($ids))
    	{
    		//暂时不做兜底处理--20151217--ward
//     		$wher['id']=array('in',$ids);
//     		$this->requestModel->where($wher)->save(array('did_status'=>2));
    	}
    	
    	//让订单失效
     	$now=time()-3*60;
	   	$select['ADMIN_STATUS']=0;
    	$select['UNIX_TIME']=array('lt',$now);
    	$this->receiveModel->where($select)->save(array('ADMIN_STATUS'=>9));
    	
    	$map['USER_STATUS']=0;
    	$map['UNIX_TIME']=array('lt',$now);
    	$this->receiveModel->where($map)->save(array('USER_STATUS'=>9));
    	return true;
    
    }
}