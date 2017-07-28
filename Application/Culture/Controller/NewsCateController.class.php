<?php
namespace Culture\Controller;

class NewsCateController extends \Common\Controller\AdminController {
	
	function _init() {
		$this->logic = new \Culture\Logic\NewsCateLogic ();
		
	}

  
    public function index_category(){
    	$category_list=$this->logic->category_list();
    	$this->assign('category_list',$category_list);
    	$this->display();
    }


    
    
    function category_add(){   
    	$list=$this->logic->getCategorySelect();
    	$this->assign('list',$list);	
    	$this->display ("/NewsCate/category_add");
    }
    
    function category_post() {
    	$res = $this->logic->cateadd ();
    	if (false === $res) {
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				'url' => '/Culture/NewsCate/index_category.html',
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => '/Culture/NewsCate/index_category.html',
    		)
    		);
    	}
    }
	
    function category_delete() {
    	$res = $this->logic->catedelete ();
    	if (false === $res) {
    		$this->ajaxReturn ( array (
    				'status' => 0,
    				/* 'url' => '/Culture/NewsCate/index_category.html', */
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    			/* 	'url' => U ( '/Culture/NewsCate/index_category.html' ), */
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
    				'url' => '/Culture/NewsCate/index_category.html',
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => '/Culture/NewsCate/index_category.html',
    		)
    		);
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
    		$xml .='<xsd:"无要素数据"'."\r";
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
    $res = $this->logic->cateattradd();
    	if (false === $res) {    	 
    		 $this->ajaxReturn ( array (
    				'status' => 0,
/*     				'url' => '/Culture/NewsCate/index_category.html',*/
    		 		'msg' => $this->logic->getError ()
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
    				'url' => U ( '/Culture/NewsCate/index.html' ),
    				'msg' => $this->logic->getError ()
    		) );
    	} else {
    		$this->ajaxReturn ( array (
    				'status' => 1,
    				'url' => U ( '/Culture/NewsCate/index.html' ),
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
    		$res = $this->logic->putCate($va,$k);
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