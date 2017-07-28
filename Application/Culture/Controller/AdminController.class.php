<?php
namespace Culture\Controller;

class AdminController extends \Common\Controller\AdminController {
	
	function _init() {
		$this->logic = new \Culture\Logic\CultureAttrLogic ();
		$this->grouplogic = new \Culture\Logic\GroupLogic ();	
		$this->catelogic = new \Culture\Logic\CateLogic ();
	}
    /**
     * Description: index 显示文化管理界面
     * Author: Jason
     * Date:
     */
    public function index_get(){
    	$list=$this->grouplogic->getGroupList();
    	$this->assign("list",$list);
        $this->display('Admin/index_get');
    }

    
    /**
     * Description: tag_index 标签管理
     * Author: Ward
     * Date:
     */
    function index_get_json() {
    	$res = $this->logic->getLists ();  
    	echo json_encode ( $res );
    }
    
	//元素添加页面
    function attr_add(){
    
    	$select_group=$this->grouplogic->getGroupsSelect(0);
    	$this->assign("select_group", $select_group);
    	$this->display ("/Admin/culture_attr_add");
    }
    
    function attr_post() {
    	$res = $this->logic->add ();
    	$cateid = I('CATEGORYID');
    	if (false === $res) {
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => U ( '/Culture/admin/index.html' ),
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => U ( '/Culture/admin/index.html' ),
    		)
    		);
    	}
    
    }
    
    
    //元素更新页面
    function culture_attr_update() {
    	$data = $this->logic->getOne ();
    	$id = I("get.id",0,'int');
    	$type1 = '';
    	$type2 = '';
    	$need = '';
    	$ver = '';
    	if (1 == $data ['type']) {
    		$type1 = 'selected';
    	}
    	if (2 == $data ['type']) {
    		$type2 = 'selected';
    	}
    	if(1 ==$data['is_need']){
    		$need='checked';
    	}
    	$select_group=$this->grouplogic->getGroupsSelect($data['group_id']);
    	$select_ver = $this->logic->getver($id);
    	$this->assign("select_group", $select_group);
    	$this->assign("select_ver", $select_ver);
    	$this->assign ( 'data', $data );
    	$this->assign ( 'type1', $type1 );
    	$this->assign ( 'type2', $type2 );
    	$this->assign ( 'need', $need );
    	$this->display ();
    }
    
    //元素更新操作
    function attr_put() {
    	$res = $this->logic->edit ();
    /* 	$attrid= I('ID'); */
    	if (false === $res) {   		 
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => U ( '/Culture/admin/index' ),
    				'msg' => $this->logic->getError ()
    		) );
    	}elseif ($res === 'nameempty'){
    		$this->ajaxReturn ( array (
    				'status' => 2,
    				'msg' => '请输入数据！',
    				'url' => U ( '/Culture/admin/index' ),
    		)
    		);
    	}else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => U ( '/Culture/admin/index' ),
    		)
    		);
    	}  	 
    	 
    }

    
   /*  function culture_attr_add(){
    	$select_group=$this->grouplogic->getGroupsSelect(0);
    	$this->assign("select_group", $select_group);
    	$this->display ("/Admin/culture_attr_add");
    } */
    
    function attr_delete(){
    	$res = $this->logic->delete ();
    	if (false === $res ) {
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => U ( '/Culture/admin/index.html' ),
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => U ( '/Culture/admin/index.html' ),
    		) );
    	}
    }
  
    function attr_output(){
    	$data = $this->logic-> getAllAttrs();
    	header("Content-type:text/xml");
    	$filename = "attr.xml";
    	header("Content-Disposition: attachment; filename=".$filename);
    	$attr = xml_encode($data,'attrlist', 'attr');
    	echo $attr;
    	/* file_put_contents('attr.xml', $attr);   	 */
    	
    }
    
    /**
     * Description: tag_index 类目管理
     * Author: Mark
     * Date:
     */

    public function index_category(){
    	//todo
    	$category_list=$this->logic->category_list();
    	$this->assign('category_list',$category_list);
    	$this->display();
    }
    
    function category_add(){
    	$list=$this->logic->getCategorySelect();
    	$this->assign('list',$list);
    	$this->display ("/Admin/category_add");
    }
    
    function category_post() {
    	$res = $this->logic->cateadd ();
    	if (false === $res) {
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => U ( '/Culture/admin/index_category' ),
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => U ( '/Culture/admin/index_category' ),
    		)
    		);
    	}
    }
    
    function category_delete() {
    	$res = $this->logic->catedelete ();
    	if (false === $res) {
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				/* 'url' => U ( '/Culture/admin/index_category' ), */
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				/* 	'url' => U ( '/Culture/admin/index_category.html' ), */
    		) );
    	}
    }
    
    function category_update() {
    	$data = $this->logic->categetOne ();
    	$this->assign ( 'data', $data );
    	$this->display ();
    }
    
    function category_put() {
    	$res = $this->logic->cateedit ();
    	if (false === $res) {
    		 
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => U ( '/Culture/admin/index_category' ),
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => U ( '/Culture/admin/index_category' )
    		)
    		);
    	}
    }
    
    /**
     * Description: index 类目元素管理
     * Author: mark
     * Date:
     */
    public function category_attr(){
    	//todo
    	$cid = I('cid');
    	$this->assign('cid',$cid);
    	$this->display();
    }
    
    function category_attr_json() {
    
    	$res = $this->logic->getCateAttrLists ();
    	echo json_encode ( $res );
    
    }
    
    
    /**
     * Description: index 添加元素
     * Author: mark
     * Date:
     */
    public function category_attr_add(){
    	//todo
    	$cid = I('cid');
    	$res = $this->logic->getgroupattr($cid);
    //	var_dump($res);
    //	$AttrArray=$this->logic->getCateAttrArray();
    //	$this->assign("AttrArray",$AttrArray);
    	$this->assign('cid',$cid); 
    	$this->assign('attrlist',$res);     		
    	$this->display();
    }
    
    //添加页面
    function category_attr_add_json() {  	 
    	$res = $this->logic->getCateAttrLists ();
    	if($res != false){
    		echo json_encode ( $res );
    	}
    }
    


    
    
    function category_attr_output(){
    	$allattr = $this->logic->getcateattr();  
    		
    	header("Content-type:text/xsd");
    	$filename = "categroy_attr.xsd";
    	header("Content-Disposition: attachment; filename=".$filename);
    	$xml = '';
    	$xml .='<?xml version="1.0" encoding="UTF-8"?> '."\r";
    	$xml .='<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" '."\r";
    	$xml .='targetNamespace="http://xh.hqtec.com" '."\r";
    	$xml .='xmlns:tns="http://xh.hqtec.com" '."\r";
    	$xml .='elementFormDefault="qualified"> '."\r"; 
    	if($allattr == false){
    		$xml .='<xsd:"无元素数据"'."\r";
    	}else{  	
    		
	    	foreach ($allattr as $k =>$v){
	    		$xml .='<xsd:element name="attr">'."\r";
	    		$xml .='<xsd:complexType>'."\r";
	    		$xml .='<xsd:sequence>'."\r";
	    		$xml .='<xsd:element name="'.$v['name'].'" type="xsd:char"/> '."\r";   		
	    		$xml .='<xsd:element name="'.$v['type'].'" type="xsd:tinyint"/> '."\r";
	    		$xml .='<xsd:element name="'.$v['hint'].'" type="xsd:varchar"/>'."\r";
	    		$xml .='<xsd:element name="'.$v['listorder'].'" type="xsd:int"/>'."\r";
	    		$xml .='<xsd:element name="'.$v['group_id'].'" type="xsd:int"/>'."\r";
	    		$xml .='<xsd:element name="'.$v['default'].'" type="xsd:varchar"/>'."\r";
	    		$xml .='<xsd:element name="'.$v['is_need'].'" type="xsd:tinyint"/>'."\r";
	    		$xml .='</xsd:sequence>'."\r";
	    		$xml .='</xsd:complexType>'."\r";
	    		$xml .='</xsd:element>'."\r";
	    	}
    	}
    	$xml .='</xsd:schema>';
    	echo $xml;
    	
    }
    
    function to_attr_add(){
    $cid = I('get.cid');
    $res = $this->logic->cateattradd();
    	if (false === $res) {    	 
    		 $this->ajaxReturn ( array (
    				'status' => 0,
/*     				'url' => U ( '/Culture/admin/index_category' ),*/    				
    		 		'msg' => $this->logic->getError (),
    		 		'url' => "/Culture/admin/category_attr_add/cid/"+$cid
    		) ); 
    	}else{  		
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'id' => $res['id'],
    				'title' => $res['name'],
    				'type' => $res['type'],
    				'url' => "/Culture/admin/category_attr_add/cid/"+$cid
    		)
    		); 
    	}
    }
	
    function get_attr(){
    	$res = $this->logic->getattr();
    	if(false === $res){
    		$this->ajaxReturn ( array (
    				'status' => 0,				
    		) );
    	}else{
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'id' => $res['id'],
    				'title' => $res['name'],
    				'type' => $res['type']
    				
    		)
    		); 
    	}
    	
    }
    function cate_attr_delete(){
    	$res = $this->logic->attr_delete ();
    	if (false === $res ) {
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => U ( '/Culture/admin/index.html' ),
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => U ( '/Culture/admin/index.html' ),
    		) );
    	}
    }
    
    /**
     * Description: map_put 修改排序
     * Author: mark
     * Date:
     */
    public function cate_listorder_put_json(){
    
    	$listorders=I('listorder');
    	/* var_dump($listorders); */
    	/*  echo $order;  */
    	/* $or = json_decode($order,true);  */
    	/* $me = json_decode(trim($menuid,chr(239).chr(187).chr(191)),true); */
    	/* var_dump($or); */
    	/* var_dump($order); */
    	foreach ($listorders as $k =>$va){
    		$res = $this->catelogic->putCate($va,$k);
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
    
    public function ver_change(){
    	$data = $this->logic->get_ver_attr();
    	if($data == false){
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'msg' => $this->logic->getError ()
    		) );
    	}else{
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'ver'=> $data['ver'],
    				'name'=> $data['name'],
    				'type'=>$data['type'],
    				'hint'=>$data['hint'],
    				'listorder'=>$data['listorder'],
    				'group_id'=>$data['group_id'],
    				'defaults'=>$data['default'],
    				'is_need'=>$data['is_need']    				
    		) );
    	}
    }
    
    
    public function get_attrs(){
    	$this->model = new \Culture\Model\CultureModel ();
    	$this->attr = new \Culture\Model\CultureAttrModel ();
    	$where['DEL']='1';
    	$res = $this->model->field('ID,TITLE,ATTRS')->where($where)->order('ID DESC')->select();
    	$count = $this->attr->count();
    	$list = array();
    	$noempty = array();
    	$i = 0;
    	$j = 0;
    	foreach ($res as $k =>$v){
    		$allattrs[$k]['id']=$v['id'];
    		$allattrs[$k]['title']= $v['title'];
    		$allattrs[$k]['attr']=json_decode ( $v['attrs'], true ); 
    		foreach ($allattrs[$k]['attr'] as $key => $val){
    			if(!empty($list)){
    				if(empty($val['value'])){
    					if(in_array($val['name'], $list)){
    						$i = $i;
    					}elseif (in_array($val['name'], $noempty)){
    						$i = $i;
    					}else{
    						$list[$i] = $val['name'];
    						$i = $i+1;
    					}
    				
    				}else{
    					$noempty[$j] = $val['name'];
    					$j = $j+1;
    				}
    			}else{
    				if(empty($val['value'])){
    					$list[$i] = $val['name'];
    					$i = $i+1;
    				}else{
    					$noempty[$j]=$val['name'];
    					$j = $j+1;
    				}
    			}
    			
    			
    		}
    	}
    	echo $count."xxx";
    	var_dump($list);
    	exit();
    }
  


}