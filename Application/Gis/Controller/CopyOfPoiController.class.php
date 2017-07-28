<?php

namespace Gis\Controller;

class PoiController extends \Common\Controller\BaseController {
	function _init() {
		$this->logic = new \Gis\Logic\PoiLogic ();
		$this->tagLogic = new \Gis\Logic\TagLogic ();
	}
	/**
	 * Description: index 显示poi点信息
	 * Author: Jason
	 */
	public function index_get_html() {
		// todo
	}
	
	/**
	 * Description: index_get 获取poi点数据
	 * Author: Jason
	 * Date:
	 */
	public function index_get() {
		// todo
	}
	/**
	 * Description: index 获取poi列表数据(根据分类获取景点、餐饮、住宿、其他)
	 * Author: Jason
	 * Date:
	 */
	public function list_get() {
		
		// todo
	}
	
	/**
	 * Description: poi点详情
	 * Author: Jason
	 * Date:
	 */
	public function poi_detail() {
		$id = $_GET ['id'];
		$res = $this->logic->getPoiDetail ( $id );
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
	 * Description: 获得poi点下的所有有文化文章的
	 * Author: ward
	 * Param:$_GET('id'=>'poi点id','key'=>'全景key')
	 * Date: 2015-12-02
	 */
	public function culture_get_json(){
		$poiId=intval($_GET['id']);
		$panoKey=intval($_GET['pano']);
		$data=$this->logic->getPoiCulture($poiId,$panoKey);
		if($data){
			$this->ajaxReturn(array('status'=>1,'data'=>$data));
		}else{
			$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
		}
	}
	
	/**
	 * Description: 分类获取poi
	 * Author: Jason
	 * Date:
	 */
	function getPoiByClass() {
		$res = $this->logic->getPoiByClass ();
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
	 * Description: 得到各个标签下的poi点
	 * Author: Jason
	 * Date:
	 */
	function getTag() {
		$res = $this->logic->getTag ();
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

	function getNearPoi() {
		$pois = $_GET ['poi_id'];
		$res = $this->logic->getNearPoi($pois);
		
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

	function getByKeyword_get_json()
	{
		$keyword = $_GET ['keyword'];
		$res = $this->logic->getByKeyword($keyword);

		if ($res!==false) {
			$this->ajaxReturn ( array (
				'status' => 1,
				'data' => $res
			) );
		} else {
			$this->ajaxReturn ( array (
				'status' => 0,
				'msg' => "数据库错误"
			) );
		}
	}

}