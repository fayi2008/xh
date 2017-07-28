<?php
namespace Way\Model;
class RelationModel extends \Think\Model {
	protected $tableName = 'way_relation'; // 关系表
	protected $_map = array (
			'listorder' => 'LISTORDER',
			'poi_id' => 'POI_ID',
			'way_id' => 'WAY_ID',
			'waster_time' => 'WASTER_TIME',
			'road_time' => 'ROAD_TIME',
			'price' => 'PRICE',
			'content' => 'CONTENT',
			'id' => 'ID',
			'day'=>'DAY',
	);
}