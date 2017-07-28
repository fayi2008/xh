<?php

namespace Business\Logic;

class GoodsLogic extends \Think\Model {
	function _initialize() {
		$this->model = new \Business\Model\GoodsModel ();
		$this->tagmodel = new \Gis\Model\TagModel ();
		$this->areaModel = new \Common\Model\AreaModel ();
		$this->relationModel = new \Gis\Model\RelationModel ();
	}
	
	
	
	// 商品list
	function getlist() {
		$selectArr = $_GET;
		$where = array ();
		$where ['a.NAME'] = array (
				"like",
				"%" . I ( 'name' ) . "%" 
		);
		if (I ( 'show' ) != 100) {
			$where ['a.SHOW'] = I ( 'show' );
		}
		if(I ( 'is_promotion' ) == 1)
		{
			$where ['a.IS_PROMOTION'] = 1;
		}

		$user = session ( 'business' );
		$where['a.POI_ID']=$user['poi_id'];
		$field = array (
				'a.*, b.name as bname' 
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
		$join="left join __GOODS_CATE__ as b on a.class_id=b.id";
		$list = $this->model->alias('a')->join($join)->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( $order )->select ();
		foreach ($list  as $key=>$value){
			$list[$key]['surplus_num']=$value['total_num']-$value['sold_num'];
		}
		$count = $this->model->alias('a')->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	function getPoiDetail($id) {
		$where ['ID'] = $id;
		$poi = $this->model->where ( $where )->find ();
		
		return $poi;
	}
	function goods_delete() {
		$id = I ( 'ids' );
		$where ['ID'] = array (
				'in',
				$id 
		);
		$res = $this->model->where ( $where )->delete ();
		AdminLog($id, 3, '', "删除商品");
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
	function releaseGood() {
		$where ['ID'] = intval ( I ( 'put.id' ) );
		if (I ( 'put.unrel' )) {
			$data ['SHOW'] = 0;
			AdminLog($where ['ID'], 8, '', "商品下架");
		} else {
			$data ['SHOW'] = 1;
			AdminLog($where ['ID'], 7, '', "商品上架");
		}
		$res = $this->model->where ( $where )->save ( $data );
		if (! $res) {
			echo $this->model->getError ();
			return false;
		}
		return $res;
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
		$field = "a.*,c.id as cid, c.name as cname ";
		$result = $this->tagmodel->alias ( 'a' )->join ( $join )->field ( $field )->select ();
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
		$result = $this->model->where ( "type=$type" )->select ();
		return $result;
	}
	
	/**
	 * Description: addgoods
	 *
	 * @param
	 *        	$data
	 * @return array Author: liuzhaojun
	 *         Date:
	 */
	function addGoods($data) {
		if ($data=$this->model->create ( $data )) {
			$user = session ( 'business' );
			
			$data ['POI_ID'] = $user ['poi_id'];
			$res = $this->model->add ( $data );
			AdminLog($res, 1, json_encode($data), "添加商品");
			if ($res !== false) {
				$res = array (
						'success' => true 
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
	 * Description: edit商品
	 *
	 * @param
	 *        	$data
	 * @return array Author: liuzhaojun
	 *         Date:
	 */
	function editGoods($data) {
		if ($data=$this->model->create ( $data )) {
			$res = $this->model->save ( $data );
			AdminLog($data['ID'], 2, json_encode($data), "编辑商品");
			if ($res !== false) {
				$res = array (
						'success' => true 
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
	
	/**
	 * Description: 获取商品详情
	 *
	 * @param
	 *        	$id 商品id
	 * @return array Author: liuzhaojun
	 *         Date:
	 */
	function getDetailGoods($id) {
		$goods=$this->model->where("id=$id")->find();
		if($goods){
			$goods['description']=html_entity_decode($goods['description']);
			$goods ['relation'] = $this->relation_culture ( $goods ['keywords']);
		}
		return $goods;
		
	}
	function getGoodsByCate( $poi_id) {
		$where = array ();
		$join="left join __GOODS_CATE__ as b on a.CLASS_ID=B.ID";
		if ($poi_id) {
			$where ['A.POI_ID'] = $poi_id;
			$where['A.SHOW']=1;
		}
		$goods = $this->model->alias("A")->join($join)->where ( $where )->field("A.*,B.NAME AS class_name")->select ();
		foreach($goods as $k=>$good)
		{
			unset($good['description']);
			$goods[$k]=$good;
		}
		return $goods;
	}

	/**
	 * Description:click 点击
	 * @param $id
	 * Author:jason
	 */
	function click($id)
	{
		$this->model->where ( "ID=$id" )->setInc ( 'CLICK', 1 );
	}

	/**
	 * Description:relation_culture 获取相关文化
	 * @param $keywords
	 * Author:jason
	 */
	function relation_culture($keywords)
	{
		$culture_model=new \Culture\Model\CultureModel();
		$culture_keys = explode ( ";", $keywords );
		$where ['_string']='';
		foreach($culture_keys as $value)
		{
			$where ['_string'] .= "TITLE like '%$value%' OR  ";
		}
		if ($where ['_string'] != '') {
			$where ['_string'] = substr ( $where ['_string'], 0, strlen ( $where ['_string'] ) - 4 );
		} else {
			unset ( $where ['_string'] );
		}
		$res = $culture_model->where ( $where )->field ( 'ID,TITLE' )->select ();
		return $res;
	}

}
