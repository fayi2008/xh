<?php

namespace Scene\Controller;

class UserController extends \Common\Controller\AdminController {
	function _init() {
		$this->logic = new \Merchant\Logic\AdminLogic ();
		$this->poilogic = new \Gis\Logic\PoiLogic ();
	}
	
	/**
	 * Description: admin_get 显示管理员列表
	 * Author: Jason
	 */
	public function admin_get() {
		if ($_GET ['id'] !== null) {
			$poi = $_GET ['id'];
			$hasPoi = '1';
			$this->assign ( "poi", $poi );
			$this->assign ( "hasPoi", $hasPoi );
		} else {
			$hasPoi = '0';
			$this->assign ( $hasPoi );
		}
		$this->display ( 'User/admin_get' );
	}
	
	/**
	 * Description: poi_post 添加poi点
	 * Author: Jason
	 * Date:
	 */
	public function admin_post() {
		$res = $this->logic->addAdmin ();
		$res ['url'] = U ( '/Merchant/user/admin_get' );
		echo json_encode ( $res );
		// todo
	}
	public function admin_add() {
		
		if ($_GET ['id'] !== null) {
			$business = $this->poilogic->getoneBusiness ($_GET ['id']);
		$this->assign ( "business", $business );
		} else {
			$business = $this->poilogic->getALLBusiness ();
		$this->assign ( "business", $business );
		}
		
		$this->display ( 'User/admin_add' );
	}
	public function admin_edit() {
		$id = I ( 'id' );
		$admin = $this->logic->getAdminDetail ( $id );
		$this->assign ( 'admin', $admin );
		$this->display ( 'User/admin_edit' );
	}
	
	/**
	 * Description: poi_put 修改商户管理员
	 * Author: Jason
	 * Date:
	 */
	public function admin_put() {
		$res = $this->logic->saveAdmin ();
		$res ['url'] = U ( '/Merchant/user/admin_get' );
		echo json_encode ( $res );
	}
	
	/**
	 * Description: admin_delete 删除商户管理员
	 * Author: Jason
	 * Date:
	 */
	public function admin_delete() {
		$res = $this->logic->admin_delete ();
		if ($res) {
			$arr ['status'] = true;
			echo json_encode ( $arr );
			die ();
		} else {
			$arr ['status'] = false;
			echo json_encode ( $arr );
			die ();
		}
		// todo
	}
	public function admin_get_json() {
		if ($_GET ['id'] !== null) {
			$result = $this->logic->getlist ($_GET ['id']);
		}else{
			$result = $this->logic->getlist ();
		}
		
		echo json_encode ( $result );
	}
}