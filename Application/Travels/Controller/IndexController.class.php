<?php
namespace Travels\Controller;

class IndexController extends \Common\Controller\BaseController {

	protected $logic;
	public  function _init(){
		C('VIEW_PATH',APP_ROOT.'/Template/'.WEB_TYPE.'/Travels/');
		$this->logic=new \Travels\Logic\TravelsLogic();
	}
	
	
	/**
     * Description: index 显示游记
     * Author: Jason
     * Date:
     */
    public function index_get_html(){
    	$this->display('index');
    	 
    }


	/**
	 * Description:用户发表游记
	 * Param:  游记数据    array('content'=>'内容','title'=>'标题','thumb'=>'缩略图（非必填）')
	 * Author： ward
	 * Date:2015-10-30
	 */
    public function index_post(){
    	$insertArr=$_POST;
    	$res=$this->logic->add($insertArr);
    	if($res){
    		$this->ajaxReturn ( array ('status' => 1));
    	}else{
    		$this->ajaxReturn ( array (	'status' => 0,'msg'=>'添加失败！'));
    	}
    }
    
    
    

    /**
     * Description: index 获取游记数据
     * Author: ward
     * Param:  $_GET('start'=>'分页起始页','limit'=>'页数据条数','ordertype'=>'排序字段（非必填）')
     * Date:
     */
    public function index_get_json(){
        $selsectArr=$_GET;
        $data=$this->logic->getForAll($selsectArr);
        if(false===$data){
        	$this->ajaxReturn ( array (	'status' => 0,'msg'=>'添加失败！'));
        }else{
        	$this->ajaxReturn ( array (	'status' => 1,'data'=>$data));
        }
    }

    /**
     * Description: index 显示游记列表数据
     * Author: ward
     * Param:  $_GET('id'=>'游记id','owner'=>'是否为去自己所有的标志位（非必填）')
     * Date:
     */
    public function detail_get_html(){
    	$selectArr=$_GET;
    	if(intval($_GET['owner'])){
    		$data=$this->logic->getForUser($selectArr);
    	}else{
    		$data=$this->logic->getForAll($selectArr);
    	}
    	$this->assign('data',json_encode($data));
        $this->display('detail');
    }

    /**
     * Description: index 显示游记详细
     * Author: ward
     * Param: $_GET('id'=>'游记id','owner'=>'是否为去自己所有的标志位（非必填）')
     * Date:
     */
    public function detail_get_json(){
    	$selectArr=$_GET;
    	if(intval($_GET['owner'])){
    		$data=$this->logic->getForUser($selectArr);
    	}else{
    		$data=$this->logic->getForAll($selectArr);
    	}
    	if(false===$data){
    		$this->ajaxReturn ( array (	'status' => 0,'msg'=>'添加失败！'));
    	}else{
    		$this->ajaxReturn ( array (	'status' => 1,'data'=>$data));
    	}
    }
    
    public function release_get_html(){
    	$this->display('release');
    }

    
    /**
     * Description:  删除游记
     * Author: ward
     * Param: $_GET('id'=>'游记id')
     * Date:2015-12-03
     */
    public  function  index_delete_html(){
    	$id=$_GET['id'];
    	$res=$this->logic->delete($id);
    	if(false!==$res){
    		$this->ajaxReturn ( array (	'status' => 1));
    	}else{
    		$this->ajaxReturn ( array ('status' => 0,'msg'=>$this->logic->getError()));
    	}
    }
    
    /**
     * Description: 显示评论
     * Author: Ting
     * Date: 2015-11-04
     */
    public function comment_get_html(){
        $this->assign('id',$_GET['id']);
        $this->display('comment');
    }

}