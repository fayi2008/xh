<?php

namespace System\Model;

class AdminModel extends \Think\Model {
    protected $tableName="ADMINS";
	//自动完成
    protected $_auto=array(
        array('PASSWORD','password_encrypt',1,'function'),
        array('CREATE_TIME','toDate',1,'function'),
        array('LAST_LOGIN_IP','get_client_ip',1,'function'),
        array('LAST_LOGIN_TIME','toDate',1,'function'),
    );

	//自动验证
	protected $_validate = array(
		array('ACCOUNT', '', '账户已经存在！', 0, 'unique', 3),
		array('ACCOUNT', 'require', '账户名称不能为空！'),
		array('EMAIL', '', '邮箱已经存在！', 0, 'unique', 3),
	);
    function checkLogin($name,$pass)
    {
        $where['ACCOUNT']=$name;
        $result = $this->where($where)->find();
        if ($result) {
            if ($result['password'] == password_encrypt($pass)) {
                //登入成功页面跳转
                session("admin", $result);
                $update['LAST_LOGIN_IP'] = get_client_ip();
                $update['LAST_LOGIN_TIME'] = date("Y-m-d H:i:s");
                $update['ID']=$result['id'];
                $this->save($update);
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
