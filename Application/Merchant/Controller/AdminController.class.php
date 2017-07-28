<?php

namespace Merchant\Controller;

class AdminController extends \Common\Controller\AdminController {
	function _init() {
		$this->logic = new \Merchant\Logic\PoiLogic ();
		$this->tagLogic = new \Merchant\Logic\TagLogic ();
	}

	
	/**
	 * Description: poi_get 显示poi管理列表
	 * Author: Jason
	 */
	public function poi_get() {
		$this->display ( 'Admin/poi_get' );
	}
	
	/**
	 * Description: poi_post 添加poi点
	 * Author: Jason
	 * Date:
	 */
	public function poi_post() {
		$res = $this->logic->addPoi ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Merchant/admin/poi_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Merchant/admin/poi_get' ) 
			) );
		}
	}
	public function poi_add() {
		$tag=$this->tagLogic->getOptions();
		$this->assign('tag',$tag);
		$this->display ( 'Admin/poi_add' );
	}
	public function poi_edit() {
		$id = I ( 'id' );
		$poi = $this->logic->getPoiDetail ( $id );
		$poi['tag_ids']=explode(",", $poi['tag_ids']);
		if (empty ( $poi ['many_image'] )) {
			$poi ['many_image'] = 'null';
		}else{
			//$poi ['many_image']=json_decode($poi ['many_image']);
		}
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
		$tag=$this->tagLogic->getOptions();
		$this->assign('tag',$tag);
		$this->assign ( 'type1', $type1 );
		$this->assign ( 'type2', $type2 );
		$this->assign ( 'type3', $type3 );
		$this->assign ( 'status0', $status0 );
		$this->assign ( 'status1', $status1 );
		$this->display ( 'Admin/poi_edit' );
	}
	
	/**
	 * Description: poi_put 修改poi点
	 * Author: Jason
	 * Date:
	 */
	public function poi_put() {
		$res = $this->logic->savePoi ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Merchant/admin/poi_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Merchant/admin/poi_get' ) 
			) );
		}
	}
	
	/**
	 * Description: poi_delete 删除poi点
	 * Author: Jason
	 * Date:
	 */
	public function poi_delete() {
		$res = $this->logic->poi_delete ();
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
	 * Description: poi_release_put 发布poi点
	 * Author: Jason
	 * Date:
	 */
	public function poi_release_put() {
		$res = $this->logic->releasePoi ();
		if ($res) {
		
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/poi_get' )
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/poi_get' )
			) );
		}
	}
	public function poi_get_json() {
		$selectArr=$_GET;
		$result = $this->logic->getlist ($selectArr);
		echo json_encode ( $result );
	}
	public function city_json() {
		$result = $this->logic->getCity ();
		echo json_encode ( $result );
	}
	
	/**
	 * Description: tag_index 标签管理
	 * Author: Ward
	 * Date:
	 */
	function tag_get_html() {
		$this->display ( 'tag_index' );
	}
	/**
	 * Description: tag_index 标签管理
	 * Author: Ward
	 * Date:
	 */
	function tag_get_json() {
		$res = $this->tagLogic->getLists ();
		echo json_encode ( $res );
	}
	
	/**
	 * Description: tag_add 添加标签页面
	 * Author: Ward
	 * Date:
	 */
	function tag_add() {
		$this->display ();
	}
	
	/**
	 * Description: tag_update 编辑标签页面
	 * Author: Ward
	 * Date:
	 */
	function tag_update() {
		$data = $this->tagLogic->getOne ();
		$this->assign ( 'data', $data );
		$this->display ();
	}
	
	/**
	 * Description: tag_post 添加标签数据
	 * Author: Ward
	 * Date:
	 */
	function tag_post() {
		$res = $this->tagLogic->add ();
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Merchant/admin/tag.html' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Merchant/admin/tag.html' ) 
			)
			 );
		}
	}
	
	/**
	 * Description: tag_put 编辑标签数据
	 * Author: Ward
	 * Date:
	 */
	function tag_put() {
		$res = $this->tagLogic->edit ();
		if (false === $res) {
			
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Merchant/admin/tag.html' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Merchant/admin/tag.html' ) 
			)
			 );
		}
	}
	
	/**
	 * Description: tag_delete 删除标签数据
	 * Author: Ward
	 * Date:
	 */
	function tag_delete() {
		$res = $this->tagLogic->delete ();
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Gis/admin/tag.html' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Gis/admin/tag.html' ) 
			) );
		}
	}
}