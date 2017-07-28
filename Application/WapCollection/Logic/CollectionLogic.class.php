<?php

namespace WapCollection\Logic;

class CollectionLogic extends \Think\Model {
	function _initialize() {
		$this->model = new \Culture\Model\CollectionModel ();
		$this->culturemodel = new \Culture\Model\CultureModel ();
		$this->newmodel = new \Culture\Model\NewsModel ();
	}
	/**
	 * Description: 添加文化采集
	 * Author: bill
	 * Date:
	 */
	function addCollection() {
		if(!trim($_POST['TITLE']))
		{
			$this->setError('标题不能为空');
			return false;
		}
		if ($data = $this->model->create ( $_POST )) {
			$user = session ( 'culture' );
			if ($data ['MANY_IMAGE']) {
				$data ['MANY_IMAGE'] = json_encode ( $data ['MANY_IMAGE'] );
			}
			
			$data ['AUTHOR'] = $user ['account'];
			$data ['CREATE_TIME'] = toDate ( time () );
			$data ['UPDATE_TIME'] = toDate ( time () );
			$data ['FROM'] = 2;
			$res = $this->model->add ( $data );
			
			if (! $res) {
				echo $this->model->getError ();
				return false;
			}
			return $res;
		} else {
			$this->model->getError ();
			return false;
		}
	}
	
	/**
	 * Description: 编辑文化采集
	 * Author: bill
	 * Date:
	 */
	function saveCollection() {
		if ($data = $this->model->create ( I ( 'post.' ) )) {
			$data ['UPDATE_TIME'] = toDate ( time () );
			if ($data ['MANY_IMAGE']) {
				$data ['MANY_IMAGE'] = json_encode ( $data ['MANY_IMAGE'] );
			}
			$res = $this->model->save ( $data );
			
			if (! $res) {
				echo $this->model->getError ();
				return false;
			}
			return $res;
		} else {
			echo $this->model->getError ();
			return false;
		}
	}
	function getDetailCollection($id) {
		$where ['ID'] = $id;
		$collection = $this->model->where ( $where )->find ();
		return $collection;
	}
	function collection_delete() {
		$id = I ( 'ids' );
		$where ['ID'] = array (
				'in',
				$id 
		);
		$res = $this->model->where ( $where )->delete ();
		
		return $res;
	}
	function release() {
		$where ['ID'] = intval ( I ( 'put.id' ) );
		if (I ( 'put.unrel' ) == 0) {
			$data ['STATUS'] = 1;
		} else if (I ( 'put.unrel' ) == 2) {
			$data ['STATUS'] = 0;
		}
		$res = $this->model->where ( $where )->save ( $data );
		if (! $res) {
			echo $this->model->getError ();
			return false;
		}
		$data = array ();
		if (I ( 'put.unrel' ) == 0) {
			$arr = $this->model->where ( $where )->find ();
			if ($arr ['type'] == 2) {
				$data ['TITLE'] = $arr ['title'];
				$data ['CONTENT'] = $arr ['content'];
				$data ['CREATE_TIME'] = toDate ( time () );
				$data ['UPDATE_TIME'] = toDate ( time () );
				$data ['THUMB'] = $arr ['thumb'];
				$data ['AUTHOR'] = $arr ['author'];
				$data ['CATE_ID'] = $arr ['cate_id'];
				$this->culturemodel->add ( $data );
			} elseif ($arr ['type'] == 1) {
				$data ['TITLE'] = $arr ['title'];
				$data ['CONTENT'] = $arr ['content'];
				$data ['THUMBNAILS'] = $arr ['thumb'];
				$data ['DATATIME'] = date ( "Y-m-d H:i:s" );
				$data ['WRITER'] = $arr ['author'];
				$data ['CATE_ID'] = $arr ['cate_id'];
				$this->newmodel->add ( $data );
			}
		}
		
		return $res;
	}
	
	/**
	 * Description: 后台文化采集list
	 * Author: Jason
	 * Date:
	 */
	public function getListForJson() {
		$field = '*';
		$where = array ();
		$name = I ( 'name' );
		$status = I ( 'status' );
		if ($status != 100) {
			$where ['STATUS'] = $status;
		}
		if ($name) {
			$where ['TITLE'] = array (
					"like",
					"%" . $name . "%" 
			);
		}
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->where ( $where )->field ( $field )->limit ( $start . ',' . $length )->select ();
		
		$count = $this->model->where ( $where )->field ( $field )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	/**
	 * 采集列表
	 * 
	 * @param unknown $type        	
	 * @return \Think\mixed
	 */
	function CollectionList($type) {
		if ($type) {
			$where ['TYPE'] = $type;
		}
		$result = $this->model->where ( $where )->order('ID DESC')->select ();
		return $result;
	}
}
