<?php
$config = array(
	//'配置项'=>'配置值'
    'SYSTEM_MOBILE'=>array('15757821826'),
    'COLLECT_EMAIL_IMAP_PATH'=>'{imap.qq.com:993/imap/ssl}INBOX',
    'COLLECT_EMAIL_USER'=>'1271390928@qq.com',
    'COLLECT_EMAIL_PASS'=>'kcnsxvjqpxmjfjig'

);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (
        array('system/menu','system/menu/index_put_json','',array('ext'=>'json','method'=>'put')),
    	array('system/database/:a','system/database/:1','',array('method'=>'get')),
    	
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;  
