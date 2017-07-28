<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (
        array('comment/:id\d','comment/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
        array('comment$','comment/index/index_get_html','',array('ext'=>'html','method'=>'get')),
    	array('comment$','comment/index/index_get_json','',array('ext'=>'json','method'=>'get')),
        array('comment$','comment/index/index_post','',array('method'=>'post')),
        array('comment/support','comment/index/support_post','',array('method'=>'post'))
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;
