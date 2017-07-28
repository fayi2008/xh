<?php

namespace Business\Model;

class LogModel extends \Think\Model {

    protected $tableName="order_log";
	protected $_auto = array(
		array('create_time', 'toDate', 1, 'function'),
		array('ip', 'get_client_ip', 1, 'function'),
	);
	protected $_validate = array(

    );
	
	/**
	 * 添加日志
	
	 * @param int $user_id  用户ID
	 * @param int $orderId  订单ID
	 * @param int $operTypeId  日志类型ID
	 * @param int $type  订单类型ID
	 * @param string $desc  备注
	
	 */
	public function addLog($orderId="",$poi_id='',$desc="") {
    		$logdata['USER_ID']=intval(session('user.id'))?intval(session('user.id')):68;
    		$logdata['ORDER_ID'] = intval($orderId);
    		$logdata['CREATE_TIME'] = toDate();
    		$logdata['DESC'] = $desc;
    		$logdata['POI_ID'] = $poi_id;
    		$logdata['IP'] =get_client_ip();
		$result = $this->add($logdata);
		return $result;
	}

}
