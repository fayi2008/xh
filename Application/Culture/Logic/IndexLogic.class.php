<?php

namespace Culture\Logic;

class IndexLogic extends \Think\Model {
	protected $model;
	public function _initialize() {
		$this->model = new \Culture\Model\CultureModel ();
		$this->categorymodel = new \Culture\Model\CultureCategoryModel ();
		$this->culturecategoryattrmodel = new \Culture\Model\CultureCategoryAttrModel ();
	}
	
	/**
	 * Description: 后台文化list
	 * Author: Jason
	 * Date:
	 */
	public function culture_search($cate_id, $name) {
		$field = 'A.*,B.NAME as bname';
		$where = array ();
		$where ['A.STATUS'] = 1;
		$where ['A.DEL'] = 1;
		if ($cate_id) {
			$category = $this->categorymodel->where ( "PARENTID=$cate_id" )->field ( "ID" )->select ();
			if ($category) {
				foreach ( $category as $key => $val ) {
					$arr [] = $val ['id'];
				}
			}
			$arr [] = $cate_id;
			$where ['A.CATE_ID'] = array (
					'in',
					$arr 
			);
		}
		if ($name) {
			$where ['A.TITLE'] = array (
					"like",
					"%" . $name . "%" 
			);
			;
		}
		
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$join = " LEFT JOIN __CULTURE_CATEGORY__ B ON A.CATE_ID=B.ID ";
		$list = $this->model->alias ( 'A' )->join ( $join )->where ( $where )->field ( $field )->limit ( $start . ',' . $length )->select ();
		
		$count = $this->model->alias ( 'A' )->join ( $join )->where ( $where )->field ( $field )->count ();
		$reslut ['data'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * 获取文化详情
	 *
	 * @param unknown $id        	
	 */
	function getDetailCulture($id = '', $title = '') {
		if ($id) {
			$where ['A.ID'] = $id;
		}
		if ($title) {
			$where ['A.TITLE'] = array (
					'like',
					"%" . $title . "%" 
			);
		}
		$join = "left join __CULTURE_CATEGORY__ AS B on A.CATE_ID=B.ID";
		$field = "A.*,B.NAME as bname";
		$res = $this->model->alias ( "A" )->join ( $join )->where ( $where )->field ( $field )->find ();
		$res ['relation'] = $this->relation_culture ( $res ['relation_culture'], $res ['cate_id'], $res ['id'] );
		$this->model->where ( "ID=$id" )->setInc ( 'CLICK', 1 );
		return $res;
	}
	public function get_class() {
		$data = $this->categorymodel->where ( array (
				'STATUS' => 1,
				'PARENTID' => 0 
		) )->order ( 'LISTORDER DESC' )->select ();
		
		return $data;
	}
	
	// 相关新闻
	public function relation_culture($relation_culture = '', $cate_id = '', $id = '') {
		$arr = array ();
		if ($relation_culture) {
			$where = array ();
			$where ['STATUS'] = 1;
			$where ['DEL'] = 1;
			if ($id) {
				$where ['ID'] = array (
						"neq",
						$id 
				);
			}
			$where ['_string'] = '';
			$relation_culture = explode ( ";", $relation_culture );
			foreach ( $relation_culture as $key => $value ) {
				$where ['_string'] .= "TITLE like '%$value%' OR  ";
			}
			if ($where ['_string'] != '') {
				$where ['_string'] = substr ( $where ['_string'], 0, strlen ( $where ['_string'] ) - 4 );
			} else {
				unset ( $where ['_string'] );
			}
			$res = $this->model->where ( $where )->field ( 'ID,TITLE' )->select ();
			if (! $res) {
				$where = array ();
				$where ['CATE_ID'] = $cate_id;
				$where ['STATUS'] = 1;
				$where ['DEL'] = 1;
				if ($id) {
					$where ['id'] = array (
							'neq',
							$id 
					);
				}
				$res = $this->model->where ( $where )->field ( 'ID,TITLE' )->limit ( 10 )->select ();
			}
			
			return $res;
		} else {
			$where = array ();
			$where ['CATE_ID'] = $cate_id;
			$where ['STATUS'] = 1;
			$where ['DEL'] = 1;
			if ($id) {
				$where ['id'] = array (
						'neq',
						$id 
				);
			}
			$res = $this->model->where ( $where )->field ( 'ID,TITLE' )->limit ( 10 )->select ();
			
			return $res;
		}
	}
}