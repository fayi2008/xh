<?php
namespace System\Controller;

class CheckController extends \Think\Controller {

    /**
     * Description: web 检测网页是否正常
     * Author: Jason
     * Date:2015-12-11
     */
    public function web(){
        $url='http://'.C('WEB_HOST').'/checkweb.php';
        $res=http_return_header($url);
        if($res['header']['http_code']==200)
        {
            $web_status=array('status'=>$res['header']['http_code'],'error_num'=>0);
            F('web_status',$web_status);
            echo 'ok';
        }else{
            $web_status=F('web_status');
            $err_msg="请检查php或者nginx状况，web服务异常！";
            if($web_status)
            {
                $err_num=$web_status['error_num']+1;
            }else{
                $err_num=1;
            }
            $web_status=array('status'=>$res['header']['http_code'],'error_num'=>$err_num);
            F('web_status',$web_status);
            if($err_num==3)
            {
                if(is_array(C('SYSTEM_MOBILE')))
                {
                    foreach(C('SYSTEM_MOBILE') as $mobile)
                    {
                        send_message_new($mobile,$err_msg);
                    }
                }else{
                    send_message_new(C('SYSTEM_MOBILE'),$err_msg);
                }
            }
            echo $err_msg;
        }

    }

    /**
     * Description:db 检查db状态
     * Author:jason
     */
    function db()
    {
        $dbHost = trim(C('DB_HOST'));
        $db_dsn = $dbHost . ':' . C('DB_PORT');
        $conn = dm_connect($db_dsn, C('DB_USER'), C('DB_PWD'));
        if (!$conn) {
            $db_status=F('db_status');
            $err_msg="连接数据库失败!";
            if($db_status)
            {
                $err_num=$db_status['error_num']+1;
            }else{
                $err_num=1;
            }
            $db_status=array('status'=>$conn,'error_num'=>$err_num);
            F('db_status',$db_status);
            if($err_num==3)
            {
                if(is_array(C('SYSTEM_MOBILE')))
                {
                    foreach(C('SYSTEM_MOBILE') as $mobile)
                    {
                        send_message_new($mobile,$err_msg);
                    }
                }else{
                    send_message_new(C('SYSTEM_MOBILE'),$err_msg);
                }
            }
            echo $err_msg;
        }else{
            $web_status=array('status'=>$conn,'error_num'=>0);
            F('db_status',$web_status);
            echo "db normal!";
        }
    }

    function webservice()
    {
        $url=C('SEND_CULTURE_WEBSERVICE');
        $res=http_return_header($url);
        if($res['header']['http_code']==200)
        {
            $web_status=array('status'=>$res['header']['http_code'],'error_num'=>0);
            F('webservice_status',$web_status);
            echo 'ok';
        }else{
            $web_status=F('webservice_status');
            $err_msg="请检查webservice状况，webservice服务异常！";
            if($web_status)
            {
                $err_num=$web_status['error_num']+1;
            }else{
                $err_num=1;
            }
            $web_status=array('status'=>$res['header']['http_code'],'error_num'=>$err_num);
            F('webservice_status',$web_status);
            if($err_num==3)
            {
                if(is_array(C('SYSTEM_MOBILE')))
                {
                    foreach(C('SYSTEM_MOBILE') as $mobile)
                    {
                        send_message_new($mobile,$err_msg);
                    }
                }else{
                    send_message_new(C('SYSTEM_MOBILE'),$err_msg);
                }
            }
            echo $err_msg;
        }
    }

    function test()
    {
        $err_msg="请检查php或者nginx状况，web服务异常！";
        if(is_array(C('SYSTEM_MOBILE')))
        {
            foreach(C('SYSTEM_MOBILE') as $mobile)
            {
                send_message_new($mobile,$err_msg);
            }
        }else{
            send_message_new(C('SYSTEM_MOBILE'),$err_msg);
        }
    }

}
