<?php
/**
 * @Author       : ward
 * @Date         : 2015.10.23
 * @Description  : 全景管理控制器主要全景的数据操作
 */

namespace System\Controller;

use System\Logic\DatabaseLogic;
class DatabaseController extends \Common\Controller\AdminController {
	
	
	
    /**
     * Description: index 显示数据库备份管理界面
     * Author: Jason
     * Date: 2015-10-21
     */
    public function index_get_html(){
        $this->display('index_index');
    }

    /**
	 * Description: index_get 获取 数据库备份名称 列表数据
	 * Author: ward
	 * Date:
	 */
	public function index_get_json(){
		$logic=new DatabaseLogic();
		$res=$logic->getLists();
		echo json_encode ($res);
		
	}
	
	
	/**
	 * Description: index_post 获取 数据库备份名称 列表数据
	 * Author: ward
	 * Date:
	 */
	public function backup_post(){
		
		$time=date('YmdHis');
		
		C('DB_USER','XH');
		C('DB_PWD','xihu2015hq');
		C('DB_NAME','XH');
		$shell='/var/www/dm/bin/dexp '.C('DB_USER').'/'.C('DB_PWD').' DIRECTORY='.C('BACKUP_PATH').' FILE='.$time.'_db_dm.dmp LOG='.$time.'_db_dm.log SCHEMAS='.C('DB_NAME').' NOLOG=y';
		
		
		$return=exec($shell);//若失败则$return 返回1
		if($return==1){
			$this->ajaxReturn(array('status'=>0,'msg'=>$lastLine));
		}else{
			$this->ajaxReturn(array('status'=>1,'msg'=>$lastLine));
		}
	}
	
	
	public function recovery_get(){
		$time=date('YmdHis');
		$file=$_GET['file'];
		if(!strpos($file,'.dmp')){
			$this->ajaxReturn(array('status'=>0,'msg'=>'文件后缀错误！'));
		}
		if(!file_exists( C('BACKUP_PATH').'/'.$file )){
			$this->ajaxReturn(array('status'=>0,'msg'=>'备份文件不存在'));
		}

		$fileName=basename($file,".dmp");
		C('DB_USER','XH');
		C('DB_PWD','xihu2015hq');
		C('DB_NAME','XH');
		$shell='/var/www/dm/bin/dimp '.C('DB_USER').'/'.C('DB_PWD').' DIRECTORY='.C('BACKUP_PATH').' FILE='.$fileName.'.dmp LOG='.$fileName.'-'.$time.'.log SCHEMAS='.C('DB_NAME').' NOLOG=y IGNORE=y';
		
		
		$return=exec($shell);//若失败则$return 返回1
		if($return==1){
			$this->ajaxReturn(array('status'=>0,'msg'=>$lastLine));
		}else{
			$this->ajaxReturn(array('status'=>1,'msg'=>$lastLine));
		}
	}
	
	
	public  function  index_delete(){
		$logic=new DatabaseLogic();
		$res=$logic->delete();//是根据文件名删除，而不是根据id
		
		if(!$return){
			$this->ajaxReturn(array('status'=>0,'msg'=>$logic->getError()));
		}else{
			$this->ajaxReturn(array('status'=>1,'msg'=>$lastLine));
		}
	}


}