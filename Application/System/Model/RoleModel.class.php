<?php

namespace System\Model;

class RoleModel extends \Think\Model {
    protected $tableName="admin_role";
	//自动验证
	protected $_validate = array(
		array('name', '', '角色名称已经存在！', 0, 'unique', 1), 
		array('name', 'require', '角色名称不能为空！'),
	);

}
