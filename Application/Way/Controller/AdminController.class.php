<?php

namespace Way\Controller;

class AdminController extends \Common\Controller\AdminController {
	function _init() {
		$this->logic = new \Way\Logic\WayLogic ();
		$this->poilogic = new \Gis\Logic\PoiLogic ();
	}
	/**
	 * Description: index_get 显示旅游攻略管理界面
	 * Author: Jason
	 * Date:
	 */
	public function index_get_html() {
		$this->display ( 'index' );
	}
	
	/**
	 * Description: add_get_html 新建攻略数据
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function add_get_html() {
        $this->assign('way_tags',C('WAY_TAG'));
		$this->display ( 'add' );
	}
	
	/**
	 * Description: index_post 新建攻略数据
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function index_post() {
		$res = $this->logic->add ();
		if ($res !== false) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => '/Way/admin/index.html' 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => '/Way/admin/index.html' 
			) );
		}
	}
	/**
	 * Description: update_get_html 编辑攻略html
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function update_get_html() {
		$way = $this->logic->getOne ();
		$tags = explode(',',$way['tag_id']);
		$this->assign ( "tags", $tags );
		$this->assign('way_tags',C('WAY_TAG'));
		$this->assign ( "way", $way );
		$this->display ( 'update' );
	}
	/**
	 * Description: index_put 编辑攻略
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function index_put() {
		$res = $this->logic->edit ();
		if ($res !== false) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => '/Way/admin/index.html' 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => '/Way/admin/index.html' 
			) );
		}
	}
	
	/**
	 * Description: index_put 删除攻略
	 * Author: Jason
	 * Date:
	 */
	public function index_delete() {
		$res = $this->logic->delete ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0 
			) );
		}
	}
	
	/**
	 * Description: index_put 发布攻略
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function release_put() {
		$res = $this->logic->release ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0 
			) );
		}
	}
	
	/**
	 * Description: index_get_json
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function index_get_json() {
		
		$res = $this->logic->getLists ();
		echo json_encode ( $res );
	}
	
	/**
	 * Description: poi_get_html 攻略poi点管理
	 * Author: Jason
	 * Date:2015-09-24
	 */
	function poi_get_html() {
		$id = I ( 'get.id' );
		$poi_logic = new \Gis\Logic\PoiLogic ();
		$pois = $poi_logic->getScenes ();
		$this->assign ( 'pois_select', $pois );
		$this->assign ( 'way_id', $id );
		
		$this->display ( 'poi' );
	}
	
	// 线路详情
	function way_detail_get_json() {
	}
	/**
	 * grid 联动json
	 */
	function data_json() {
		$relation = $this->logic->getrelation ();
		echo json_encode ( $relation, JSON_UNESCAPED_UNICODE );
	}
	/**
	 * 添加与编辑攻略
	 */
	function relation_post() {
		$reslut = $this->logic->relation_post ();
		echo json_encode ( $reslut );
	}
	/**
	 * 删除攻略
	 */
	function relation_delete() {
		$res = $this->logic->relation_delete ();
		$way_id = I ( 'way_id' );
		$way_id = $way_id [0];
		if ($res) {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( "/Way/admin/poi.html?id=$way_id" ) 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( "/Way/admin/poi.html?id=$way_id" ) 
			) );
		}
	}
	public function select_json() {
		$suggest = $_POST ['suggest'];
		$poi = $this->poilogic->getSceneName ( $suggest );
		//var_dump($poi);
		$str = json_encode($poi);
		$callback = $_GET ['callback'];
		echo $callback . "(" . $str . ")";
	
		die ();
	}
}