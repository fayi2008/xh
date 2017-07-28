<?php

namespace Api\Controller;

class AlipayController extends \Think\Controller {
	function _initialize() {
	}
	public function notify() {
		$alipay_config = C ( 'ALIPAY' );
		
		$log_ = new \Think\Log ();
		$log_name = C ( 'LOG_PATH' ) . "alipay_" . date ( "Y-m-d" ) . ".log"; // log文件路径
		$log_->write ( "【数据接收成功】:" . json_encode ( $_POST ) . "\n", "INFO", "file", $log_name );
		$alipayNotify = new \Common\Lib\Paywap\AlipayNotify ( $alipay_config );
		$verify_result = $alipayNotify->verifyNotify ();
		$log_->write ( "验证结果：" . $verify_result . "\n", 'INFO', "file", $log_name );
		if ($verify_result) {
			$doc = new \DOMDocument ();
			if ($alipay_config ['sign_type'] == 'MD5') {
				$doc->loadXML ( $_POST ['notify_data'] );
			}
			if ($alipay_config ['sign_type'] == '0001') {
				$doc->loadXML ( $alipayNotify->decrypt ( $_POST ['notify_data'] ) );
			}
			if (! empty ( $doc->getElementsByTagName ( "notify" )->item ( 0 )->nodeValue )) {
				// 商户订单号
				$out_trade_no = $doc->getElementsByTagName ( "out_trade_no" )->item ( 0 )->nodeValue;
				// 支付宝交易号
				$trade_no = $doc->getElementsByTagName ( "trade_no" )->item ( 0 )->nodeValue;
				// 交易状态
				$trade_status = $doc->getElementsByTagName ( "trade_status" )->item ( 0 )->nodeValue;
				
				$log_->write ( $trade_status, 'WARN', "file", $log_name );
				if ($trade_status == 'TRADE_FINISHED') {
					$hotel = session ( 'hotel' );
					list ( $type, $order_id ) = explode ( "_", $out_trade_no );
					$data = array (
							'id' => $order_id,
							'trade_no' => $trade_no,
							'return_status' => $trade_status,
							'return_from' => 'notify' 
					);
					
						tag ( 'apipay_paysuccess_' . $type, $data );
					
					// 注意：
					// 该种交易状态只在两种情况下出现
					// 1、开通了普通即时到账，买家付款成功后。
					// 2、开通了高级即时到账，从该笔交易成功时间算起，过了签约时的可退款时限（如：三个月以内可退款、一年以内可退款等）后。
					
					// 调试用，写文本函数记录程序运行情况是否正常
					// logResult("这里写入想要调试的代码变量值，或其他运行的结果记录");
					
					echo "success"; // 请不要修改或删除
				} else if ($trade_status == 'TRADE_SUCCESS') {
					// 判断该笔订单是否在商户网站中已经做过处理
					// 如果没有做过处理，根据订单号（out_trade_no）在商户网站的订单系统中查到该笔订单的详细，并执行商户的业务程序
					// 如果有做过处理，不执行商户的业务程序
					$hotel = session ( 'hotel' );
					
					list ( $type, $order_id ) = explode ( "_", $out_trade_no );
					$data = array (
							'id' => $order_id,
							'trade_no' => $trade_no,
							'return_status' => $trade_status,
							'return_from' => 'notify' 
					);
					tag ( 'apipay_paysuccess_' . $type, $data );
					
					// 注意：
					// 该种交易状态只在一种情况下出现——开通了高级即时到账，买家付款成功后。
					
					// 调试用，写文本函数记录程序运行情况是否正常
					// logResult("这里写入想要调试的代码变量值，或其他运行的结果记录");
					
					echo "success"; // 请不要修改或删除
				}
			}
			
			// ——请根据您的业务逻辑来编写程序（以上代码仅作参考）——
			
			// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		} else {
			// 验证失败
			echo "fail";
			// 调试用，写文本函数记录程序运行情况是否正常
			// logResult("这里写入想要调试的代码变量值，或其他运行的结果记录");
		}
	}
	
	/**
	 * Description: callback 同步返回
	 * Author: Jason
	 */
	public function callback() {
		$alipay_config = C ( 'ALIPAY' );
		unset ( $_GET ['h_id'] );
		// 计算得出通知验证结果
		$log_ = new \Think\Log ();
		$log_name = C ( 'LOG_PATH' ) . "alipay_" . date ( "Y-m-d" ) . ".log"; // log文件路径
		$log_->write ( "【数据接收成功】:Callback" . json_encode ( $_GET ) . "\n", "INFO", "file", $log_name );
		
		$alipayNotify = new \Common\Lib\Paywap\AlipayNotify ( $alipay_config );
		$verify_result = $alipayNotify->verifyReturn ();
		if ($verify_result) { // 验证成功
		                      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		                      // 请在这里加上商户的业务逻辑程序代码
		                      
			// ——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
		                      // 获取支付宝的通知返回参数，可参考技术文档中页面跳转同步通知参数列表
			$hotel = session ( 'hotel' );
			// 商户订单号
			$out_trade_no = $_GET ['out_trade_no'];
			
			// 支付宝交易号
			$trade_no = $_GET ['trade_no'];
			
			// 交易状态
			$result = $_GET ['result'];
			if ($result == 'success') {
				list ( $type, $order_id ) = explode ( "_", $out_trade_no );
				
				$data = array (
						'id' => $order_id,
						'trade_no' => $trade_no,
						'return_status' => $result,
						'return_from' => 'callback' 
				);
				
				tag ( 'apipay_paysuccess_' . $type, $data );
				if ($data ['url']) {
					redirect ( $data ['url'] );
				}
				// redirect ( '/page/user/payment/shop-1-' . $order_id . '-' . $info ['goods_id'] );
			}
		} else {
			// 验证失败
			// 如要调试，请看alipay_notify.php页面的verifyReturn函数
			echo "验证失败";
		}
	}
	public function merchant() {
		$url = "http://" . $_SERVER ['HTTP_HOST'] . "/user/order.html";
		redirect ( $url );
	}
	/**
	 *
	 * @author ：liuzhaojun
	 *         异步退款
	 */
	function refundNotify() {
		$AlipayLogic = new \Hotel\Api\AlipayLogic ();
		$alipayconfig = $AlipayLogic->getAliconfig ();
		// 合作身份者id，以2088开头的16位纯数字
		$alipay_config ['partner'] = $alipayconfig ['partner_id'];
		// 安全检验码，以数字和字母组成的32位字符
		$alipay_config ['key'] = $alipayconfig ['ali_key'];
		// ↑↑↑↑↑↑↑↑↑↑请在这里配置您的基本信息↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
		// 签名方式 不需修改
		$alipay_config ['sign_type'] = strtoupper ( 'MD5' );
		// 字符编码格式 目前支持 gbk 或 utf-8
		$alipay_config ['input_charset'] = strtolower ( 'utf-8' );
		// ca证书路径地址，用于curl中ssl校验
		// 请保证cacert.pem文件在当前文件夹目录中
		$alipay_config ['cacert'] = APP_ROOT . $alipayconfig ['pem_url'];
		// 访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
		$alipay_config ['transport'] = 'http';
		// 计算得出通知验证结果
		$alipayNotify = new \Common\Lib\Api\Alipay\AlipayNotify ( $alipay_config );
		$verify_result = $alipayNotify->verifyNotify ();
		
		if ($verify_result) { // 验证成功
		                      // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		                      // 请在这里加上商户的业务逻辑程序代
		                      
			// ——请根据您的业务逻辑来编写程序（以下代码仅作参考）——
		                      
			// 获取支付宝的通知返回参数，可参考技术文档中服务器异步通知参数列表
		                      
			// 批次号
			
			$batch_no = $_POST ['batch_no'];
			
			// 批量退款数据中转账成功的笔数
			
			$success_num = $_POST ['success_num'];
			
			// 批量退款数据中的详细信息
			$result_details = $_POST ['result_details'];
			// 商户订单号
			$out_trade_no = $_POST ['out_trade_no'];
			$log_ = new \Think\Log ();
			$log_name = C ( 'LOG_PATH' ) . "alipayRefund_" . date ( "Y-m-d" ) . ".log"; // log文件路径
			$log_->write ( "【数据接收成功】:" . $result_details . $out_trade_no . "\n", "INFO", "file", $log_name );
			// 判断是否在商户网站中已经做过了这次通知返回的处理
			// 如果没有做过处理，那么执行商户的业务程序
			// 如果有做过处理，那么不执行商户的业务程序
			if ($success_num > 0) {
				$arr = explode ( "^", $result_details );
				$trade_no = $arr [0];
				$resModel = new \Hotel\Restaurant\OrderModel ();
				$data = $resModel->where ( "trade_no='$trade_no'" )->find ();
				
				if ($data) {
					$data ['pay_back_status'] = 4;
					$resModel->save ( $data );
					echo "success"; // 请不要修改或删除
					die ();
				}
				$roomModel = new \Hotel\Room\OrderModel ();
				$data = $roomModel->where ( "trade_no='$trade_no'" )->find ();
				
				if ($data) {
					$data ['pay_back_status'] = 4;
					$data ['status'] = 3;
					
					$log_->write ( "【数据接收成功】:" . $sql . "\n", "INFO", "file", $log_name );
					echo "success"; // 请不要修改或删除
					die ();
				}
				
				$goodsModel = new \Hotel\Room\OrderModel ();
				$data = $goodsModel->where ( "trade_no='$trade_no'" )->find ();
				
				if ($data) {
					$data ['pay_back_status'] = 4;
					$data ['status'] = 3;
					
					$log_->write ( "【数据接收成功】:" . $sql . "\n", "INFO", "file", $log_name );
					echo "success"; // 请不要修改或删除
					die ();
				}
			} else {
				$arr = explode ( "^", $result_details );
				$trade_no = $arr [0];
				$resModel = new \Hotel\Restaurant\OrderModel ();
				$data = $resModel->where ( "trade_no='$trade_no'" )->find ();
				if ($data) {
					$data ['pay_back_status'] = 3;
					$resModel->save ( $data );
					echo "success"; // 请不要修改或删除
					die ();
				}
				$roomModel = new \Hotel\Room\OrderModel ();
				$data = $roomModel->where ( "trade_no='$trade_no'" )->find ();
				if ($data) {
					$data ['pay_back_status'] = 3;
					$roomModel->save ( $data );
					echo "success"; // 请不要修改或删除
					die ();
				}
				$goodsModel = new \Hotel\shop\OrderModel ();
				$data = $goodsModel->where ( "trade_no='$trade_no'" )->find ();
				if ($data) {
					$data ['pay_back_status'] = 3;
					$goodsModel->save ( $data );
					echo "success"; // 请不要修改或删除
					die ();
				}
			}
			
			// 调试用，写文本函数记录程序运行情况是否正常
			// logResult("这里写入想要调试的代码变量值，或其他运行的结果记录");
			
			// ——请根据您的业务逻辑来编写程序（以上代码仅作参考）——
			
			// ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		} else {
			// 验证失败
			echo "fail";
			
			// 调试用，写文本函数记录程序运行情况是否正常
			// logResult("这里写入想要调试的代码变量值，或其他运行的结果记录");
		}
	}
}
