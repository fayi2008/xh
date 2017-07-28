<?php
$config = array(
    //'配置项'=>'配置值'
    'PANO_IMAGES_PATH'=>PUBLIC_ROOT.'pano/',
    'PANO_TOOLS_PATH'=>APP_ROOT.'Tools/krpanotools',
    'BD_MAP_API_KEY'=>'8lO6Y9WE9ea11T0bAVwQfmmX',
    'PANO_TOOLS_KEY'=>'bEQSsRPMLlv1V/7kCvyw/aCJl/neQ9N6EYcRP1XkKldMgc+5GlXyoS2oPtpAlq4ZeWUKWiX3m5p7ear2pY8J0rRAOSdn2u0+fv0ubNlEPo94ELEDYRvdeWGIyQgjwDtjkabP+t4q9TxOtFpspKi7o94Otwv/L/jUp5mR3JI8hPpYVsHdNDMowEHbjOjUng+b9QciFg4GG2zjWuZgn98Ydl37y41d8GOlQXd2bhe58gqwQfPjeK18pjYMWOdWcYGFuLDpZE13GnAyEa4SAa/W+0WKj5J8eZdcox94jgWdjCh1yaCG2dw+/OcvNBs/3bXw3UkT6UY3Rt91+CSToHCrxQ==',
	'PANO_API_WEBSERVICE'=>'http://202.107.200.131:8188/ZnlyWebService/executeWS?wsdl',
	'INTERFACE_KEY'=>'SJCQ001'
);
$route_config = array (
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array (
        array('panorama/admin$','panorama/admin/index_get_html','',array('ext'=>'html','method'=>'get')),
    	array('panorama/admin/:a','panorama/admin/:1','',array('method'=>'get')),
    	array('panorama/:key/hot/:hot','panorama/hot/index_get','',array('ext'=>'json','method'=>'get')),
    	array('panorama/:key/hot','panorama/hot/index_get','',array('ext'=>'json','method'=>'get')),	 
    	array('panorama/:key/culture','panorama/hot/culture_get','',array('ext'=>'json','method'=>'get')),
    	array('panorama/:key/group','panorama/group/list_get','',array('ext'=>'json','method'=>'get')),
    	array('panorama/poi','panorama/index/list_get','',array('method'=>'get')),
    	array('panorama/:key$','panorama/index/index_get_html','',array('ext'=>'html','method'=>'get')),
    	array('panorama/:key$','panorama/index/index_get','',array('ext'=>'json','method'=>'get')),
		array('panorama/:key/season','panorama/index/season_get_json','',array('ext'=>'json','method'=>'get')),
    )
);
$all_config = array_merge ( $config, $route_config );

return $all_config;

