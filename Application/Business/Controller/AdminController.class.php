<?php

namespace Business\Controller;

class AdminController extends \Common\Controller\BusinessController {
	function _init() {
		$this->logic = new \Merchant\Logic\AdminLogic ();
		$this->poilogic = new \Gis\Logic\PoiLogic ();
		$this->tagLogic = new \Gis\Logic\TagLogic ();
		$this->cateLogic = new \Business\Logic\CateLogic ();
		$this->goodsLogic = new \Business\Logic\GoodsLogic ();
		$this->alipayLogic = new \Business\Logic\AlipayLogic ();
		$this->orderLogic = new \Business\Logic\OrderLogic ();
		$this->promotionLogic = new \Business\Logic\PromotionLogic ();
	}
	/**
	 * Description: index 显示商品管理界面
	 * Author: Jason
	 * Date:
	 */
	public function goods_get() {
		$this->display ( "Admin/goods_get" );
	}
	
	/**
	 * Description: index 显示
	 * Author: Jason
	 * Date:
	 */
	public function alipay_get() {
		$alipay_config = $this->alipayLogic->getAlipayConfig ();
		
		$this->assign ( "alipay_config", $alipay_config );
		$this->display ( "Admin/alipay" );
	}
	
	/**
	 * Description: goods_add 添加商品
	 * Author: Jason
	 * Date:
	 */
	function goods_add() {
		$cate = $this->cateLogic->getALLcate ();
		$panorama_logic=new \Panorama\Logic\PanoLogic();
		$poi_id = session ( 'business.poi_id' );
		$panos=$panorama_logic->getPanosOfPoi($poi_id);
		$this->assign ( "cate", $cate );
		$this->assign ( "panos", $panos );
		$this->display ( "Admin/goods_add" );
	}
	
	/**
	 * Description: goods_update 编辑商品
	 * Author: Jason
	 * Date:
	 */
	function goods_edit() {
		$cate = $this->cateLogic->getALLcate ();
		$this->assign ( "cate", $cate );
		$id = $_GET ['id'];
		$goods = $this->goodsLogic->getDetailGoods ( $id );
		$goods ['description'] = htmlspecialchars_decode ( $goods ['description'] );
		$panorama_logic=new \Panorama\Logic\PanoLogic();
		$poi_id = session ( 'business.poi_id' );
		$panos=$panorama_logic->getPanosOfPoi($poi_id);
		$this->assign ( "goods", $goods );
		$this->assign ( "panos", $panos );
		$this->display ( "Admin/goods_edit" );
	}
	
	/**
	 * Description: map_delete 修改商品数据
	 * Author: liuzhaojun
	 * Date:
	 */
	public function goods_put() {
		$logic = new \Business\Logic\GoodsLogic ();
		$data = I ( 'put.' );
		$res = $logic->editGoods ( $data );
		$res ['data'] = U ( '/Business/admin/goods_get' );
		$this->ajaxReturn ( $res );
	}
	
	/**
	 * Description: map_delete 修改alipay
	 * Author: liuzhaojun
	 * Date:
	 */
	public function alipay_put() {
		$logic = new \Business\Logic\AlipayLogic ();
		$data = I ( 'put.' );
		$res = $logic->editAlipay ( $data );
		$res ['data'] = U ( '/Business/admin/alipay' );
		$this->ajaxReturn ( $res );
	}
	
	/**
	 * Description: map_delete 添加商品数据
	 * Author: Jason
	 * Date:
	 */
	public function goods_post() {
		$logic = new \Business\Logic\GoodsLogic ();
		$data = I ( 'post.' );
		$res = $logic->addGoods ( $data );
		$res ['data'] = U ( '/Business/admin/goods_get' );
		$this->ajaxReturn ( $res );
	}
	
	/**
	 * Description: map_delete 添加alipay
	 * Author: Jason
	 * Date:
	 */
	public function alipay_post() {
		$logic = new \Business\Logic\AlipayLogic ();
		$data = I ( 'post.' );
		$res = $logic->addAlipay ( $data );
		$res ['data'] = U ( '/Business/admin/alipay' );
		$this->ajaxReturn ( $res );
	}
	
	/**
	 * Description: goods_delete 删除商品
	 * Author: Jason
	 * Date:
	 */
	
	/**
	 * Description: goods_cate 商品分类管理
	 * Author: Jason
	 * Date:
	 */
	public function cate_get() {
		$logic = new \Business\Logic\CateLogic ();
		
		$cate_json = $logic->cate_list ();
		$this->assign ( 'cate_json', $cate_json );
		$this->display ( 'Admin/cate_index' );
	}
	
	/**
	 * Description: cate_add 分类添加显示页面
	 * Author: Jason
	 * Date:
	 */
	public function cate_add() {
		$this->display ( "Admin/cate_add" );
	}
	/**
	 * Description: cate_update 分类编辑显示页面
	 * Author: Jason
	 * Date:
	 */
	public function cate_edit() {
		$id = I ( "get.id", 0, 'int' );
		if (! $id) {
			$this->error ( '参数错误', U ( 'index' ) );
		}
		$logic = new \Business\Logic\CateLogic ();
		$group = $logic->getGroupInfo ( $id );
		if (! $group) {
			$this->error ( '不存在该菜单', U ( 'index' ) );
		}
		$select_categorys = $logic->getCatesSelect ( $group ['parentid'] );
		
		$this->assign ( "data", $group );
		$this->assign ( "select_categorys", $select_categorys );
		$this->display ( 'Admin/cate_edit' );
	}
	/**
	 * Description: cate_post 分类添加数据处理
	 * Author: Jason
	 * Date:
	 */
	public function cate_post() {
		$logic = new \Business\Logic\CateLogic ();
		$data = I ( 'post.' );
		$res = $logic->addCate ( $data );
		$this->ajaxReturn ( $res );
	}
	
	/**
	 * Description: cate_put 分类编辑数据处理
	 * Author: Jason
	 * Date:
	 */
	public function cate_put() {
		$logic = new \Business\Logic\CateLogic ();
		$data = I ( 'put.' );
		$res = $logic->edit ( $data );
		$this->ajaxReturn ( $res );
	}
	public function cate_delete_json() {
		$logic = new \Business\Logic\CateLogic ();
		$id = I ( 'get.id', 0, 'int' );
		$res = $logic->deleteCate ( $id );
		if ($res) {
			$data = array (
					'success' => true 
			);
		} else {
			$data = array (
					'success' => false 
			);
		}
		$this->ajaxReturn ( $data );
	}
	/**
	 * Description: cate_delete 分类删除
	 * Author: Jason
	 * Date:
	 */
	public function cate_delete() {
	}
	function index() {
		$menu_logic = new \System\Logic\MenuLogic ();
		$submenus = $menu_logic->submenu ();
		$menu_json = $menu_logic->menu_json ();
		$this->assign ( 'submenus', $submenus );
		$this->assign ( 'menu_json', $menu_json );
		$this->display ( 'index' );
	}
	/**
	 * Description: index 后台首页
	 * Author: Jason
	 * Date:
	 */
	function main() {
		$this->display ( 'main' );
	}
	function admin_edit() {
		$user = session ( 'business' );
		$id = $user ['id'];
		$admin = $this->logic->getAdminDetail ( $id );
		$this->assign ( 'admin', $admin );
		$this->display ( 'Admin/admin_edit' );
	}
	public function admin_put() {
		$res = $this->logic->saveAdmin ();
		$res ['url'] = U ( '/business/admin/admin_edit' );
		echo json_encode ( $res );
	}
	function poi() {
		$user = session ( 'business' );
		
		$poi_id = $user ['poi_id'];
		
		$poi = $this->poilogic->getPoiDetail ( $poi_id );
		
		$this->assign ( "poi", $poi );
		$this->display ();
	}
	public function poi_edit() {
		$user = session ( 'business' );
		
		$id = $user ['poi_id'];
		
		$poi = $this->poilogic->getPoiDetail ( $id );
		$poi ['tag_ids'] = explode ( ",", $poi ['tag_ids'] );
		
		$this->assign ( 'poi', $poi );
		$type1 = '';
		$type2 = '';
		$type3 = '';
		$status0 = '';
		$status1 = '';
		if (1 == $poi ['type']) {
			$type1 = 'selected';
		}
		if (2 == $poi ['type']) {
			$type2 = 'selected';
		}
		if (3 == $poi ['type']) {
			$type3 = 'selected';
		}
		if (0 == $poi ['status']) {
			$status0 = 'selected';
		}
		if (1 == $poi ['status']) {
			$status1 = 'selected';
		}
		$tag = $this->tagLogic->getOptions ();
		$this->assign ( 'tag', $tag );
		$this->assign ( 'type1', $type1 );
		$this->assign ( 'type2', $type2 );
		$this->assign ( 'type3', $type3 );
		$this->assign ( 'status0', $status0 );
		$this->assign ( 'status1', $status1 );
		$this->display ( 'Admin/poi_edit' );
	}
	public function poi_put() {
		$res = $this->poilogic->savePoi ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/business/admin/poi' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/business/admin/poi' ) 
			) );
		}
	}
	public function goods_get_json() {
		$result = $this->goodsLogic->getlist ();
		echo json_encode ( $result );
	}
	public function goods_release_put() {
		$res = $this->goodsLogic->releaseGood ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/business/admin/goods_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/business/admin/goods_get' ) 
			) );
		}
	}
	public function goods_delete() {
		$res = $this->goodsLogic->goods_delete ();
		if ($res) {
			$arr ['success'] = true;
			echo json_encode ( $arr );
			die ();
		} else {
			$arr ['success'] = false;
			echo json_encode ( $arr );
			die ();
		}
		// todo
	}
	
	
	/**
	 * Description: order_get_html 订单管理主页
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function order_get_html(){
		$this->display("order_index");
	}
	
	/**
	 * Description: order_get_json 订单管理主页
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function order_get_json(){
		$res = $this->orderLogic->getLists();
		echo json_encode($res,JSON_UNESCAPED_UNICODE);
	}
	
	/**
	 * Description: order_close_put 关闭订单
	 * Author: frima
	 * Date:2015-09-25
	 */
	public function order_close_put(){
		$res = $this->orderLogic->close();
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
	
	/**
	 * Description: order_send_put 关闭订单
	 * Author: frima
	 * Date:2015-09-25
	 */
	public function order_send_put(){
		$res = $this->orderLogic->send();
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
	
	/**
	 * Description: detail_get_json 获得订单详情
	 * Author: Ward
	 * Date:
	 */
	public function detail_get_json() {
		$res=$this->orderLogic->detail();
		echo $res;
	}

	/**
	 * Description:promotion_get_html 促销管理页面
	 * Author:jason
	 */
	public function promotion_get_html()
	{
		$business_id=session('business.poi_id');
		$promotion=$this->promotionLogic->getPromotion($business_id);
		$this->assign('promotion',$promotion);
		$this->display ( 'promotion' );
	}

	/**
	 * Description:promotion_put 修改促销活动信息
	 * Author:jason
	 */
	public function promotion_put()
	{
		$business_id=session('business.poi_id');
		$name=I('put.NAME');
		$description=I('put.DESCRIPTION');
		$res=$this->promotionLogic->updatePromotion($business_id,$name,$description);
		if($res!==false)
		{
			$this->ajaxReturn ( array (
				'status' => 1
			) );
		}else{
			$this->ajaxReturn ( array (
				'status' => 0,
				'msg'=>'保存数据失败'
			) );
		}
	}

}