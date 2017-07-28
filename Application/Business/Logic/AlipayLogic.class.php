<?php

/**
 * Author: Jason
 * Date: 2015/9/7
 * Time: 15:47
 * Description: 
 */
namespace Business\Logic;

use Business\Model\AlipayModel;

class AlipayLogic extends \Think\Model {
	function _initialize() {
		$this->model = new AlipayModel ();
	}
	
	/**
	 * Description: 得到商户的支付宝配置信息
	 *
	 * @param
	 *        	$data
	 * @return array Author: liuzhaojun
	 *         Date:
	 */
	function getAlipayConfig() {
		$user = session ( "business" );
		$poi_id = $user ['poi_id'];
		$where ['POI_ID'] = $poi_id;
		$alipay = $this->model->where ( $where )->find ();
		return $alipay;
	}
	/**
	 * Description: 添加alipay配置信息
	 *
	 * @param
	 *        	$data
	 * @return array Author: liuzhaojun
	 *         Date:
	 */
	function addAlipay($data) {
		if ($data = $this->model->create ( $data )) {
			$user = session ( 'business' );
			
			$data ['POI_ID'] = $user ['poi_id'];
			$res = $this->model->add ( $data );
			AdminLog($res, 1, json_encode($data), "添加商户支付宝信息");
			if ($res !== false) {
				$res = array (
						'success' => true ,
						'msg' => "添加成功"
				);
			} else {
				$res = array (
						'success' => false,
						'msg' => "添加失败" 
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
	 * Description: editalipay
	 *
	 * @param
	 *        	$data
	 * @return array Author: liuzhaojun
	 *         Date:
	 */
	function editAlipay($data) {
		if ($data = $this->model->create ( $data )) {
			$res = $this->model->save ( $data );
			AdminLog($data['ID'], 2, json_encode($data), "编辑商户支付宝信息");
			if ($res !== false) {
				$res = array (
						'success' => true,
						'msg' => "跟新成功"
				);
			} else {
				$res = array (
						'success' => false,
						'msg' => "跟新失败" 
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
}