<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2014 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: liu21st <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用入口文件

// 检测PHP环境
if(version_compare(PHP_VERSION,'5.4.0','<'))  die('require PHP > 5.4.0 !');

// 开启调试模式 建议开发阶段开启 部署阶段注释或者设为false
define('APP_DEBUG',false);
//项目版本号
define('APP_VERSION','2.61');
//项目名称
define('APP_NAME','xh');
// 定义应用目录
define('APP_PATH','../Application/');
//公开目录
define('PUBLIC_ROOT',   dirname($_SERVER['SCRIPT_FILENAME']).'/');
//项目根目录
define('APP_ROOT',   PUBLIC_ROOT.'../');
//项目缓存目录
define('RUNTIME_PATH',   APP_ROOT.'Runtime/');
//自动生成目录安全文件
define('BUILD_DIR_SECURE', false);

if(!file_exists(PUBLIC_ROOT.'install.lock'))
{
    if(stripos($_SERVER['REQUEST_URI'],'install')===false)
    {
        header('location:/install');
        exit;
    }

}
require '../vendor/autoload.php';
// 引入ThinkPHP入口文件
require '../ThinkPHP/ThinkPHP.php';

// 亲^_^ 后面不需要任何代码了 就是如此简单