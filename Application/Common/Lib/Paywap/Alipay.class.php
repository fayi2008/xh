<?php
/* *
 * 功能：即时到账交易接口接入页
 *************************注意*************************
 * 如果您在接口集成过程中遇到问题，可以按照下面的途径来解决
 * 1、商户服务中心（https://b.alipay.com/support/helperApply.htm?action=consultationApply），提交申请集成协助，我们会有专业的技术工程师主动联系您协助解决
 * 2、商户帮助中心（http://help.alipay.com/support/232511-16307/0-16307.htm?sh=Y&info_type=9）
 * 3、支付宝论坛（http://club.alipay.com/read-htm-tid-8681712.html）
 * 如果不想使用扩展功能请把扩展功能参数赋空值。
 */


namespace Common\Lib\Paywap;

class Alipay{
    protected  $alipay_config;
    function __construct($alipay_config=array()){
        $this->alipay_config =array_merge(C('ALIPAY'),$alipay_config);

    }

    /**
     * @param $out_trade_no 订单号
     * @param $subject 标题
     * @param $total_fee 消费金额
     * @param string $seller_email 收款人帐号
     * @param string $notify_url 服务器异步通知页面路径
     * @param string $call_back_url 页面跳转同步通知页面路径
     * @param string $merchant_url 操作中断返回地址
     */
    function pay($out_trade_no,$subject,$total_fee,$seller_email = "",$notify_url = "",$call_back_url = "",$merchant_url = "")
    {
        /**************************调用授权接口alipay.wap.trade.create.direct获取授权码token**************************/
        $alipay_config= $this->alipay_config;

        if(!$seller_email)
        {
            $seller_email=C('ALIPAY.account');
        }
        if(!$notify_url)
        {
            $notify_url=C('ALIPAY.notify_url');
        }
        if(!$call_back_url)
        {
            $call_back_url=C('ALIPAY.call_back_url');
        }
        if(!$merchant_url)
        {
            $merchant_url=C('ALIPAY.merchant_url');
        }
//返回格式
        $format = "xml";
//必填，不需要修改

//返回格式
        $v = "2.0";
//必填，不需要修改

//请求号
        $req_id = date('Ymdhis').$out_trade_no;
//必填，须保证每次请求都是唯一

//请求业务参数详细
        $req_data = '<direct_trade_create_req><notify_url>' . $notify_url . '</notify_url><call_back_url>' . $call_back_url . '</call_back_url><seller_account_name>' . $seller_email . '</seller_account_name><out_trade_no>' . $out_trade_no . '</out_trade_no><subject>' . $subject . '</subject><total_fee>' . $total_fee . '</total_fee><merchant_url>' . $merchant_url . '</merchant_url></direct_trade_create_req>';
//必填

        /************************************************************/

//构造要请求的参数数组，无需改动
        $para_token = array(
            "service" => "alipay.wap.trade.create.direct",
            "partner" => trim($alipay_config['partner']),
            "sec_id" => trim($alipay_config['sign_type']),
            "format"	=> $format,
            "v"	=> $v,
            "req_id"	=> $req_id,
            "req_data"	=> $req_data,
        	"qr_pay_mode"=>2,
            "_input_charset"	=> trim(strtolower($alipay_config['input_charset']))
        );


//建立请求
        $alipaySubmit = new AlipaySubmit($alipay_config);
        $html_text = $alipaySubmit->buildRequestHttp($para_token);

//URLDECODE返回的信息
        $html_text = urldecode($html_text);
//var_dump($html_text);
//解析远程模拟提交后返回的信息
        $para_html_text = $alipaySubmit->parseResponse($html_text);
//var_dump($para_html_text);
//获取request_token
        $request_token = $para_html_text['request_token'];
//var_dump($request_token);
//exit;
        /**************************根据授权码token调用交易接口alipay.wap.auth.authAndExecute**************************/

//业务详细
        $req_data = '<auth_and_execute_req><request_token>' . $request_token . '</request_token></auth_and_execute_req>';
//必填

//构造要请求的参数数组，无需改动
        $parameter = array(
            "service" => "alipay.wap.auth.authAndExecute",
            "partner" => trim($alipay_config['partner']),
            "sec_id" => trim($alipay_config['sign_type']),
            "format"	=> $format,
            "v"	=> $v,
            "req_id"	=> $req_id,
            "req_data"	=> $req_data,
            "_input_charset"	=> trim(strtolower($alipay_config['input_charset']))
        );

//建立请求
        $alipaySubmit = new AlipaySubmit($alipay_config);
        $html_text = $alipaySubmit->buildRequestForm($parameter, 'get', '确认');
        echo $html_text;
    }
}


