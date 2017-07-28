<?php
namespace  Gis\Model;
class TagModel extends \Think\Model{
	protected  $tableName='poi_tag';//优惠表
	//自动验证
	protected $_validate = array(
			array('NAME', 'checkUniqueName', '名称已经存在！', 0, 'callback', 3),
			array('NAME', 'require', '名称不能为空！'),
	);

	function checkUniqueName($name)
	{
		if($this->field('ID')->where(array('STATUS'=>1,'NAME'=>$name))->find())
		{
			return false;
		}else{
			return true;
		}
	}
	
}