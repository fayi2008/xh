<?php
namespace Home\Controller;
class IndexController extends \Common\Controller\BaseController {

	
	
    function _init()
    {
        C('VIEW_PATH',APP_ROOT.'/Template/'.WEB_TYPE.'/Home/');
    }
    /**
     * Description: index 首页
     * Author: Jason
     * Date:
     */
    public function index(){
        $this->click();
        $this->logic=new \Home\Logic\HomeLogic();
		$data=$this->logic->index();
		$data=json_encode($data);
		$this->assign('data',$data);
        $this->display('index');
    }


    private function click()
    {
        $file = PUBLIC_ROOT."click.data";
        $lock_file = PUBLIC_ROOT."click.lock";
        $fp = fopen($lock_file , 'w');
        if(flock($fp , LOCK_EX)){
            $num=file_get_contents($file);
            if(!$num)
            {
                $num=1;
            }else{
                $num=intval($num)+1;
            }
            file_put_contents($file,$num);
        }
        flock($fp , LOCK_UN);
        fclose ( $fp );
        $this->assign('click_num',$num);
    }


    public function nav(){
        $this->display('nav');
    }

}