<?php

namespace Gis\Logic;

class PoiLogic extends \Think\Model {
	protected $model;
	function _initialize() {
		$this->model = new \Gis\Model\PoiModel ();
		$this->tagmodel = new \Gis\Model\TagModel ();
		$this->areaModel = new \Common\Model\AreaModel ();
		$this->relationModel = new \Gis\Model\RelationModel ();
	}
	/**
	 * Description: 添加poi点
	 * Author: bill
	 * Date:
	 */
	function addPoi() {
		if ($data = $this->model->create ( $_POST )) {
			//----ward----
			$tagArr=$data ['TAG_IDS'];
			$data['HOTEL']=0;
			$data['FOOD']=0;
			if(!empty($tagArr)){
				foreach ($tagArr as $v){
					if($v==1){
						$data['HOTEL']=1;
					}
					if($v==2){
						$data['FOOD']=1;
					}
				}
			}
			//----ward--2016-02-29--
			if ($data ['TAG_IDS']) {
				$data ['TAG_IDS'] = implode ( ",", $data ['TAG_IDS'] );
			}
			if($data['MANY_IMAGE']){
				$data['MANY_IMAGE']=json_encode($data['MANY_IMAGE']);
			}
			
			$res = $this->model->add ( $data );
			AdminLog ( $res, 1, json_encode ( $data ), "添加poi" );
			if (! $res) {
				echo $this->model->getDbError ();
				return false;
			}
			if ($_POST ['TYPE'] == '2') {
				$tagArr = $_POST ['TAG_IDS'];
				$datas = array ();
				if (is_null ( $tagArr )) {
					return $res;
				} elseif (is_string ( $tagArr )) {
					$datas = array (
							'POI_ID' => $res,
							'TAG_ID' => $tagArr 
					);
				} elseif (is_array ( $tagArr )) {
					$datas = array ();
					foreach ( $tagArr as $val ) {
						$datas [] = array (
								'POI_ID' => $res,
								'TAG_ID' => $val 
						);
					}
				}
				$this->relationModel->addAll ( $datas );
			}
			
			return $res;
		} else {
			$this->setError ( $this->model->getError () );
			return false;
		}
	}
	
	/**
	 * Description: 编辑poi点
	 * Author: bill
	 * Date:
	 */
	function savePoi() {
		if ($data = $this->model->create ( I ( 'put.' ) )) {
			//----ward----
			$tagArr=$data ['TAG_IDS'];
			$data['HOTEL']=0;
			$data['FOOD']=0;
			if(!empty($tagArr)){
				foreach ($tagArr as $v){
					if($v==1){
						$data['HOTEL']=1;
					}
					if($v==2){
						$data['FOOD']=1;
					}
				}
			}
			//----ward--2016-02-29--
			if ($data ['TAG_IDS']) {
				$data ['TAG_IDS'] = implode ( ",", $data ['TAG_IDS'] );
			} else {
				$data ['TAG_IDS'] = '';
			}
			if($data['MANY_IMAGE']){
				$data['MANY_IMAGE']=json_encode($data['MANY_IMAGE']);
			}else{
				$data['MANY_IMAGE']=json_encode(array());
			}
			$res = $this->model->save ($data);
			
			AdminLog ( $data ['ID'], 2, json_encode ( $data ), "编辑poi" );
			if ($data ['TYPE'] == '2') {
				$tagArr = I ( 'put.TAG_IDS' );
				$infoId = intval ( I ( 'put.ID' ) );
				$where ['POI_ID'] = $infoId;
				$this->relationModel->where ( $where )->delete (); // 删除原来就的关系
				
				$datas = array ();
				if (is_null ( $tagArr )) {
					if ($res === false) {
						return false;
					} else {
						return true;
					}
				} elseif (is_string ( $tagArr )) {
					$datas [] = array (
							'POI_ID' => $infoId,
							'TAG_ID' => $tagArr 
					);
				} elseif (is_array ( $tagArr )) {
					$datas = array ();
					foreach ( $tagArr as $val ) {
						$datas [] = array (
								'POI_ID' => $infoId,
								'TAG_ID' => $val 
						);
					}
				}
				$this->relationModel->addAll ( $datas ); // 添加新的关系
			}
			
			if (false === $res) {
				$this->setError ( $this->model->getError () );
				return false;
			}
			
			return true;
		} else {
			
			$this->setError ( $this->model->getError () );
			return false;
		}
	}
	// poi点list
	function getlist() {
		$selectArr = $_GET;
		$where = array ();
		$where ['NAME'] = array (
				"like",
				"%" . I ( 'name' ) . "%" 
		);
		if (I ( 'status' ) != 100) {
			$where ['STATUS'] = I ( 'status' );
		}
		if(I ( 'type' ))
		{
			$where ['TYPE'] = intval(I ( 'type' ));
		}

		$field = array (
				'ID,NAME,LAT,LON,ADDRESS,STATUS,POWER' 
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		// 排序条件
		$order = '';
		if (! empty ( $selectArr ['field'] )) {
			$order = '' . strtoupper ( $selectArr ['field'] ) . ' ' . $selectArr ['direction'] . ',';
		}
		if ($selectArr ['field'] !== 'id') {
			$order .= ' ID DESC';
		}
		$order = rtrim ( $order, ',' );
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( $order )->select ();
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	function getPoiDetail($id) {
		$where ['ID'] = $id;
		$poi = $this->model->where ( $where )->find ();
		
		return $poi;
	}
	function poi_delete() {
		$id = I ( 'ids' );
		$where ['ID'] = array (
				'in',
				$id 
		);
		$res = $this->model->where ( $where )->delete ();
		return $res;
	}
	
	/**
	 * Description: 获得所有poi点
	 *
	 * @param $field 字段
	 *        	Author: bill
	 *        	Date:2015-11-19
	 *        	recode:jason
	 */
	function getALLpoi($field = '*') {
		$poi = $this->model->field ( $field )->order ( 'ID DESC' )->select ();
		return $poi;
	}
	
	/**
	 * Description: 获得单条poi点
	 * Author: bill
	 * Date:
	 */
	function getOnepoi($id) {
		$poi = $this->model->field ( 'id,name' )->where ( "id =" . $id )->select ();
		return $poi;
	}
	function releasePoi() {
		$where ['ID'] = intval ( I ( 'put.id' ) );
		if (I ( 'put.unrel' )) {
			$data ['STATUS'] = 0;
			AdminLog ( $where ['ID'], 5, '', "取消发布poi" );
		} else {
			$data ['STATUS'] = 1;
			AdminLog ( $where ['ID'], 4, '', "发布poi" );
		}
		$res = $this->model->where ( $where )->save ( $data );
		if (! $res) {
			echo $this->model->getError ();
			return false;
		}
		return $res;
	}
	function getCity() {
		$cityData = array ();
		$city = F ( 'areaData' );
		if ($city) {
			$cityData = $city;
		} else {
			$allData = $this->areaModel->select ();
			$nowPro = - 1;
			$nowCity = - 1;
			foreach ( $allData as $k => $v ) {
				if ($k == 0)
					continue;
				if (substr ( $v ['code'], 2, 4 ) === '0000') {
					$cityData [] = array (
							'id' => $v ['code'],
							'text' => $v ['name'] 
					);
					$nowPro ++;
					$nowCity = - 1;
				} elseif (substr ( $v ['code'], 4, 2 ) === '00') {
					$cityData [$nowPro] ['children'] [] = array (
							'id' => $v ['code'],
							'text' => $v ['name'],
							'leaf' => false 
					);
					$nowCity ++;
				} else {
					if (substr ( $v ['code'], 4, 2 ) === "01") {
						continue;
					}
					$cityData [$nowPro] ['children'] [$nowCity] ['children'] [] = array (
							'id' => $v ['code'],
							'text' => $v ['name'],
							'leaf' => true 
					);
				}
			}
			F ( 'areaData', $cityData );
		}
		return $cityData;
	}
	
	/**
	 * Description: 自动补全搜索
	 * Author: bill
	 * Date:
	 */
	function getPoiName($name) {
		$where ['NAME'] = array (
				'like',
				"%" . $name . "%" 
		);
		
		$result = $this->model->where ( $where )->field ( "NAME" )->select ();
		;
		$arr = array ();
		if ($result) {
			foreach ( $result as $key => $value ) {
				$arr [] = $value ['name'];
			}
		}
		return $arr;
	}
	
	/**
	 * Description: 自动补全搜索
	 * Author: bill
	 * Date:
	 */
	function getSceneName($name) {
		$where ['NAME'] = array (
				'like',
				"%" . $name . "%" 
		);
		$where ['TYPE'] = 2;
		$result = $this->model->where ( $where )->field ( "NAME,ID" )->select ();
		;
		$arr = array ();
		if ($result) {
			foreach ( $result as $key => $value ) {
				$arr [$key] ['text'] = $value ['name'];
				$arr [$key] ['value'] = $value ['id'];
			}
		}
		return $arr;
	}
	
	/**
	 * Description: getScenes
	 * Author: Jason
	 * Date:2015.09.25
	 */
	function getScenes() {
		$where = array (
				'STATUS' => 1,
				'TYPE' => 2 
		);
		$data = $this->model->where ( $where )->getField ( "ID as i,ID,NAME", '|' );
		$data = array_values ( $data );
		return $data;
	}
	/**
	 * 获取所有的商户
	 *
	 * @return \Think\mixed
	 */
	function getALLBusiness() {
		$business = $this->model->where ( "TYPE=1" )->select ();
		
		return $business;
	}
	function getoneBusiness($id) {
		$business = $this->model->where ( "TYPE=1 and ID=$id" )->select ();
		return $business;
	}
	// 各个标签下面的poi
	function getTag() {
		$join = "left join __POI_RELATION_TAG__ as b on a.id=b.tag_id left join __POI__ as c on b.poi_id=c.id";
		$field = "a.*,c.id as cid, c.name as cname,c.image,c.description,c.lat,c.lon, c.type,c.have_pano";
		$result = $this->tagmodel->alias ( 'a' )->join ( $join )->field ( $field )->where ( 'a.status=1  and c.type=2 and c.status=1 and c.id is not null' )->select ();
		// var_dump($result);die();
		$arr = array ();
		$arr2 = array ();
		foreach ( $result as $key => $val ) {
			
			$arr [$val ['name']] [] = $val;
		}
		$i = 0;
		foreach ( $arr as $k => $v ) {
			
			$arr2 [$i] ['name'] = $k;
			$arr2 [$i] ['data'] = $v;
			$i ++;
		}
		return $arr2;
	}
	function getPoiByClass() {
		$type = $_GET ['type'];
		$where=array();
		$where['STATUS']=1;
		if ($type) {
			$where ['TYPE'] = $type;
		}
		$result = $this->model->where ( $where )->select ();
		
		return $result;
	}
	function getNearPoi($poi_ids) {
		$where = array ();
		$where ['ID'] = array (
				'in',
				$poi_ids 
		);
		$pois = $this->model->where ( $where )->select ();
		$where = array ();
		$where ['TYPE'] = array (
				'in',
				"1,3" 
		);
		$near = array ();
		foreach ( $pois as $key => $value ) {
			$lng = $value ['lon']; // 经度
			$lat = $value ['lat']; // 纬度
			$dist = distance2degree ( $value ['lat'], 500 );
			
			$where ['LON'] = array (
					'BETWEEN',
					($lng - $dist ['lng_d']) . ',' . ($lng + $dist ['lng_d']) 
			);
			$where ['LAT'] = array (
					'BETWEEN',
					($lat - $dist ['lat_d']) . ',' . ($lat + $dist ['lat_d']) 
			);
			$near [$value ['id']] [] = $this->model->where ( $where )->select ();
		}
		
		$arr = array ();
		if ($near) {
			foreach ( $near as $key => $val ) {
				foreach ( $val [0] as $k => $v ) {
					
					$arr [$v ['id']] = $v;
				}
			}
		}
		return $arr;
	}
	function getGoodsPoi($name) {
		if ($name) {
			$where ["NAME"] = array (
					"like",
					"%" . $name . "%" 
			);
		}
		$where ['TYPE'] = 2;
		$field = "id,image,name";
		$poi = $this->model->where ( $where )->field ( $field )->order ( "power desc" )->limit ( 30 )->select ();
		return $poi;
	}
	/**
	 * Description: 获得poi点下的所有有文化文章的
	 * Author: ward
	 * Param:$poiId=>poi点id
	 * Date: 2015-12-02
	 */
	public function getPoiCulture($poiId, $panoKey) {
		//$field = ' d.ID,b.PANO_KEY,d.THUMB,d.EXCERPT,d.TITLE';
		$field = ' d.ID,d.THUMB,d.TITLE';
		$where ['a.ID'] = $poiId;
		$where ['c.TYPE'] = 5; // 类型为5的是文化类热点
		$where['c.STATUS']=1;//表示该热点已经发布
		$data = $this->model->alias ( 'a' )
			->join ( "LEFT JOIN __PANORAMA__  AS b ON a.ID = b.POI_ID" )
			->join ( "LEFT JOIN __PANORAMA_HOT__ AS c ON c.PANO_ID = b.ID" )
			->join ( "LEFT JOIN __CULTURE__ AS d ON c.CULTURE_ID=d.ID" )
			->where ( $where )->distinct(true)->field ( $field )->select ();
		//ward 2016-03-07  去除重复的文化文章
		if (empty ( $data ) || ! is_array ( $data )) {
			return $data;
		}
		$headArr = array ();
		$footArr = array ();
		foreach ( $data as $key => $val ) {
			if ($val ['pano_key'] == $panoKey) {
				$headArr [] = $val;
			} else {
				$footArr [] = $val;
			}
		}
		$data = array_merge ( $headArr, $footArr );
		
		return $data;
	}

	/**
	 * Description: getByKeyword 关键字搜索
	 * @param $keyword
	 * @return mixed
	 * Author: Jason
	 * Date:
	 */
	function getByKeyword($keyword)
	{
		$where['NAME']=array('like','%'.$keyword.'%');
		$where ['STATUS'] = 1;
		$data = $this->model->field(array('ID','NAME','ADDRESS','LAT','LON'))->where($where)->select();
		return $data;
	}


}
