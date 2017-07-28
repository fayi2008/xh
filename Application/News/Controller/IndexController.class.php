<?php
namespace News\Controller;

class IndexController extends \Common\Controller\BaseController {

	public  function _init(){
        C('VIEW_PATH',APP_ROOT.'/Template/Mobile/News/');
	}

    /**
     * Description:
     * Author: Ward
     * Date:2015-10-28
     */
    public function index_get_html(){
        $this->display('index');
    }
    public function build_get_html(){
            $this->display('build');
    }
    public function login_get_html(){
            $this->display('login');
    }
    public function detail_get_html(){
            $this->display('detail');
    }

}