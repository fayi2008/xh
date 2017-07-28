<?php

namespace Way\Controller;

class IndexController extends \Common\Controller\BaseController {
	function _init() {
		$this->logic = new \Way\Logic\WayLogic ();
		$this->poilogic = new \Gis\Logic\PoiLogic ();
		C('VIEW_PATH',APP_ROOT.'/Template/'.WEB_TYPE.'/Way/');
	}
	
	/**
	 * Description: index推荐路线展示
	 * Author: fay
	 * Date:2015/10/22
	 */
	public function index_get_html() {

		$way_list = $this->logic->way_list_get_json ();
		if($way_list){
			$data['data']=$way_list;
			$data['status']=1;
		}else{
			$data['data']=array();
			$data['status']=0;
		}
		$this->assign('data',json_encode($data));
		$this->display('index');
	}

	/**
	 * Description: map_get_html地图页面
	 * Author: fay
	 * Date:2015/10/22
	 */
	public function map_get_html() {
		// todo
		$way_detail = $this->logic->way_detail_get_json ();
		if($way_detail){
			$data['data']=$way_detail;
			$data['status']=1;
		}else{
			$data['data']=array();
			$data['status']=0;
		}

		$this->assign('data',json_encode($data));
		$this->display('map');

	}

	/**
	 * Description: choice_get_html 推荐线路选择页
	 * Author: Jason
	 * Date:2015/10/26
	 * recode:fay
	 *
	 */
	public function choice_get_html() {

		$name=$_GET['name'];
		$res=$this->poilogic->getGoodsPoi($name);
		if (is_array ( $res )) {
			$data['data']=$res;
			$data['status']=1;
		} else {
			$data['data']='error';
			$data['status']=0;
		}
		$this->assign('data',json_encode($data));
		// todo
		$this->display('choice');
	}


	/**
	 * Description: detail_get_html 旅游路线详情页
	 * Author: fay
	 * Date:2015/10/22
	 */
	public function detail_get_html() {
		// todo
		$way_detail = $this->logic->way_detail_get_json ();
		if($way_detail){
			$data['data']=$way_detail;
			$data['status']=1;
		}else{
			$data['data']=array();
			$data['status']=0;
		}

		$this->assign('data',json_encode($data));
		$this->display('detail');
	}

	/**
	 * Description: 线路列表
	 * Author: liuzhaojun
	 * Date:
	 */
	function way_list_get_json() {
		$way_list = $this->logic->way_list_get_json ();
		if($way_list){
			$data['data']=$way_list;
			$data['status']=1;
		}else{
			$data['data']=array();
			$data['status']=0;
		}
		echo json_encode($data,JSON_UNESCAPED_UNICODE);

	}
	/**
	 * Description: 线路细节
	 * Author: liuzhaojun
	 * Date:
	 */

	function way_detail_get_json(){

		$way_detail = $this->logic->way_detail_get_json ();
		if($way_detail){
			$data['data']=$way_detail;
			$data['status']=1;
		}else{
			$data['data']=array();
			$data['status']=0;
		}
		echo json_encode($data,JSON_UNESCAPED_UNICODE);

	}

	/**
	 * Description: 自定义景点攻略
	 * Author: liuzhaojun
	 * Date:
	 */
	function way_diy_list_get_json() {
		$way_list = $this->logic->way_diy_list_get_json ();
		if($way_list){
			$data['data']=$way_list;
			$data['status']=1;
		}else{
			$data['data']=array();
			$data['status']=0;
		}
		echo json_encode($data,JSON_UNESCAPED_UNICODE);

	}

	function getGoodsPoi(){
		$name=$_GET['name'];
		$res=$this->poilogic->getGoodsPoi($name);
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





}