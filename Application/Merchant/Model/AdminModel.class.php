<?php

namespace Merchant\Model;

class AdminModel extends \Think\Model {
	protected $tableName = "business_admin";
	
	// 自动验证
	protected $_validate = array (
			array (
					'ACCOUNT',
					'',
					'账户已经存在！',
					0,
					'unique',
					1 
			),
			array (
					'ACCOUNT',
					'require',
					'账户名称不能为空！' 
			) 
	);
	function checkLogin($name, $pass) {
		$where ['ACCOUNT'] = $name;
		$result = $this->where ( $where )->find ();
		
	
		if ($result) {
			if($result['status']==0){
				$this->setError ( "账号被禁用的" );
				return false;
			}
			if ($result ['password'] == password_encrypt ( $pass )) {
				// 登入成功页面跳转
				session ( "business", $result );
				$data ['LAST_LOGIN_IP'] = get_client_ip ();
				$data ['LAST_LOGIN_TIME'] = date ( "Y-m-d H:i:s" );
				$id=$result['id'];
				
				$this->where ("ID=$id" )->save ( $data );
				
				return true;
			} else {
				$this->setError ( "您输入的帐号或密码错误！" );
				return false;
			}
		} else {
			$this->setError ( "您输入的帐号或密码错误！" );
			return false;
		}
	}
}
