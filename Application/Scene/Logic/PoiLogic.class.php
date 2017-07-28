<?php

namespace Scene\Logic;

class PoiLogic extends \Think\Model {
	function _initialize() {
		$this->model = new \Gis\Model\PoiModel ();
		$this->areaModel = new \Common\Model\AreaModel ();
		$this->relationModel = new \Gis\Model\RelationModel ();
		$this->wayPoiModel = new \Scene\Model\WayPoiModel ();
	}
	/**
	 * Description: 添加poi点
	 * Author: bill
	 * Date:
	 */
	function addPoi() {
		if ($data = $this->model->create ( $_POST )) {
			
			if ($data ['TAG_IDS']) {
				$data ['TAG_IDS'] = implode ( ",", $data ['TAG_IDS'] );
			} else {
				$data ['TAG_IDS'] = '';
			}
			$data ['TYPE'] = 2;
			$res = $this->model->add ( $data );
			AdminLog ( $res, 1, json_encode ( $data ), "添加POI点" );
			if ($data ['TYPE'] == '2') {
				$tagArr = $_POST ['TAG_IDS'];
				$datas = array ();
				if (empty ( $tagArr )) {
					return $res;
				} elseif (is_string ( $tagArr )) {
					$datas [] = array (
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
				if ($datas) {
					$this->relationModel->addAll ( $datas ); // 添加新的关系
				}
			}
			if (! $res) {
				echo $this->model->getDbError ();
				return false;
			}
			if ($data2 = $this->wayPoiModel->create ( $_POST )) {
				$data2 ['POI_ID'] = $res;
				$res2 = $this->wayPoiModel->add ( $data2 );
				AdminLog ( $res2, 1, json_encode ( $data ), "添加POI点" );
			}
			
			if (! $res2) {
				echo $this->wayPoiModel->getDbError ();
				return false;
			}
			return true;
		} else {
			$this->model->getError ();
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
			if ($data ['TAG_IDS']) {
				$data ['TAG_IDS'] = implode ( ",", $data ['TAG_IDS'] );
			} else {
				$data ['TAG_IDS'] = '';
			}
			
			$data ['TYPE'] = 2;
			$res = $this->model->save ( $data );
			AdminLog ( $data ['ID'], 2, json_encode ( $data ), "编辑POI点" );
			
			if ($data ['TYPE'] == '2') {
				$tagArr = I ( 'put.TAG_IDS' );
				$infoId = intval ( I ( 'put.ID' ) );
				$where ['POI_ID'] = $infoId;
				$this->relationModel->where ( $where )->delete (); // 删除原来就的关系
				                                                   // echo $this->relationModel->getLastSql();die();
				$datas = array ();
				if (empty ( $tagArr )) {
					
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
				if ($datas) {
					$this->relationModel->addAll ( $datas ); // 添加新的关系
				}
			}

			if ($res === false) {
				$this->setError($this->model->getError ());
				return false;
			}
			$bid = I ( 'BID' );
			$data2 = $this->wayPoiModel->create ( I ( 'put.' ) );
			if(!$data2['PRICE'])
			{
				$data2['PRICE']=0;
			}
			if ($bid) {
				$data2 ['ID'] = $bid;
				$res2 = $this->wayPoiModel->save ( $data2 );
				AdminLog ( $bid, 2, json_encode ( $data ), "编辑POI点" );
			} else {
				$data2 ['POI_ID'] = $data ['ID'];
				unset ( $data2 ['ID'] );
				$res2 = $this->wayPoiModel->add ( $data2 );
				AdminLog ( $res2, 1, json_encode ( $data ), "添加POI点" );
			}
			if ($res2 === false) {
				$this->setError($this->model->getError ());
				return false;
			}
			
			return true;
		} else {

			$this->setError($this->model->getError ());
			return false;
		}
	}
	// poi点list
	function getlist() {
		$selectArr=$_GET;
		$where = array ();
		$where ['NAME'] = array (
				"like",
				"%" . I ( 'name' ) . "%" 
		);
		if (I ( 'status' ) != 100) {
			$where ['STATUS'] = I ( 'status' );
		}
		$where ['TYPE'] = 2;
		$field = array (
				'ID,NAME,LAT,LON,ADDRESS,STATUS,POWER' 
		);
		//排序条件
		$order='';
		if(!empty($selectArr['field'])){
			$order=''.strtoupper($selectArr['field']).' '.$selectArr['direction'].',';
		}
		if($selectArr['field']!=='id'){
			$order.=' ID DESC';
		}
		$order=rtrim($order,',');
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( $order )->select ();
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	function getPoiDetail($id) {
		$where ['A.ID'] = $id;
		$field = "a.*,b.ID as bid,b.WASTER_TIME,b.MIN_TIME,b.CONTENT,b.PRICE,b.MAX_TIME";
		$join = "left join __WAY_POI__ as b on a.ID=b.POI_ID";
		$poi = $this->model->alias ( 'a' )->join ( $join )->field ( $field )->where ( $where )->find ();
		return $poi;
	}
	function poi_delete() {
		$id = I ( 'ids' );
		$where ['ID'] = array (
				'in',
				$id 
		);
		$res = $this->model->where ( $where )->delete ();
		AdminLog ( $id, 3, '', "删除POI点" );
		return $res;
	}
	
	/**
	 * Description: 获得所有poi点
	 * Author: bill
	 * Date:
	 */
	function getALLpoi() {
		$poi = $this->model->select ();
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
		} else {
			$data ['STATUS'] = 1;
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
	function searchScene($name) {
		$where = array (
				'a.STATUS' => 1,
				'a.TYPE' => 2 
		);
		if ($name) {
			$where ['a.NAME'] = $name;
		} elseif ($id) {
			$where ['a.ID'] = $id;
		}
		$field = "b.*";
		$join = "left join __WAY_POI__  as b on a.id=b.poi_id";
		$data = $this->model->alias ( 'a' )->join ( $join )->where ( $where )->field ( $field )->find ();
		
		return $data;
	}
}
