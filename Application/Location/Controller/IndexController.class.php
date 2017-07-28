<?php
namespace Location\Controller;
class IndexController extends \Common\Controller\BaseController {

	protected $logic;
    public  function _init(){
      //  C('VIEW_PATH',APP_ROOT.'/Template/Location/');
        $this->logic=new \Location\Logic\LocationLogic();
    }

    /**
     * Description: index 记录地理位置信息
     * Author: ward
     * Date: 2015-10-30
     */
    public function index_get(){
    	//echo cookie('PHPSESSID');exit('rer');//dbcnrrgh1u5esgu48ntlcq6di5rer
    	$locationArr=$_GET;
    	$res=$this->logic->add($locationArr);
    	if($res){
    		$this->ajaxReturn(array('status'=>1,'data'=>$res));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>'处理失败！'));
    	}
    }


}