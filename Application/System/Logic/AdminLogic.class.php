<?php

namespace System\Logic;

use System\Model\AdminModel;

class AdminLogic extends \Think\Model {
	function _initialize() {
		$this->model = new AdminModel ();
	}
	
	/**
	 * Description: admin_list 获取数据列表
	 * 
	 * @return array|mixed|string Author: Jason
	 *         Date:2015-09-11
	 */
	public function admin_list() {
		$selectArr = $_GET;
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$account = I ( 'get.ACCOUNT' );
		$role_id = I ( 'get.ROLE_ID' );
		$where = array ();
		
		if ($account) {
			$where ['a.ACCOUNT'] = $account;
		}
		if ($role_id) {
			$where ['a.ROLE_ID'] = $role_id;
		}
		// 排序条件
		$order = '';
		if (! empty ( $selectArr ['field'] )) {
			$order = '' . strtoupper ( $selectArr ['field'] ) . ' ' . $selectArr ['direction'] . ',';
		}
		if ($selectArr ['field'] !== 'id') {
			$order .= ' A.ID DESC';
		}
		$order = rtrim ( $order, ',' );
		$data = $this->model->alias ( 'a' )->

		field ( 'a.*,b.NAME as role_name' )->join ( '__ADMIN_ROLE__ b on a.ROLE_ID=b.ID', 'left' )->where ( $where )->order ( $order )->select ();
		$count = $this->model->alias ( 'a' )->field ( 'a.*' )->where ( $where )->count ();
		
		return array (
				'rows' => $data,
				'results' => $count 
		);
	}
	
	/**
	 * Description: getInfo 获取信息
	 * 
	 * @param $id 菜单id        	
	 * @return mixed Author: Jason
	 *         Date: 2015.09.11
	 */
	function getInfo($id) {
		return $this->model->find ( $id );
	}
	
	/**
	 * Description: edit 编辑
	 * 
	 * @param
	 *        	$data
	 * @return array Author: Jason
	 *         Date:
	 */
	function edit($data) {
		if ($data = $this->model->create ( $data )) {
		
			if($data['PASSWORD']){
				$data['PASSWORD'] = password_encrypt($data['PASSWORD']);
			}else{
				unset($data['PASSWORD']);
			}
			$res = $this->model->save ( $data );
			if ($res !== false) {
				$res = array (
						'success' => true 
				);
			} else {
				$res = array (
						'success' => false,
						'msg' => "更新数据失败" 
				);
			}
		} else {
			$res = array (
					'success' => false,
					'msg' => $this->model->getError () 
			);
		}
		
		return $res;
	}
	
	/**
	 * Description: add 添加
	 * 
	 * @param
	 *        	$data
	 * @return array Author: Jason
	 *         Date:
	 */
	function add($data) {
		if ($this->model->create ( $data )) {
			$res = $this->model->add ();
			if ($res !== false) {
				$res = array (
						'success' => true 
				);
			} else {
				$res = array (
						'success' => false,
						'msg' => "添加数据失败" 
				);
			}
		} else {
			$res = array (
					'success' => false,
					'msg' => $this->model->getError () 
			);
		}
		
		return $res;
	}
	
	/**
	 * Description: delete 删除
	 * 
	 * @param
	 *        	$id
	 * @return mixed Author: Jason
	 *         Date:
	 */
	function delete($id) {
		return $this->model->delete ( $id );
	}
}