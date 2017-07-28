<?php
/**
 * @Author       : jason
 * @Date         : 2015.12.03
 * @Description  : 全景CLI控制器
 */
namespace Panorama\Controller;

class ExeController extends \Think\Controller {
    protected $grouplogic,$poilogic,$panologic,$hotlogic;

	function _initialize() {
        defined('EXE_DATA_PATH')   or define('EXE_DATA_PATH',     RUNTIME_PATH.'EXE/');
	}

    /**
     * Description:批量制作全景
     * Author: Jason
     * Date:2015-12-03
     */
    function produce()
    {
        set_time_limit ( 0 );
        if(!function_exists('posix_getpid'))
        {
            tp_log('不存在posix_getpid函数,请安装php-process插件','ERR','makepano');
            exit('不存在posix_getpid函数,请安装php-process插件');
        }
        if(php_sapi_name()!=='cli')
        {
            tp_log('请在cli模式下运行该脚本','ERR','makepano');
            exit('请在cli模式下运行该脚本');
        }
        $pid=F('makepano_pid','',EXE_DATA_PATH);
        if(file_exists("/proc/$pid/cmdline")&&strpos(file_get_contents("/proc/$pid/cmdline"),'php')!==false)
        {
            exit('进程运行中,请勿重复运行');
        }
        $pid=posix_getpid();
        F('makepano_pid',$pid,EXE_DATA_PATH);
        /*if(!F('makepano_register','',EXE_DATA_PATH))
        {
            $this->register();
        }*/
        //服务器重启后注册会失效，改为每次重启进程重新注册下
        $this->register();
        $panologic = new \Panorama\Logic\PanoLogic ();
        while(true)
        {
            $panologic->makePanos();
            sleep(30);
        }
    }

    /**
     * Description: register 全景制作注册注册
     * Author: Jason
     * Date:2015-12-03
     */
	function register() {
		exec ( C ( 'PANO_TOOLS_PATH' ) . ' register '.C('PANO_TOOLS_KEY'), $arr );
        if(strpos($arr[1],'Code registered')!==false)
        {
            F('makepano_register',true,EXE_DATA_PATH);
        }
        tp_log($arr[1],'INFO','makepano_register');
	}
}