<?php
namespace  Call\Controller;

class  IndexController extends \Common\Controller\BaseController{
	protected $logic;
	public  function _init(){
		$this->logic=new \Call\Logic\CallLogic();
	}
	
	/**
	 * Description:  客服中心（客服端）首页
	 * Author: Ward
	 * Date:2015-11-26
	 */
	public function  index_get_html(){
		echo "index_get_html";exit();
		$this->display('index');
	}

	/**
	 * Description: 客服中心（客服端）列表
	 * Author: Ward
	 * Date:2015-11-26
	 */
	public function index_post_json(){
	
		$data=$_POST;
		$res=$this->logic->add($data);
		if($res){
			$this->ajaxReturn ( array (	'status' => 1,'data'=>$res));
		}else{
			$this->ajaxReturn ( array ('status' => 0,'msg'=>''));
		}
	}

	
	/**
	 * Description:  获得照片列表
	 * Author: Ward
	 * Date:2015-11-26
	 */
	public function index_get_json(){
		
		
	}
	
	
	/**
	 * Description: index 显示照片详细
	 * Author: ward
	 * Date:2015-11-26
	 */
	public function detail_get_json(){
		$selectArr=$_GET;
		$data=$this->logic->getForRecorder($selectArr);
		
	}
	
	
	
	/**
	 * Description:
	 * Author: Ward
	 * Date:2015-11-26
	 */
	public function  detail_get_html(){
		echo "detail_get_html";
		exit();
	
	}
}