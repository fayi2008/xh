<?php
namespace  Call\Controller;

class  AdminController extends \Common\Controller\AdminController {
	protected $logic;
	public  function _init(){
		$this->logic=new \Call\Logic\CallLogic();
	}
	
	/**
	 * Description: index 显示呼叫中心管理界面、获取呼叫中心列表
	 * Author: Ward
	 * Date:
	 */
	public function index_get_html() {
		$this->display('index_index');
	}
	
	/**
	 * Description: index 显示呼叫中心管理界面、获取呼叫中心列表
	 * Author: Ward
	 * Date:
	 */
	public function index_get_json() {
		$res=$this->logic->getLists();
		echo json_encode ($res);
	}
	
	
	
	/**
	 * Description: map_post 添加呼叫中心
	 * Author: Ward
	 * Date:
	 */
	public function index_post() {
		// todo
		$parentId=I('post.PARENT_ID');
		$url=U ( '/Tour/admin/index' );
		if(!empty($parentId)){
			$url.='?parent='.$parentId;
		}
		$res =$this->logic->add();
		if (false===$res) {
	
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => $url,
					'msg'=>$this->logic->getError()
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => $url
			) );
		}
	}
	
	/**
	 * Description: index_add 添加呼叫中心页面
	 * Author: Ward
	 * Date:
	 */
	function index_add() {
		if(!empty($_GET['parent'])){
			$this->assign('parent',$_GET['parent']);//说明为子景点
		}
		$tag=$this->tagLogic->getOptions();
		$this->assign('tag',$tag);
		 
		 
		$this->display();
	}
	
	
	/**
	 * Description: map_put 修改呼叫中心
	 * Author: Ward
	 * Date:
	 */
	public function index_put() {
		$res =$this->logic->edit();
		if (false===$res) {
	
			$this->ajaxReturn ( array (
					'status' => 0,
					'url' => U ( '/Tour/admin/index' ),
					'msg'=>$this->logic->getError()
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 1,
					'url' => U ( '/Tour/admin/index' )
			) );
		}
		// todo
	}
	
	/**
	 * Description: map_delete 删除呼叫中心
	 * Author: Ward
	 * Date:
	 */
	public function index_delete() {
		$res =$this->logic->delete();
		 
		if (false!==$res) {
	
			$this->ajaxReturn ( array (
					'status' => 1,
					//'data' => U ( '/Panorama/admin/hot_get' )
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
					//'data' => U ( '/Panorama/admin/hot_get' )
			) );
		}
	
		// todo
	}
	
	/**
	 * Description: map_release_put 发布呼叫中心
	 * Author: Ward
	 * Date:
	 */
	public function index_release() {
		$res =$this->logic->release();
		if ($res) {
			$this->ajaxReturn ( array (
					'status' => 1,
					 
			) );
		} else {
			$this->ajaxReturn ( array (
					'status' => 0,
	
			) );
		}
	
	
	}
	
	
	
	/**
	 * Description: img_update 编辑呼叫中心页面
	 * Author: Ward
	 * Date:
	 */
	function index_update() {
		$data=$this->logic->getOne();
		$this->assign('data',$data);
		$this->display();
	}
	
}