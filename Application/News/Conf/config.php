<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (
        array('news$','news/index/index_get_html','',array('ext'=>'html','method'=>'get')),
        array('news/build','news/index/build_get_html','',array('ext'=>'html','method'=>'get')),
        array('news/login','news/index/login_get_html','',array('ext'=>'html','method'=>'get')),
        array('news/detail','news/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;
