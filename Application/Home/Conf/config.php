<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (
        array('nav$','Home/index/nav','',array('ext'=>'html','method'=>'get')),
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;

