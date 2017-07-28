<?php

namespace Way\Model;

class WayPoiModel extends \Think\Model {
	protected $tableName = "way_poi";
	protected $_map = array (
			
			'poi_id' => 'POI_ID',
			'waster_time' => 'WASTER_TIME',
			'max_time' => 'MAX_TIME',
			'min_time' => 'MIN_TIME',
			'price' => 'PRICE',
			'content' => 'CONTENT' 
	)
	;
}
