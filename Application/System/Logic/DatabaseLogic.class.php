<?php
namespace System\Logic;

class DatabaseLogic extends \Think\Model{
	
	
	
	public function  getLists(){
		$handler = opendir(C('BACKUP_PATH'));
		while( ($filename = readdir($handler)) !== false ){
			if($filename != '.' && $filename != '..'&&strpos($filename, '.dmp') !== false){
				$files[] = $filename ;
			}
		}
		closedir($handler);
		$start = intval ( I ( "get.start" ) )==0?1:intval ( I ( "get.start" ) )+1;
		$length = intval ( I ( "get.limit" ) )==0?30:intval ( I ( "get.limit" ) );
		if(empty($files)){
			return $reslut=array('rows'=>'','results'=>0);
		}
		foreach ($files as $key=>$value) {
			$key=$key+1;
			if($key>=$start&&$key<($start+$length)){
				$a=filectime(C('BACKUP_PATH').$value);
				
				$list[]=array('id'=>$key,'file'=>$value,'create_time'=>date("Y-m-d H:i:s",$a));
			}
				
		}
		$reslut ['rows'] = $list;
		$reslut ['results'] = count($files);
		return $reslut;
	}
	
	
	
	/*
	 * 
	 */
	public function delete(){
		$files=I('get.files');		
		if(!is_array($files)||empty($files)){
			return false;
		}
		$ret=true;
		foreach ($files as $k=>$v){
			$ret=unlink(C('BACKUP_PATH').'/'.$v);
			if(!$ret){
				$this->setError('删除'.$v.'失败！');
				break;
			}
		}
		return $ret;
	}
}

