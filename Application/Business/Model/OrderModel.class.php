<?php
namespace  Business\Model;
class OrderModel extends \Think\Model{
	protected  $tableName='goods_order';
	
	
	protected $_validate = array(
			array('MOBILE', 'require', '手机号不能为空'),
			array('MOBILE','/^((\+86)|(86))?1[3|5|7|8][0-9]{9}$/','请输入正确的手机号格式'),
			array('GUEST_ID', 'require', '用户不存在'),
			array('GOODS_ID', 'require', '套餐不能为空'),
			array('PAYMENT_ID', 'require', '请选择支付方式'),
	
	);
}