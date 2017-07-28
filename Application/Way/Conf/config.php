<?php
$config = array(
    'LOAD_EXT_CONFIG' => array('WAY_TAG'=>'way_tag')
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (
    	array('way/admin/:a','way/admin/:1','',array('method'=>'get')),
        array('way/admin','way/admin/index_get_html','',array('ext'=>'html','method'=>'get')),

    	array('way/list','way/index/way_list_get_json','',array('ext'=>'json','method'=>'get')),
    	array('way/diy_list','way/index/way_diy_list_get_json','',array('ext'=>'json','method'=>'get')),
    	array('way/detail/:id\d','way/index/way_detail_get_json','',array('ext'=>'json','method'=>'get')),

        array('way$','way/index/index_get_html','',array('ext'=>'html','method'=>'get')),
        array('way/:id\d','way/index/detail_get_html','',array('ext'=>'html','method'=>'get')),
        array('way/map/:id\d','way/index/map_get_html','',array('ext'=>'html','method'=>'get')),
        array('way/choice$','way/index/choice_get_html','',array('ext'=>'html','method'=>'get')),
        array('way/custom$','way/index/custom_get_html','',array('ext'=>'html','method'=>'get')),

        array('way/reco$','way/index/reco_get_html','',array('ext'=>'html','method'=>'get')),
        array('way/nearby$','way/index/nearby_get_html','',array('ext'=>'html','method'=>'get')),
        array('way/nearby','way/index/nearby_get_json','',array('ext'=>'json','method'=>'get')),
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;

