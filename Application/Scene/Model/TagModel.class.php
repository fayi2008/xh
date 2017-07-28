<?php
namespace  Scene\Model;
class TagModel extends \Think\Model{
	protected  $tableName='poi_tag';//优惠表
	
	//自动验证
	protected $_validate = array(
			array('NAME', '', '名称已经存在！', 0, 'unique', 3),
			array('NAME', 'require', '名称不能为空！'),
	);
	
}