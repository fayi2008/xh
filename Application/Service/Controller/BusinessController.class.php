<?php
namespace  Service\Controller;

class  BusinessController extends \Common\Controller\BaseController{
	protected  $logic;
	public  function _init(){
		$this->logic=new \Service\Logic\BusinessLogic();
	}
	
	/**
	 * Description: 商家修改响应记录状态        
	 * Param:  status=>'抢单1 达成意向2   未达成意向3 到店消费4  未到店消费5',id=>'', request_id=>''
	 * Author： ward
	 * Date:2015-12-15
	 */
	public function response(){
		$status=$_GET['status'];
		$receiveId=$_GET['id'];//receive表中的id
		$requestId=$_GET['request_id'];
		$res=$this->logic->getBusinessResponse($receiveId, $requestId, $status);
		if($res){
			$this->ajaxReturn(array('status'=>'1','msg'=>'成功!'));
		}else{
			$this->ajaxReturn(array('status'=>'0','msg'=>$this->logic->setError()));
		}
	}
	
	
	
	/**
	 * Description:获得该商户的今天的所有订单列表
	 */
	public  function today(){
		
		$wx_worker=session('wx_worker');
		$poi_id=$wx_worker['poi_id'];
		if($_GET['test'])
		{
			$poi_id=$_GET['test'];
		}
		$data=$this->logic->today_lists($poi_id);
		$last=$this->logic->last_order($poi_id);//获得该订单最近的一条订单状态
		$sum=$this->logic->getTodaySum($poi_id);
		$did=$this->logic->getTodayDid($poi_id);
		$this->ajaxReturn(array('status'=>'true','data'=>$data,'last'=>$last,
				'sum'=>intval($sum),'did'=>intval($did)));
	}
	
	/**
	 * Description:获得该商户的所有订单列表
	 */
	public function lists(){
	
		$wx_worker=session('wx_worker');
		$poiId=$wx_worker['poi_id'];
		//$poi_id=635;
		if($_GET['test'])
		{
			$poiId=$_GET['test'];
		}
		$page=$_GET['page']?intval($_GET['page']):'1';
		$data=$this->logic->lists($poiId,$page);
		$this->ajaxReturn(array('status'=>'true','data'=>$data));
	}
	
	/**
	 *Description:
	 */
	public function new_response(){
		$wx_worker=session('wx_worker');
		$poiId=$wx_worker['poi_id'];
		$data=$this->logic->new_response($poiId);
		$this->ajaxReturn(array('status'=>'true','data'=>$data));
	}
	
	
	/**
	 * @Description:商家滑动开启或关闭接收订单
	 */
	public function slide_receive(){
		$wx_worker=session('wx_worker');
		$poi_id=$wx_worker['poi_id'];
		$res=$this->logic->switchReceive($poi_id);
		$this->ajaxReturn($res);
	}
	
	
	
	
}