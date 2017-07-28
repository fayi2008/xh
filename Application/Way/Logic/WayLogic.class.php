<?php

namespace Way\Logic;

class WayLogic extends \Think\Model {
	protected $model;
	protected function _initialize() {
		$this->model = new \Way\Model\WayModel ();
		$this->poimodel = new \Gis\Model\PoiModel ();
		$this->relationmodel = new \Way\Model\RelationModel ();
		$this->tagrelationmodel = new \Gis\Model\RelationModel ();
		$this->waypoimodel = new \Way\Model\WayPoiModel ();
	}
	
	/**
	 * Description: 路线信息列表（后台）
	 * Author: frima
	 * Date:2015-09-24
	 */
	public function getLists() {
		$selectArr = $_GET;
		$where = array ();
		$title = I ( 'title' );
		if ($title) {
			$where ['TITLE'] = array (
					"like",
					"%" . I ( 'title' ) . "%" 
			);
		}
		
		if (I ( 'status' ) !== "100" && I ( 'status' ) != '') {
			$where ['POST_STATUS'] = intval ( I ( 'status' ) );
		}
		if (I ( 'type' ) !== "100" && I ( 'type' ) != '') {
			$where ['TYPE'] = intval ( I ( 'type' ) );
		}
		$where ['STATUS'] = array (
				'neq',
				0 
		);
		
		// 排序条件
		$order = '';
		if (! empty ( $selectArr ['field'] )) {
			$order = '' . strtoupper ( $selectArr ['field'] ) . ' ' . $selectArr ['direction'] . ',';
		}
		if ($selectArr ['field'] !== 'id') {
			$order .= ' ID DESC';
		}
		$order = rtrim ( $order, ',' );
		$field = "ID,TITLE,CREATE_DATE,UPDATE_DATE,POST_STATUS,TYPE";
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( $order )->select ();
		// echo $this->model->getLastSql();die();
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * Description: 路线信息列表（前台）
	 * Author: bill
	 * Date:2015-09-24
	 */
	function way_list_get_json() {
		$where ["a.STATUS"] = array (
				'neq',
				0 
		);
		$type= $_GET['type'];
		
		if($type!=0){
			$where ['a.TYPE'] = 1;
		}
		if(!isset($type)){
			$where ['a.TYPE'] = 1;
		}
		
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$day = intval ( I ( "get.day" ) );
		$tag = I ( "get.tag_id" );
		$poi = I ( "get.poi_id" );
		if ($day) {
			$where ['a.TOTAL_DAY'] = $day;
		}
		if (! $length) {
			$length = 10;
		}
		if (! $start) {
			$start = 0;
		}
		$where ["a.POST_STATUS"] = array (
				'neq',
				0 
		);
		
		$where ['_string'] = '';
		if ($tag) {
			$arr_tag = explode ( ",", $tag );
			foreach ( $arr_tag as $key => $v ) {
				$where ['_string'] .= "a.TAG_ID like '%$v%' AND  ";
			}
		}
		
		if ($poi) {
			$arr_poi = explode ( ",", $poi );
			foreach ( $arr_poi as $key => $v ) {
				$where ['_string'] .= "a.POI_ID like '%$v%' AND  ";
			}
		}
		
		if ($where ['_string'] != '') {
			$where ['_string'] = substr ( $where ['_string'], 0, strlen ( $where ['_string'] ) - 5 );
		} else {
			unset ( $where ['_string'] );
		}
		
		$ordertype = $_GET ['ordertype'];
		if ($ordertype == 'time') {
			$orderby = 'a.CREATE_DATE DESC';
		} elseif ($ordertype == 'hot') {
			$orderby = 'a.HITSUM DESC';
		} else {
			$orderby = 'a.CREATE_DATE DESC';
		}
		$field = "a.*";
		
		// $join = 'left join way_relation as b on a.id=b.way_id left join poi as c on b.poi_id=c.id';
		$list = $this->model->alias ( 'a' )->where ( $where )->limit ( $start . ',' . $length )->field ( $field )->order ( $orderby )->select ();
	
		$arrway = array ();
		if ($list) {
			foreach ( $list as $key => $val ) {
				$arrway [] = $val ['id'];
			}
		}
		
		//获得该路线下的攻略点
		$where2 = array ();
		if ($arrway) {
			$where2 ['b.WAY_ID'] = array (
					'in',
					$arrway 
			);
			$where2 ['c.id'] = array (
					'exp',
					'is not null' 
			);
		}
		$join = "left join  __POI__ as c on b.poi_id=c.id";
		$poi = $this->relationmodel->alias ( 'b' )->join ( $join )->where ( $where2 )->field ( 'b.WAY_ID,c.NAME,b.DAY,LISTORDER' )->order ( 'b.DAY asc,b.LISTORDER asc,b.ID desc' )->select ();
		//处理该路线下poi点攻略
		foreach ( $list as $key => $val ) {
			foreach ( $poi as $k => $v ) {
				if ($val ['id'] == $v ['way_id']) {
					$list [$key] ['poi'] [] = $v;
				}
			}
		}
		//处理该路线标签
		$way = array_values ( $list );
		$WAY_TAG = C ( 'WAY_TAG' );
		foreach ( $way as $key => $val ) {
			$tag_id = $val ['tag_id'];
			if ($tag_id) {
				$tag_id = explode ( ",", $tag_id );
				if ($tag_id) {
					foreach ( $tag_id as $k => $v ) {
						$way [$key] ['tag'] [] = $WAY_TAG [$v];
					}
				}
			} else {
				$way [$key] ['tag'] = '';
			}
		}
		//数量
		$count = $this->model->alias ( 'a' )->where ( $where )->count ();
		
		$reslut ['rows'] = $way;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * Description: 线路详情
	 * Author: bill
	 * Date:2015-09-24
	 */
	function way_detail_get_json($way_id=0) {
		if(!$way_id)
		{
			$way_id = (I ( 'get.id' ));
		}
		$field = "a.id as aid ,b.listorder ,c.*,b.day,e.WASTER_TIME,d.PANO_KEY";    
		$poi = $this->model->alias ( 'a' )->field ( $field )->join ( "left join  __WAY_RELATION__ as b on a.ID=b.WAY_ID" )
			->join ( "left join  __POI__ as c on b.POI_ID=C.ID" )->join ( "left join  __PANORAMA__ as d on c.ID=d.POI_ID" )
			->join ( "left join __WAY_POI__ as e on c.ID=e.POI_ID" )
			->where ( "a.ID=$way_id and c.id is not null" )->order ( 'b.listorder asc' )->select();
		$arr = array ();
		foreach ( $poi as $k => $v ) {
			if (empty ( $arr [$v ['id']] )) {
				$arr [$v ['id']] = $v;
			}
			$arr [$v ['id']] ['pano'] [] = $v ['pano_key'];
		}
		$arr = array_values ( $arr );
		
		foreach ( $arr as $key => &$val ) {
			
			$arr [$key] ['description'] = html_entity_decode ( $val ['description'] );
		}
		$way_detail = $this->model->where ( "id=$way_id" )->find ();
		$this->model->where("ID=$way_id")->setInc('HITSUM', 1);
		$data ['way'] = $way_detail;
		$data ['poi'] = $arr;
		return $data;
	}
	
	/**
	 * Description: 自定义景点攻略
	 * Author: bill
	 * Date:2015-09-24
	 */
	function way_diy_list_get_json() {
		// $tag=$_POST['tag'];
		// $day=$_POST['day'];
		// $poi=$_POST['poi'];
		$tag = '1,2,3';
		$day = 1;
		$poi = '1,27';
		// 查询必游景点的标签
		$tag_ids = $this->poimodel->field ( "TAG_IDS" )->where ( "id in ($poi)" )->select ();
		if ($tag_ids) {
			$tag_ids_str = '';
			foreach ( $tag_ids as $k => $v ) {
				$tag_ids_str .= $v ['tag_ids'] . ",";
			}
			$tag = $tag_ids_str . $tag;
		}
		// ===========
		$where ['STATUS'] = array (
				'neq',
				0 
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$start = 0;
		$length = 2;
		$where ['POST_STATUS'] = array (
				'neq',
				0 
		);
		$where ['_string'] = '';
		if ($tag) {
			$arr_tag = explode ( ",", $tag );
			foreach ( $arr_tag as $key => $v ) {
				$where ['_string'] .= " FIND_IN_SET($v,TAG_ID) AND  ";
			}
		}
		
		if ($poi) {
			$arr_poi = explode ( ",", $poi );
			foreach ( $arr_poi as $key => $v ) {
				$where ['_string'] .= "FIND_IN_SET($v,POI_ID) AND  ";
			}
		}
		
		if ($where ['_string'] != '') {
			$where ['_string'] = substr ( $where ['_string'], 0, strlen ( $where ['_string'] ) - 5 );
		}
		if ($day) {
			$where ['TOTAL_DAY'] = $day;
		}
		
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( 'LISTORDER desc' )->select ();
		foreach ( $list as $k => $v ) {
			$list [$k] ['tag_count'] = count ( explode ( ",", $v ['tag_id'] ) );
		}
		foreach ( $list as $key => $value ) {
			
			$count [$key] = $value ['tag_count'];
		}
		array_multisort ( $count, SORT_NUMERIC, SORT_ASC, $list );
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * Description: 路线发布
	 * Author: frima
	 * Date:2015-9-24
	 */
	public function release() {
		$where ['ID'] = intval ( I ( 'id' ) );
		$data ['POST_STATUS'] = I ( 'unrel' ) ? 0 : 1;
		$res = $this->model->where ( $where )->save ( $data );
		AdminLog ( $res, 2, json_encode ( $data ), "确定线路发布" );
		return $res;
	}
	
	/**
	 * Description: 获得单个路线的详情
	 * Author: frima
	 * Date:2015-9-24
	 */
	public function getOne() {
		$where ['ID'] = intval ( I ( 'id' ) );
		$field = 'ID,TITLE,INTRODUCTION,IMAGE_URI,LISTORDER,TAG_ID,TYPE';
		$res = $this->model->field ( $field )->where ( $where )->find ();
		return $res;
	}
	
	/**
	 * Description: 编辑路线详情
	 * Author: frima
	 * Date:2015-9-24
	 */
	public function edit() {
		if ($data = $this->model->create ( I ( 'put.' ) )) {
			$data ['UPDATE_DATE'] = date ( "Y-m-d H:i:s", time () );
			$data ['TAG_ID'] = implode ( ',', I ( 'put.tags' ) );
			$res = $this->model->save ( $data );
			AdminLog ( $data ['ID'], 2, json_encode ( $data ), "编辑线路详情" );
			return $res;
		} else {
			return false;
		}
	}
	
	/**
	 * Description: 添加路线详情
	 * Author: frima
	 * Date:2015-9-24
	 */
	public function add() {
		if ($data = $this->model->create ( I ( 'post.' ) )) {
			$data ['CREATE_DATE'] = date ( "Y-m-d H:i:s", time () );
			$data ['UPDATE_DATE'] = date ( "Y-m-d H:i:s", time () );
			unset ( $data ["ID"] );
			$data ['TAG_ID'] = implode ( ',', I ( 'post.tags' ) );
			$res = $this->model->add ( $data );
			if (false === $res) {
				return $res;
			}
			AdminLog ( $res, 1, json_encode ( $data ), "添加线路信息" );
			return $res;
		} else {
			return false;
		}
	}
	
	/**
	 * Description: 删除商品详情
	 * Author: frima
	 * Date:2015-9-23
	 */
	public function delete() {
		$id = I ( 'put.ids' );
		$where ['ID'] = array (
				'in',
				$id 
		);
		$data ['STATUS'] = 0;
		$res = $this->model->where ( $where )->save ( $data );
		AdminLog ( $res, 1, json_encode ( $id ), "删除线路信息" );
		return $res;
	}
	
	/**
	 * Description: 得到线路攻略
	 * Author: frima
	 * Date:2015-9-23
	 */
	function getrelation() {
		$way_id = I ( 'way_id' );
		$join = "left join __POI__ as b on a.poi_id=b.id left join __WAY_POI__ as c on b.id=c.poi_id";
		$field = "a.*,b.name,c.waster_time,c.max_time,c.min_time,c.price,c.content";
		$result = $this->relationmodel->alias ( 'a' )->field ( $field )->join ( $join )->where ( "way_id=$way_id and b.id is not null" )->order ( 'a.id desc ,a.listorder asc' )->select ();

		if ($result) {
			foreach ( $result as $key => $value ) {
				$id = $value ['id'];
				$way_id = $value ['way_id'];
				$result [$key] ['content'] = html_entity_decode ( $value ['content'] );
				$result [$key] ['do'] = "<a href='/way/admin/relation_delete/id/$id/way_id/$way_id'>删除</a>";
			}
		}
		return $result;
	}
	/**
	 * author ：bill
	 * Description: 编辑攻略
	 */
	function relation_post() {
		$data = $this->relationmodel->create ();
		$suggest = I ( 'suggest' );
		$id = I ( 'name' );
		$poi_id = I ( 'poi_id' );
		if (! is_numeric($id)) {
			$poi = $this->poimodel->where ( "name='$suggest'" )->find ();
			
			if ($poi) {
				$data ['POI_ID'] = $poi ['id'];
			} else {
				$arr = array (
						"success" => false,
						"message" => 'poi点不存在' 
				);
				return $arr;
			}
		} else {
			if ($poi_id && empty($_POST ['isNew'])) {
				$data ['POI_ID'] = $poi_id;
			} else {
				$data ['POI_ID'] = $id;
			}
		}
		
		if ($_POST ['isNew']) {
			$result = $this->relationmodel->where ( "WAY_ID={$data['WAY_ID']} and POI_ID={$data['POI_ID']}" )->find ();
			if ($result) {
				$arr = array (
						"success" => false,
						"message" => '不能重复添加该poi点' 
				);
				return $arr;
			} else {
				unset ( $data ['ID'] );
				$id = $this->relationmodel->add ( $data);
				AdminLog ( $id, 1, json_encode ( $data ), "添加路线攻略POI关系" );
				$arr = array (
						"success" => true,
						"isNew" => true,
						"id" => $id 
				);
			}
		} else {
			$result = $this->relationmodel->where ( "WAY_ID={$data['WAY_ID']} and POI_ID={$data['POI_ID']} and ID !={$_POST['id']}" )->find ();
			if ($result) {
				$arr = array (
						"success" => false,
						"message" => '不能重复添加该poi点' 
				);
				return $arr;
			}

			$res=$this->relationmodel->save ( $data );
			AdminLog ( $res, 2, json_encode ( $data ), "保存路线攻略POI关系" );
			$arr = array (
					"success" => true 
			);
		}
		$waypoi = $this->waypoimodel->where ( "POI_ID={$data['POI_ID']}" )->find ();
		if (! $waypoi) {
			$datawaypoi = $this->waypoimodel->create ( $_POST );
			$datawaypoi ['POI_ID'] = $data ['POI_ID'];
			$res = $this->waypoimodel->add ( $datawaypoi );
			AdminLog ( $res, 1, json_encode ( $datawaypoi ), "添加线路POI点" );
		} else {
			$datawaypoi = $this->waypoimodel->create ( $_POST );
			$datawaypoi ['POI_ID'] = $data ['POI_ID'];
			$datawaypoi ['ID'] = $waypoi ['id'];
			$res=$this->waypoimodel->save ( $datawaypoi );
			AdminLog ( $res, 2, json_encode ( $datawaypoi ), "编辑线路POI点" );
		}
		$this->edit_way ( $data ['WAY_ID'] );
		//获得填写攻略中的最大天数
		$day=$this->getTodayDay($data ['WAY_ID']);
		$dayarr=array("TOTAL_DAY"=>$day);
		$this->model->where("ID={$data ['WAY_ID']}")->save($dayarr);
		return $arr;
	}
	/**
	 * 编辑线路的tag 和poi
	 *
	 * @param unknown $way_id        	
	 */
	function edit_way($way_id) {
		$poi = $this->relationmodel->where ( "WAY_ID=$way_id" )->field ( 'POI_ID' )->select ();
		if ($poi) {
			$count = count ( $poi );
			$str_poi_id = '';
			foreach ( $poi as $key => $value ) {
				if ($key + 1 != $count) {
					$str_poi_id .= $value ['poi_id'] . ",";
				} else {
					$str_poi_id .= $value ['poi_id'];
				}
				$arr_poi_id [] = $value ['poi_id'];
			}
			
			$where ['POI_ID'] = array (
					'in',
					$arr_poi_id 
			);
			
			$tag = $this->tagrelationmodel->where ( $where )->field ( "TAG_ID" )->select ();
			if ($tag) {
				$count = count ( $tag );
				$str_tag_id = '';
				foreach ( $tag as $key => $value ) {
					if ($key + 1 != $count) {
						$str_tag_id .= $value ['tag_id'] . ",";
					} else {
						$str_tag_id .= $value ['tag_id'];
					}
				}
			}
			// $way ['TAG_ID'] = $str_tag_id;
			$way ['POI_ID'] = $str_poi_id;
			$way ['ID'] = $way_id;
			$this->model->save ( $way );
			AdminLog ( $way ['ID'], 2, json_encode ( $way ), "编辑线路POI,TAG信息" );
		} else {
			$way ['TAG_ID'] = '';
			$way ['POI_ID'] = '';
			$way ['ID'] = $way_id;
			$this->model->save ( $way );
		}
	}
	/**
	 * 删除攻略
	 */
	function relation_delete() {
	
		$id = I ( 'ids' );
		$id = $id [0];
		$way_id = I ( 'way_id' );
		$way_id = $way_id [0];
		$result = $this->relationmodel->where ( "id=$id" )->delete ();
		AdminLog ( $id, 3, '', "删除攻略" );
		$result = true;
		if ($result) {
			$this->edit_way ( $way_id );
			$day=$this->getTodayDay($way_id);
			$dayarr=array("TOTAL_DAY"=>$day);
			$this->model->where("ID={$way_id}")->save($dayarr);
			
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 * Description: 首页获得路线推荐的内部接口（ !!仅供内部其他模块调用(Home)）
	 * Author:ward
	 * Date:2015-11-24
	 */
	public function getHomeWays() {
		$size = 8;
		$where ['POST_STATUS'] = 1;
		$where ['STATUS'] = 1;
		$data = $this->model->where ( $where )->field ( $field )->order ( 'HITSUM DESC' )->limit ( $size )->select ();
		if (empty ( $data ) || ! is_array ( $data )) {
			
			return $data;
		}
		$wayTag = C ( 'WAY_TAG' );
		foreach ( $data as $key => $val ) {
			$tagStr = $val ['tag_id'];
			if ($tagStr) {
				$tagArr = explode ( ",", trim ( $tagStr ) );
				
				foreach ( $tagArr as $k => $v ) {
					$data [$key] ['tag'] [] = $wayTag [$v];
				}
			} else {
				$way [$key] ['tag'] = '';
			}
		}
		return $data;
	}
	
	/**
	 * 获得路线攻略中的天数
	 * @param int $way_id
	 * @return int
	 * @review ward
	 */
	public function getTodayDay($way_id){
		//$day=$this->relationmodel->where("WAY_ID=$way_id")->max('DAY');
		$way_id=intval($way_id);
		$dayArr=$this->relationmodel->Distinct(true)->alias('a')
			->join('left join __POI__ as b on a.POI_ID=b.ID')
			->where("a.WAY_ID=$way_id and b.ID IS NOT NULL")->field('DAY')->select();
		//ward 2016-03-16 rewrite
		$day=count($dayArr);
		if($day){
			if($day>3){
				$day=4;
			}
			return $day;
		}else{
			return 0;
		}
	}

	/**
	 * 获取最近的一个景点
	 * @param $lon 经度
	 * @param $lat 纬度
	 * @param $distance 距离
	 */
	public function getNearbyWay($lon,$lat,$distance='5000')
	{
		$dist = distance2degree ( $lat, $distance );

		$where ['b.LON'] = array (
			'BETWEEN',
			($lon - $dist ['lng_d']) . ',' . ($lon + $dist ['lng_d'])
		);
		$where ['b.LAT'] = array (
			'BETWEEN',
			($lat - $dist ['lat_d']) . ',' . ($lat + $dist ['lat_d'])
		);
		$where ['b.TYPE'] =2;
		$where ['d.STATUS'] =1;
		$join = "left join __POI__ as b on a.poi_id=b.id left join __WAY_POI__ as c on b.id=c.poi_id join __WAY__ as d on a.way_id=d.id";
		$field = "a.way_id";
		$result = $this->relationmodel->alias ( 'a' )->field ( $field )->join ( $join )->where ($where)->order ( 'a.id desc ,a.listorder asc' )->select();
		return $result;
	}
}