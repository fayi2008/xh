<?php

namespace Merchant\Logic;

class PoiLogic extends \Think\Model {
	function _initialize() {
		$this->model = new \Gis\Model\PoiModel ();
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
			$data ['TYPE'] = 1;
			if($data['MANY_IMAGE']){
				$data['MANY_IMAGE']=json_encode($data['MANY_IMAGE']);
			}
			$res = $this->model->add ( $data );
			AdminLog ( $res, 1, json_encode ( $data ), "添加商户" );
			if (! $res) {
				echo $this->model->getDbError ();
				return false;
			}
			
		
			
			return $res;
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
		
		if ($data = $this->model->create ( I('put.') )) {
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
			}else{
				$data ['TAG_IDS'] = '';
			}
			$data ['TYPE'] = 1;
			if($data['MANY_IMAGE']){
				$data['MANY_IMAGE']=json_encode($data['MANY_IMAGE']);
			}else{
				$data['MANY_IMAGE']=json_encode(array());
			}
			$res = $this->model->save ( $data );
			
			AdminLog ( $data ['ID'], 2, json_encode ( $data ), "编辑商户" );
			
			if ($res===false) {
				echo $this->model->getError ();
				return false;
			}
			return true;
		} else {
			echo $this->model->getError ();
			return false;
		}
	}
	// poi点list
	function getlist($selectArr) {
		$where = array ();
        if(isset($selectArr['name'])&&$selectArr['name'])
        {
            $where ['NAME'] = array (
                "like",
                "%" . $selectArr['name'] . "%"
            );
        }
		if (I ( 'status' ) != 100) {
			$where ['STATUS'] = I ( 'status' );
		}
		if (I ( 'tag' ) != '') {
			$where ['TAG_IDS'] = intval(I ( 'tag' ));
		}

		$where ['TYPE'] = 1;
		$field = array (
				'ID,NAME,LAT,LON,ADDRESS,TAG_IDS,STATUS,POWER,RECOMMEND'
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		//排序条件
		$order='';
		if(!empty($selectArr['field'])){
			$order=''.strtoupper($selectArr['field']).' '.$selectArr['direction'].',';
		}
		if($selectArr['field']!=='id'){
			$order.=' ID DESC';
		}
		$order=rtrim($order,',');
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( $order )->select ();
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}

	function getBusinessList() {
		$where = array ();
		
		$where ['STATUS'] = 1;
		$where ['TYPE'] = 1;
		$field = array (
				'ID,NAME,LAT,LON,ADDRESS,STATUS,POWER,IMAGE,PHONE,PANO_KEY,RECOMMEND'
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		
		if (! $length) {
			$length = 10;
		}
		if (! $start) {
			$start = 0;
		}
		$tag = I ( 'tag' );
		if ($tag) {
			$where ['TAG_IDS'] = array (
					"like",
					"%" . $tag . "%" 
			);
		}
		$order = "RECOMMEND DESC,power desc";
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
		AdminLog ( $where ['ID'], 3, '', "删除商户" );
		
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
		if (I ( 'put.unrel' ) == 0) {
			$data ['STATUS'] = 1;
			AdminLog ( $where ['ID'], 4, '', "发布商户" );
		} else {
			$data ['STATUS'] = 0;
			AdminLog ( $where ['ID'], 5, '', "取消发布商户" );
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
}
