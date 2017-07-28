<?php
namespace  Service\Controller;

class  ExeController extends \Common\Controller\BaseController{
	
	public function close(){
		$businessLogi=new \Service\Logic\BusinessLogic();
		$businessLogi->endService();
		echo 'ok';
	}
	
	public function autoeval(){
		
	}
}