<?php
namespace  Panorama\Model;

class HotModel extends \Think\Model{
	protected  $tableName='panorama_hot';
	
	protected $_auto = array (
			array('CREATE_TIME','toDate',1 ,'function')
	);
	
}