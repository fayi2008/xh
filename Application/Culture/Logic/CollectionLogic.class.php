<?php

namespace Culture\Logic;

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
		if ($data = $this->model->create ( $_POST )) {
			$user = session ( 'admin' );
			
			$data ['AUTHOR'] = $user ['account'];
			$data ['MANY_IMAGE'] = json_encode ( $data ['MANY_IMAGE'] );
			$data ['CREATE_TIME'] = toDate ( time () );
			$data ['UPDATE_TIME'] = toDate ( time () );
			$res = $this->model->add ( $data );
			
			if (! $res) {
				echo $this->model->getError ();
				return false;
			}
			AdminLog ( $res, 1, json_encode ( $_POST ), "添加文化采集" );
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
		if ($data = $this->model->create ( I ( 'put.' ) )) {
			$data ['UPDATE_TIME'] = toDate ( time () );
			$data ['MANY_IMAGE'] = json_encode ( $data ['MANY_IMAGE'] );
			$res = $this->model->save ( $data );
			
			if (! $res) {
				echo $this->model->getError ();
				return false;
			}
			AdminLog ( $data ['ID'], 2, json_encode ( $data ), "编辑文化采集" );
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
		AdminLog ( $id, 3, '', "删除文化采集" );
		return $res;
	}
	function release() {
		$where ['ID'] = intval ( I ( 'put.id' ) );
		if (I ( 'put.unrel' ) == 1) {
			$data ['STATUS'] = 1;
			AdminLog ( I ( 'put.id' ), 4, '', "发布文化采集" );
		} else if (I ( 'put.unrel' ) == 2) {
			$data ['STATUS'] = 0;
			AdminLog ( I ( 'put.id' ), 5, '', "取消文化采集" );
		}
		$res = $this->model->where ( $where )->save ( $data );
		if (! $res) {
			echo $this->model->getError ();
			return false;
		}
		$data = array ();
		if (I ( 'put.unrel' ) == 1) {
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
				if ($arr ['thumb']) {
					$data ['THUMBNAILS'] = $arr ['thumb'];
				} else {
					$many_image = json_decode ( $arr ['many_image'] );
					$data ['THUMBNAILS'] = $many_image [0];
				}
				$data ['DATATIME'] = date ( "Y-m-d H:i:s" );
				$data ['WRITER'] = $arr ['author'];
				$data ['CATEGORYID'] = $arr ['cate_id'];
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
		$selectArr = $_GET;
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
		// 排序条件
		$order = '';
		if (! empty ( $selectArr ['field'] )) {
			$order = '' . strtoupper ( $selectArr ['field'] ) . ' ' . $selectArr ['direction'] . ',';
		}
		if ($selectArr ['field'] !== 'id') {
			$order .= ' ID DESC';
		}
		$order = rtrim ( $order, ',' );
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->where ( $where )->field ( $field )->limit ( $start . ',' . $length )->order ( $order )->select ();
		
		$count = $this->model->where ( $where )->field ( $field )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}

	/**
	 * Description:apiCollect 采集资讯、文化接口
	 * @param $title 标题
	 * @param $content 内容
	 * @param $type
	 * @param $signature
	 * @param $source_from
	 * @param string $email
	 * @param string $mobile
	 * @param string $phone
	 * Author:jason
	 */
	public function apiCollect($title,$content,$type,$signature,$source_from,$email='',$mobile='',$phone='')
	{
		if(!in_array($source_from,array(\Culture\Model\CollectionModel::SOURCE_FROM_WEB,\Culture\Model\CollectionModel::SOURCE_FROM_MESSAGE,\Culture\Model\CollectionModel::SOURCE_FROM_EMAIL,\Culture\Model\CollectionModel::SOURCE_FROM_PHONE)))
		{
			$this->setError('参数source_from错误');
			return false;
		}else{
			if($source_from==\Culture\Model\CollectionModel::SOURCE_FROM_MESSAGE)
			{
				if(!$mobile)
				{
					$this->setError('该来源参数mobile不能为空');
					return false;
				}
			}else if($source_from==\Culture\Model\CollectionModel::SOURCE_FROM_EMAIL)
			{
				if(!$email)
				{
					$this->setError('该来源参数email不能为空');
					return false;
				}
			}else if($source_from==\Culture\Model\CollectionModel::SOURCE_FROM_PHONE)
			{
				if(!$phone)
				{
					$this->setError('该来源参数phone不能为空');
					return false;
				}
			}
		}
		if(!in_array($type,array(\Culture\Model\CollectionModel::TYPE_CULTURE,\Culture\Model\CollectionModel::TYPE_NEWS)))
		{
			$this->setError('参数type错误');
			return false;
		}
		if(!$title)
		{
			$this->setError('参数title不能为空');
			return false;
		}
		$data=array(
			'TITLE'=>$title,
			'CONTENT'=>$content,
			'TYPE'=>$type,
			'SOURCE_FROM'=>$source_from,
			'EMAIL'=>$email,
			'MOBILE'=>$mobile,
			'PHONE'=>$phone
		);
		$sign_arr=$data;
		$sign_arr['KEY']=C('COLLECT_KEY');
		ksort($sign_arr,SORT_STRING);
		$sign_str=implode('',$sign_arr);
		if(md5($sign_str)!=$signature)
		{
			$this->setError('签名验证失败');
			return false;
		}
		$data ['CREATE_TIME'] = toDate ();
		$data ['UPDATE_TIME'] = toDate ();
		$res = $this->model->add ( $data );
		if (!$res) {
			$this->setError($this->model->getError ());
			return false;
		}
		AdminLog ( $res, 1, json_encode ( $_POST ), "添加文化采集" );
		return $res;
	}

	/**
	 * Description:emailCollection 添加Email采集资讯
	 * @param $data
	 * @return bool
	 * Author:jason
	 */
	function addCollectionByData($data)
	{
		$res = $this->model->add ( $data );
		if (! $res) {
			$this->setError($this->model->getError ());
			return false;
		}
		AdminLog ( $res, 1, json_encode ( $data ), "添加文化采集" );
		return $res;
	}

	/**
	 * Description:getLastEmailCreateTime
	 * @return mixed
	 * Author:jason
	 */
	function getLastEmailCreateTime()
	{
		return $this->model->where(array('SOURCE_FROM'=>'EMAIL'))->getField('CREATE_TIME');
	}
}
