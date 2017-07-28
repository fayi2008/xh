<?php

namespace Culture\Logic;

class NewsCateLogic extends \Think\Model {
	protected $model;
	public function _initialize() {
		$this->cate = new \Culture\Model\NewsCategoryModel ();
	}
	public function getLists() {
		// $this->model=new \Preferen\Model\PreferenModel();
		$where = array ();
		$where ['NAME'] = array (
				"like",
				"%" . I ( 'title' ) . "%" 
		);
		$where ['STATUS'] = array (
				'neq',
				0 
		);
		
		/*
		 * $where['ID'] = array(
		 * 'in',
		 * '25,28,29'
		 * );
		 */
		
		$field = array (
				'ID,NAME,TYPE,HINT,LISTORDER',
				'DEFAULT',
				'IS_NEED' 
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->select ();
		// echo $this->model->getLastSql();
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	
	
	
	
	// 得到类目id
	public function getcateid() {
		$where ['ATTRID'] = intval ( $_GET ['id'] );
		$field = 'categoryid';
		$data = $this->attrcate->where ( $where )->field ( $field )->find ();
		return $data;
	}
	
	
	
	
	
	/**
	 * Description: 删除文化要素信息（后台）
	 * Author: ward
	 * Date:
	 */
	public function delete() {
		$id = I ( 'ids' );
		
		$where ['ID'] = array (
				'in',
				$id 
		);
		$where1 ['ATTRID'] = array (
				'in',
				$id 
		);
		
		$res = $this->model->where ( $where )->delete ();
		$res1 = $this->attrcate->where ( $where1 )->delete ();
		if (false === $res || false === $res1) {
			return false;
		} else {
			return $res;
		}
	}
	

	
	// 文化类别
	public function categetLists() {
		$where = array ();
		$where ['NAME'] = array (
				"like",
				"%" . I ( 'title' ) . "%" 
		);
		$field = array (
				'ID,NAME,LISTORDER,REMARK' 
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->cate->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->select ();
		// echo $this->model->getLastSql();
		$count = $this->cate->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * Description: 添加文化要素信息（后台）
	 * Author: ward
	 * Date:
	 */
	public function cateadd() {
		$data = $this->cate->create ();
		if ($data) {
			$res = $this->cate->add ( $data );
			AdminLog($res, 1, json_encode($data), "添加资讯分类");
			return 1;
		} else {
			return false;
		}
	}
	
	/**
	 * Description: 文化要素信息详情（后台）
	 * Author: ward
	 * Date:
	 */
	public function categetOne() {
		$where ['ID'] = intval ( I ( 'id' ) ); // 信息id
		$field = '*';
		$data = $this->cate->where ( $where )->field ( $field )->find ();
		return $data;
	}
	
	/**
	 * Description: 编辑文化类目信息（后台）
	 * Author: mark
	 * Date:
	 */
	public function cateedit() {
		if ($data = $this->cate->create ( I ( 'put.' ) )) {
			$res = $this->cate->save ( $data );
			AdminLog($data['ID'], 1, json_encode($data), "编辑资讯分类");
			return $res;
		} else {
			return false;
		}
	}
	
	/**
	 * Description: 删除文化类目信息（后台）
	 * Author: mark
	 * Date:
	 */
	public function catedelete() {
		$id = I ( 'cid' );
		$where ['ID'] = $id;
		$where ['PARENTSID'] = $id;
		
		$res = $this->cate->where ( $where )->delete ();
			AdminLog($id, 3, '', "删除资讯分类");
		if (false === $res) {
			return false;
		} else {
			return $res;
		}
	}
	public function getCategorySelect() {
		$field = array (
				'ID,NAME' 
		);
		$where ['PARENTID'] = 0;
		$data = $this->cate->where ( $where )->field ( $field )->select ();
		return $data;
	}
	// 给类目添加要素
	public function getAddLists() {
		$where2 ['CATEGORYID'] = intval ( I ( "cid" ) );
		$attrid2 = $this->attrcate->field ( 'attrid' )->where ( $where2 )->select ();
		$aid2 = array ();
		foreach ( $attrid2 as $k => $v ) {
			$aid2 [$k] = $v ['attrid'];
		}
		$field = array (
				'ID,NAME,TYPE,HINT,LISTORDER',
				'DEFAULT',
				'IS_NEED' 
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		
		if (! empty ( $aid2 )) {
			$where3 = array ();
			$where3 ['ID'] = array (
					'not in',
					$aid2 
			);
			
			$list = $this->model->field ( $field )->where ( $where3 )->limit ( $start . ',' . $length )->select ();
			$count = $this->model->field ( $field )->where ( $where3 )->count ();
		} else {
			
			$list = $this->model->field ( $field )->limit ( $start . ',' . $length )->select ();
			$count = $this->model->field ( $field )->count ();
		}
		
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/*
	 * Description: 要素插入关联表
	 * Author: mark
	 * Date:
	 */
	public function cateattradd() {
		$aid = I ( 'id' );
		$cid = I ( 'cid' );
		if (empty ( $aid )) {
			return false;
		} else {
			$where4 ['ID'] = $cid;
			$r = $this->cate->where ( $where4 )->getField ( 'PARENTID' );
			if ($r != 0) {
				$data ['CATEGORYID'] = $cid;
				$data ['ATTRID'] = $aid;
				$where ['ATTRID'] = $aid;
				$where ['CATEGORYID'] = $cid;
				$r = $this->attrcate->where ( $where )->find ();
				if (! empty ( $r )) {
					$this->attrcate->where ( $where )->delete ();
				}
				$res = $this->attrcate->add ( $data );
			} else {
				$where2 ['PARENTID'] = $cid;
				$pt = $this->cate->field ( 'ID' )->where ( $where2 )->select ();
				
				if (! empty ( $pt )) {
					foreach ( $pt as $v ) {
						$where3 ['CATEGORYID'] = $v ['id'];
						$where3 ['ATTRID'] = $aid;
						$data2 ['CATEGORYID'] = $v ['id'];
						$data2 ['ATTRID'] = $aid;
						$re = $this->attrcate->where ( $where3 )->getField ( 'ID' );
						if (! empty ( $re )) {
							$this->attrcate->where ( $where3 )->delete ();
						}
						$res = $this->attrcate->add ( $data2 );
						if (false === $res) {
							return false;
							break;
						}
					}
					$where5 ['CATEGORYID'] = $cid;
					$where5 ['ATTRID'] = $aid;
					$data3 ['CATEGORYID'] = $cid;
					$data3 ['ATTRID'] = $aid;
					$old = $this->attrcate->where ( $where5 )->getField ( 'ID' );
					if (! empty ( $old )) {
						$this->attrcate->where ( $where5 )->delete ();
					}
					$this->attrcate->add ( $data3 );
				} else {
					$data ['CATEGORYID'] = $cid;
					$data ['ATTRID'] = $aid;
					$where ['ATTRID'] = $aid;
					$where ['CATEGORYID'] = $cid;
					$r = $this->attrcate->where ( $where )->find ();
					if (! empty ( $r )) {
						$this->attrcate->where ( $where )->delete ();
					}
					$res = $this->attrcate->add ( $data );
				}
			}
			if (false === $res) {
				return false;
			} else {
				return $res;
			}
		}
	}
	public function getattr() {
		$aid = I ( 'id' );
		$title = I ( 'title' );
		if (! empty ( $aid )) {
			$where ['ID'] = $aid;
			$field = array (
					'ID,NAME,TYPE' 
			);
			$res = $this->model->field ( $field )->where ( $where )->find ();
			if (empty ( $res )) {
				return false;
			} else {
				return $res;
			}
		} elseif (! empty ( $title )) {
			$where ['NAME'] = $title;
			$field = array (
					'ID,NAME,TYPE' 
			);
			$res = $this->model->field ( $field )->where ( $where )->find ();
			if (empty ( $res )) {
				return false;
			} else {
				return $res;
			}
		} elseif (empty ( $aid ) && empty ( $title )) {
			return false;
		}
	}
	public function attr_delete() {
		$id = I ( 'ids' );
		$cid = I ( 'cid' );
		$where1 ['ATTRID'] = array (
				'in',
				$id 
		);
		$where1 ['CATEGORYID'] = $cid;
		
		$res1 = $this->attrcate->where ( $where1 )->delete ();
		if (false === $res1) {
			return false;
		} else {
			return $res;
		}
	}
	public function category_list() {
		/* $data=F('CATEGORY_LIST'); */
		/* if(!$data) { */
		$data = $this->get_tree ( 0 ); // 得到树
		$data = $this->clear_key ( $data );
		$data = json_encode ( $data, JSON_UNESCAPED_UNICODE );
		
		/* F('CATEGORY_LIST',$data); */
		/* } */
		return $data;
	}
	public function get_tree($myid, $data = '') {
		if (! $data) {
			$data = $this->get_cache ();
		}
		$tree = new \Common\Lib\Util\Tree ();
		$tree->init ( $data );
		$res = $tree->get_tree_array ( $myid );
		return $res;
	}
	function clear_key($arr) {
		$res = array_values ( $arr );
		foreach ( $res as $key => $value ) {
			if ($value ['children']) {
				$res [$key] ['children'] = $this->clear_key ( $value ['children'] );
			}
		}
		return $res;
	}
	
	/**
	 * Description: get_cache 获取缓存
	 * 
	 * @return mixed Author: mark
	 *         Date:
	 */
	public function get_cache() {
		/*
		 * $category=F('CATEGORY');
		 * if($category)
		 * {
		 * return $category;
		 * }else{
		 */
		/* $where['PARENTID']= 0; */
		$data = $this->cate->order ( 'LISTORDER DESC' )->getField ( 'ID,NAME,REMARK,LISTORDER,PARENTID' );
		F ( "CATEGORY", $data );
		return $data;
		/* } */
	}
	function putCate($order, $id) {
		/* $where['id']=$id; */
		$data = array (
				'LISTORDER' => $order 
		);
		$res = $this->cate->where ( array (
				"ID" => $id 
		) )->save ( $data );
		
		if ($res !== false) {
			$res = array (
					'success' => true 
			);
		} else {
			$res = array (
					'success' => false,
					'msg' => "更新排序失败" 
			);
		}
		return $res;
	}
	
	function NewsCate(){
		$arr=$this->cate->select();
		$res=$this->_findChildren($arr,0);
		return $res;
	}
	
	function _findChildren($list, $p_id){    //数据层级化，
		$r = array();
		foreach($list as $id=>$item){
			if($item['parentid'] == $p_id) {
				$length = count($r);
				$r[$length] = $item;
				if($t = $this->_findChildren($list, $item['id']) ){
					$r[$length]['children'] = $t;
				}
			}
		}
		return $r;
	}
	

}