<?php

namespace Panorama\Logic;

class HotLogic extends \Think\Model {
	protected $model;
	function _initialize() {
		$this->model = new \Panorama\Model\HotModel ();
	}
	
	/**
	 * Description: list_get 获取全景所有的热点列表（兼容获得某一个具体热点详情）前端接口
	 * Author: ward
	 * Param: $id=>'全景的key' $hot=>'热点id'
	 * Date:
	 */
	public function get($key,$hot) {
		if (!empty($key)) {
			$where ['PANO_KEY'] = $key;
		}
		if (!empty($hot)) {
			$where ['ID'] = $hot;
		}
		$where['STATUS']=array('NEQ',0);
		$res = $this->model->where ( $where )->select ();
		return $res;
	}
	
	
	/**
	 * Description: culture_get 获取全景下面热点中带文章的的文章详情(随机一篇)
	 * Author: ward
	 * Param: $key=>'全景key值'
	 * Date:2015-12-04
	 */
	public function getHotCulture($key){
		$where['a.PANO_KEY']=$key;
		$where['a.TYPE']=5;
		$where['a.STATUS']=1;//已经发布的热点
		$field='b.ID,b.ATTRS';
		$data=$this->model->alias('a')->
			join("left join __CULTURE__ as b on a.CULTURE_ID=b.ID")->where($where)
			->field($field)->select();
		if(is_array($data)){
			$count=count($data);
			if($count>0){
				$rand=rand(0,$count-1);
				$ret=$data[$rand];
				//$ret['attrs']=html_entity_decode($ret['attrs']);
				return $ret;
			}else{
				return array();
			}
		}else{
			return false;
		}
	}
	
	
	/**
	 * Description: 后台热点list
	 *
	 * Author: liuzhaojun
	 * Date:
	 */
	public function getListForJson($id = -1) {
		$field = 'A.*,B.TITLE as btitle';
		if ($id != - 1) {
			$where ['A.PANO_ID'] = $id;
		}
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->alias ( 'A' )->join ("LEFT JOIN __PANORAMA__ B ON A.PANO_KEY=B.PANO_KEY")->where ( $where )->field ( $field )->limit ( $start . ',' . $length )->select ();
		$count = $this->model->alias ( 'A' )->join ("LEFT JOIN __PANORAMA__ B ON A.PANO_KEY=B.PANO_KEY")->where ( $where )->field ( $field )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		
		return $reslut;
	}
	
	/**
	 * Description: 添加热点
	 *
	 * Author: liuzhaojun
	 * Date:
	 */
	function addHot() {
        unset($_POST['ID']);
		if ($this->model->create ( $_POST )) {
			$res = $this->model->add ();
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
	 * Description: 编辑热点
	 * Author: liuzhaojun
	 * Date:
	 */
	function saveHot() {
		if ($data = $this->model->create ( I ( 'put.' ) )) {
			$res = $this->model->save ( $data );
			AdminLog($data['ID'], 2, json_encode($data), "编辑热点");
			if ( $res===false) {
				echo $this->model->getError ();
				return false;
			}
			return true;
		} else {
			echo $this->model->getError ();
			return false;
		}
	}
	/**
	 * Description: 热点详情
	 *
	 * Author: liuzhaojun
	 * Date:
	 */
	function getHotDetail($id) {
		$where ['ID'] = $id;
		$hot = $this->model->where ( $where )->find ();
		return $hot;
	}
	/**
	 * Description: 发布与删除热点
	 *
	 * Author: liuzhaojun
	 * Date:
	 */
	function releaseHot() {
		$where ['ID'] = intval ( I ( 'id' ) );
		if (I ( 'unrel' )) {
			$data ['STATUS'] = 2;
		} else {
			$data ['STATUS'] = 1;
		}
		$res = $this->model->where ( $where )->save ( $data );
		AdminLog(intval ( I ( 'id' ) ), 2, json_encode($data), "发布与删除热点");
		if (! $res) {
			echo $this->model->getError ();
			return false;
		}
		return $res;
	}
	
	/**
	 * Description: 删除热点
	 *
	 * Author: liuzhaojun
	 * Date:
	 */
	function deleteHot() {
		$where ['ID'] = intval ( I ( 'put.id' ) );
		$res = $this->model->where ( $where )->delete ();
		if (! $res) {
			echo $this->model->getError ();
			return false;
		}
		return $res;
	}
}