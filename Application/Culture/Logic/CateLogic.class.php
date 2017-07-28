<?php

/**
 * Author: Jason
 * Date: 2015/9/7
 * Time: 15:47
 * Description: 
 */
namespace Culture\Logic;

use Culture\Model\Model;

class CateLogic extends \Think\Model {
	function _initialize() {
		$this->model = new \Culture\Model\CultureCategoryModel ();
	}
	
	/**
	 * Description: addMenu
	 * 
	 * @param
	 *        	$data
	 * @return array Author: Jason
	 *         Date:
	 */
	function putCate($order, $id) {
		/* $where['id']=$id; */
		$data = array (
				'LISTORDER' => $order 
		);
		$res = $this->model->where ( array (
				"ID" => $id 
		) )->save ( $data );
		AdminLog($id, 6, json_encode($data), "文化分类排序");
		if ($res !== false) {
			$res = array (
					'success' => true 
			);
		} else {
			$res = array (
					'success' => false,
					'msg' => "更新排序失败" 
			);
		}
		return $res;
	}
     /**
	 * 得到前6个文化分类
	 */
	function getTop6Cate() {
		$where['PARENTID']=0;
		$where['STATUS']=1;
		$res = $this->model->where($where)->limit ( 6 )->order ( 'LISTORDER ASC' )->select ();
		return $res;
	}
}