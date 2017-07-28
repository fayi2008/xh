<?php
namespace Panorama\Controller;

class GroupController extends \Common\Controller\BaseController {
	protected  $logic;
	public  function _initialize(){
		parent::_initialize();
		$this->logic=new \Panorama\Logic\GroupLogic();
	}
	

	public  function index_get_html(){
		
	}
	
	
	/**
	 * Description: list_get 获取该全景所属poi的所有分组列表 前端接口
	 * Author: ward
	 * Param: $_GET('id'=>'全景的key')
	 * Date: 2015-12-04
     * recoder:jason
	 */
    public function list_get(){
        $pano_key=I('get.key');
        $season=I('get.season');
        $res=$this->logic->getList($pano_key,$season);
        header( 'Access-Control-Allow-Origin:*' );
        if(is_array($res)){
       		$this->ajaxReturn(array('status'=>1,'data'=>$res));
       }else{
      	 	$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
       }
    }

}