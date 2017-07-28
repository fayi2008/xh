<?php

/* * 
 * 菜单
 */
namespace Business\Model;


class CateModel extends \Think\Model {
	protected  $tableName='goods_cate';//商品分类表
	//自动验证
	protected $_validate = array(
		//array(验证字段,验证规则,错误提示,验证条件,附加规则,验证时间)
		array('NAME', 'require', '菜单名称不能为空！', 1, 'regex', 3),
		//array('app', 'require', '应用不能为空！', 1, 'regex', 3),
		//array('model', 'require', '模块名称不能为空！', 1, 'regex', 3),
		//array('action', 'require', '方法名称不能为空！', 1, 'regex', 3),
		//array('app,model,action', 'checkAction', '同样的记录已经存在！', 0, 'callback', 1),
		array('PARENTID', 'checkParentid', '菜单只支持三级！', 1, 'callback', 1),
	);
	//自动完成
	protected $_auto = array(
		//array(填充字段,填充内容,填充条件,附加规则)
	);

	//验证菜单是否超出三级
	public function checkParentid($parentid) {
		$find = $this->where(array("ID" => $parentid))->getField("PARENTID");
		if ($find) {
			$find2 = $this->where(array("ID" => $find))->getField("PARENTID");
			if ($find2) {
				$find3 = $this->where(array("ID" => $find2))->getField("PARENTID");
				if ($find3) {
					return false;
				}
			}
		}
		return true;
	}

	//验证action是否重复添加
	public function checkAction($data) {
		//检查是否重复添加
		$find = $this->where($data)->find();
		if ($find) {
			return false;
		}
		return true;
	}



	/**
	 * 后台有更新/编辑则删除缓存
	 * @param type $data
	 */
    protected function _before_write(&$data) {
		parent::_before_write($data);
        $this->clearCache();
	}

    function clearCache()
    {
        F("Group", NULL);
        F("MENU_LIST", NULL);
        F("SUBMENU", NULL);
        F("MENU_JSON", NULL);
    }

	//删除操作时删除缓存
    protected function _after_delete($data, $options) {
		parent::_after_delete($data, $options);
		$this->_before_write($data);
	}


}

?>