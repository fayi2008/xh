<?php
namespace System\Logic;

use System\Model\RoleModel;

class RoleLogic extends \Think\Model {

    function _initialize()
    {
        $this->model=new RoleModel();
    }

    /**
     * Description: role_list 获取角色列表
     * @return array|mixed|string
     * Author: Jason
     * Date:2015-09-11
     */
    public function role_list() {
        $join = '__ADMINS__ b on a.id =b.role_id ';
        $where=array('a.status'=>1);
        $data = $this->model->alias("a")->field('a.id,a.name,a.remark,count(b.role_id) as num,a.listorder')
            ->join($join,'LEFT')
            ->where($where)
            ->group('a.id,a.name,a.remark,a.listorder')
            ->order('a.listorder desc,a.id asc')->select();
        return array('rows'=>$data);
    }

    /**
     * Description: role_select_data
     * @return mixed
     * Author: Jason
     * Date:
     */
    function role_select_data()
    {
        return $this->model->field(array('ID','NAME'))->select();
    }


    /**
     * Description: getInfo 获取角色信息
     * @param $id 角色id
     * @return mixed
     * Author: Jason
     * Date: 2015.09.11
     */
    function getInfo($id)
    {
        return $this->model->find($id);
    }


    /**
     * Description: edit 编辑角色
     * @param $data
     * @return array
     * Author: Jason
     * Date:
     */
    function edit($data)
    {
        if($this->model->create($data))
        {
            $res=$this->model->save();
            if($res!==false)
            {
                $res=array('success'=>true);
            }else{
                $res=array('success'=>false,'msg'=>"更新角色数据失败");
            }
        }else{
            $res=array('success'=>false,'msg'=>$this->model->getError());
        }

        return $res;
    }

    /**
     * Description: addRole 添加角色
     * @param $data
     * @return array
     * Author: Jason
     * Date:
     */
    function addRole($data)
    {
        if($data=$this->model->create($data))
        {    $data['CREATE_TIME'] 	=time();
             $data['UPDATE_TIME'] 	=time();
            $res=$this->model->add($data);
            if($res!==false)
            {
                $res=array('success'=>true);
            }else{
                $res=array('error'=>false,'msg'=>"添加角色数据失败");
            }
        }else{
            $res=array('success'=>false,'msg'=>$this->model->getError());
        }

        return $res;
    }

    /**
     * Description: deleteRole 删除角色
     * @param $id
     * @return mixed
     * Author: Jason
     * Date:
     */
    function deleteRole($id)
    {
    	return $this->model->delete($id);
    }


}