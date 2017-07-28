<?php
namespace Admin\Logic;

class IndexLogic extends \Think\Model {
    /**
     * Description: main 系统首页数据
     * Author: Jason
     * Date:
     */
	function main() {
		if (ROLE_ID == 1) {
			$info = array (
					'系统发布' => 'logomap ' . APP_VERSION . '发布',
					'操作系统' => PHP_OS,
					'运行环境' => $_SERVER ["SERVER_SOFTWARE"],
					'PHP运行方式' => php_sapi_name (),
					'上传附件限制' => ini_get ( 'upload_max_filesize' ),
					'执行时间限制' => ini_get ( 'max_execution_time' ) . "秒",
					'剩余空间' => round ( (@disk_free_space ( "." ) / (1024 * 1024)), 2 ) . 'M',
					'MYSQL版本' => mysql_get_server_info () 
			);
		} else {
			$info = array (
					'系统发布' => 'logomap ' . APP_VERSION . '发布',
					'上传附件限制' => ini_get ( 'upload_max_filesize' ),
					'执行时间限制' => ini_get ( 'max_execution_time' ) . "秒" 
			);
		}
        return $info;
	}
}

?>