<?php
namespace User\Model;
class UserModel extends \Think\Model{
	protected  $tableName='USER';
	
	protected $_validate = array(
			array('MOBILE', 'require', '手机号码不能为空'),
			array('MOBILE', 'checkTel', '手机号码格式错误！',3,'callback'),
			array('PASSWORd', 'check', '含非法字符！',3,'callback'),
			
	);
	
	
	function check($data){
		$str='/select|insert|and|or|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile|alter|>|<|script/';
		$flag=preg_match($str,$data);
		if($flag){//如果$flag=0，则说明不含非法字符
			return false;
		}else{
			return true;
		}
	}
	
	
	
	
	function checkTel($data){
		$tel='/1[0-9]{1}[0-9]{1}[0-9]{8}|0[0-9]{2,3}-[0-9]{7,8}(-[0-9]{1,4})?/';
		$data=trim($data);
		$flag= preg_match($tel,$data);
		$flag=(bool)$flag;
		return $flag;
	}
	
}