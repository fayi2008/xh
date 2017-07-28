<?php
$config = array(
    //'配置项'=>'配置值'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (

        array('business$','Business/index/index_get_html','',array('ext'=>'html','method'=>'get')),
        array('business/:id\d','Business/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
        array('business/goods/:id\d','Business/index/goods_get_html','',array('ext'=>'html','method'=>'get')),
    	array('business/cate_get','Business/index/cate_get','',array('ext'=>'json','method'=>'get')),
    	array('business/goods_get/:poi_id\d','Business/index/goods_get','',array('ext'=>'json','method'=>'get')),
        array('business/:id\d','Business/index/detail_get','',array('ext'=>'json','method'=>'get')),
    	array('business/merchant/:id\d','Business/index/BusinessDetail','',array('ext'=>'json','method'=>'get')),
    	array('business/merchantlist','Business/index/getBusinessList','',array('ext'=>'json','method'=>'get')),
    	array('business/getorders','Business/order/index_get_json','',array('ext'=>'json','method'=>'get')),
        array('business/orders','Business/order/index_post','',array('ext'=>'json','method'=>'get')),
        array('business/pay_get','Business/order/pay_get','',array('ext'=>'html','method'=>'get')),
        array('business/confirm','Business/order/confirm','',array('ext'=>'json','method'=>'get')),

    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;
