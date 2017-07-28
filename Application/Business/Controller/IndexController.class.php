<?php

namespace Business\Controller;

class IndexController extends \Common\Controller\BaseController {
	function _init() {
		$this->catelogic = new \Business\Logic\CateLogic ();
		$this->goodlogic = new \Business\Logic\GoodsLogic ();
		$this->orderlogic = new \Business\Logic\OrderLogic ();
		$this->poilogic = new \Merchant\Logic\PoiLogic ();
		$this->promotionLogic= new \Business\Logic\PromotionLogic();
		C ( 'VIEW_PATH', APP_ROOT . '/Template/' . WEB_TYPE . '/Business/' );
	}
	function index_get_html() {
		$this->display ( 'index' );
	}
	function detail_get_html() {
		$id = I ( 'id' );
		$res = $this->poilogic->getPoiDetail ( $id );
		if (is_array ( $res )) {
			$data['status']=1;
			$data['data']=$res;
			if($res['pc_website_url'])
			{
				header('location:'.$res['pc_website_url']);
				exit();
			}
		} else {

			$data['status']=0;
			$data['msg']='';
		}
		$this->assign('data',json_encode($data));


		$res = $this->goodlogic->getGoodsByCate ( $id );
		if (is_array ( $res )) {

				$goods['status'] = 1;
				$goods['data'] = $res;

		} else {
			$goods['status'] = 0;
			$goods['msg'] = '';

		}
		$this->assign('goods',json_encode($goods));

		$promotion_info = $this->promotionLogic->getPromotion ( $id );
		if (is_array ( $promotion_info )) {

			$promotion['status'] = 1;
			$promotion['data'] = $promotion_info;

		} else {
			$promotion['status'] = 0;
			$promotion['msg'] = '';

		}
		$this->assign('promotion',json_encode($promotion_info));

		$this->display ( 'detail' );
	}
	function goods_get_html() {
		$goods_id = I ( 'id' );
		$res = $this->goodlogic->getDetailGoods ( $goods_id );
		$this->goodlogic->click($goods_id);
		if (is_array ( $res )) {
			$this->goodlogic->click();
			$goods['status'] = 1;
			$goods['data'] = $res;
		} else {
			$goods['status'] = 0;
			$goods['msg'] = '';
		}
		$this->assign('goods',json_encode($goods));
		$this->display ( 'goods' );
	}
	
	/**
	 * Description: index 获取商品列表
	 * Author: Jason
	 * Date:
	 */
	public function goods_get() {
		$poi_id = $_GET ['poi_id'];
		$res = $this->goodlogic->getGoodsByCate ( $poi_id );
		if (is_array ( $res )) {
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
	
	/**
	 * Description: index 获取商品详情
	 * Author: Jason
	 * Date:
	 */
	public function detail_get($goods_id) {
		$res = $this->goodlogic->getDetailGoods ( $goods_id );
		if (is_array ( $res )) {
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
	
	/**
	 * Description: index 获取商品分类
	 * Author: Jason
	 * Date:
	 */
	public function cate_get() {
		$poi_id = $_GET ['poi_id'];
		$res = $this->catelogic->get_cate ( $poi_id );
		
		if (is_array ( $res )) {
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
	/**
	 * 前台商户列表
	 */
	public function getBusinessList() {
		$res = $this->poilogic->getBusinessList ();
		if (is_array ( $res )) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => $this->poilogic->getError () 
			) );
		}
	}
	/**
	 * 前台商户详情
	 */
	public function BusinessDetail() {
		$id = I ( 'id' );
		$res = $this->poilogic->getPoiDetail ( $id );
		if (is_array ( $res )) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg' => $this->poilogic->getError () 
			) );
		}
	}
	public function order_close(){
		
		
		$res = $this->orderlogic->order_close();
		
		if(false===$res){
			$this->ajaxReturn ( array (
					'status' => 0,
					'msg'=>$this->logic->getError()
			) );
		}else{
			$this->ajaxReturn ( array (
					'status' => 1
			) );
		}
	}
}