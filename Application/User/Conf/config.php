<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (
        array('user/:id\d','user/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
        array('user$','user/index/index_get_html','',array('ext'=>'html','method'=>'get')),
        array('user/comment$','user/index/comment_get_html','',array('ext'=>'html','method'=>'get')),
        array('user/comment/travels$','user/index/travels_comment_get_html','',array('ext'=>'html','method'=>'get')),
		array('user/comment/news$','user/index/news_comment_get_html','',array('ext'=>'html','method'=>'get')),
        array('user/travels$','user/index/travels_get_html','',array('ext'=>'html','method'=>'get')),
        array('user/photo$','user/index/photo_get_html','',array('ext'=>'html','method'=>'get')),
		array('user/order$','user/index/order_get_html','',array('ext'=>'html','method'=>'get')),
        array('user/way$','user/index/way_get_html','',array('ext'=>'html','method'=>'get')),

    	array('user/login$','user/index/login_get_html','',array('ext'=>'html','method'=>'get')),
    	array('user/login$','user/index/login_post','',array('ext'=>'json','method'=>'post')),
    	array('user/logout$','user/index/logout_post','',array('ext'=>'json','method'=>'post')),
    	array('user/verifiy$','user/index/verifiy_get_json','',array('ext'=>'json','method'=>'get')),
    	array('user/register$','user/index/register_get_html','',array('ext'=>'html','method'=>'get')),
    	array('user/register$','user/index/register_post','',array('ext'=>'json','method'=>'post')),
    	array('user/upload$','user/index/upload_post','',array('method'=>'post')),
    	array('user/comment$','user/index/comment_get_json','',array('method'=>'get')),
    	array('user/travels$','user/index/travels_get_json','',array('method'=>'get')),
    	array('user/photo$','user/index/photo_get_json','',array('method'=>'get')),

    	array('user/profile$','user/index/profile_put','',array('method'=>'post')),
    	array('user/profile_s$','user/index/resetpwd_put','',array('method'=>'post')),
    	array('user/collect$','user/index/collect_get_json','',array('ext'=>'json','method'=>'get')),
    	array('user/collect$','user/index/collect_post','',array('method'=>'post')),
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;

