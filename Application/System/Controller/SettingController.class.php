<?php
namespace System\Controller;

class SettingController extends \Common\Controller\AdminController {

    /**
     * Description: index 显示设置
     * Author: Jason
     * Date:2015-12-11
     */
    public function index_get_html(){
        $logic=new \System\Logic\SettingLogic();
        $data=$logic->getSetting();
        $this->assign('data',$data);
        $this->display('index');

    }


    /**
     * Description: index_put_json 修改
     * Author: Jason
     * Date:2015-12-11
     */
    public function index_put_json(){
        $logic=new \System\Logic\SettingLogic();
        $res=$logic->setting(I('put.'));
        $this->ajaxReturn(array('success'=>$res));
    }

}