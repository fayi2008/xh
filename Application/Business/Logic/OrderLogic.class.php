<?php

namespace Business\Logic;

use Wxpay;

class OrderLogic extends \Think\Model {
	protected $model, $goodsModel;
	protected function _initialize() {
		$this->model = new \Business\Model\OrderModel ();
		$this->goodsModel = new \Business\Model\GoodsModel ();
		$this->logmodel = new \Business\Model\LogModel ();
	}
	
	/**
	 * Description: 订单信息列表（后台）
	 * Author: ward
	 * Date:
	 */
	public function getLists() {
		$where = array ();
		$user = session ( 'business' );
		$poi_id = $user ['poi_id'];
		$where ['B.POI_ID'] = $poi_id;
		$name = I ( 'name' );
		$id = I ( 'ID' );
		if ($name) {
			$where ['B.NAME'] = array (
					"like",
					"%" . I ( 'name' ) . "%" 
			);
		}
		if ($id) {
			$where ['A.ID'] = array (
					"like",
					"%" . I ( 'id' ) . "%" 
			);
		}
		$status = I ( 'trading_status' );
		if ('' !== $status) {
			$where ['A.TRADING_STATUS'] = $status;
		}
		$startTime = I ( 'start_time' );
		$endTime = I ( 'end_time' );
		if (! empty ( $startTime )) {
			$startTime = strtotime ( $startTime );
			if (! empty ( $endTime )) {
				$endTime = strtotime ( $endTime );
				$where ['A.BOOK_TIME'] = array (
						array (
								'gt',
								$startTime 
						),
						array (
								'lt',
								$endTime 
						),
						'and' 
				);
			} else {
				$where ['A.BOOK_TIME'] = array (
						'gt',
						$startTime 
				);
			}
		} else {
			if (! empty ( $endTime )) {
				$endTime = strtotime ( $endTime );
				$where ['A.BOOK_TIME'] = array (
						'lt',
						$endTime 
				);
			}
		}
		if($_GET['field'])
		{
			$params['sort_info']=$_GET['field'].' '.$_GET['direction'];
		}
		if(isset($params['sort_info'])&&$params['sort_info'])
		{
			$order=$params['sort_info'].',A.ID DESC';
		}else{
			$order='A.ID DESC';
		}
		
		// $where ['STATUS']=array('neq',0);
		$field = "A.ID,B.NAME as good_name,BOOKING_NAME,MOBILE,BOOK_TIME,NUM,A.PRICE,A.TOTAL_PRICE,A.TRADING_STATUS";
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->alias ( "A" )->field ( $field )->where ( $where )
			->join ( "left join __GOODS__ as B on A.GOODS_ID = B.ID" )
			->order($order)
			->limit ( $start . ',' . $length )->select ();
		if($list){
			foreach ($list as $key=>$value){
				$list[$key]['book_time']=date("Y-m-d H:i:s",$value['book_time']);
			}
		}
		$count = $this->model->alias ( "A" )->field ( $field )->where ( $where )->join ( "left join __GOODS__ as B on A.GOODS_ID = B.ID" )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * Description: 关闭订单（后台）
	 * Author: frima
	 * Date:2015-09-25
	 */
	public function close() {
		$id = intval ( I ( 'put.id' ) );
		$where ['ID'] = $id;
		$data ['TRADING_STATUS'] = 4; // 订单被关闭
		$data ['PAY_STATUS'] = 2; // 支付被关闭
		$this->startTrans ();
		$res = $this->model->where ( $where )->save ( $data );
		AdminLog($where ['ID'], 9, '', "订单关闭");
		if (false !== $res) {
			if (C ( 'SHOP_MODE' ) == 0) { // 拍下减库存，则需要还原库存
				$arr = $this->model->find ( $id );
				$where ['ID'] = $arr ['goods_id'];
				$flag = $this->goodsModel->where ( $where )->setDec ( 'SOLD_NUM', $arr ['num'] );
				if ($flag) { // 库存还原成功
					$this->commit (); //
					return true;
				} else { // 库存还原失败
					$this->rollback (); // 回滚
					return false;
				}
			} else { // 如果是支付减库存，则库存不用更改
				$this->commit (); //
				return true;
			}
		} else {
			$this->rollback (); // 关闭失败，回滚！
			return false;
		}
	}
	
	/**
	 * Description: 发货订单（后台）
	 * Author: frima
	 * Date:2015-09-25
	 */
	public function send() {
		$where ['ID'] = intval ( I ( 'put.id' ) );
	
		$data ['BELIVERY_TIME'] = time ();
		$data ['TRADING_STATUS'] = 3;
		$res = $this->model->where ( $where )->save ( $data );
		AdminLog($where ['ID'], 10, '', "订单确认完成");
		return $res;
	}
	
	/**
	 * Description: 用户下单（前端接口）
	 * Author: ward
	 * Date:
	 */
	public function add() {
		$goodsId = intval ( $_GET ['GOODS_ID'] );
		$user=session('user');
		if(!$user){
			$this->setError ( '请先登录' );
			return false;
		}
		$goodsArr = $this->goodsModel->find ( $goodsId );
		
		if (! $goodsArr) {
			$this->setError ( '该商品已经飞走了！' );
			return false;
		}
	
		$num = intval ( $_GET ['NUM'] ); // 购买数量
		
		if (empty ( $num )) {
			$this->setError ( '订购数量不能为空！' );
			return false;
		}
		
// 		if (intval ( $goodsArr ['limit'] ) < $num) {
// 			$this->setError ( '一次预定数量超过限定数量！' );
			
// 			return false;
// 		}
		
		if ($goodsArr ['total_num'] - $goodsArr ['sold_num'] < $num) {
			$this->setError ( '库存不足！' );
			return false;
		}
		$this->startTrans (); // 启动事务
		$data = $this->model->create ( $_GET );
		
		if ($data) {
			if($goodsArr['is_promotion']==1)
			{
				$data ['PRICE'] = $goodsArr ['promotion_price'];
			}else{
				$data ['PRICE'] = $goodsArr ['price']; // 销售单价
			}
			$data ['TOTAL_PRICE'] = $num * $goodsArr ['price']; // 总价=份数*时价
			$data ['BOOK_TIME'] = time();
			$data['MOBILE']=$user['mobile'];
			$data['BOOKING_NAME']=$user['nickname'];
			$data ['USER_ID'] = $user['id'];
			$data ['TRADING_STATUS'] == 0; // 交易状态标志
			$data ['PAY_STATUS'] = 0; // 支付状态标志
			$data ['ORIGIN_DATA'] = json_encode ( $goodsArr ); // 商品信息快照
			$orderId = $this->model->add ( $data );
			if (! $orderId) { // 添加数据失败
				$this->model->rollback (); // 失败 回滚
				return false;
			}
			
			if (! C ( 'SHOP_MODE' )) { // 1为支付减库存,0为拍下减库存
				$r = $this->goodsModel->where ( 'ID=' . $goodsId )->setInc ( 'SOLD_NUM', $num );
				if ($r) {
					$this->model->commit (); // 提交
					return $orderId;
				} else {
					$this->setError ( $this->goodsModel->getError () );
					$this->rollback (); // 失败数据回滚
					return false;
				}
			} else {
				
				$this->model->commit ();
				$this->logmodel->addLog ( $orderId, $goodsArr ['poi_id'], json_encode ( $data ) );
				return $orderId;
			}
		} else {
			$this->setError ( $this->model->getError () );
			return false;
		}
	}
	
	/**
	 * Description: 用户下单成功后---调用支付接口
	 * Author: ward
	 * Date:
	 */
	public function pay($orderId) {
		$orderId = intval ( $orderId );
		$this->model->startTrans (); // 开启事务
		$orderArr = $this->model->lock ( true )->find ( $orderId ); // 获取订单数据
		$goodsArr = $this->getGoods ( $orderArr ['goods_id'] );
		
		import ( "Common.Lib.Paywap.Alipay" );
		// payment_id判断支付方式，1到店支付，2微信支付，3支付宝支付；flag判断管理员是否操作，0未操作，1已操作
		if ($orderArr ['payment_id'] == 3 && $orderArr ['pay_status'] == 0) {
			
			$info = M ( 'alipay_config' )->where ( 'POI_ID='.$goodsArr['data']['poi_id'])->find (); // 获取支付宝配置数据
			if ($info) {
				C ( 'ALIPAY.partner', $info ['partner_id'] );
				C ( 'ALIPAY.key', $info ['ali_key'] );
				C ( 'ALIPAY.account', $info ['account'] );
				C ( 'ALIPAY.notify_url', "http://" . $_SERVER ['HTTP_HOST'] . C ( 'ALIPAY.notify_url' ) );
				C ( 'ALIPAY.call_back_url', "http://" . $_SERVER ['HTTP_HOST'] . C ( 'ALIPAY.call_back_url' ) );
				C ( 'ALIPAY.merchant_url', "http://" . $_SERVER ['HTTP_HOST'] . C ( 'ALIPAY.merchant_url' ) );
			} else {
				$this->setProperty ( 'error', "支付配置错误，请重新配置" );
				return false;
			}
			
			$alipay = new \Common\Lib\Paywap\Alipay ( C ( 'ALIPAY' ) );
			// $alipay->pay($roomOrder['id'],"酒店房间预订",$roomOrder['total_price']);
			// 测试支付宝付款，测试金额0.01，正式上线需要变更为订单实际金额
			$alipay->pay ( 'b_' . $orderArr ['id'], $goodsArr ['data'] ['name'], $orderArr ['total_price'] );
			exit ();
		}
		
		$this->model->commit ();
		
		return array (
				'status' => 1, // 返回支付状态，1成功，0失败
				'data' => $orderArr,
				'info' => L ( "ORDER_SUCCESS" ) 
		);
	}
	
	/*
	 * 获取商品详情
	 * @param $id
	 * @return array
	 */
	function getGoods($id) {
		
		// 获取套餐信息
		$res = $this->goodsModel->find ( $id );
		$data ['data'] = $res;
		if ($data) {
			return $data;
		} else {
			return false;
		}
	}
	
	/*
	 * 获取订单详情(模态框专用)
	 * @param $id
	 * @return array
	 */
	function detail() {
		$where ['A.ID'] = intval ( I ( 'id' ) );
		$field = 'A.ID,B.NAME AS GOODS_NAME,BOOKING_NAME,A.MOBILE,A.MAIL_ID,A.MAIL_NAME,BOOK_TIME AS BOOK_TIME,';
		$field .= 'BELIVERY_TIME AS BELIVERY_TIME,CONFIRM_TIME AS CONFIRM_TIME,NUM,A.PRICE,A.TOTAL_PRICE,TRADING_STATUS';
		$res = $this->model->alias ( 'A' )->field ( $field )->join ( "left join __GOODS__ as B on A.GOODS_ID = B.ID" )->join ( "left join __USER__ as C on A.USER_ID = C.ID" )->where ( $where )->find ();
		
		$data = "<p>订单号：{$res['id']}</p>";
		$data .= "<p>商品名：{$res['goods_name']}</p>";
		
		$data .= "<p>预订人：{$res['booking_name']}</p>";
		$data .= "<p>手机号码：{$res['mobile']}</p>";
		$data .= "<p>下单时间：".date('Y-m-d H:i:s',$res['book_time'])."</p>";
		//$data .= "<p>发货时间：{$res['belivery_time']}</p>";
		$data .= "<p>确认时间：{$res['confirm_time']}</p>";
		// $data .= "<p>购买数量：{$res['num']}</p>";
		// $data .= "<p>单价：{$res['price']}</p>";
		$data .= "<p>总价：{$res['num']}(件)*{$res['price']}(元/件)={$res['total_price']}(元)</p>";
		// 交易状态0:未支付 1：已支付 2:已发货3：已完成 4：被系统关闭
		switch ($res ['trading_status']) {
			case '0' :
				$data .= "<p color='red'>订单状态：<font color='red'>未支付</font></p>";
				break;
			case '1' :
				$data .= "<p color='red'>订单状态：<font color='red'>已支付</font></p>";
				break;
			case '2' :
				$data .= "<p>快递名：{$res['mail_name']}</p>";
				$data .= "<p>快递单：{$res['mail_id']}</p>";
				$data .= "<p color='red'>订单状态：<font color='red'>已发货</font></p>";
				break;
			case '3' :
				//$data .= "<p>快递名：{$res['mail_name']}</p>";
				//$data .= "<p>快递单：{$res['mail_id']}</p>";
				$data .= '<p >订单状态：<font color="red">已收货,完成订单</font></p>';
				break;
			case '4' :
				$data .= "<p>订单状态：<font color='red'>被系统关闭</font></p>";
				break;
			default :
				break;
		}
		return $data;
	}
	
	/**
	 * 前端接口---根据订单状态获得相关订单列表
	 *
	 * @return boolean|unknown
	 */
	public function get() {
		if (isset ( $_GET ['status'] )) {
			$status = intval ( $_GET ['status'] );
			if($status==3){
				$where ['TRADING_STATUS'] =array('in','2,3');
			}else{
				$where ['TRADING_STATUS'] = $status;
			}
			
		} else {
			$where ['TRADING_STATUS'] = array (
					'neq',
					4 
			); // 被系统取消的订单不能显示
		}
		
		$user = session ( 'user' );
		$where ['USER_ID'] = $user['id'];
		$field = 'ID,ORIGIN_DATA,AMOUNT,NUM,TRADE_NO,MAIL_ID,MAIL_NAME,TRADING_STATUS,BOOKING_NAME,MOBILE,ADDRESS,BOOK_TIME';
		$res = $this->model->where ( $where )->field ( $field )->order ( 'ID desc' )->select ();
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $res;
		$reslut ['results'] = $count;
		return $reslut;
	}
	/**
	 * 前端接口---用户点击确认收货
	 *
	 * @return boolean|unknown
	 */
// 	public function confim() {
// 		$where ['ID'] = intval ( I ( 'get.id' ) );
// 		$data ['CONFIRM_TIME'] = time ();
// 		$data ['TRADING_STATUS'] = 3; // 订单已经完成
// 		$res = $this->model->where ( $where )->save ( $data );
// 		return $res;
// 	}
	

	/**
	 * 
	 */
	function confirm($order_id){
		$user = session('user');
		$user_id=$user['id'];
		//$data['TRADING_STATUS']=2;//2表示已发货
		if(empty($user_id)){
			return false;
		}
		$data['TRADING_STATUS']=3;//3表示已经完成订单  ward 2016-03-16
		$data['CONFIRM_TIME']=time();
		$res = $this->model->where("ID=$order_id and USER_ID=$user_id")->save($data);
		return $res;
		
	}
	
	/**
	 * Description: 
	 * Author: frima
	 * Date:2015-09-25
	 */
	public function close_auto($id){
		
		$where['ID'] =$id;
		$data['TRADING_STATUS'] = 4;//订单被关闭
		$data['PAY_STATUS']=2;//支付被关闭
		$this->startTrans();
		$res = $this->model->where($where)->save($data);
	
		if(false!==$res){
			if(C('SHOP_MODE')==0){//拍下减库存，则需要还原库存
				$arr=$this->model->find($id);
				$where['ID']=$arr['goods_id'];
				$flag=$this->goodsModel->where($where)->setDec('SOLD_NUM',$arr['num']);
				if($flag){//库存还原成功
					$this->commit();//
					return true;
				}else{//库存还原失败
					$this->rollback();//回滚
					return false;
				}
			}else{//如果是支付减库存，则库存不用更改
				$this->commit();//
				return true;
			}
		}else{
			$this->rollback();//关闭失败，回滚！
			return false;
		}
	
	}
	function order_close(){
		$where['TRADING_STATUS']=0;
		$where['BOOK_TIME']=array('lt',time()-1800);
		$res = $this->model->where($where)->field("ID")->select();
		if($res){
			foreach ($res as $key=>$value){
				$this->close_auto($value['id']);
			}
		}
	}
}