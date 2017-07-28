<?php
namespace  Comment\Controller;

class  IndexController extends \Common\Controller\BaseController {
	protected $logic;
	public  function _init(){
		$this->logic=new \Comment\Logic\CommentLogic();
	}
	
     /**
	 * Description:用户对（照片、游记、评论）进行评论---添加评论(前端接口)（module:1游记2照片墙3新闻资讯）
	 * Author: ward
	 * Date: 2015-10-22
	 * Param: 评论数据   array('module'=>模块类型,'id'=〉模块id,'content'=>'内容','to_id'=>'被评论者id',)
	 * Return:true/false
	 */
	public function index_post(){
		$insertArr=$_POST;
		$res=$this->logic->add($insertArr);
		if($res){
			$this->ajaxReturn ( array ('status' => 1));
		}else{
			$this->ajaxReturn ( array ('status' => 0,'msg'=>''));
		}
	}
	/**
	 * Description: 获得（游记）照片墙下的所有评论----(前端接口)（module:1游记2照片墙3新闻资讯）
	 * Author: ward
	 * Date: 2015-10-22
	 * Param: 筛选条件   array('module'=>模块类型,'id'=〉模块id(不必填),)
	 * Return:true/false
	 */
	public function index_get_json(){
		$selectArr=$_GET;
		$data=$this->logic->getForAll($selectArr);
		
		if(false===$data){
			$res=array('status'=>0,'msg'=>'系统错误！');
			$this->ajaxReturn($res);
		}else{
			$res=array('status'=>1,'data'=>$data);
			$this->ajaxReturn($res);
		}
	}
	/**
	 * Description:用户点赞（module:1游记2照片墙3新闻资讯）
	 * Author: ward
	 * Date: 2015-10-22
	 * Param: 点赞数据   'module'=>模块类型,'id'=〉模块id
	 */
	public function support_post(){
		$module=intval($_POST['module']);
		$id=intval($_POST['id']);
		$res=$this->logic->addSupport($module,$id);
		if($res){
			$this->ajaxReturn ( array ('status' => 1));
		}else{
			$this->ajaxReturn ( array (	'status' => 0,'msg'=>$this->logic->getError()));
		}
	}
	
}