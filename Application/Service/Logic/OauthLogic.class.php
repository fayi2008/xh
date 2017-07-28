<?php
namespace  Service\Logic;

use Service\Model\OauthModel;
class OauthLogic extends  \Think\Model{
	
	protected   $model,$poiModel,$guideModel;
	public function _initialize() {
		//实例化model类
		$this->model = new \Service\Model\OauthModel();
		$this->poiModel=new \Service\Model\PoiModel();
		//$this->guideModel=new \Home\Guide\GuideModel();
	}
	
	/**
	 * Description: checkOpenId
	 * @param $open_id
	 * @return mixed
	 * Author: Jason
	 */
	function checkOpenId($open_id)
	{
		$where['OPENID']=$open_id;
		//$where['_from']='wx';
		//$where['attention_status']=1;
		$user_info=$this->getUserInfo($open_id);
		//var_dump($user_info);exit('rer');
		if(!$user_info['subscribe'])
		{
			exit("请先关注公众号");
		}
	
		$res=$this->model->where($where)->find();
		if(!$res)
		{
			$data=array(
					"_FROM"=>"wx",
					"_NAME"=>$user_info['nickname'],
					"SEX"=>$user_info['sex'],
					"HEAD_IMG"=>$user_info['headimgurl'],
					'STATUS'=>$user_info['subscribe'],
					"OPENID"=>$user_info['openid'],
					'CREATE_TIME'=>$user_info['subscribe_time']?$user_info['subscribe_time']:time(),
					"LANGUAGE"=>$user_info['language'],
					"CITY"=>$user_info['city'],
					"COUNTRY"=>$user_info['country'],
					"PROVINCE"=>$user_info['province'],
					'ATTENTION_STATUS'=>$user_info['subscribe'],
					'LOCK_TO_ID'=>0
			);
			$id=$this->model->add($data);
			$res=$this->model->find($id);
		}
	
		session('wx_worker',$res);
		return true;
	
	}
	
	/**
	 * Description: checkOpenId
	 * @param $open_id
	 * @return mixed
	 * Author: Jason
	 */
	function checkWait($open_id)
	{
		$where['OPENID']=$open_id;
		//$where['_from']='wx';
		//$where['attention_status']=1;
		$user_info=$this->getUserInfo($open_id);
		
		if(!$user_info['subscribe'])
		{
			exit("请先关注公众号");
		}
	
		$res=$this->model->where($where)->find();
		if(!$res)
		{
			exit('请先做绑定操作');
		}
	
		session('wx_worker',$res);
		return true;
	
	}
	
	
	function getUserInfo($open_id)
	{
		$weixin = new \Common\Lib\Api\WxChat();
		return $weixin->user($open_id);
	}
	
	function bindPoi($key,$user_id,$phone)
	{
		$id=$this->poiModel->where(array('ID'=>$key))->getField('ID');
		if(!$id)
		{
			return false;
		}
	
		$res=$this->model->save(array('ID'=>$user_id,'POI_ID'=>$id,'PHONE'=>$phone));
		if($res)
		{
			session('wx_worker.poi_id',$id);
		}
		return $res;
	}
	function unbind($user_id)
	{
		$res=$this->model->save(array('ID'=>$user_id,'POI_ID'=>0,'GUIDE_ID'=>0,'ROLE'=>0));
		return $res;
	}
	function unbindGuide($user_id)
	{
		$res=$this->model->save(array('ID'=>$user_id,'GUIDE_ID'=>0));
		return $res;
	}
	
	function bindGuide($key,$user_id)
	{
		$id=$this->guideModel->where(array('ID'=>$key))->getField('ID');
		if(!$id)
		{
			return false;
		}
	
		$res=$this->model->save(array('id'=>$user_id,'guide_id'=>$id));
		if($res)
		{
			session('wx_worker.guide_id',$id);
		}
		return $res;
	}
	
	function bindService($key,$user_id)
	{
		if($key=='12345678')
		{
			$res=$this->model->save(array('id'=>$user_id,'role'=>2));
		}else{
			return false;
		}
	
		if($res)
		{
			session('wx_worker.role_id',2);
		}
		return $res;
	}
	
	/**
	 * Description: getPoiManager
	 * @param $poi_id
	 * Author: Jason
	 */
	function getPoiManager($poi_id)
	{
		$where['POI_ID']=$poi_id;
		$where['RECEIVE_STATUS']=1;
		$res=$this->model->where($where)->field('OPENID')->select();
		return $res;
	
	}
	
	function getGuideOpenId($guide_id){
		$where['GUIDE_ID']=$guide_id;
		$where['RECEIVE_STATUS']=1;
		return $this->model->where($where)->field('OPENID')->select();
	}
	
	function getPhoneList($poi_id,$id){
		$where['POI_ID']=$poi_id;
		$where['ID']=array('neq',$id);
		return $this->model->where($where)->field('PHONE')->select();
	}
	/*
	 * 接单者 打开关闭接单开关
	 */
	function updateReceiveStatus($id,$status){
		//     	$where['id']=intval($id);
		//     	$data['receive_status']= '!`receive_status`';//是否开启接单状态
	
		$sql='update k_oauth_user set receive_status= !`receive_status` where id='.$id;
		//     	echo $sql;
		$res=$this->model->execute($sql);
		$res= $this->model->where(array('id'=>$id))->find();
		//var_dump($this->model->getLastSql());
		return $res;
	}
	
	
}