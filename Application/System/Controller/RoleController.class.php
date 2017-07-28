<?php
namespace System\Controller;

use System\Logic\RoleLogic;

class RoleController extends \Common\Controller\AdminController {
    /**
     * Description: index 显示角色管理界面、获取角色列表
     * Author: Jason
     * Date:
     */
    public function index_get_html(){
        //todo
        $this->display();

    }

    /**
     * Description: index_get_json 获取角色数据
     * Author: Jason
     * Date:
     */
    function index_get_json()
    {
        $logic=new RoleLogic();
        $data=$logic->role_list();
        $this->ajaxReturn($data);
    }

    /**
     * Description: add_get_html 添加角色界面
     * Author: Jason
     * Date:
     */
    function add_get_html()
    {
        $this->display();
    }

    /**
     * Description: map_post 添加角色
     * Author: Jason
     * Date:
     */
    public function index_post_json(){
    
        $logic=new RoleLogic();
        $data=$logic->addRole($_POST);
        $this->ajaxReturn($data);
    }

    /**
     * Description: edit_get_html 编辑角色界面
     * Author: Jason
     * Date:
     */
    function edit_get_html()
    {
        $id=intval(I('get.id'));
        $logic=new RoleLogic();
        $data = $logic->getInfo($id);
        $this->assign('data',$data);
        $this->display();
    }

    /**
     * Description: map_put 修改角色
     * Author: Jason
     * Date:
     */
    public function index_put_json(){
        $logic=new RoleLogic();
        $data=I('put.');
        $res = $logic->edit($data);
        $this->ajaxReturn($res);
    }

    /**
     * Description: map_delete 删除角色
     * Author: Jason
     * Date:
     */
    public function index_delete_json(){
        $logic=new RoleLogic();
        $id=I('get.id',0,'int');
        $res = $logic->deleteRole($id);
        if($res)
        {
            $data=array('success'=>true);
        }else{
            $data=array('success'=>false);
        }
        $this->ajaxReturn($data);
    }

}