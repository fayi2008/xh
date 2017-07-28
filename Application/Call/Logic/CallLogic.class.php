<?php
namespace Call\Logic;

class CallLogic extends \Think\Model{
	
	protected $model;
	public function _initialize(){
		$this->model=new \Call\Model\CallModel();
	}
	
	
/**
	 * 后台管理---照片列表接口（后端）
	 * 
	 */
	public function  getLists(){
		//排序条件
		$order='';
		if(!empty($_GET['field'])){
			$order=''.strtoupper($_GET['field']).' '.$_GET['direction'].',';
		}
		if($_GET['field']!=='id'){
			$order.=' ID DESC';
		}
		$order=rtrim($order,',');
		
		//筛选条件
		$where = array ();
		$tel=I('tel');
		if(!empty($tel)){
			$where ['TEL'] = array (
					"like",
					"%" . $tel . "%"
			);
		}
		$type=I('type');
		if(!empty($type)){
			$where ['TYPE'] = $type;
		}
		$status=I('status');
		if(!empty($status)){
			$where ['STATUS'] = $status;
		}
		
// 		$startTime=I('start_time');
// 		$endTime=I('end_time');
// 		if(!empty($startTime)){
// 			$startTime=strtotime($startTime);
// 			if(!empty($endTime)){
// 				$endTime=strtotime($endTime);
// 				$where['CREATE_TIME']=array(array('gt',$startTime),array('lt',$endTime),'and');
// 			}else {
// 				$where['CREATE_TIME']=array('gt',$startTime);
// 			}
// 		}else{
// 			if(!empty($endTime)){
// 				$endTime=strtotime($endTime);
// 				$where['CREATE_TIME']=array('lt',$endTime);
// 			}
// 		}
		//查询字段		
		//$where ['STATUS']=array('neq',0);
		$field='ID,TEL,TYPE,CREATE_TIME,STATUS';
		//limit条件
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->field ($field)->where ( $where )->limit ( $start . ',' . $length )->order($order)->select ();
		if(is_array($list)&&!empty($list)){
			foreach ($list as $k=>$v){
				
				$list[$k]['create_time']=date('Y-d-m H:i:s',$v['create_time']);
				if(1==$v['type']){
					$list[$k]['type']='咨询';
				}elseif(2==$v['type']){
					$list[$k]['type']='投诉';
				}
				if(1==$v['status']){
					$list[$k]['status']='待处理';
				}elseif (2==$v['status']){
					$list[$k]['status']='顺利处理';
				}elseif(3==$v['status']){
					$list[$k]['status']='处理有难度';
				}
				
			}
		}
		//var_dump($list);exit('rer');
		$count =$this->model->field ($field)->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	/*
	 * Description: 查看详情接口（后端）
	 * 
	 */
	public function getOne(){
		$where['ID']=intval($_GET['id']);//信息id
		$field='*';
		$data=$this->model->where($where)->field($field)->find();
		return $data;
	}
	
	
	/*
	 * Description: 添加客服记录（客服端）
	 * 
	 */
	public function  add($fileArr){
		$callerId=session('call.id');
		if(empty($callerId)){
			$this->setError('系统错误');
			return false;
		}
		$data=array();
		$data['AUTHOR']=$callerId;
		$data['TEL']=$fileArr['tel'];
		$data['TYPE']=$fileArr['type'];
		$data['REFLECT_CONTENT']=$fileArr['reflect'];
		$data['REPLY_CONTENT']=$fileArr['reply'];
		$data['STATUS']=$fileArr['status'];
		$data['CREATE_TIME']=time();
		$data=$this->model->create($data);
		if($data){
			$res=$this->model->add($data);
			return $res;
		}else{
			//unlink($fileArr['file']);
			return false;
		}
	}
	
	/*
	 * Description: 展示自己记录的列表（客服端）
	 *
	 */
	public function getForRecorder($selectArr){
		$callerId=session('call.id');
		if(empty($callerId)){
			$this->setError('系统错误');
			return false;
		}
		
		$offset=0;
		$pageSize=20;//
		if(!empty($selectArr['limit'])){
			$pageSize=intval($selectArr['limit'])>0?intval($selectArr['limit']):10;
				
		}
		if(!empty($selectArr['start'])){
			$offset=intval($selectArr['start']);
		}
		if(!empty($selectArr['ordertype'])){
			$order=$selectArr['ordertype'].' DESC';
		}
		$where['AUTHOR']=$callerId;
		if(isset($selectArr['id'])){
			$where['ID']=intval($selectArr['id']);
		}
		
		$data=$this->model->field($field)->where($where)
		  ->limit($offset,$pageSize)->order($order)->select();
		$count=$this->model->field($field)->where($where)
		  ->count();
		$ret['data']=$data;
		$ret['count']=$count;
		return $ret;
	}
	/*
	 * Description: 修改客服记录（客服端）
	 *
	 */
	 public function edit($fileArr){
	 	$data['ID']=$fileArr['id'];
	 
	 //	$data['TEL']=$fileArr['tel'];
	 	$data['TYPE']=$fileArr['type'];
	 //	$data['REFLECT_CONTENT']=$fileArr['reflect'];
	 	$data['REPLY_CONTENT']=$fileArr['reply'];
	 	$data['STATUS']=$fileArr['status'];
	 	$data['UPDATE_TIME']=time();
		if ($data = $this->model->create ($data )) {
			$where['ID']=$fileArr['id'];
			$where['AUTHOR']=$callerId;
			$res=$this->model->where($where)->save($data);
			return $res;
		}else{
			return false;
		}
	}
	
}
