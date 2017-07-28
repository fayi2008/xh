<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (

        array('photo$','photo/index/index_get_html','',array('ext'=>'html','method'=>'get')),
        array('photo$','photo/index/index_post','',array('method'=>'post')),
        array('photo/m_list','photo/index/m_list_get_html','',array('ext'=>'html','method'=>'get')),
        array('photo/release','photo/index/release_get_html','',array('ext'=>'html','method'=>'get')),
        array('photo/:id\d/comment$','photo/index/comment_get_html','',array('ext'=>'html','method'=>'get')),
        array('photo/:id\d','photo/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
    	array('photo/:id\d','photo/index/detail_get_json','',array('ext'=>'json','method'=>'get')),
        array('photo/delete','photo/index/index_delete_html','',array('method'=>'get')),
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;
