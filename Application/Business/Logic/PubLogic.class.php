<?php
/**
 * Author: Jason
 * Date: 2015/9/6
 * Time: 15:58
 * Description: 
 */

namespace Business\Logic;


class PubLogic extends \Think\Model{
    function _initialize()
    {
        $this->model = new \Merchant\Model\AdminModel();
    }

    function dologin()
    {
        $name = $_POST ['username'];
        $pass = $_POST ['password'];
        $verify = $_POST ['verify'];
        
        // 验证码
        if (! check_verify ( $verify )) {
            $this->setError ( "验证码错误！" );
            return false;
        }
        $rs = $this->model->checkLogin($name,$pass);
        if($rs)
        {
            return true;
        }else{
            $this->setError ( $this->model->getError() );
            return false;
        }
    }

}