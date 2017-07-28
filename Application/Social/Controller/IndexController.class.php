<?php
namespace Social\Controller;

class IndexController extends \Common\Controller\BaseController {

	public  function _init(){
        C('VIEW_PATH',APP_ROOT.'/Template/'.WEB_TYPE.'/Social/');
	}

    /**
     * Description:
     * Author: Ward
     * Date:2015-10-28
     */
    public function index_get_html(){
        $this->display('index');
    }

}