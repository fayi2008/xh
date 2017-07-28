<?php
namespace  App\Controller;

class  AdminController extends \Common\Controller\AdminController {
	protected $logic;
	public  function _init(){
		$this->logic=new \App\Logic\AppLogic();
	}
	
	/**
	 * Description: index 显示APP管理界面
	 * Author: jason
	 * Date:
	 */
	public function index_get_html() {
	
		$this->display('index');
	}
	/**
	 * Description: index 显示信息列表
	 * Author: jason
	 * Date:
	 */
	public function index_get_json() {
		$length=I('get.limit');
		$start=I('get.start');
		$params=I('get.');
		$res=$this->logic->getlist($length,$start,'',$params);
		echo json_encode ($res);
	}

	/**
	 * Description:add 添加页面
	 * Author:jason
	 */
	public function add_get_html() {
		$this->display('add');
	}

	/**
	 * Description:add_post_json 处理添加数据
	 * Author:jason
	 */
	public function  add_post_json(){
		$data=I('post.');
		$res=$this->logic->addData($data);
		if(false!==$res){
			$this->ajaxReturn ( array ('status' => 1));
		}else{
			$this->ajaxReturn ( array ('status' => 0,'msg'=>$this->logic->getError()));
		}
	}
	
	
	/**
	 * Description:  编辑页面
	 * Author: jason
	 * Date:
	 */
	function edit_get_html() {
		$id=I('get.id');
		$data=$this->logic->getInfo($id);
		$this->assign('data',$data);
		$this->display('edit');
	}

	/**
	 * Description:edit_put_json 处理编辑数据
	 * Author:jason
	 */
	public function  edit_put_json(){
		$data=I('put.');
		$res=$this->logic->editData($data);
		if(false!==$res){
			$this->ajaxReturn ( array ('status' => 1));
		}else{
			$this->ajaxReturn ( array ('status' => 0,'msg'=>$this->logic->getError()));
		}
	}
	
	public function delete()
	{
		$ids=I('get.ids');
		$res=$this->logic->delete($ids);
		if(false!==$res){
			$this->ajaxReturn ( array ('status' => 1));
		}else{
			$this->ajaxReturn ( array ('status' => 0,'msg'=>$this->logic->getError()));
		}
	}
	
}