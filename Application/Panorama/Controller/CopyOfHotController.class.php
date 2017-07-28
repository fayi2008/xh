<?php
namespace Panorama\Controller;

class HotController extends \Common\Controller\BaseController {
	protected  $logic;
	public  function _initialize(){
		parent::_initialize();
		$this->logic=new \Panorama\Logic\HotLogic();
	}
	

	public  function index_get_html(){
		
	}
	
	
	/**
	 * Description: list_get 获取全景所有的热点列表（兼容获得某一个具体热点详情）前端接口
	 * Author: ward
	 * Param: $_GET('key'=>'全景的key' 'hot'=>'热点id') 两个参数至少有key
	 * Date:
	 */
    public function index_get(){
        //todo
       $key=empty($_GET['key'])?'':$_GET['key'];
       $hot=empty($_GET['hot'])?'':intval($_GET['hot']);
       $res=$this->logic->get($key,$hot);
       
       header( 'Access-Control-Allow-Origin:*' );
       if(is_array($res)){
       		$this->ajaxReturn(array('status'=>1,'data'=>$res));
       }else{
      	 	$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
       }
    }
    
    /**
     * Description: culture_get 获取全景下面热点中带文章的的文章详情(随机一篇)
     * Author: ward
     * Param: $_GET('id'=>'全景key值')
     * Date:2015-12-04
     */
    public function culture_get(){
    	$panoKey=$_GET['key'];
    	$res=$this->logic->getHotCulture($panoKey);
    	
    	header( 'Access-Control-Allow-Origin:*' );
    	if(!empty($res)){
    		$this->ajaxReturn(array('status'=>1,'data'=>$res));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
    	}
    }

}