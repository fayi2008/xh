<?php
return array(
    'URL_ROUTER_ON' => true, // 开启路由
    'URL_ROUTE_RULES' => array(
        array('admin/main', 'admin/index/main', '', array('ext' => 'html', 'method' => 'get')),
    )
);