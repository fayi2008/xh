<?php
namespace Help\Controller;

class IndexController extends \Common\Controller\BaseController {

	public  function _init(){
      	 C('VIEW_PATH',APP_ROOT.'/Template/Desktop/Help/');
      
	}

    /**
     * Description:
     * Author: Ward
     * Date:2015-10-28
     */
    public function index_get_html(){
    	$view=(empty($_GET['v'])?'index':$_GET['v']);
		$this->logic = new \Culture\Logic\IndexLogic ();
		$res = $this->logic->get_class ();
		if (is_array ( $res )) {

			$cate['status'] = 1;
			$cate['data'] = $res;

		} else {

			$cate['status'] = 0;
			$cate['msg'] = $this->logic->getError ();

		}
		$this->assign('cate',json_encode($cate));
		$this->display($view);
    }

}