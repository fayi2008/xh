<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (
          array('location$','location/index/index_get','',array('ext'=>'json','method'=>'get')),
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;

