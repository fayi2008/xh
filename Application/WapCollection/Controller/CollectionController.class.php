<?php

namespace WapCollection\Controller;

class CollectionController extends \Common\Controller\CultureController {
	function _init() {
		$this->logic = new \WapCollection\Logic\CollectionLogic ();
		$this->catelogic = new \Culture\Logic\NewsCateLogic ();
	}
	/**
	 * Description: index 显示文化管理界面
	 * Author: Jason
	 * Date:
	 */
	public function index_get() {
		// todo
		$this->display ( 'Collection/collection_get' );
	}
	
	/**
	 * Description: map_delete 添加文化页面
	 * Author: Jason
	 * Date:
	 */
	public function add_get() {
		$this->display ( 'Collection/collection_add' );
		// todo
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
					'url' => U ( '/WapCollection/collection/index_get' ),
					'msg' => $this->logic->getError () 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/WapCollection/collection/index_get' ) 
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
		// todo
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
		
		// todo
		$res = $this->logic->collection_delete ();
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
	function NewsCate() {
		$res = $this->catelogic->NewsCate ();
		if ($res) {
			
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => $res 
			) );
		}
	}
	function CollectionList() {
		$type = I ( 'type' );
		$res = $this->logic->CollectionList ( $type );
		if ($res !==false) {
			foreach ($res as $key=>$val){
				$res[$key]['content']=html_entity_decode($val['content']);
				$res[$key]['many_image']=json_decode($val['many_image'],true);
			}
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => $res 
			) );
		}
	}
	function CollectionDetail() {
		$id = I ( "id" );
		$res = $this->logic->getDetailCollection ( $id );
		if ($res) {
			$res['content']=html_entity_decode($res['content']);
			$res['many_image']=json_decode($res['many_image'],true);
			$this->ajaxReturn ( array (
					'status' => 1,
					'data' => $res 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					'data' => $res 
			) );
		}
	}
	
	/**
	 * Description: upload 前端上传图片的公共接口
	 * Author: ward
	 * Date:
	 */
	public  function upload_post(){
		 
		$userId=session('culture.id');
		if(empty($userId)){
			$this->ajaxReturn(array('status'=>0,'msg'=>'请先登录！'));
			exit;
		}
		$cutFlag=intval($_POST['cut']);
		if($cutFlag){
			$res=parent::upload(1);
		}else{
			$res=parent::upload();
		}
		return $res;
	}
	public function getStatus(){
		$userId=session('culture.id');
		if($userId){
			$this->ajaxReturn(array('status'=>1));
		}else{
			$this->ajaxReturn(array('status'=>0));
		}
	}
}