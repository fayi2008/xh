<?php

namespace System\Logic;

use System\Model\AccessModel;

class AccessLogic extends \Think\Model {
	function _initialize() {
		$this->model = new AccessModel ();
		$this->menumodel = new \System\Model\MenuModel ();
	}
	
	/**
	 * Description: role_select_data 获取角色的权限ID数组
	 * 
	 * @param int $role_id
	 *        	角色ID
	 * @return array|mixed|string Author: Jason
	 *         Date:2015-10-28
	 */
	public function role_select_data($role_id) {
		$where ['ROLE_ID'] = $role_id;
		$data = $this->model->where ( $where )->getField ( 'menu_id', true );
		return $data;
	}
	
	/**
	 * Description: addAccess 添加权限
	 * 
	 * @param $ids 权限ID字符串1，2，3        	
	 * @param $role_id 角色ID        	
	 * @return mixed Author: Jason
	 *         Date:
	 */
	function addAccess($ids, $role_id) {
		$this->model->where ( array (
				'ROLE_ID' => $role_id 
		) )->delete ();
		$data = array ();
		$ids = explode ( ',', $ids );
		foreach ( $ids as $menu_id ) {
			$data [] = array (
					'ROLE_ID' => $role_id,
					'MENU_ID' => $menu_id 
			);
		}
		$res = $this->model->addAll ( $data );
		return $res;
	}
	function getUserMenuID() {
		$user = session ( 'admin' );
		$role_id = $user ['role_id'];
		$where = array ();
		$data = $this->role_select_data ( $role_id );
		if ($data) {
			$where ['ID'] = array (
					'in',
					$data 
			);
		}
		
		$data2 = $this->menumodel->where ( $where )->getField ( 'parentid', true );
		$where2 = array ();
		if ($data2) {
			$where2 ['ID'] = array (
					'in',
					$data2 
			);
		}
		$data3 = $this->menumodel->where ( $where2 )->getField ( 'parentid', true );
		return array_merge_recursive ( $data, $data2, $data3 );
	}
	 function check_access($roleid, $url) {
		
		$where=array();
		if ($roleid != 1) {
			$data = $this->role_select_data ( $roleid );
			
			if ($data) {
				$where ['ID'] = array (
						'not in',
						$data 
				);
				$where['URI']= array('neq','');
				$data_uri = $this->menumodel->where ( $where )->getField ( 'URI', true );
			
				if (in_array ( $url, $data_uri )) {
					return false;
				} else {
					return true;
				}
			}
		} else {
			return true;
		}
		// TODO
	}
}