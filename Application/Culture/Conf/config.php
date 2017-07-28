<?php

$config = array(
    //'配置项'=>'配置值'
    //'SEND_CULTURE_WEBSERVICE'=>"http://202.107.200.131:9001/KBI-tour-server/services/KBIServer?wsdl",
    'INTERFACENAME'=>'kbiadmin',
    'INTERFACEPASS'=>'kbi123456',
    'COLLECT_KEY'=>'f2c756aad0c8a9ce9b66e3a4f866b787'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (

        array('culture$','culture/index/index_get_html','',array('ext'=>'html','method'=>'get')),
        array('culture/:id\d','culture/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
        array('culture/list$','culture/index/list_get_html','',array('ext'=>'html','method'=>'get')),

        array('culture/news/list$','culture/index/newsList_get_html','',array('ext'=>'html','method'=>'get')),
        array('culture/news/:id\d','culture/index/news_get_html','',array('ext'=>'html','method'=>'get')),

    	array('culture/culture_cate','culture/index/culture_cate','',array('ext'=>'json','method'=>'get')),
    	array('culture/culture_search','culture/index/culture_search','',array('ext'=>'json','method'=>'get')),
        array('culture/:id\d','culture/index/culture_detail','',array('ext'=>'json','method'=>'get')),
        array('culture/news','culture/index/news_list','',array('ext'=>'json','method'=>'get')),
        array('culture/api/collection','culture/index/collection','',array()),
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;
