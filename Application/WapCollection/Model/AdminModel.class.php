<?php

namespace WapCollection\Model;

class AdminModel extends \Think\Model {
    protected $tableName="ADMINS";
	//自动完成
    protected $_auto=array(
        array('PASSWORD','password_encrypt',3,'function'),
        array('CREATE_TIME','toDate',1,'function'),
    );

	//自动验证
	protected $_validate = array(
		array('ACCOUNT', '', '账户已经存在！', 0, 'unique', 1),
		array('ACCOUNT', 'require', '账户名称不能为空！'),
	);
    function checkLogin($name,$pass)
    {
        $where['ACCOUNT']=$name;
        $result = $this->where($where)->find();
        if ($result) {
            if ($result['password'] == password_encrypt($pass)) {
                //登入成功页面跳转
                if($result['role_id']!=54){
                	$this->setError("没有权限");
                	return false;
                }
                session("culture", $result);
                $result['LAST_LOGIN_IP'] = get_client_ip();
                $result['LAST_LOGIN_TIME'] = date("Y-m-d H:i:s");
                $this->save($result);
                return true;
            } else {
                $this->setError("您输入的帐号或密码错误！");
                return false;
            }
        } else {
            $this->setError("您输入的帐号或密码错误！");
            return false;
        }
    }
}
