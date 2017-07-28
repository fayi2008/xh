<?php

/**
 * Author: Jason
* Date: 2015/6/18
* Time: 11:46
* Description:
*/
namespace Api\Behavior;

use Think\Exception;

class PaysuccessBehavior extends \Think\Behavior {
	function run(&$params) {
		$order_id = $params ['id'];
		$log_ = new \Think\Log ();
		$log_name = C ( 'LOG_PATH' ) . "paytest_" . date ( "Y-m-d" ) . ".log"; // log文件路径 // $hotel = session('hotel');
		$data = $params;
		$data ['ID'] = $params ['id'];
		$data ['PAY_STATUS'] = 1;
		$data ['TRADING_STATUS'] = 1;
		$data ['AMOUNT'] = array (
				'exp',
				'TOTAL_PRICE' 
		);
		$data ['TRADE_NO'] = $params ['trade_no'];
		$order_model = new \Business\Model\OrderModel (); // 订单表
		$pack_model = new \Business\Model\GoodsModel (); // 商品信息表
		$log_->write ( "【数据接收成功】:" . json_encode ( $data ) . "\n", "INFO", "file", $log_name );
		
		try {
			$order_model->startTrans ();
			$info = $order_model->lock ( true )->find ( $order_id );
			if ($info ['pay_status'] == 1) { // 0：未支付 1:已支付 2：已关闭
				$order_model->commit ();
				if ($info ['payment_id'] == 3) {
					$params = array (
							'url' => 'http://' . $_SERVER ['HTTP_HOST'] . '/user/order.html?status=1'
					);
				}
				return false;
			}
			$res = $order_model->save ( $data ); // 订单表更新 pay_status状态 和实际支付的钱amount
			$order_model->commit ();
		} catch ( Exception $e ) {
			$order_model->rollback ();
		}
		
		// 判断出库模式SHOP_MODE=1支付出库，默认0预订出库
		if (C ( 'SHOP_MODE' )) {
			// $r = $pack_model->where('id=' . $info ['relation_id'] )->setInc('sold_num',intval($info['num']));
		//	$log_->write ( "【数据接收成功】:" .'333333333' . "\n", "INFO", "file", $log_name );
			$r = $pack_model->where ( 'ID=' . $info ['goods_id'] )->setInc ( 'SOLD_NUM', intval ( $info ['num'] ) );
		//	$log_->write ( "【数据接收成功】:" .'44444444444' . "\n", "INFO", "file", $log_name );
		}
		
		if ($info ['payment_id'] == 3) {
			$params = array (
					'url' => 'http://' . $_SERVER ['HTTP_HOST'] . '/user/order.html?status=1'
			);
		}
	}
}