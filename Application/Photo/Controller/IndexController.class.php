<?php
namespace  Photo\Controller;
class IndexController extends \Common\Controller\BaseController {
	protected $logic;
	public  function _init(){
		$this->logic=new \Photo\Logic\PhotoLogic();
		C('VIEW_PATH',APP_ROOT.'/Template/'.WEB_TYPE.'/Photo/');
	}

	/**
	 * Description:  index 显示照片墙（印象）
	 * Author: Ward
	 * Date:2015-10-28
	 */
	public function  index_get_html(){
		$this->display('index');
	}


	
	/**
	 * Description:用户发表照片
	 * Param:  游记数据    $_POST('description'=>'简述','file_url'=>'图片路径','size'=>'','height'=>'','width'=>'')
	 * Author： ward
	 * Date:2015-10-28
	 */
	public function index_post_json(){
		
		$data=$_POST;
		$res=$this->logic->add($data);
		if($res){
			$this->ajaxReturn ( array (	'status' => 1,'data'=>$res));
		}else{
			$this->ajaxReturn ( array ('status' => 0,'msg'=>$this->logic->getError()));
		}
	}

	
	/**
	 * Description:  获得照片列表
	 * Author: Ward
	 * Date:2015-10-28
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
	 * Description: 显示评论
	 * Author: Ting
	 * Date: 2015-11-05
	 */
	public function comment_get_html(){
		$this->assign('id',$_GET['id']);
		$this->display('comment');
	}

	/**
	 * Description: 发表印象
	 * Author: Ting
	 * Date: 2015-11-05
	 */
	public function release_get_html(){
		$this->display('release');
	}
	
	/**
	 * Description:  删除印象
	 * Author: ward
	 * Param: $_GET('id'=>'印象id')
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
	 * Description:  显示照片详细
	 * Author: ward
	 * Param: $_GET('id'=>'','owner'=>'(非必填)')
	 * Date:2015-11-11
	 */
	public function detail_get_json(){
		$selectArr=$_GET;
	
		if(intval($_GET['owner'])){//owner 为是否为自己
			$data=$this->logic->getForUser($selectArr);
		}else{
			$data=$this->logic->getForAll($selectArr);
		}
		if(false===$data){
			$this->ajaxReturn ( array (	'status' => 0,'msg'=>'取数据失败！'));
		}else{
			$this->ajaxReturn ( array (	'status' => 1,'data'=>$data));
		}
	}
	
	
	
	/**
	 * Description: index 显示照片详细页面及数据
	 * Author: Ward
	 * Param: $_GET('id'=>'','owner'=>'(非必填)')
	 * Date:2015-10-28
	 */
	public function  detail_get_html()
	{
		$selectArr = $_GET;
		if(intval($_GET['owner'])){
			$data=$this->logic->getForUser($selectArr);
		}else{
			$data=$this->logic->getForAll($selectArr);
		}
		if (false!==$data) {
			$this->assign('data', json_encode($data));
		} else {
			$this->assign('data', '{}');
		}
		$this->display('detail');
	
	}

}