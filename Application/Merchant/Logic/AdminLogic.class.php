<?php

namespace Merchant\Logic;

class AdminLogic extends \Think\Model {
	function _initialize() {
		$this->model = new \Merchant\Model\AdminModel ();
	}
	/**
	 * Description: 添加商户管理员
	 * Author: bill
	 * Date:
	 */
	function addAdmin() {
		$arr = array ();
		if ($_POST ['PASSWORD'] != $_POST ['REPASSWORD']) {
			$arr ['message'] = '两次输入的密码不一致';
			$arr ['status'] = 0;
			return $arr;
		}
		$admin = $this->model->where ( "ACCOUNT='" . $_POST ['ACCOUNT'] . "' and POI_ID=" . $_POST ['POI_ID'] )->find ();
		;
		if ($admin) {
			$arr ['message'] = '不能添加两个登陆名一样的用户';
			$arr ['status'] = 0;
			return $arr;
		}
		if ($data = $this->model->create ( $_POST )) {
			$data['CREATE_TIME']=date("Y-m-d H:i:s");
			$data ['PASSWORD'] = password_encrypt ( $data ['PASSWORD'] );
			$res = $this->model->add ( $data );
			AdminLog($res, 1, json_encode($data), "添加商户管理员");
			if (! $res) {
				$arr ['message'] = $this->model->getDbError ();
				$arr ['status'] = 0;
				return $arr;
			} else {
				$arr ['message'] = '添加成功';
				$arr ['status'] = 1;
				return $arr;
			}
		} else {
			$arr ['message'] = $this->model->getError ();
			$arr ['status'] = 0;
			return $arr;
		}
	}
	
	/**
	 * Description: 编辑商户管理员
	 * Author: bill
	 * Date:
	 */
	function saveAdmin() {
		if ($data = $this->model->create ( I ( 'put.' ) )) {
			if ($data ['PASSWORD']) {
				$data ['PASSWORD'] = password_encrypt ( $data ['PASSWORD'] );
			} else {
				unset ( $data ['PASSWORD'] );
			}
			
			$res = $this->model->save ( $data );
			AdminLog($data['ID'], 2, json_encode($data), "编辑商户管理员");
			if ($res===false) {
				$arr ['message'] = '修改失败';
				$arr ['status'] = 0;
				return $arr;
			} else {
				$arr ['message'] = '修改成功';
				$arr ['status'] = 1;
				return $arr;
			}
		} else {
			$arr ['message'] = $this->model->getError ();
			$arr ['status'] = 0;
			return $arr;
		}
	}
	// adminlist
	function getlist($id = -1) {
		$selectArr=$_GET;
		$where = array ();
		if(I ( 'acount' )){
		$where ['a.ACCOUNT'] = array (
				"like",
				"%" . I ( 'acount' ) . "%" 
		);
		}
		if ($id != - 1) {
			$where ['a.POI_ID'] = $id;
		}
		if (I ( 'status' ) != 100) {
			$where ['a.STATUS'] = I ( 'status' );
		}
		
		$field = array (
				'a.*,b.NAME' 
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
			//排序条件
		$order='';
		if(!empty($selectArr['field'])){
			$order='a.'.strtoupper($selectArr['field']).' '.$selectArr['direction'].',';
		}
		if($selectArr['field']!=='id'){
			$order.='a.ID DESC';
		}
		$order=rtrim($order,',');
		$join = "left join __POI__ as b on a.poi_id=b.id";
		$list = $this->model->alias('a')->join($join)->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( $order )->select ();
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	function getAdminDetail($id) {
		$where ['ID'] = $id;
		$admin = $this->model->where ( $where )->find ();
		return $admin;
	}
	function admin_delete() {
			$where ['ID'] = intval ( I ( 'put.id' ) );
		if (I ( 'put.unrel' )) {
			$data ['STATUS'] = 0;
		} else {
			$data ['STATUS'] = 1;
		}
		$res = $this->model->where ( $where )->save ( $data );
		AdminLog($where ['ID'], 3, '', "删除商户管理员");
		
		if (! $res) {
			echo $this->model->getError ();
			return false;
		}
		return $res;
	}
	
	/**
	 * Description: 获得所有poi点
	 * Author: bill
	 * Date:
	 */
	function getALLAdmin() {
		$poi = $this->model->select ();
		return $poi;
	}
	/**
	 * Description: 获得单条poi点
	 * Author: bill
	 * Date:
	 */
	function getOneAdmin($id) {
		$poi = $this->model->field ( 'id,name' )->where ( "id =" . $id )->select ();
		return $poi;
	}
	function releaseAdmin() {
		$where ['ID'] = intval ( I ( 'put.id' ) );
		if (I ( 'put.unrel' )==0) {
			$data ['STATUS'] = 1;
		} else {
			$data ['STATUS'] = 0;
		}
		$res = $this->model->where ( $where )->save ( $data );
		if (! $res) {
			echo $this->model->getError ();
			return false;
		}
		return $res;
	}
}
