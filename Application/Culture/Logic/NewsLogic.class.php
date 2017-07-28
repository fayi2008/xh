<?php
/**
 * Author: Jason
 * Date: 2015/9/7
 * Time: 15:47
 * Description: 
 */

namespace Culture\Logic;


use Culture\Model\NewsModel;
use Culture\Model\NewsCategoryModel;

class NewsLogic extends \Think\Model {

    function _initialize()
    {
        $this->model=new NewsModel();
        $this->cate = new NewsCategoryModel();
    }

    function news_list(){
    	$selectArr=$_GET;
    	$where['STATUS']=1;
    	$field = array('ID','TITLE','DATATIME','WRITER');
    	$start = intval ( I ( "get.start" ) );
    	$length = intval ( I ( "get.limit" ) );
    	//排序条件
    	$order='';
    	if(!empty($selectArr['field'])){
    		$order=''.strtoupper($selectArr['field']).' '.$selectArr['direction'].',';
    	}
    	if($selectArr['field']!=='id'){
    		$order.=' ID DESC';
    	}
    	$order=rtrim($order,',');
    	$list = $this->model->field($field)->where($where)->limit ( $start . ',' . $length )->order($order)->select();
    	$count = $this->model->field ( $field )->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
    }
    
    function add(){
		$data=$this->model->create();
	//	var_dump($data);die();
		if(empty($data['TITLE'])){
			return 2;
		}elseif(empty($data['CONTENT'])){
			return 3;
		}
		if($data){
			$res=$this->model->add($data);
			AdminLog($res, 1, json_encode($data), "添加资讯");
			return $res;
		}else{
			return false;
		}
	}
	
	function getnews(){
		$id = I('id');
		$where['ID'] = $id;
		$res = $this->model->where($where)->find();
		if(empty($res)){
			return false;
		}else{
			return $res;
		}
	}
    
	function edit(){
		if ($data = $this->model->create ( I('put.') )) {
			$res = $this->model->save( $data );
			AdminLog($data['ID'], 2, json_encode($data), "编辑资讯");
			return $res;
		}else {
			return false;
		}	
	}
	
	function delete(){
		$id = I('id');
		$where['ID'] = $id;
		$data['STATUS']='0';
		$res = $this->model->where($where)->save($data);
		AdminLog($data['ID'], 3, '', "删除资讯");
		if(false === $res){
			return false;
		}else{
			return $res;
		}	
	}
	

	function web_get_list($CATEGORY = '',$LIMIT = 20){
		$where = array ();
		if(!empty($CATEGORY)){
			$where['CATEGORYID'] = $CATEGORY;
		}
		$where ['STATUS'] = array (
				'neq',
				0
		);
// 		$field = array (
// 				'ID,TITLE,URL,THUMBNAILS,MAINIMG,CONTENT,SCENERY,DATATIME,WRITER,COMMENT_COUNT,SUPPORT_NUM'
// 		);
		// 去掉CONTENT字段
		$field = array (
				'ID,TITLE,URL,THUMBNAILS,MAINIMG,SCENERY,DATATIME,WRITER,COMMENT_COUNT,SUPPORT_NUM'
		);
		$start = intval ( I ( "get.start" ) );
		$l = I ( "get.limit");
		if(empty($l)){		
			$length = $LIMIT ;
		}else{
			$length = intval (I ( "get.limit" ));
		}
		$list = $this->model->field ( $field )->where ( $where )->limit ( $start . ',' . $length )->select ();
		$count = $this->model->field ( $field )->where ( $where )->count ();
		$data['data']=$list;
		$data['count'] = $count;	
		return $data;
	}
	
	function getcate(){
		
		$res = $this->cate->field('ID,NAME')->select();
		if(!empty($res)){
			return $res;
		}else {
			return false;
		}
	}
}