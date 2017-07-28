<?php
namespace Culture\Controller;

use Culture\Logic\GroupLogic;

class GroupController extends \Common\Controller\AdminController {

    /**
     * Description: index 显示菜单管理界面、获取菜单列表
     * Author: Jason
     * Date:
     */
    public function index_get(){
        //todo
        $logic=new GroupLogic();
        $group_json=$logic->group_list();
        
        $this->assign('group_json',$group_json);
        $this->display('index');

    }

    /**
     * Description: add_get_html 添加菜单页面
     * Author: Jason
     * Date:
     */
    function add_get_html()
    {
        $logic=new GroupLogic();
        $select_categorys=$logic->getGroupsSelect(0);
        $this->assign("select_categorys", $select_categorys);
        $this->display();
    }

    /**
     * Description: map_post 添加菜单
     * Author: Jason
     * Date:
     */
    public function index_post_json(){
        $logic=new GroupLogic();
        $data=I('post.');
        $res = $logic->addGroup($data);
        $this->ajaxReturn($res);
    }

    /**
     * Description: edit_get_html 编辑菜单页面
     * Author: Jason
     * Date: 2015.09.09
     */
    function edit_get_html()
    {

        $id = I("get.id",0,'int');
        if(!$id)
        {
            $this->error('参数错误',U('index'));
        }
        $logic=new GroupLogic();
        $group = $logic->getGroupInfo($id);
        if(!$group)
        {
            $this->error('不存在该菜单',U('index'));
        }
        $select_categorys=$logic->getGroupsSelect($group['parentid']);

        $this->assign("data", $group);
        $this->assign("select_categorys", $select_categorys);
        $this->display();
    }
    /**
     * Description: map_put 修改菜单
     * Author: Jason
     * Date:
     */
    public function index_put_json(){
        $logic=new GroupLogic();
        $data=I('put.');
        $res = $logic->edit($data);
        $this->ajaxReturn($res);
    }

    /**
     * Description: map_delete 删除菜单
     * Author: Jason
     * Date:
     */
    public function index_delete_json(){
        $logic=new GroupLogic();
        $id=I('get.id',0,'int');
        $res = $logic->deleteGroup($id);
        if($res)
        {
        	$data=array('success'=>true);
        }else{
        	$data=array('success'=>false);
        }
        $this->ajaxReturn($data);
    }
    
    /**
     * Description: map_put 修改排序
     * Author: mark
     * Date:
     */
    public function listorder_put_json(){
    	$logic=new GroupLogic();
    	$listorders=I('listorder');
    	/* var_dump($listorders); */
    	/*  echo $order;  */
    	/* $or = json_decode($order,true);  */
    	/* $me = json_decode(trim($menuid,chr(239).chr(187).chr(191)),true); */
    	/* var_dump($or); */
    	/* var_dump($order); */
    	foreach ($listorders as $k =>$va){
    		$res =$logic->putGroup($va,$k);
    		if($res)
    		{
    			$data=array('success'=>true);
    		}else{
    			$data=array('success'=>false);
    			break;
    		}
    	}
    
    	$this->ajaxReturn($data);
    }







}