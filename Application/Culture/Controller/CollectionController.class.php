<?php

namespace Culture\Controller;

class CollectionController extends \Common\Controller\AdminController {
	function _init() {
		$this->logic = new \Culture\Logic\CollectionLogic ();
	}
	/**
	 * Description: index 显示文化管理界面
	 * Author: Jason
	 * Date:
	 */
	public function index_get() {
		$this->display ( 'Collection/collection_get' );
	}
	
	/**
	 * Description: map_delete 添加文化页面
	 * Author: Jason
	 * Date:
	 */
	public function add_get() {
		$this->display ( 'Collection/collection_add' );
	}
	
	/**
	 * Description: map_delete 添加文化数据
	 * Author: Jason
	 * Date:
	 */
	public function collection_post() {
		$res = $this->logic->addCollection ();
		
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Culture/collection/index_get' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Culture/collection/index_get' ) 
			) );
		}
	}
	
	/**
	 * Description: map_delete 修改文化页面
	 * Author: Jason
	 * Date:
	 */
	public function collection_edit() {
		$id = I ( 'id' );
		$collection = $this->logic->getDetailCollection ( $id );
		
		
	
		$collection ['content'] = html_entity_decode ( $collection ['content'] );
	
		$this->assign ( "collection", $collection );
		$this->display ( 'Collection/collection_edit' );
	}
	/**
	 * Description: index_put 编辑文化采集状态
	 * Author: Jason
	 * Date:
	 */
	public function collection_put() {
		$res = $this->logic->saveCollection ();
		
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Culture/collection/index_get' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Culture/collection/index_get' ) 
			) );
		}
	}
	
	/**
	 * Description: index_delete 删除文化
	 * Author: Jason
	 * Date:
	 */
	public function collection_delete() {
		$res = $this->logic->collection_delete();
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Culture/collection/index.html' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Culture/collection/index.html' ) 
			) );
		}
	}
	
	/**
	 * Description: 后台列表json格式数据
	 * Author: liuzhaojun
	 * Date:
	 */
	function index_get_json() {
		$res = $this->logic->getListForJson ();
		echo json_encode ( $res );
	}
	public function collection_release_put() {
		$res = $this->logic->release ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/culture/collection/index_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/culture/collection/index_get' ) 
			) );
		}
	}
}