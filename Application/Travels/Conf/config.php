<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (

        array('travels$','travels/index/index_get_html','',array('ext'=>'html','method'=>'get')),
    	array('travels$','travels/index/index_get_json','',array('ext'=>'json','method'=>'get')),
        array('travels$','travels/index/index_post','',array('method'=>'post')),
    	array('travels/release','travels/index/release_get_html','',array('ext'=>'html','method'=>'get')),
        array('travels/:id\d/comment$','travels/index/comment_get_html','',array('ext'=>'html','method'=>'get')),
        array('travels/:id\d','travels/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
    	array('travels/:id\d','travels/index/detail_get_json','',array('ext'=>'json','method'=>'get')),
    	array('travels/delete','travels/index/index_delete_html','',array('method'=>'get')),
    		
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;
