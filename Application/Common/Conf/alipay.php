<?php

/**
 * alipay配置文件
 */
return array(
    'partner' => "2088212350307852",//合作身份者id，以2088开头的16位纯数字,
    'key' => '2p2sm1ve67b02httbqn5aptlcbviibvp',//如果签名方式设置为“MD5”时，请设置该参数,安全检验码，以数字和字母组成的32位字符
    'private_key_path'=>APP_ROOT.'static/resource/paywap/key/rsa_private_key.pem',//如果签名方式设置为“0001”时，请设置该参数,商户的私钥（后缀是.pen）文件相对路径
    'ali_public_key_path'=>APP_ROOT.'static/resource/paywap/key/alipay_public_key.pem',//支付宝公钥（后缀是.pen）文件相对路径
    'sign_type'=> 'MD5',//签名方式 不需修改
    'input_charset' => 'utf-8',//字符编码格式 目前支持 gbk 或 utf-8
    'cacert' => APP_ROOT.'static/resource/paywap/key/cacert.pem',//请保证cacert.pem文件在当前文件夹目录中
    'transport' => 'http',//访问模式,根据自己的服务器是否支持ssl访问，若支持请选择https；若不支持请选择http
    'account' => 'hongquankeji@163.com',//收款人帐号
    'notify_url' => "/Api/Alipay/notify",//服务器异步通知页面路径
    'call_back_url'=>"/Api/Alipay/callback", //页面跳转同步通知页面路径
    'merchant_url' => "/Api/Alipay/merchant", //操作中断返回地址
);
