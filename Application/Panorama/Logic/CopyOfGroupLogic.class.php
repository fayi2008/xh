<?php

namespace Panorama\Logic;

class GroupLogic extends \Think\Model {
	
	protected $model,$panoModel;
	function _initialize() {
		$this->model = new \Panorama\Model\GroupModel();
		$this->panoModel=new \Panorama\Model\PanoModel ();
	}
	
	
	/**
	 * Description: list_get 获取该全景所属poi的所有分组列表（ 前端接口）
	 * Author: ward
	 * Param: pano_key 全景的key
     * @param season 季节1234分别代表春夏秋冬
	 * Date:2015-12-04
     * recoder:jason
	 */
	public function getList($pano_key,$season='') {
        if(!$season){
        	$info=$this->panoModel->where(array('PANO_KEY'=>$pano_key))->find();
        	if($info['season']){
        		$season=$info['season'];
        	}else{
        		$month=date('m');
        		if($month<3){
        			$month=+12;
        		}
        		$season=ceil(($month-2)/3);
        	}
        }//ward 2015-12-10 
		$id = $pano_key; // 全景key
		$where ['B.PANO_KEY'] = $id;
		$field = 'A.*,B.PANO_KEY';
		$res = $this->model->alias ( 'A' )->join ( ' LEFT JOIN __PANORAMA__ B ON A.POI_ID=B.POI_ID' )->where ( $where )->field ( $field )->select ();
		
		if(empty($res)||!is_array($res)){
			return $res;
		}
		
		foreach ($res as $val){
			$groupArr[]=$val['id'];
		}
		$map['GROUP_ID']=array('in',$groupArr);
        $map['STATUS']=1;
        if(!session('admin'))
        {
            $map['POST_STATUS']=1;
        }
        $map['SEASON']=array('in',array('0',$season));
		$arr=$this->panoModel->where($map)->field('ID,PANO_KEY,LAT,LON,GROUP_ID,TITLE,SEASON')->order('LISTORDER DESC')->select();
		
		if(empty($arr)||!is_array($arr)){
			return $res;
		}
		foreach ($res as $k1=>$v1){
			foreach ($arr as $k2=>$v2){
				if($v1['id']==$v2['group_id']){
					$res[$k1]['group_list'][]=$v2;
				}
			}
		}
		//如果分组group_list 中为空，则该分组信息也置空
		foreach ($res as $key=>$val){
			if(empty($val['group_list'])){
				unset($res[$key]);
			}
		}
		$res=array_values($res);
		
		return $res;
	}
	
	/**
	 * Description: 后台分组list
	
	 * Author: liuzhaojun
	 * Date:
	 */
	public function getListForJson($id = -1) {
		$this->model = new \Panorama\Model\GroupModel ();
		$field = 'A.*,B.NAME as bname';
		$where = array();
		if($id != -1)
		{
			$where['A.POI_ID'] = $id;
		}
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->alias ( 'A' )->join ( ' LEFT JOIN __POI__ B ON A.POI_ID=B.ID' )->where ( $where )->field ( $field )->limit ( $start . ',' . $length )->select ();
		$count = $this->model->alias ( 'A' )->join ( ' LEFT JOIN __POI__ B ON A.POI_ID=B.ID' )->where ( $where )->field ( $field )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}

	/**
	 * Description: getListOfPoi 获取某个poi点的全景分组列表
	 * @param $poi_id
	 * @return mixed
	 * Author: Jason
	 * Date:2015-11-26
	 */
	function getListOfPoi($poi_id)
	{
		$where['POI_ID'] = $poi_id;
		return $this->model->where($where)->order('LISTORDER ASC')->select();
	}
	
	
	
	 /**
     * Description: 添加分组
     * @param $id
     * @param $img_path
     * @return mixed
     * Author: Jason
     * Date:
     */
	function addGroup() {
		if ($this->model->create ( $_POST )) {
			$res = $this->model->add ();
			AdminLog($res, 1, json_encode($res), "添加分组");
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
     * Description: 编辑分组
     * @param $id
     * @param $img_path
     * @return mixed
     * Author: liuzhaojun
     * Date:
     */
	function saveGroup() {
		if ($data = $this->model->create ( I('put.') )) {
				
			$res = $this->model->save ( $data );
			AdminLog($data['ID'], 2, json_encode($data), "编辑分组");
			//	echo  $this->model->getLastSql();
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

    /**
     * Description: updateGroupAll 更新所有的分组数据
     * @param $data
     * @return bool
     * Author: Jason
     * Date:2015-11-30
     */
    function updateGroupAll($data)
    {
        foreach($data as $key=>$value)
        {
            $this->model->save ($value);
        }
        return true;
    }
	/**
	 * Description: 分组详情
	 * @param $id
	 * @param $img_path
	 * @return mixed
	 * Author: liuzhaojun
	 * Date:
	 */
	function getGroupDetail($id) {
		$where ['ID'] = $id;
		$group = $this->model->where ( $where )->find ();
		return $group;
	}
	
	/**
	 * Description: 删除分组
	 * @param $id
	 * @param $img_path
	 * @return mixed
	 * Author: liuzhaojun
	 * Date:
	 */
	
	function cate_delete() {
		$id = I ( 'put.ids' );
		$where ['ID'] = array (
				'in',
				$id
		);
		$res = $this->model->where ( $where )->delete ();
		return $res;
	}
	
	/**
	 * Description:所以分组
	
	 * Author: liuzhaojun
	 * Date:
	 */
	function getALLGroup(){
		$poi = $this->model->select();
		return $poi;
	}
	function getGroup($id){
		$where['POI_ID'] = $id; 
		$poi = $this->model->where($where)->select();
		return $poi;
	}
}