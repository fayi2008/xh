<?php
namespace  Comment\Controller;

class  AdminController extends \Common\Controller\AdminController {
	protected $logic;
	public  function _init(){
		$this->logic=new \Comment\Logic\CommentLogic();
	}
	
	/**
	 * Description: index 显示优惠管理界面、
	 * Author: Ward
	 * Date:
	 */
	public function index_get_html() {
		$module=intval($_GET['module']);
		if(1===$module){
			$this->display('travels_index');
			exit();
		}elseif(2===$module){
			$this->display('photo_index');
			exit();
		}elseif(3===$module){
			$this->display('news_index');
			exit();
		}
		$this->display('travels_index');
	}
	/**
	 * Description: index 获取优惠列表
	 * Author: Ward
	 * Date:
	 */
	public function index_get_json() {
		$res=$this->logic->getLists();
		echo json_encode ($res);
	}
	
	
	
	/**
	 * Description:  审核照片详情（审核照片）
	 * Author: Ward
	 * Date:
	 */
	function index_update() {
		$data=$this->logic->getOne();
		$this->assign('data',$data);
		$this->display('index_update');
	}
	
	/**
	 * 
	 */
	function  index_put(){
		$res=$this->logic->edit();
		if(false!==$res){
			$this->ajaxReturn ( array ('status' => 1));
		}else{
			$this->ajaxReturn ( array ('status' => 0,'msg'=>$this->logic->getError()));
		}
	}
	
}