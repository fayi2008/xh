<?php
namespace System\Controller;

use System\Logic\AdminLogic;
use System\Logic\RoleLogic;

class AdminController extends \Common\Controller\AdminController {
    /**
     * Description: index 显示管理员界面
     * Author: Jason
     * Date:
     */
    public function index_get_html(){
        $role_logic=new RoleLogic();
        $roles=$role_logic->role_select_data();
        $this->assign('roles',$roles);
        $this->display();
    }

    /**
     * Description: index_get_json 获取管理员数据
     * Author: Jason
     * Date:
     */
    function index_get_json()
    {
        $logic=new AdminLogic();
        $data=$logic->admin_list();
        $this->ajaxReturn($data);
    }

    /**
     * Description: add_get_html 添加界面
     * Author: Jason
     * Date:
     */
    function add_get_html()
    {
        $role_logic=new RoleLogic();
        $roles=$role_logic->role_select_data();
        $this->assign('roles',$roles);
        $this->display();
    }

    /**
     * Description: index_post 添加管理员
     * Author: Jason
     * Date:
     */
    public function index_post_json(){
        $logic=new AdminLogic();
        $data=$logic->add($_POST);
        $this->ajaxReturn($data);
    }
    /**
     * Description: edit_get_html 编辑界面
     * Author: Jason
     * Date:
     */
    function edit_get_html()
    {
        $role_logic=new RoleLogic();
        $roles=$role_logic->role_select_data();
        $data_logic=new AdminLogic();
        $data = $data_logic->getInfo(I('get.id'));
        $this->assign('roles',$roles);
        $this->assign('data',$data);
        $this->display();
    }
    /**
     * Description: index_put 修改管理员
     * Author: Jason
     * Date:
     */
    public function index_put_json(){
        $logic=new AdminLogic();
        $data=I('put.');
        $res = $logic->edit($data);
        $this->ajaxReturn($res);
    }

    /**
     * Description: index_delete 删除管理员
     * Author: Jason
     * Date:
     */
    public function index_delete_json(){
        $logic=new AdminLogic();
        $id=I('get.id',0,'int');
        $res = $logic->delete($id);
        if($res)
        {
            $data=array('success'=>true);
        }else{
            $data=array('success'=>false);
        }
        $this->ajaxReturn($data);
    }







}