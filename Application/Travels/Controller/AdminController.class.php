<?php
namespace Travels\Controller;

class AdminController extends \Common\Controller\AdminController {

	protected $logic;
	public  function _init(){
		$this->logic=new \Travels\Logic\TravelsLogic();
	}
	
	
	
	/**
     * Description: index 显示游记管理界面、获取游记列表
     * Author: Jason
     * Date:
     */
    public function index_get_json(){
    	$res=$this->logic->getLists();
    	echo json_encode ($res);
    }

    
    public function index_get_html() {
    
    	$this->display('index_index');
    }
    

    /**
     * Description: map_delete 编辑（审核）游记页面
     * Author: ward
     * Date:
     */
    public function index_update(){
    	$data=$this->logic->getOne();
    	$this->assign('data',$data);
    	$this->display('index_update');
    }
     /**
     * Description: 编辑（审核）游记逻辑
     * Author: ward
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



}