<?php
namespace Merchant\Logic;

class TagLogic  extends \Think\Model{
	protected $model;
	public function  _initialize(){
		$this->model=new \Gis\Model\TagModel();
	}
	/**
	 * Description: 标签信息列表（前端）
	 * Author: ward
	 * Date:
	 */
	public function get(){
		$where['STATUS']=1;
		$res=$this->model->where($where)->select();
		return $res;
	}
	
	
	
	
	
	/**
	 * Description: 获得某条信息下的标签（对内接口）
	 * Author: ward
	 * Date:
	 */
	public function getInfoTags($id){
		$where['B.PREFEREN_ID']=intval($id);
		$res=$this->model->alias('A')->join("LEFT JOIN __PREFERENTIAL_RELATION__  B ON A.ID=B.TAG_ID")
			->where($where)->field('A.ID,A.NAME')->select();
		return $res;
	}
	
	
	/**
	 * Description: 标签信息列表（后台）
	 * Author: ward
	 * Date:
	 */
	public function getLists(){
		//	$this->model=new \Preferen\Model\PreferenModel();
		$where = array ();
		$where ['NAME'] = array (
				"like",
				"%" . I ( 'title' ) . "%"
		);
		$where ['STATUS']=array('neq',0);
		$field = array (
				'ID,NAME'
		);
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->field ($field)->where ( $where )->limit ( $start . ',' . $length )->select ();
		//echo $this->model->getLastSql();
		$count =$this->model->field ($field)->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	/**
	 * Description: 标签信息详情（后台）
	 * Author: ward
	 * Date:
	 */
	public function getOne(){
		$where['ID']=intval($_GET['id']);//信息id
		$field='*';
		$data=$this->model->where($where)->field($field)->find();
		return $data;
	}
	/**
	 * Description: 添加标签信息（后台）
	 * Author: ward
	 * Date:
	 */
	public function add(){
		$data=$this->model->create();
		if($data){
			$data['STATUS']=1;
			$res=$this->model->add($data);
		}else{
			return false;
		}
	}
	
	
	/**
	 * Description: 编辑标签信息（后台）
	 * Author: ward
	 * Date:
	 */
	public function edit(){
		if ($data = $this->model->create ( I('put.') )) {
			$res = $this->model->save( $data );
			return $res;
		} else {
			return false;
		}
	}
	
	/**
	 * Description: 删除标签信息（后台）
	 * Author: ward
	 * Date:
	 */
	
	public function delete(){
		$id = I ( 'ids' );
		$where ['ID'] = array (
				'in',
				$id
		);
		$data=array('STATUS'=>0);
		$res = $this->model->where ( $where )->save($data);
		return $res;
	}
	
	/**
	 * Description: 发布标签信息（后台）
	 * Author: ward
	 * Date:
	 */
	public function release(){
		$id = I ( 'ids' );
		$where ['ID'] = array (
				'in',
				$id
		);
		$res = $this->model->where ( $where )->save(array('status'=>1));
		return $res;
	}
	
	/**
	 * Description: 给优惠信息管理模块提供标签的---复选框选项（后台）
	 * Author: ward
	 * Date:
	 */
	public function getOptions(){
		$where['STATUS']=1;
		$field='ID,NAME';
		$res=$this->model->where($where)->field($field)->select();
		return $res;
	}
	
}