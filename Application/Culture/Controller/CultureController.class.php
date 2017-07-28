<?php

namespace Culture\Controller;

class CultureController extends \Common\Controller\AdminController {
	function _init() {
		$this->logic = new \Culture\Logic\CultureLogic ();
		$this->indexlogic = new \Culture\Logic\IndexLogic ();
	}
	/**
	 * Description: index 显示文化管理界面
	 * Author: Jason
	 * Date:
	 */
	public function index_get() {
		$this->display ( 'Culture/index_get' );
	}
	
	/**
	 * Description: map_delete 添加文化页面
	 * Author: Jason
	 * Date:
	 */
	public function add_get() {
		$select_categorys = $this->logic->getMenusSelect ( 0 );
		// var_dump($select_categorys);
		$this->assign ( "select_categorys", $select_categorys );
		$this->display ( 'Culture/add_get' );
	}
	
	/**
	 * Description: map_delete 添加文化数据
	 * Author: Jason
	 * Date:
	 */
	public function index_post() {
		$relation=$this->indexlogic->relation_culture($_POST['RELATION_CULTURE'],$_POST['CATE_ID']);
		$_POST['RELATION_CULTURE2']=json_encode($relation);
		
		$res = $this->logic->addCulture ();
		
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Culture/culture/index_get' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Culture/culture/index_get' ) 
			) );
		}
	}
	
	/**
	 * Description: map_delete 修改文化页面
	 * Author: Jason
	 * Date:
	 */
	public function update_get() {
		$id = I ( 'id' );
		$culture = $this->logic->getDetailCulture ( $id );

		$select_categorys = $this->logic->getMenusSelect ( $culture ['cate_id'] );

		$this->assign ( "select_categorys", $select_categorys );
		$culture ['content'] = html_entity_decode ( $culture ['content'] );
		$culture ['excerpt'] = html_entity_decode ( $culture ['excerpt'] );

		$culture ['attrs'] = json_decode ( $culture ['attrs'], true );
		$data = $this->logic->cultureAttr2 ( $culture ['cate_id'] );
		foreach ( $data as $key => $value ) {
			$id = $this->findId ( $culture ['attrs'], $value ['id'] );
			if ($id !== false) {
				$data [$key] ['value'] = $culture ['attrs'] [$id] ['value'];
			} else {
				$data [$key] ['value'] = '';
			}
		}
		$culture ['attrs'] = json_encode ( $data );
		if (empty ( $culture ['many_image'] )) {
			$culture ['many_image'] = 'null';
		}
		$this->assign ( "culture", $culture );
		$this->display ( 'Culture/update_get' );
	}
	/**
	 * Description: index_put 编辑文化
	 * Author: Jason
	 * Date:
	 */
	public function index_put() {
		$res = $this->logic->editCulture ();
		
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Culture/culture/index_get' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Culture/culture/index_get' ) 
			) );
		}
	}
	
	/**
	 * Description: index_delete 删除文化
	 * Author: Jason
	 * Date:
	 */
	public function index_delete() {
		
		// todo
		$res = $this->logic->delete ();
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Culture/admin/index.html' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Culture/admin/index.html' ) 
			) );
		}
	}
	
	/**
	 * Description: tag_index 标签管理
	 * Author: Ward
	 * Date:
	 */
	function index_get_json() {
		$res = $this->logic->getListForJson ();
		echo json_encode ( $res );
	}
	public function index_release_put() {
		$res = $this->logic->release ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => U ( '/Panorama/admin/hot_get' ) 
			) );
		}
	}
	function firstMemu() {
		$data = $this->logic->firstmemu ();
		$this->ajaxReturn ( $data );
	}
	/*
	 * 二级菜单
	 */
	function twoMemu($parentid) {
		$data = $this->logic->twoMemu ( $parentid );
		$this->ajaxReturn ( $data );
	}
	function cultureAttr($type_id) {
		$data = $this->logic->cultureAttr ( $type_id );
		
		$arr = array ();
		if ($data) {
			foreach ( $data as $key => $value ) {
				if ($value ['type'] == 1) {
					$arr ['type1'] [] = $value;
				} elseif ($value ['type'] == 2) {
					$arr ['type2'] [] = $value;
				}
			}
		}
		
		$this->ajaxReturn ( $arr );
	}
	function findId($a, $id) {
		foreach ( $a as $k => $t ) {
			if (in_array ( $id, $t ))
				return $k;
		}
		return FALSE;
	}
	public function suggest_culture() {
		$name = $_GET ['title'];
		$res = $this->logic->suggest_culture ( $name );
		if (false === $res) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => $res 
			)
			 );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		}
	}



}