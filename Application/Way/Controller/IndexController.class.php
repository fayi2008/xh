<?php

namespace Way\Controller;

class IndexController extends \Common\Controller\BaseController {
	function _init() {
		$this->logic = new \Way\Logic\WayLogic ();
		$this->poilogic = new \Gis\Logic\PoiLogic ();
		C ( 'VIEW_PATH', APP_ROOT . '/Template/' . WEB_TYPE . '/Way/' );
	}
	
	/**
	 * Description: index推荐路线展示
	 * Author: fay
	 * Date:2015/10/22
	 */
	public function index_get_html() {
		$way_list = $this->logic->way_list_get_json ();
		if ($way_list) {
			$data ['data'] = $way_list;
			$data ['status'] = 1;
		} else {
			$data ['data'] = array ();
			$data ['status'] = 0;
		}
		$this->assign ( 'data', json_encode($data,JSON_UNESCAPED_UNICODE  ));
		$this->display ( 'index' );
	}
	
	/**
	 * Description: map_get_html地图页面
	 * Author: fay
	 * Date:2015/10/22
	 */
	public function map_get_html() {
		// todo
		$way_detail = $this->logic->way_detail_get_json ();
		$this->CollectModel = new \User\Model\CollectModel ();
		$userId = session ( 'user.id' );
		if (empty ( $userId )) {
			$flag = - 1;
		} else {
			$way_id = (I ( 'get.id' ));
			$collect = $this->CollectModel->where ( "USER_ID=$userId AND WAY_ID=$way_id AND STATUS=1" )->find ();
			if ($collect) {
				$flag = 1;
			} else {
				$flag = 0;
			}
		}
		if ($way_detail) {
			$data ['data'] = $way_detail;
			$data ['status'] = 1;
			$data ['flag'] = $flag;
		} else {
			$data ['data'] = array ();
			$data ['status'] = 0;
			$data ['flag'] = $flag;
		}
		
		$this->assign ( 'data', json_encode ( $data,JSON_UNESCAPED_UNICODE ) );
		$this->display ( 'map' );
	}
	
	/**
	 * Description: choice_get_html 推荐线路选择页
	 * Author: Jason
	 * Date:2015/10/26
	 * recode:fay
	 */
	public function choice_get_html() {
		$name = $_GET ['name'];
		$res = $this->poilogic->getGoodsPoi ( $name );
		if (is_array ( $res )) {
			$data ['data'] = $res;
			$data ['status'] = 1;
		} else {
			$data ['data'] = 'error';
			$data ['status'] = 0;
		}
		$this->assign ( 'data', json_encode ( $data ) );
		// todo
		$this->display ( 'choice' );
	}
	
	/**
	 * Description: custom_get_html 推荐线路列表页
	 * Author: fay
	 * Date:2015/10/26
	 */
	public function custom_get_html() {
		$this->display ( 'custom' );
		// todo
	}
	
	/**
	 * Description: detail_get_html 旅游路线详情页
	 * Author: fay
	 * Date:2015/10/22
	 */
	public function detail_get_html() {
		// todo
		$way_detail = $this->logic->way_detail_get_json ();

		$this->CollectModel = new \User\Model\CollectModel ();
		$userId = session ( 'user.id' );
		if (empty ( $userId )) {
			$flag = - 1;
		} else {
			$way_id = (I ( 'get.id' ));
			$collect = $this->CollectModel->where ( "USER_ID=$userId AND WAY_ID=$way_id AND STATUS=1" )->find ();
			if ($collect) {
				$flag = 1;
			} else {
				$flag = 0;
			}
		}
		if ($way_detail) {
			$data ['data'] = $way_detail;
			$data ['flag'] = $flag;
			$data ['status'] = 1;
		} else {
			$data ['data'] = array ();
			$data ['status'] = 0;
			$data ['flag'] = $flag;
		}
		
		$this->assign ( 'data', json_encode ( $data ) );
		$this->display ( 'detail' );
	}
	
	/**
	 * Description: 线路列表
	 * Author: liuzhaojun
	 * Date:
	 */
	function way_list_get_json() {
		$way_list = $this->logic->way_list_get_json ();
	
		if ($way_list) {
			$data ['data'] = $way_list;
			$data ['status'] = 1;
		} else {
			$data ['data'] = array ();
			$data ['status'] = 0;
		}
		echo json_encode ( $data, JSON_UNESCAPED_UNICODE );
	}
	/**
	 * Description: 线路细节
	 * Author: liuzhaojun
	 * Date:
	 */
	function way_detail_get_json() {
		$way_detail = $this->logic->way_detail_get_json ();
		if ($way_detail) {
			$data ['data'] = $way_detail;
			
			$data ['status'] = 1;
		} else {
			$data ['data'] = array ();
			
			$data ['status'] = 0;
		}
		echo json_encode ( $data, JSON_UNESCAPED_UNICODE );
	}
	
	/**
	 * Description: 自定义景点攻略
	 * Author: liuzhaojun
	 * Date:
	 */
	function way_diy_list_get_json() {
		$way_list = $this->logic->way_diy_list_get_json ();
		if ($way_list) {
			$data ['data'] = $way_list;
			$data ['status'] = 1;
		} else {
			$data ['data'] = array ();
			$data ['status'] = 0;
		}
		echo json_encode ( $data, JSON_UNESCAPED_UNICODE );
	}
	function getGoodsPoi() {
		$name = $_GET ['name'];
		$res = $this->poilogic->getGoodsPoi ( $name );
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
	 * Description: 移动端 推荐线路
	 * Author:
	 * Date:
	 */
	public function reco_get_html() {
		$way_list = $this->logic->way_list_get_json ();
		if ($way_list) {
			$data ['data'] = $way_list;
			$data ['status'] = 1;
		} else {
			$data ['data'] = array ();
			$data ['status'] = 0;
		}
		$this->assign ( 'data', json_encode ( $data ) );
		$this->display ( 'reco' );
	}

	/**
	 * Description:移动端最近线路
	 * Author:jason
	 * Date:
	 */
	public function nearby_get_html()
	{
		$this->display ( 'nearby' );
	}

	/**
	 * Description:获取最近线路数据
	 * Author:jason
	 * Date:
	 */
	public function nearby_get_json()
	{
		$lon=I('get.lon');
		$lat=I('get.lat');
		$way_ids = $this->logic->getNearbyWay($lon,$lat,'5000');
		if (!$way_ids) {
			$way_ids =  $this->logic->getNearbyWay($lon,$lat,'25000');
		}
		if($way_ids){
			$way_info=array_rand($way_ids);
			$data ['data'] = $this->logic->way_detail_get_json($way_ids[$way_info]['way_id']);
			$data ['status'] = 1;
		} else {
			$data ['data'] = array ();
			$data ['msg'] = '没有搜到附近的景点攻略';
			$data ['status'] = 0;
		}
		echo json_encode ( $data, JSON_UNESCAPED_UNICODE );
	}
}