<?php

namespace Wxpay\Controller;

class WxpayController extends \Think\Controller {
	protected $wx_config;
	function _initialize() {
			$info=C('WXPAY');
			if (!$info) {
				return false;
				//"微信支付配置错误，请重新配置" 
			}
			$this->wx_config = C ( 'WXPAY' );
		
	}
	public function index() {
		
		$wx_config = $this->wx_config;
		import ( "Common.Lib.Wxpay.WxPayPubHelper" );
		// C('WECHAT_APPID',$wx_config['APPID']);
		// C('WECHAT_APPSECRET',$wx_config['APPSECRET']);
		// 使用jsapi接口
		$jsApi = new \JsApi_pub ( $wx_config );
		// $wx_model=new \Common\Lib\Api\WxChat();
		// =========步骤1：网页授权获取用户openid============
		// 通过code获得openid
		if (! isset ( $_GET ['code'] )) {
			// 触发微信返回code码
			$backurl = strtolower ( "http://" . $_SERVER ['HTTP_HOST'] . $_SERVER ['REQUEST_URI'] );
			// echo $redirect_uri;
			// exit;
			$back_url = "http://" . $_SERVER ['HTTP_HOST'] . $_SERVER ['REQUEST_URI'];
			$redirect_url = 'http://' . C ( 'API_DOMAIN' ) . '/Wx/Wx/getcodenew?backurl=' . urlencode ( urlencode ( $back_url ) );
			
			$url = $jsApi->createOauthUrlForCode ( urlencode ( $redirect_url ) );
			//var_dump($url,$back_url,$redirect_url);exit('rer');
			Header ( "Location: $url" );
		} else {
			// 获取code码，以获取openid
			$code = $_GET ['code'];
			$jsApi->setCode ( $code );
			$openid = $jsApi->getOpenId ();
		}
		
		// $openid = "o2f1muO0R1Inocn0tRsLou3YFg1I";
		
		// =========步骤2：使用统一支付接口，获取prepay_id============
		// 使用统一支付接口
		$unifiedOrder = new \UnifiedOrder_pub ( $wx_config );
		
		// 设置统一支付接口参数
		// 设置必填参数
		// appid已填,商户无需重复填写
		// mch_id已填,商户无需重复填写
		// noncestr已填,商户无需重复填写
		// spbill_create_ip已填,商户无需重复填写
		// sign已填,商户无需重复填写
		$out_trade_no = $_GET ['out_trade_no'];
		$title = $_GET ['title'];
		$total_fee = $_GET ['total_fee'];
		list ( $type, $order_id ) = explode ( "_", $out_trade_no );
		
		$info ['order_id'] = $order_id;
		tag ( 'wxpay_prepay_' . $type, $info );
		
		$unifiedOrder->setParameter ( "openid", "$openid" ); // 商品描述
		$unifiedOrder->setParameter ( "body", $title ); // 商品描述
		                                                // 自定义订单号，此处仅作举例
		$unifiedOrder->setParameter ( "out_trade_no", $out_trade_no ); // 商户订单号
		$unifiedOrder->setParameter ( "total_fee", intval ( $total_fee ) ); // 总金额
		$unifiedOrder->setParameter ( "notify_url", $wx_config ['NOTIFY_URL'] ); // 通知地址
		$unifiedOrder->setParameter ( "trade_type", "JSAPI" ); // 交易类型
		                                                       // 非必填参数，商户可根据实际情况选填
		                                                       // $unifiedOrder->setParameter("sub_mch_id","XXXX");//子商户号
		                                                       // $unifiedOrder->setParameter("device_info","XXXX");//设备号
		                                                       // $unifiedOrder->setParameter("attach","XXXX");//附加数据
		                                                       // $unifiedOrder->setParameter("time_start","XXXX");//交易起始时间
		                                                       // $unifiedOrder->setParameter("time_expire","XXXX");//交易结束时间
		                                                       // $unifiedOrder->setParameter("goods_tag","XXXX");//商品标记
		                                                       // $unifiedOrder->setParameter("openid","XXXX");//用户标识
		                                                       // $unifiedOrder->setParameter("product_id","XXXX");//商品ID
		
		$prepay_id = $unifiedOrder->getPrepayId ();
		
		// =========步骤3：使用jsapi调起支付============
		$jsApi->setPrepayId ( $prepay_id );
		
		$jsApiParameters = $jsApi->getParameters ();
		// exit;
		// $view=new \Think\View();
		$this->assign ( $_GET );
		
		// var_dump($prepay_id, $_GET,$jsApiParameters);die();
		$this->assign ( 'jsApiParameters', $jsApiParameters );
		$this->display ();
	}
// 	public function code_pay() {
// 		$wx_config = $this->wx_config;
// 		import ( "Common.Lib.Wxpay.WxPayPubHelper" );
// 		// =========步骤2：使用统一支付接口，获取prepay_id============
// 		// 使用统一支付接口
// 		$unifiedOrder = new \UnifiedOrder_pub ( $wx_config );
		
// 		// 设置统一支付接口参数
// 		// 设置必填参数
// 		// appid已填,商户无需重复填写
// 		// mch_id已填,商户无需重复填写
// 		// noncestr已填,商户无需重复填写
// 		// spbill_create_ip已填,商户无需重复填写
// 		// sign已填,商户无需重复填写
// 		$out_trade_no = $_GET ['out_trade_no'];
// 		$title = $_GET ['title'];
// 		$total_fee = $_GET ['total_fee'];
// 		list ( $type, $order_id ) = explode ( "_", $out_trade_no );
// 		$info ['order_id'] = $order_id;
// 		$unifiedOrder->setParameter ( "body", $title ); // 商品描述
// 		$unifiedOrder->setParameter ( "out_trade_no", $out_trade_no ); // 商户订单号
// 		$unifiedOrder->setParameter ( "total_fee", intval ( $total_fee ) ); // 总金额
// 		$unifiedOrder->setParameter ( "notify_url", $wx_config ['NOTIFY_URL'] ); // 通知地址
// 		$unifiedOrder->setParameter ( "trade_type", "NATIVE" ); // 交易类型
// 		$unifiedOrder->setParameter ( "product_id", "123344445" ); // 商品ID
// 		$code_url = $unifiedOrder->getcode_url ();
// 		$uuid = create_uuid ();
// 		$res = generateQRImg ( $code_url, $uuid, '', 0, 'L', 6 );
// 		return $res;
// 	}
	
	
	public function code_pay($out_trade_no,$title,$total_fee) {
		$wx_config = $this->wx_config;
		
		import ( "Common.Lib.Wxpay.WxPayPubHelper" );
		// =========步骤2：使用统一支付接口，获取prepay_id============
		// 使用统一支付接口
		$unifiedOrder = new \UnifiedOrder_pub ( $wx_config );
		list ( $type, $order_id ) = explode ( "_", $out_trade_no );
		$unifiedOrder->setParameter ( "body", $title ); // 商品描述
		$unifiedOrder->setParameter ( "out_trade_no", $out_trade_no ); // 商户订单号
		$unifiedOrder->setParameter ( "total_fee", intval ( $total_fee ) ); // 总金额
		$unifiedOrder->setParameter ( "notify_url", $wx_config ['NOTIFY_URL'] ); // 通知地址
		$unifiedOrder->setParameter ( "trade_type", "NATIVE" ); // 交易类型
		$unifiedOrder->setParameter ( "product_id", $order_id ); // 商品ID
		$code_url = $unifiedOrder->getcode_url ();
		$uuid = create_uuid ();
		$res = generatePayQRImg ( $code_url, $uuid, '', 0, 'L', 6 );
		return $res;
	}
	function old_pay() {
		$wx_config = C ( 'WXPAY_OLD' );
		// C('WECHAT_APPID',$wx_config['APPID']);
		// C('WECHAT_APPSECRET',$wx_config['APPSECRET']);
		// 使用jsapi接口
		$jsApi = new \Common\Lib\Wxpay\WxPayOld ( $wx_config );
		// $wx_model=new \Common\Lib\Api\WxChat();
		// =========步骤1：网页授权获取用户openid============
		// 通过code获得openid
		/*
		 * if (!isset($_GET['code']))
		 * {
		 * //触发微信返回code码
		 * //$backurl=strtolower("http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI']);
		 * $back_url="http://".$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
		 * $redirect_url='http://'.C('API_DOMAIN').'/Wx/Wx/getcodenew/backurl/'.urlencode(urlencode($back_url));
		 * $url = $jsApi->createOauthUrlForCode(urlencode($redirect_url));
		 * Header("Location: $url");
		 * }else
		 * {
		 * //获取code码，以获取openid
		 * $code = $_GET['code'];
		 * $jsApi->setCode($code);
		 * $openid = $jsApi->getOpenId();
		 * }
		 */
		
		$out_trade_no = $_GET ['out_trade_no'];
		$title = $_GET ['title'];
		$total_fee = $_GET ['total_fee'];
		list ( $type, $order_id ) = explode ( "_", $out_trade_no );
		switch ($type) {
			case "h" :
// 				$order_model = new \Hotel\Room\OrderModel ();
// 				$info = $order_model->find ( $order_id );
				break;
			case "r" :
// 				$order_model = new \Hotel\Restaurant\OrderModel ();
// 				$info = $order_model->find ( $order_id );
				break;
			case "s" :
				//$order_model = new \Hotel\Shop\OrderModel ();
				$order_model = new \Shop\Model\OrderModel ();
				$info = $order_model->find ( $order_id );
				break;
		}
		
		// $jsApi->setPackageParameter("openid","$openid");//商品描述
		$jsApi->setPackageParameter ( "body", $title ); // 商品描述
		                                                // 自定义订单号，此处仅作举例
		$jsApi->setPackageParameter ( "out_trade_no", $out_trade_no ); // 商户订单号
		$jsApi->setPackageParameter ( "total_fee", intval ( $total_fee ) ); // 总金额
		$jsApi->setPackageParameter ( "notify_url", $wx_config ['NOTIFY_URL'] ); // 通知地址
		                                                                         
		// 非必填参数，商户可根据实际情况选填
		                                                                         // $unifiedOrder->setParameter("sub_mch_id","XXXX");//子商户号
		                                                                         // $unifiedOrder->setParameter("device_info","XXXX");//设备号
		                                                                         // $unifiedOrder->setParameter("attach","XXXX");//附加数据
		                                                                         // $unifiedOrder->setParameter("time_start","XXXX");//交易起始时间
		                                                                         // $unifiedOrder->setParameter("time_expire","XXXX");//交易结束时间
		                                                                         // $unifiedOrder->setParameter("goods_tag","XXXX");//商品标记
		                                                                         // $unifiedOrder->setParameter("openid","XXXX");//用户标识
		                                                                         // $unifiedOrder->setParameter("product_id","XXXX");//商品ID
		
		$jsApiParameters = $jsApi->getParameters ();
		// exit;
		// $view=new \Think\View();
		$this->assign ( $_GET );
		switch ($type) {
			case "h" :
				//$this->assign ( 'url', C ( 'ROOM' ) . 'order_callback#!/0/' . $info ['room_type_id'] . '/' . $order_id );
				break;
			case "r" :
				//$this->assign ( 'url', C ( 'DINNER' ) . 'order_callback#status=0&id=' . $info ['relation_id'] );
				break;
			case "s" :
				$this->assign ( 'url', C ( 'GOODS' ) . 'order_callback#status=0&id=' . $info ['goods_id'] );
				break;
		}
		$this->assign ( 'jsApiParameters', $jsApiParameters );
		$this->display ();
	}
	public function notify() {
		$hotel = session ( 'hotel' );
		import ( "Common.Lib.Wxpay.WxPayPubHelper" );
		// 使用通用通知接口
		$notify = new \Notify_pub ();
		
		// 存储微信的回调
		$xml = $GLOBALS ['HTTP_RAW_POST_DATA'];
		$notify->saveData ( $xml );
		
		// 验证签名，并回应微信。
		// 对后台通知交互时，如果微信收到商户的应答不是成功或超时，微信认为通知失败，
		// 微信会通过一定的策略（如30分钟共8次）定期重新发起通知，
		// 尽可能提高通知的成功率，但微信不保证通知最终能成功。
		if ($notify->checkSign () == FALSE) {
			$notify->setReturnParameter ( "return_code", "FAIL" ); // 返回状态码
			$notify->setReturnParameter ( "return_msg", "签名失败" ); // 返回信息
		} else {
			$notify->setReturnParameter ( "return_code", "SUCCESS" ); // 设置返回码
		}
		$returnXml = $notify->returnXml ();
		// echo $returnXml;
		
		// ==商户根据实际情况设置相应的处理流程，此处仅作举例=======
		
		// 以log文件形式记录回调信息
		$log_ = new \Think\Log ();
		$log_name = C ( 'LOG_PATH' ) . "wxpay_" . date ( "Y-m-d" ) . ".log"; // log文件路径
		$log_->write ( "【接收到的notify通知】:\n" . $xml . "\n", "INFO", "file", $log_name );
		
		if ($notify->checkSign () == TRUE) {
			if ($notify->data ["return_code"] == "FAIL") {
				// 此处应该更新一下订单状态，商户自行增删操作
				$log_->write ( "【通信出错】:\n" . $xml . "\n", "INFO", "file", $log_name );
			} elseif ($notify->data ["result_code"] == "FAIL") {
				// 此处应该更新一下订单状态，商户自行增删操作
				$log_->write ( "【业务出错】:\n" . $xml . "\n", "INFO", "file", $log_name );
			} else {
				// 此处应该更新一下订单状态，商户自行增删操作
				$log_->write ( "【支付成功】:\n" . $xml . "\n", "INFO", "file", $log_name );
				$out_trade_no = $notify->data ["out_trade_no"];
				list ( $type, $order_id ) = explode ( "_", $out_trade_no );
				if($type=='s'){
					$data = array (
							'id' => $order_id,
							'pay_openid'=>$notify->data ["openid"],
							'trade_no' => $notify->data ["transaction_id"]
					);
				}else{
					$data = array (
							'id' => $order_id,
							'trade_no' => $notify->data ["transaction_id"]
					);
				}
				$log_->write ( "钩子函数执行前:\n".$type."\n" , "INFO", "file", $log_name );
				tag ( 'wxpay_paysuccess_' . $type, $data );
				//tag ( 'wxpay_prepay_' . $type, $data );
				$log_->write ( "钩子函数执行后:\n" , "INFO", "file", $log_name );
				$test='xxxxxx';
				$log_->write ( "【xxxxxxxxx】:\n" . $test. "\n", "INFO", "file", $log_name );
			}
		} else {
			$log_->write ( "【验证签名失败】:\n" . $xml . "\n", "INFO", "file", $log_name );
		}
	}
	public function callback() {
	}
}
