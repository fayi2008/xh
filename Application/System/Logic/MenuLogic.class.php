<?php
/**
 * Author: Jason
 * Date: 2015/9/7
 * Time: 15:47
 * Description: 
 */

namespace System\Logic;


use System\Model\MenuModel;

class MenuLogic extends \Think\Model {

    function _initialize()
    {
        $this->model=new MenuModel();
    }

    /**
     * 按父ID查找菜单子项
     * @param integer $parentid   父菜单ID
     * @param integer $with_self  是否包括他自己
     */
    public function admin_menu($parentid, $with_self = false) {
        //父节点ID
        $parentid = (int) $parentid;
        $result = $this->model->where(array('PARENTID' => $parentid, 'STATUS' => 1))->order(array("LISTORDER" => "DESC"))->select();
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

    function menu_json($ids = '')
    {
        //$data=F('MENU_JSON');
        if(!$data)
        {
            $menus=$this->menu_list($ids);
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
                    
                    if($menu['code']=='gis')
                    {
                    	$f['homePage']='list';
                    }
                    if($menu['code']=='social')
                    {
                    	$f['homePage']='photo';
                    }
                    if($menu['code']=='Way')
                    {
                    	$f['homePage']='list';
                    }
                    if($menu['code']=='pano')
                    {
                    	$f['homePage']='add';
                    }
                    if($menu['code']=='culture')
                    {
                    	$f['homePage']='group';
                    }
                    if($menu['code']=='merchant')
                    {
                    	$f['homePage']='list';
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
                                        'href'=>$vt['uri'].'?'.$vt['parameters']//ward 2015-12-08 
                                    );
                                    $s['items'][]=$t;
                                }
                            }else{
                                if($v['uri'])
                                {
                                    $s['items'][]=array(
                                        'id'=>$v['code'],
                                        'text'=>$v['name'],
                                        'href'=>$v['uri'].'?'.$v['parameters']//ward 2015-12-08
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
            //F('MENU_JSON',$data);
        }
        return $data;
    }

    /**
     * Description: menu_list 菜单树状结构集合json
     * @return array|mixed|string
     * Author: Jason
     * Date:
     */
    public function menu_list($ids) {
         /*$data=F('MENU_LIST');
         if(!$data) {
             $data = $this->get_tree_role ( 0, $ids );
             $data=$this->clear_key($data);
             $data=json_encode($data,JSON_UNESCAPED_UNICODE);
             F('MENU_LIST',$data);
         }
         return $data;*/
    	$data = $this->get_tree_role ( 0, $ids );

    	$data = $this->clear_key ( $data );
    	$data = json_encode ( $data, JSON_UNESCAPED_UNICODE );
    	return $data;
    }

    /**
     * Description: accesssList 权限列表
     * @param $selected_access_array 选择的权限ID数组
     * @return array|mixed
     * Author: Jason
     * Date:
     */
    function accesssList($selected_access_array){
        $data=$this->get_cache();
        foreach($data as $key=>$value)
        {
            if(in_array($value['id'],$selected_access_array))
            {
                $data[$key]['checked']=true;
            }
            $data[$key]['text']=$value['name'];
        }
        $data=$this->get_tree(0,$data);
        $data=$this->clear_key($data);
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
            $data = $this->model->where(array('STATUS'=>1))->order('LISTORDER DESC,ID ASC')->getField('ID,PARENTID,CODE,URI,PARAMETERS,METHOD,DEPENDENCE,TYPE,STATUS,NAME,ICON,REMARK,LISTORDER');
            F("Menu", $data);
        } else {
            F("Menu", $data);
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
        $menu=F('Menu');
        if($menu)
        {
            return $menu;
        }else{
            $data = $this->model->where(array('STATUS'=>1))->order('LISTORDER DESC,ID ASC')->getField('ID,PARENTID,CODE,URI,PARAMETERS,METHOD,DEPENDENCE,TYPE,STATUS,NAME,ICON,REMARK,LISTORDER');
            F("Menu", $data);
            return $data;
        }
    }

    /**
     * Description: getMenuInfo 获取菜单信息
     * @param $id 菜单id
     * @return mixed
     * Author: Jason
     * Date: 2015.09.09
     */
    function getMenuInfo($id)
    {
        return $this->model->where(array("ID" => $id))->find();
    }

    /**
     * Description: getMenusSelect 获取父菜单选择框
     * @param string $parent_id 父菜单id
     * @return string
     * Author: Jason
     * Date: 2015.09.09
     */
    function getMenusSelect($parent_id='')
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
    {
        if($this->model->create($data))
        {
            $res=$this->model->save();
            if($res!==false)
            {
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
     * Description: addMenu
     * @param $data
     * @return array
     * Author: Jason
     * Date:
     */
    function addMenu($data)
    {
        if($this->model->create($data))
        {
            $res=$this->model->add();
            if($res!==false)
            {
                $res=array('success'=>true);
            }else{
                $res=array('success'=>false,'msg'=>"添加菜单数据失败");
            }
        }else{
            $res=array('success'=>false,'msg'=>$this->model->getError());
        }

        return $res;
    }
    
    function deleteMenu($id)
    {
    	return $this->model->delete($id);
    }
    
    /**
     * Description: putMenu
     * @param $data
     * @return array
     * Author: Jason
     * Date:
     */
    function putMenu($order,$id)
    {	
    	/* $where['id']=$id; */
    	$data=array('LISTORDER'=>$order);
    	$res= $this->model->where(array("ID" => $id))->save($data);
    	
    	if($res!==false){
    		$res=array('success'=>true);
    	}else{
    		$res=array('success'=>false,'msg'=>"更新排序失败");
    	}  	
    	return $res;
    }
    
    public function get_tree_role($myid, $ids) {
    
    	// $data=$this->get_cache();
    	$where ['STATUS'] = 1;
    	if ($ids) {
    		$where ['ID'] = array (
    				'in',
    				$ids
    		);
    	}
    	$data = $this->model->where ( $where )->order ( 'LISTORDER DESC' )->getField ( 'ID,PARENTID,CODE,URI,PARAMETERS,METHOD,DEPENDENCE,TYPE,STATUS,NAME,ICON,REMARK,LISTORDER' );
    	$tree = new \Common\Lib\Util\Tree ();
    	$tree->init ( $data );
    	$res = $tree->get_tree_array ( $myid );
    	return $res;
    }
    


}