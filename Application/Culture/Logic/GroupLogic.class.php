<?php
/**
 * Author: Jason
 * Date: 2015/9/7
 * Time: 15:47
 * Description: 
 */

namespace Culture\Logic;


use Culture\Model\GroupModel;

class GroupLogic extends \Think\Model {

    function _initialize()
    {
        $this->model=new GroupModel();
    }

    /**
     * 按父ID查找菜单子项
     * @param integer $parentid   父菜单ID
     * @param integer $with_self  是否包括他自己
     */
    public function admin_menu($parentid, $with_self = false) {
        //父节点ID
        $parentid = (int) $parentid;
        $result = $this->model->where(array('PARENTID' => $parentid, 'STATUS' => 1))->order(array("LISTORDER" => "ASC"))->select();
        if ($with_self) {
            $result2[] = $this->where(array('ID' => $parentid))->find();
            $result = array_merge($result2, $result);
        }
        return $result;
    }

    /**
     * Description: submenu 获取菜单 头部菜单导航
     * @return array|mixed
     * Author: Jason
     * Date:
     */
    public function submenu() {
        $res=F('SUBMENU');
        if(!$res)
        {
            $data=$this->get_cache();
            $tree=new \Common\Lib\Util\Tree();
            $tree->init($data);
            $res=$tree->get_child(0);
            F('SUBMENU',$res);
        }
        return $res;
    }

    function menu_json()
    {
        $data=F('MENU_JSON');
        if(!$data)
        {
            $menus=$this->menu_list();
            $menus=json_decode($menus,true);
            $tmp=array();
            foreach ($menus as $menu) {
                if($menu['parentid']==0)
                {
                    $f='';
                    $f['id']=$menu['code'];
                    if($menu['code']=='system')
                    {
                        $f['homePage']='home';
                    }
                    if(isset($menu['children']))
                    {
                        foreach($menu['children'] as $v)
                        {
                            $s='';
                            $s['text']=$v['name'];
                            if(isset($v['children'])&&$v['children'])
                            {
                                foreach ($v['children'] as $vt) {
                                    $t='';
                                    $t=array(
                                        'id'=>$vt['code'],
                                        'text'=>$vt['name'],
                                        'href'=>$vt['uri']
                                    );
                                    $s['items'][]=$t;
                                }
                            }else{
                                if($v['uri'])
                                {
                                    $s['items'][]=array(
                                        'id'=>$v['code'],
                                        'text'=>$v['name'],
                                        'href'=>$v['uri']
                                    );
                                }
                            }
                            $f['menu'][]=$s;
                        }
                    }
                    $tmp[]=$f;
                }

            }
            $data=json_encode($tmp,JSON_UNESCAPED_UNICODE);
            F('MENU_JSON',$data);
        }
        return $data;
    }

    /**
     * Description: menu_list 菜单树状结构集合json
     * @return array|mixed|string
     * Author: Jason
     * Date:
     */
    public function group_list() {
        $data=F('GROUP_LIST');
       
            $data = $this->get_tree(0);
            $data=$this->clear_key($data);
            $data=json_encode($data,JSON_UNESCAPED_UNICODE);
            F('GROUP_LIST',$data);
        
        return $data;
    }

    /**
     * Description: clear_key
     * @param $arr
     * @return array
     * Author: Jason
     * Date:
     */
    function clear_key($arr)
    {
        $res=array_values($arr);
        foreach($res as $key=>$value)
        {
            if($value['children'])
            {
                $res[$key]['children']=$this->clear_key($value['children']);
            }
        }
        return $res;
    }

    /**
     * Description: get_tree 取得树形结构的菜单
     * @param $myid 父id
     * @param $data 需排序成树状的数据
     * @return array
     * Author: Jason
     * Date: 2015.09.07
     */
    public function get_tree($myid,$data='') {
        if(!$data)
        {
            $data=$this->get_cache();
        }
        $tree=new \Common\Lib\Util\Tree();
        $tree->init($data);
        $res=$tree->get_tree_array($myid);
        return $res;
    }



    /**
     * 更新缓存
     * @param type $data
     * @return type
     */
    public function menu_cache($data = null) {
        if (empty($data)) {
            $data = $this->model->where(array('STATUS'=>1))->order('LISTORDER DESC')->getField('ID,PARENTID,CODE,URI,PARAMETERS,METHOD,DEPENDENCE,TYPE,STATUS,NAME,ICON,REMARK,LISTORDER');
            F("Group", $data);
        } else {
            F("Group", $data);
        }
        return $data;
    }

    /**
     * Description: get_cache 获取缓存
     * @return mixed
     * Author: Jason
     * Date:
     */
    public function get_cache()
    {
        $menu=F('Group');
        if($menu)
        {
            return $menu;
        }else{
            $data = $this->model->order('LISTORDER DESC')->getField('ID,PARENTID,NAME,LISTORDER');
            F("Group", $data);
            return $data;
        }
    }

    /**
     * Description: getGroupInfo 获取菜单信息
     * @param $id 菜单id
     * @return mixed
     * Author: Jason
     * Date: 2015.09.09
     */
    function getGroupInfo($id)
    {
        return $this->model->where(array("ID" => $id))->find();
    }

    /**
     * Description: getGroupsSelect 获取父菜单选择框
     * @param string $parent_id 父菜单id
     * @return string
     * Author: Jason
     * Date: 2015.09.09
     */
    function getGroupsSelect($parent_id='')
    {
        $tree = new \Common\Lib\Util\Tree();
        $result = $this->get_cache();
        $str = "<option value='\$id' \$selected>\$spacer \$name</option>";
        $tree->init($result);
        return $tree->get_tree(0,$str,$parent_id);
    }

    /**
     * Description: edit
     * @param $data
     * @return array
     * Author: Jason
     * Date:
     */
    function edit($data)
    {   if($data['ID']==$data['PARENTID']){
    	$res=array('success'=>false,'msg'=>"父id不能为自己");
    	return $res;
          }
        if($this->model->create($data))
        {   
        	
            $res=$this->model->save();
            if($res!==false)
            {     AdminLog($data['ID'], 2, json_encode($_POST), "编辑文化分组");
                $res=array('success'=>true);
            }else{
                $res=array('success'=>false,'msg'=>"更新菜单数据失败");
            }
        }else{
            $res=array('success'=>false,'msg'=>$this->model->getError());
        }

        return $res;
    }

    /**
     * Description: addGroup
     * @param $data
     * @return array
     * Author: Jason
     * Date:
     */
    function addGroup($data)
    {
        if($this->model->create($data))
        {
            $res=$this->model->add();
            if($res!==false)
            {    AdminLog($res, 1, json_encode($_POST), "添加文化分组");
                $res=array('success'=>true);
            }else{
                $res=array('success'=>false,'msg'=>"添加数据失败");
            }
        }else{
            $res=array('success'=>false,'msg'=>$this->model->getError());
        }

        return $res;
    }
    
    function deleteGroup($id)
    {    AdminLog($id, 3, '', "删除文化分组");
    	return $this->model->delete($id);
    }
    
    /**
     * Description: addMenu
     * @param $data
     * @return array
     * Author: Jason
     * Date:
     */
    function putGroup($order,$id)
    {
    	/* $where['id']=$id; */
    	$data=array('LISTORDER'=>$order);
    	$res= $this->model->where(array("ID" => $id))->save($data);
    	AdminLog($id, 6, json_encode($data), "文化分组排序");
    	if($res!==false){
    		$res=array('success'=>true);
    	}else{
    		$res=array('success'=>false,'msg'=>"更新排序失败");
    	}
    	return $res;
    }
    
    function getGroupList(){
    	$result=$this->model->select();
    	return $result;
    }


}