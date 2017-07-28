<?php

namespace Culture\Logic;

class CultureAttrLogic extends \Think\Model {
	protected $model;
	public function _initialize() {
		$this->model = new \Culture\Model\CultureAttrModel ();
		$this->cate = new \Culture\Model\CultureCategoryModel ();
		$this->attrcate = new \Culture\Model\CultureCategoryAttrModel ();
		$this->group = new \Culture\Model\GroupModel ();
		$this->attrlog = new \Culture\Model\AttrLogModel ();
	}
	public function getLists() {
		// $this->model=new \Preferen\Model\PreferenModel();
		$where = array ();
		if(I ( 'name' )){
		$where ['a.NAME'] = array (
				"like",
				"%" . I ( 'name' ) . "%" 
		);
		}
// 		$where ['a.STATUS'] = array (
// 				'neq',
// 				0 
// 		);

		if(I('GROUP_ID')!=1000){
			$where['a.GROUP_ID']=I('GROUP_ID');
		}
		
		/*
		 * $where['ID'] = array(
		 * 'in',
		 * '25,28,29'
		 * );
		 */
		if (C ( 'DB_TYPE' ) == 'mysql') {
			$field = array (
					'a.ID',
					'a.NAME',
					'a.TYPE',
					'a.HINT',
					'a.LISTORDER',
					
					'a.IS_NEED',
					'a.VER' ,
					'b.NAME as bname'
			);
		} else {
			$field = array (
					'a.ID',
					'a.NAME',
					'a.TYPE',
					'a.HINT',
					'a.LISTORDER',
					
					'a.IS_NEED',
					'a.VER',
					'b.NAME as bname' 
			);
		}
		
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$join = " LEFT JOIN __CULTURE_GROUP__ b ON a.GROUP_ID=b.ID ";
		$list = $this->model->alias('a')->join($join)->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( "ID DESC" )->select ();
		$count = $this->model->alias('a')->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * Description: 得到要素信息
	 * Author: mark
	 * Date:
	 */
	public function getattrlist() {
		$where = array ();
		if (I ( 'title' )) {
			$where ['NAME'] = array (
					"like",
					"%" . I ( 'title' ) . "%" 
			);
		}
		$where ['STATUS'] = array (
				'neq',
				0 
		);
		
		$field = array (
				'ID,NAME,TYPE,HINT,LISTORDER',
				'`DEFAULT`',
				'IS_NEED',
				'VER' 
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->select ();
		return $list;
	}

	/**
	 * Description:getAllAttrs 获取所有的要素信息
	 * @return mixed
	 * Author:jason
	 */
	function getAllAttrs()
	{
		$list = $this->model->select ();
		return $list;
	}
	
	/**
	 * Description: 添加文化要素信息（后台）
	 * Author: ward
	 * Date:
	 */
	public function add() {
		$data = $this->model->create ();
		$type = $data ['TYPE'];
		$name = $data ['NAME'];
		
		$reslut = $this->model->where ( "TYPE=$type and NAME='$name'" )->find ();
		if ($reslut) {
			$where ['TYPE'] = $type;
			$where ['NAME'] = $name;
			$this->model->where ( $where )->delete ();
			// echo $this->model->getLastSql();die();
		}
		if ($data) {
			$res = $this->model->add ( $data );
			$data ['UPDATETIME'] = date ( 'y-m-d h:i:s', time () );
			$data ['ATTRID'] = $res;
			$r = $this->attrlog->add ( $data );
			if ($res) {
				AdminLog ( $res, 1, json_encode ( $data ), "添加文化要素" );
				return $res;
			}
		} else {
			return false;
		}
	}
	
	/**
	 * Description: 文化要素信息详情（后台）
	 * Author: ward
	 * Date:
	 */
	public function getOne() {
		$where ['ID'] = intval ( $_GET ['id'] ); // 信息id
		$field = '*';
		$data = $this->model->where ( $where )->field ( $field )->find ();
		return $data;
	}
	
	// 得到类目id
	public function getcateid() {
		$where ['ATTRID'] = intval ( $_GET ['id'] );
		$field = 'categoryid';
		$data = $this->attrcate->where ( $where )->field ( $field )->find ();
		return $data;
	}
	
	/**
	 * Description: 编辑文化信息（后台）
	 * Author: ward
	 * Date:
	 */
	public function edit() {
		$name = I ( 'NAME' );
		
		if (empty ( $name )) {
			$name = 'namempty';
			return $name;
		}
		
		if ($data = $this->model->create ( I ( 'put.' ) )) {
			if (array_key_exists ( 'IS_NEED', $data )) {
				$data ['IS_NEED'] = "1";
			} else {
				$data ['IS_NEED'] = '0';
			}
			
			if ($data ['VER'] == 'new') {
				$where6 ['ATTRID'] = $data ['ID'];
				$ver = $this->attrlog->where ( $where6 )->max ( 'VER' );
				$data ['VER'] = $ver + 0.1;
				$res = $this->model->save ( $data );
				$data ['ATTRID'] = $data ['ID'];
				unset ( $data ['ID'] );
				$data ['UPDATETIME'] = date ( 'y-m-d h:i:s', time () );
				$r = $this->attrlog->add ( $data );
			} else {
				$newattr = array ();
				$data ['UPDATETIME'] = date ( 'y-m-d h:i:s', time () );
				$data ['ATTRID'] = $data ['ID'];
				unset ( $data ['ID'] );
				$where ['ATTRID'] = $data ['ATTRID'];
				$where ['VER'] = $data ['VER'];
				$r = $this->attrlog->where ( $where )->save ( $data );
				$attr = $this->attrlog->where ( $where )->find ();
				$newattr ['ID'] = $attr ['attrid'];
				$newattr ['NAME'] = $attr ['name'];
				$newattr ['TYPE'] = $attr ['type'];
				$newattr ['LISTORDER'] = $attr ['listorder'];
				$newattr ['GROUP_ID'] = $attr ['group_id'];
				$newattr ['DEFAULT'] = $attr ['default'];
				$newattr ['IS_NEED'] = $attr ['is_need'];
				$newattr ['VER'] = $attr ['ver'];
				$newattr ['HINT'] = $attr ['hint'];
				$res = $this->model->save ( $newattr );
			}
			
			return $res;
		} else {
			return false;
		}
	}
	
	// 修改关联表
	public function cateattredit($cateid, $attrid) {
		$where ['ATTRID'] = $attrid;
		$data ['CATEGORYID'] = $cateid;
		$res = $this->attrcate->where ( $where )->save ( $data );
		if (false === $res) {
			return false;
		} else {
			return $res;
		}
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
		AdminLog ( $id, 3, '', "删除文化要素" );
		$res1 = $this->attrcate->where ( $where1 )->delete ();
		$res2 = $this->attrlog->where ( $where1 )->delete ();
		if (false === $res || false === $res1 || false === $res2) {
			return false;
		} else {
			return $res;
		}
	}
	
	// 提取同类目所有要素
	public function getCateAttrArray() {
		$where1 ['CATEGORYID'] = intval ( I ( 'cid' ) );
		$where = array ();
		$attrid = $this->attrcate->field ( 'attrid' )->where ( $where1 )->select ();
		$aid = array ();
		if ($attrid) {
			foreach ( $attrid as $k => $v ) {
				$aid [$k] = $v ['attrid'];
			}
		}
		return $aid;
	}
	
	// 提取同类目所有要素
	public function getCateAttrLists() {
		
		/* $aid = array(); */
		$where1 ['CATEGORYID'] = intval ( I ( 'cid' ) );
		$where = array ();
		$attrid = $this->attrcate->field ( 'attrid' )->where ( $where1 )->select ();
		$aid = array ();
		if ($attrid) {
			foreach ( $attrid as $k => $v ) {
				$aid [$k] = $v ['attrid'];
			}
		}
		
		if (! empty ( $aid )) {
			$where ['ID'] = array (
					'in',
					$aid 
			);
		} else {
			$where ['ID'] = 0;
		}
		
		$field = array (
				'ID',
				'NAME',
				'TYPE',
				'HINT',
				'LISTORDER',
				
				'IS_NEED',
				'VER' 
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->select ();
		
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
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
	 * Description: 添加文化分类信息（后台）
	 * Author: ward
	 * Date:
	 */
	public function cateadd() {
		$data = $this->cate->create ();
		if ($data) {
			$res = $this->cate->add ( $data );
			AdminLog ( $res, 1, json_encode ( $data ), "添加文化分类" );
			$where ['CATEGORYID'] = I ( 'PARENTID' );
			$aid = $this->attrcate->field ( 'ATTRID' )->where ( $where )->select ();
			foreach ( $aid as $k => $v ) {
				$data1 ['ATTRID'] = $v ['attrid'];
				$data1 ['CATEGORYID'] = $res;
				$this->attrcate->add ( $data1 );
			}
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
			AdminLog ( $data ['ID'], 2, json_encode ( $data ), "编辑文化分类" );
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
		$where2 ['CATEGORYID'] = $id;
		$data ['STATUS'] = '0';
		$res = $this->cate->where ( $where )->save ( $data );
		AdminLog ( $id, 3, '', "删除文化分类" );
		$res2 = $this->attrcate->where ( $where2 )->delete ();
		if (false === $res || false === $res2) {
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
		$where ['STATUS'] = 1;
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
		$attrid = I ( 'attr_id' );
		$cid = I ( 'get.cid' );
		if (empty ( $attrid ) || empty ( $cid )) {
			return false;
		} else {
			$where['CATEGORYID']=$cid;
			$this->attrcate->where ( $where )->delete ();
		
			foreach ( $attrid as $k => $va ) {
				$data [] = array (
						'CATEGORYID' => $cid,
						'ATTRID' =>$va,
				);
			}
			
			$res = $this->attrcate->addAll ( $data );
			if ($res) {
				return true;
			} else {
				return false;
			}
		}
	}
	public function cateattradd_bak() {
		$attrid = I ( 'attr_id' );
		$cid = I ( 'get.cid' );
		if (empty ( $attrid ) || empty ( $cid )) {
			return false;
		} else {
			foreach ( $attrid as $k => $va ) {
				$where4 ['ID'] = $cid;
				$r = $this->cate->where ( $where4 )->getField ( 'PARENTID' );
				if ($r != 0) {
					$data ['CATEGORYID'] = $cid;
					$data ['ATTRID'] = $va;
					$where ['ATTRID'] = $va;
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
							$where3 ['ATTRID'] = $va;
							$data2 ['CATEGORYID'] = $v ['id'];
							$data2 ['ATTRID'] = $va;
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
						$where5 ['ATTRID'] = $va;
						$data3 ['CATEGORYID'] = $cid;
						$data3 ['ATTRID'] = $va;
						$old = $this->attrcate->where ( $where5 )->getField ( 'ID' );
						if (! empty ( $old )) {
							$this->attrcate->where ( $where5 )->delete ();
						}
						$this->attrcate->add ( $data3 );
					} else {
						$data ['CATEGORYID'] = $cid;
						$data ['ATTRID'] = $va;
						$where ['ATTRID'] = $va;
						$where ['CATEGORYID'] = $cid;
						$r = $this->attrcate->where ( $where )->find ();
						if (! empty ( $r )) {
							$this->attrcate->where ( $where )->delete ();
						}
						$res = $this->attrcate->add ( $data );
						if (empty ( $res )) {
							return false;
							break;
						}
					}
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
		$where ['STATUS'] = '1';
		$data = $this->cate->where ( $where )->order ( 'LISTORDER DESC' )->getField ( 'ID,NAME,REMARK,LISTORDER,PARENTID' );
		F ( "CATEGORY", $data );
		return $data;
		/* } */
	}
	
	/**
	 * Description: 得到类目下的所有要素
	 *
	 * @return mixed Author: mark
	 *         Date:
	 */
	public function getcateattr() {
		$cid = I ( 'cid' );
		$w ['CATEGORYID'] = $cid;
		$idgroup = $this->attrcate->field ( 'ATTRID' )->where ( $w )->select ();
		if (! empty ( $idgroup )) {
			$id = array ();
			foreach ( $idgroup as $key => $value ) {
				$id [] = $value ['attrid'];
			}
			$w2 ['ID'] = array (
					'in',
					$id 
			);
			$res = $this->model->where ( $w2 )->select ();
			return $res;
		} else {
			return false;
		}
	}
	
	/**
	 * Description: 得到分组下的所有要素，并用于添加
	 *
	 * @return mixed Author: mark
	 *         Date:
	 */
	public function getgroupattr($cid) {
		$gid = $this->model->field ( 'GROUP_ID' )->group ( 'GROUP_ID' )->select ();
		$attrArray = $this->getCateAttrArray ( $cid );
		$res = array ();
		foreach ( $gid as $k => $va ) {
			$where ['GROUP_ID'] = $va ['group_id'];
			$attr = $this->model->field ( 'ID,NAME,TYPE,HINT' )->where ( $where )->order ( 'ID DESC' )->select ();
			if ($attr) {
				foreach ( $attr as $key => $value ) {
					if (in_array ( $value ['id'], $attrArray )) {
						$attr [$key] ['checked'] = "checked";
					} else {
						$attr [$key] ['checked'] = "";
					}
				}
			}
			$res [$k] ['attr'] = $attr;
			$where2 ['ID'] = $va ['group_id'];
			$gname = $this->group->where ( $where2 )->getField ( 'NAME' );
			$res [$k] ['gname'] = $gname;
			$res [$k] ['gid'] = $va ['group_id'];
		}
		return $res;
	}
	public function getver($id = "0") {
		$where ['ATTRID'] = $id;
		$res = $this->attrlog->field ( 'VER' )->where ( $where )->group ( 'VER' )->select ();
		return $res;
	}
	
	// 版本切换
	public function get_ver_attr() {
		$id = I ( 'id' );
		$ver = I ( 'ver' );
		$where ['VER'] = $ver;
		$where ['ATTRID'] = $id;
		$field = array (
				'ATTRID,NAME,TYPE,HINT,LISTORDER',
				'DEFAULT',
				'IS_NEED',
				'VER' 
		);
		$res = $this->attrlog->field ( $field )->where ( $where )->find ();
		if (empty ( $res )) {
			return false;
		} else {
			return $res;
		}
	}
}