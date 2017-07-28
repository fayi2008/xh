<?php
namespace  Service\Logic;

class UserLogic extends  \Think\Model{
	protected $requestModel,$receiveModel,$poiModel;
	protected  function _initialize(){
		$this->requestModel=new \Service\Model\RequestModel();
		$this->receiveModel=new \Service\Model\ReceiveModel();
		$this->poiModel=new \Service\Model\PoiModel();
	}
	
	/**
	 * Description: 获得poi列表信息
	 * Param:  array('lat','lng','radius'=>'半径(米)','type'=>'0住 1吃 ')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public function getPoiList($select){
		$lon=$select['lng']; //经度
		$lat=$select['lat']; //纬度
		$type=$select['type'];//类型   0住 1吃 
		//$level=I('get.level');
		
		$distance=$select['radius'];//半径长度
		$where['a.TYPE']=1;//ward 在该表中类型为1 表示商户
		$where['a.RECEIVE_STATUS']=1;
		if(empty($distance)){
			$distance=5000;
		}
		if(isset($type)){
			if(1==$type){
				$where['a.FOOD']=1;
			}elseif(0==$type){
				$where['a.HOTEL']=1;
			}
		}
		$distance=intval($distance);
		$dist=distance2degree($lat,$distance);
		$field='a.*';
	
		$where['a.LON']=array('BETWEEN',($lon-$dist['lng_d']).','.($lon+$dist['lng_d']));
		$where['a.LAT']=array('BETWEEN',($lat-$dist['lat_d']).','.($lat+$dist['lat_d']));
		$res=$this->poiModel->alias('a')->where($where)->field($field)->select();
		return $res;
	}
	
	/**
	 * Description: 获得poi详细信息
	 * Param:
	 * Author： ward
	 * Date:2015-12-14
	 */
	public function getPoiDetail(){
		
	}


	
	
	/**
	 * Description: 根据用户的筛选条件推荐住宿酒店
	 * Param: array('lat','lon','level')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public  function getTenHotel($select){
		$user=session('user');
		$userId=$user['id'];
		
		if(empty($userId)){
			$this->setError('请先登录！');
			return false;
		}
		$lon=$select['lng'];//经度
		$lat=$select['lat'];//纬度		
		//1.用户将之前的请求其在商家接收表中的记录设置为‘失效’
		$businessLogic=new \Service\Logic\BusinessLogic();
		$businessLogic->changeStatusByUserId($userId);
		
		//2.查询获得待处理的poi点信息
		$select['type']=0;//
		$data=$this->getPoiFilter($select);
		
		if(!is_array($data)){
			return false;
		}
		
		//3.按一定规则将查询出来的数据重新排序
		$data=$this->bubbleSort($lat,$lon,$data);
	
		//4.
		$count=count($data)>30?30:count($data);
		
		$data=array_slice($data,0,$count);
		
		if(!empty($data)){
			$insert=array();
			$insert['POI_ID']=0;//兴趣点默认为0 即
			$insert['REQUEST_TYPE']=$requestType=0;//0住1吃
			$insert['CONSUME_TYPE']=$filter['type'];//消费类型
			$insert['USER_ID']=$userId;
			$insert['LAT']=$lat;
			$insert['LON']=$lon;
		
			$requestId=$this->addRequestRecord($insert);
			
			$addData=array();
			$time=time();
			for($i=0;$i<$count;$i++){
				$addData[]=array('POI_ID'=>$data[$i]['id'],'REQUEST_ID'=>$requestId,'STATUS'=>0,'UNIX_TIME'=>$time);
				$addData[$i]['REQUEST_ID']=$requestId;
			}
			
			$businessLogic->addReceiveRecord($addData,$msg="你有个住宿订单要处理！");
			return $requestId;
		}
		
		return false;
	}
	
	
	
	/**
	 * Description: 根据用户的筛选条件推荐--吃饭--酒店
	 * Param: $_GET('lat','lon','poi','level')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public  function getTenFood($select){
		$user=session('user');
		$userId=$user['id'];
		if(empty($userId)){
			$this->setError('请先登录！');
			return false;
		}
		$lon=$select['lng'];//经度
		$lat=$select['lat'];//纬度
		$poiId=empty($_GET['poi'])?'':$_GET['poi'];//如果poi点id不为空，则说明是用户自己强意向请求
	
		
		//1.用户将之前的请求其在商家接收表中的记录设置为‘失效’
		$businessLogic=new \Service\Logic\BusinessLogic();
		$businessLogic->changeStatusByUserId($userId);
	
		//2.查询获得待处理的poi点信息
		$select['type']=1;
		$data=$this->getPoiFilter($select);
		if(!is_array($data)){
			return false;
		}
		
		//3.按一定规则将查询出来的数据重新排序
		$data=$this->bubbleSort($lat,$lon,$data);
	
		
		$count=count($data)>30?30:count($data);
		$data=array_slice($data,0,$count);
		if(empty($data)){
			return false;
		}
		//4.用户请求表添加记录
		$insert=array();
		$insert['POI_ID']=0;//兴趣点默认为0 即
		$insert['REQUEST_TYPE']=$requestType=1;//0住1吃
		$insert['CONSUME_TYPE']=$filter['type'];//消费类型
		$insert['USER_ID']=$userId;
		$insert['LAT']=$lat;
		$insert['LON']=$lon;
		$requestId=$this->addRequestRecord($insert);
		
		//5给商家接收请求表并通知商家
		$addDate=array();
		$time=time();
		for($i=0;$i<$count;$i++){
			$addDate[]=array('POI_ID'=>$data[$i]['id'],'REQUEST_ID'=>$requestId,'STATUS'=>0,'UNIX_TIME'=>$time);
			$addDate[$i]['REQUEST_ID']=$requestId;
		}
		$flag=$businessLogic->addReceiveRecord($addDate,$msg="你有个住宿订单要处理！");
		return $requestId;
		
	}
	
	/**
	 * Description: 根据用户的筛选条件推荐--吃饭--酒店
	 * Param: $_GET('lat','lon','poi','level')
	 * Author： ward
	 * Date:2015-12-14
	 */
	public function nextPoi($requestId, $recevieId){
		$businessLogic=new \Service\Logic\BusinessLogic();
		$res=$businessLogic->getNextPoi($requestId, $recevieId, $type);
		return $res;
	}
	
	/**
	 * Description: 用户获得自己的历史请求记录
	 * Param: $page=>'分页第几页（从1开始）',$one='标志位',$requestId='请求ID'		
	 * Author： ward
	 * Date:2015-12-15 
	 */
	public function getRequestHistory($page,$one=null,$requestId=null){
		$user=session('user');
		$userId=$user['id'];
		//$userId=22;
		if(empty($userId)){
			$this->setError('系统错误！');
			return false;
		}
		$nextPage=intval($page);//下一页
		//$nextPage=1;
		if(1==$one&&$requestId){
			//$requestId=intval($_GET['id']);//获得该用户下一条请求下所有响应者的记录
			$res=$this->getRequestOne($userId, $requestId);
		}else{//获得该用户下一条请求下所有响应者的记录
			$res=$this->getRequestTitle($userId,$nextPage);
		}
		if($res){
			$requestArr=array();
			foreach($res as $key=>$val){
				$requestArr[]=$val['id'];
			}
			$lists=$this->getRequestDetail($userId,$requestArr);
			foreach ($res  as $key=>$val){
				$sum=0;//当sum==0时删除该条数据
				foreach ($lists as $listsKey=> $listsVal){
					if($val['id']==$listsVal['request_id']){
						$res[$key]['lists'][]=$listsVal;
						if( in_array($listsVal['admin_status'],array(1,2,3,4,5))){
							$res[$key]['flag']=1;
							$newRes[$key]=$res[$key];
							$sum=$sum+1;
						}
					}
				}
				if(1==$res[$key]['flag']||0==$sum){
					unset($res[$key]);
				}
				$flag=$sum=0;
			}//$res foreach循环结束
			if(empty($res)){
				if(empty($newRes)){
					$res=null;
				}else{
					$res=$newRes;
				}
			}else{
				if(!empty($newRes)){
					$res=array_merge($newRes,$res);
				}else{
					$res=$res;
				}
			}
			$res=array_values($res);//去掉键值
			return $res;
		}elseif (null==$res){
			return array();
		}elseif(false==$res){
			$this->setError('系统错误！');
			return false;
			
		}
	}
	/**
	 * Description: 用户轮询请求处理接口
	 * Param: $type=>'请求类型type=1,0为吃住',$requestId='请求ID'
	 * Author： ward
	 * Date:2015-12-15
	 */
	public function getForRequest($requestId,$type){
		$user=session('user');
		$userId=$user['id'];
		// $userId=24;
		
		if(empty($userId)){
			$this->setError('系统错误');
			return false;
		}
		
		if(1==intval($type)||0==intval($type)){//请求类型type=1,0为吃住 type=2为导游
			$res=$this->getRresponse($userId,$requestId);
		}
		$arr=$this->getDidStatus($requestId);
		
		if(!empty($arr['did_status'])&&2==intval($arr['did_status'])){
			$this->setError('三分钟内 未有商家抢单，稍后旅游服务中心会与您电话联系');
			return -1;
		}
		return $res;
	}
	
	/**
	 * Description: 用户取消请求（含强意向）
	 * Param: $type=>'请求类型1为吃、0为住'
	 * Author： ward
	 * Date:2015-12-15
	 */
	public function processCancel($type){
		$user=session('user');
		$userId=$user['id'];
		if(empty($userId)){
			$this->setError('系统错误');
			return false;
		}
		if(0==intval($type)||1==intval($type)){//请求类型type=0,1为住吃 type=2为导游
			//$res=$this->service->changeStatus($userId,$status=9);//9 表示poi_receive中请求失效
			$businessLogic=new \Service\Logic\BusinessLogic();
			$res=$businessLogic->changeStatusByUserId($userId,$status=9);
			$this->setError($businessLogic->getError());
			return $res;
		}
		return true;
		
	}
	
	
	/**
	 * 
	 * @param unknown $requestId
	 * @return \Think\mixed
	 */
	public function  processCallMe($select){
		$user=session('user');
		$userId=$user['id'];
		$poiId=$select['id'];
		$info=$this->poiModel->find($poiId);
		if(empty($userId)||empty($poiId)||empty($info)){
			$this->setError('系统错误！');
			return false;
		}
		if(0==intval($info['receive_status'])){
			$this->setError('该商户很忙，无法接单！');
			return false;
			
		}
		$insert=array();
		$insert['POI_ID']=$poiId;//兴趣点
		$insert['REQUEST_TYPE']=$requestType=intval($_GET['type']);//不分吃还是住
		$insert['CONSUME_TYPE']=0;//无消费类型
		$insert['USER_ID']=$userId;
		$insert['AUTO_STATUS']=1;//由用户主动发起请求
		$insert['LAT']=$select['lat'];
		$insert['LON']=$select['lng'];
		$requestId=$this->addRequestRecord($insert);
		$data['AUTO_STATUS']=1;
		$data['REQUEST_ID']=$requestId;
		$data['POI_ID']=$poiId;
		$data['STATUS']=1;
		$data['UNIX_TIME']=time();
		$businessLogic=new \Service\Logic\BusinessLogic();
		$addData=array($data);
		$res=$businessLogic->addReceiveRecord($addData,$msg="你有个住宿订单要处理！");
		
		if($res){
			return $requestId;
		}else{
			$this->setError('失败！');
			return false;
			
		}
	}
	
	/**
	 * @description:用户接受商家的邀请
	 * @param:int 请求ID 即 user_request表中的id字段
	 * @param:int poi点ID
	 */
	public function processReceive($poiId,$requestId){
		$user=session('user');
		$userId=$user['id'];
		if(empty($userId)){
			$this->setError('系统错误');
			return false;
			
		}
		$businessLogic=new \Service\Logic\BusinessLogic();
		$res=$businessLogic->changeReceiveStatus($poiId,$status=2,$requestId);
		return $res;
	}
	/**
	 * Description:  只要有人响应 则修改did_status 的状态位为1
	 * Param: $id=>user_request表的id
	 * Author： ward
	 * Date:2015-12-15
	 */
	public function changeDidStatus($requestId){
		return $this->requestModel->where('ID='.$requestId)->save(array('DID_STATUS'=>1));
	}
	
	
    public function search($keyword,$location){
       
        $where['NAME']=array('like','%'.$keyword.'%');
        $where['AREA']=array('like','%'.$location.'%');
        $where['TYPE']=1;//ward 2016-02-01 1表示商家
     	$data= $this->poiModel->where($where)->select();
        return $data;
    }
	
    
    public function getPoiDeatail($poiId){
//     	$field='a.id,a.name,a.image,a.address,a.phone';
//     	$field.='a.hotel,a.food,a.lat,a.lon';
		$field='a.*';
    	$data=$this->poiModel->alias('a')->where('a.id='.$poiId)->field($field)->find();
    	return $data;
    }
    
    
	private function getDidStatus($requestId){
		$where['ID']=intval($requestId);
		$data=$this->requestModel->where($where)->field('ID,DID_STATUS')->find();
		return $data;
	}
	
	/**
	 * 用户轮询借口
	 */
	private  function getRresponse($userId,$requestId){
		$where['a.USER_ID']=$userId;
		$where['b.REQUEST_ID']=$requestId;//请求的request_id
		$where['b.ADMIN_STATUS']=array('in','1');//1 表示已经有商家抢了该单
		$where['b.USER_STATUS']=array('neq','3');//1 表示已经有商家抢了该单
		$field='';
		$res=$this->requestModel->alias('a')->join('left join __K_POI_RECEIVE__ as b on a.ID=b.REQUEST_ID ')
					//	->join('__K_BUSINESS_POI__ as c on b.poi_id=c.id')->where($where)->field('a.*,b.*,c.*,b.id as receive_id')->limit('10')->select();
					->join('__POI__ as c on b.POI_ID=c.ID')->where($where)->field('a.*,b.*,c.*,b.ID as receive_id')->limit('10')->select();
		
		//var_dump($this->requestModel->getLastSql());exit('rere');
		return $res;
	}
	
	
	/**
	 * 
	 */
	private  function getRequestDetail($userId,$requestArr){
		$where['a.USER_ID']=$userId;
		//$where['b.admin_status']=array('in',array(1,2,3,4,5));
		$where['b.USER_STATUS']=array('in',array(1,2,3,4,5));
		$where['b.REQUEST_ID']=array('in',$requestArr);
		$res=$this->requestModel->alias('a')->join('left join __K_POI_RECEIVE__ as b on a.ID=b.REQUEST_ID')
		//->join('left join __K_BUSINESS_POI__ as c on b.poi_id=c.id')->where($where)->field('b.*,c.name,c.phone,c.lat,c.lon')->select();
		->join('left join __POI__ as c on b.POI_ID=c.ID')->where($where)->field('b.*,c.NAME,c.PHONE,c.LAT,c.LON')->select();
		
		return $res;
	}
	/**
	 * 获得该用户的所有请求记录---吃住
	 */
	private  function getRequestTitle($userId,$nextPage){
		$where['USER_ID']=$userId;
		$offSet=($nextPage-1)*10;
		$where['REQUEST_TYPE']=array('in',array(0,1));
		$res=$this->requestModel->where($where)->order('ID desc')->limit($offSet,10)->select();
		return $res;
	}
	/**
	 * ???
	 */
	private  function getRequestOne($userId,$requestId){
		$where['USER_ID']=$userId;
		$offSet=($nextPage-1)*10;
		$where['REQUEST_TYPE']=array('in',array(0,1));//0，1表示吃和住
		$where['ID']=$requestId;
		$res=$this->requestModel->where($where)->select();
		return $res;
	}
	

	/**
	 * Description: 冒泡排序
	 * Param: $lat,$lon,$data(array('id','lat','lon'),array(...),...)
	 * Author： ward
	 * Date:2015-12-14
	 */
	private  function bubbleSort($lat,$lon,$data){
		if($count<=1){
			return $data;
		}
		static $flag=true;
		for ($i=1;$i<$count&&$flag;$i++){
			$flag=false;
			for($j=$count-1;$j>=$i;$j--){
				$j_distance=getDistance($lat, $lon,$data[$j]['lat'], $data[$j]['lon']);
				$j_p_distance=getDistance($lat, $lon,$data[$j-1]['lat'], $data[$j-1]['lon']);
				$data[$j]['distance']=$j_distance;
				if($j_distance<$j_p_distance){
					$temp=$data[$j-1];
					$data[$j-1]=$data[$j];
					$data[$j]=$temp;
					$flag=true;
				}
			}
		}
		return $data;
	}
	
	/**
	 * Description: 用户添加请求记录
	 * Param: $inset(array('id','lat','lon'),array(...),...)
	 * Author： ward
	 * Date:2015-12-14
	 */
	private  function addRequestRecord($insert){
		$insert['DATE_TIME']=toDate();
		$insert['STATUS']=0;
		$data=$this->requestModel->create($insert);
		if($data){
			$res=$this->requestModel->add($data);
			return $res;
		}else{
			return false;
		}
		
	}
	
	
	/**
	 * Description: 根据用户的筛选条件推荐POI(包括住宿、吃饭)
	 * Param: $select('lat','lon','type'), $radius=>'半径'
	 * Return array(array('id'=>'poi点ID','lon','lat',...),...)
	 * Author： ward
	 * Date:2015-12-14
	 */
	private  function getPoiFilter($select,$radius=1000){
		$lon=$select['lng'];//经度
		$lat=$select['lat'];//纬度
		$type=$select['type'];//类型 0住1吃
		$distance=$radius;//半径长度
		if(1==$type){
			$where['a.FOOD']=1;
		}elseif(0==$type){
			$where['a.HOTEL']=1;
		}
		
		$where['a.RECEIVE_STATUS']=1;//商家只有打开“接单”才会被推荐
		$distance=intval($distance);
		$dist=distance2degree($lat,$distance);
		$where['a.LON']=array('BETWEEN',($lon-$dist['lng_d']).','.($lon+$dist['lng_d']));
		$where['a.LAT']=array('BETWEEN',($lat-$dist['lat_d']).','.($lat+$dist['lat_d']));
		$res=$this->poiModel->alias('a')->where($where)->field('a.*')->select();
		return $res;
	}
	
}