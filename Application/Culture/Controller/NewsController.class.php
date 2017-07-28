<?php
namespace Culture\Controller;

use Culture\Logic\NewsLogic;

class NewsController extends \Common\Controller\AdminController {

	function _init() {
		$this->news = new \Culture\Logic\NewsLogic ();
		
		/* $this->grouplogic = new \Culture\Logic\GroupLogic (); */
	}
    
    /**
     * Description: index 显示菜单管理界面、获取菜单列表
     * Author: mark
     * Date:
     */
    public function index_news(){
   
        $this->display();
    }
    
    public function index_news_json(){
       $res = $this->news->news_list();
       echo json_encode($res);
    }
    
    
    /**
     * Description: 添加页面
     * Author: mark
     * Date:
     */
    
    public function news_add(){
    	$cate=$this->news->getcate();
    	$this->assign('cate',$cate);
    	$this->display();
    }
    
    public function news_add_json(){
    	$res = $this->news->add();
    	if($res ==2){
    		$this->ajaxReturn ( array (
    				'status' => 2,
    				'msg' => '请输入标题'
    	
    		));
    	}
    	if($res==3){
    		$this->ajaxReturn ( array (
    				'status' => 3,
    				'msg' => '请输入内容'
   
    		));
    	}
    	if($res){
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => '/Culture/news/index_news'
    					
    		));
    	}else{
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => '/Culture/news/index_news',
    				'msg'=>'添加失败！'
    		));
    	}
    	
    }
    
    /**
     * Description: 编辑页面
     * Author: mark
     * Date:
     */

    public function news_update(){
    	$list = $this->news->getnews();
    	$content = html_entity_decode($list['content']);
    	$cate=$this->news->getcate();
    	$this->assign('cate',$cate);
    	$this->assign('content',$content);
    	$this->assign('list',$list);	
    	$this->display();
    }
    
    public  function news_update_put(){
    	$res = $this->news->edit();
    	if($res){
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => U ( '/Culture/news/index_news' )
    	
    		));
    	}else{
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => U ( '/Culture/news/index_news' ),
    				'msg'=>'添加失败！'
    		));
    	}
    }
    
    /**
     * Description: 删除页面
     * Author: mark
     * Date:
     */
    
    public function news_delete(){
    	$res = $this->news->delete();
    	if(false === $res){
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => '/Culture/news/index_news',
    				'msg'=>'添加失败！'
    		));
    	}else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => '/Culture/news/index_news',
    				
    		));
    	}
    }
    

}