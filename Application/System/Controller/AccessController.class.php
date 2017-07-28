<?php
namespace System\Controller;

use System\Logic\AccessLogic;
use System\Logic\MenuLogic;

class AccessController extends \Common\Controller\AdminController {
    /**
     * Description: index 显示权限界面
     * Author: Jason
     * Date:
     */
    public function index_get_html(){
        $role_id=intval(I('get.role_id'));
        if(!$role_id)
        {
            $this->error('参数错误');
        }
        $logic=new AccessLogic();
        $role_accesses=$logic->role_select_data($role_id);
        $menu_logic=new MenuLogic();
        $accesses=$menu_logic->accesssList($role_accesses);
        $this->assign('accesses',json_encode($accesses,JSON_UNESCAPED_UNICODE));
        $this->assign('menu_ids',implode(',',$role_accesses));
        $this->assign('role_id',$role_id);
        $this->display();
    }


    /**
     * Description: index_post 添加权限
     * Author: Jason
     * Date:
     */
    public function index_post_json(){
        $logic=new AccessLogic();
        $res=$logic->addAccess($_POST['menu_ids'],I('post.role_id','','intval'));
        if($res)
        {
            $this->success('更新成功');
        }else{
            $this->error('更新失败');
        }

    }









}