<?php
namespace  Service\Controller;

class  IndexController extends \Common\Controller\BaseController{
	
	public  function _init(){
		C('VIEW_PATH',APP_ROOT.'/Template/Mobile/Service/');
	}
	
	public function index_get(){
		$view=empty($_GET['v'])?'index':$_GET['v'];
		$this->display($view);
	}
}