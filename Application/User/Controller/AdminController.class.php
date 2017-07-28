<?php
namespace User\Controller;

class AdminController extends \Common\Controller\AdminController {

	protected $logic;
	public  function _init(){
		$this->logic=new \User\Logic\UserLogic();
	}
	
	/**
     * Description: index 显示用户管理界面
     * Author: Jason
     * Date:
     */
    public function index_get_html(){
        $this->display('index_index');	
        
    }

    /**
     * Description: index 获取用户管理界面的数据
     * Author: Jason
     * Date:
     */
    public function index_get_json(){
    	$selectArr=$_GET;
    	$res=$this->logic->getLists($selectArr);
    	echo json_encode ($res);
    }

    /**
     * Description: map_delete 禁用用户
     * Author: Jason
     * Date:
     */
    public function index_put(){
    	$res=$this->logic->edit();
    	if(false!==$res){
    		$this->ajaxReturn ( array ('status' => 1));
    	}else{
    		$this->ajaxReturn ( array ('status' => 0,'msg'=>$this->logic->getError()));
    	}
    }

    
    
    /**
     * Description: index_update 编辑用户信息
     * Author: Ward
     * Date:
     */
    function index_update() {
    	$id=$_GET['id'];
    	$data=$this->logic->getOne($id);
    	
    	$this->assign('data',$data);
    	$this->display();
    }


}