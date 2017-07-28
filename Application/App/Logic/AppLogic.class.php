<?php
namespace App\Logic;

class AppLogic extends \Think\Model {

	function _initialize() {
		$this->model = new \App\Model\AppModel ();
	}

	/**
	 * Description:getInfo
	 * @param $app_id
	 * Author:jason
	 */
	function getInfo($app_id)
	{
		$model=new \App\Model\AppModel();
		$where['ID']=$app_id;
		$res=$model->where($where)->find();
		return $res;
	}

	/**
	 * Description:click
	 * @param $app_id
	 * @return bool
	 * Author:jason
	 */
	function click($app_id)
	{
		$model=new \App\Model\AppModel();
		$where['ID']=$app_id;
		$res=$model->where($where)->setInc('CLICK');
		return $res;
	}

	/**
	 * Description:getlist 获取后台列表数据
	 * @param int $length
	 * @param int $start
	 * @param string $field
	 * @param array $params
	 * @return mixed
	 * Author:jason
	 */
	function getlist($length=10,$start=0,$field='',$params=array()) {
		$where = array ();
		if(isset($params['name'])&&$params['name'])
		{
			$where ['a.NAME'] = array (
				"like",
				"%" . $params ['name'] . "%"
			);
		}
		if(!$field)
		{
			$field = array (
				'a.*'
			);
		}
		// 排序条件
		$order = '';
		if (! empty ( $params ['field']  )) {
			$order = '' . strtoupper ( $params ['field'] ) . ' ' . $params ['direction'] . ',';
		}
		if ($params ['field'] !== 'id') {
			$order .= ' ID DESC';
		}
		$order = rtrim ( $order, ',' );
		$list = $this->model->alias('a')->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->order ( $order )->select ();
		$count = $this->model->alias('a')->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}

	/**
	 * Description:addData 添加终端数据
	 * @param $data
	 * @return mixed
	 * Author:jason
	 */
	function addData($data)
	{
		$data['CREATE_TIME']=toDate();
		$data['UPDATE_TIME']=$data['CREATE_TIME'];
		return $this->model->add($data);
	}

	/**
	 * Description:editData 编辑终端数据
	 * @param $data
	 * @return mixed
	 * Author:jason
	 */
	function editData($data)
	{
		$data['UPDATE_TIME']=toDate();
		$res=$this->model->save($data);
		if($res!==false)
		{
			$this->setError($this->model->getError());
		}
		return $res;
	}

	/**
	 * Description:delete 删除数据
	 * @param array|mixed $ids
	 * @return mixed
	 * Author:jason
	 */
	function delete($ids)
	{
		if(is_array($ids))
		{
			$where['ID']=array('in',$ids);
		}else{
			$where['ID']=$ids;
		}
		return $this->model->where($where)->delete();
	}

}

?>