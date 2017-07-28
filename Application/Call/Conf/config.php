<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (

        array('call$','call/index/index_get_html','',array('ext'=>'html','method'=>'get')),
        array('call$','call/index/index_post','',array('method'=>'post')),
    	array('call$','call/index/index_get_json','',array('ext'=>'json', 'method'=>'get')),
   		array('call/:id\d','call/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
    	array('call/:id\d','call/index/detail_get_json','',array('ext'=>'json','method'=>'get')),
 )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;

