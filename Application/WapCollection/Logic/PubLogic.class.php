<?php
/**
 * Author: Jason
 * Date: 2015/9/6
 * Time: 15:58
 * Description: 
 */

namespace WapCollection\Logic;


class PubLogic extends \Think\Model{
    function _initialize()
    {
        $this->model = new \WapCollection\Model\AdminModel();
    }

    function dologin()
    {  
        $name = $_POST ['username'];
        $pass = $_POST ['password'];
      
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