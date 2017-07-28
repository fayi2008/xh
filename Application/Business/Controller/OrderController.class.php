<?php

namespace Business\Controller;

class OrderController extends \Common\Controller\BaseController {
	protected $logic;
	public function _initialize() {
		parent::_initialize ();
		$this->logic = new \Business\Logic\OrderLogic ();
	}
	
	/**
	 * 下订单
	 *
	 * @return Ambigous <boolean, \Think\mixed>
	 */
	public function index_post() {
		$res = $this->logic->add ();
		if(!$res){
			$this->error ( '下单失败' );
			return false;
		}
		$isMobile = isMobile () || WEB_TYPE == 'Mobile';

		if (! $isMobile) {
			$url = "http://" . $_SERVER ['HTTP_HOST'] . "/business/order/pay_get/id/" . $res;
			
			$filename = generatePayQRImg ( $url, '', '', 0, 'L', 6 );
			$orderModel = new \Business\Model\OrderModel ();
			$orderdata ['QRCODE_URI'] = $filename;
			$orderModel->where ( "ID=$res" )->save ( $orderdata );
			 if($filename){
			 	$data['status']=1;
			 	$data['image']=$filename;
			 	$this->ajaxReturn($data);
			 }else{
			 	$data['status']=0;
			 	$data['image']='';
			 	$this->ajaxReturn($data);
			 }
			 
		}
		
		if ($res) {
			$res = $this->logic->pay ( $orderId = $res );
		} else {
			$this->error ( '下单失败' );
		}
		return $res;
	}
	/**
	 * 用户在订单列表中点击确认支付
	 */
	public function pay_get() {
		$orderId = I ( 'get.id' );
		$res = $this->logic->pay ( $orderId );
		if($res){
			return $res;
		}else{
			echo '系统错误';
			exit();
		}
	}
	/**
	 * 用户在订单列表中点击--确认收到货
	 */
	public function confirm_post() {
		$res = $this->logic->confim ();
		if (intval ( $res ) > 0) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'msg' => '成功！' 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => '失败，请联系管理员！' 
			) );
		}
	}
	
	/*
	 *
	 */
	public function order_get_html() {
		$this->display ( "order_index" );
	}
	
	/*
	 * 根据条件取订单列表---前端接口
	 */
	public function index_get_json() {
		$res = $this->logic->get ();
		if (false !== $res) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => $this->logic->getError () 
			) );
		}
	}
	
	/*
	 * 确认收货
	 * @author liuzhaojun
	 * @date 2015.04.27
	 */
	function confirm() {
	    $order_id=$_GET['order_id'];
		$res = $this->logic->confirm ($order_id);
		
		if ($res !== false) {
			$this->ajaxReturn ( array (
					"status" => 1,
					"info" =>  '成功'
			) );
		} else {
			$this->ajaxReturn ( array (
					"status" => 0,
					"info" =>  '失败'
			) );
		}
	}
	
}