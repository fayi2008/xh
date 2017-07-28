<?php

namespace Common\Lib\Wxpay;

class WxPayOld
{
    var $code;//code码，用以获取openid
    var $openid;//用户的openid
    var $parameters;//jsapi参数，格式为json
    var $package;//package的相关参数
    var $curl_timeout;//curl超时时间
    var $wx_config;//微信配置
	function __construct($config="") {
        $this->wx_config=array_merge(C("WXPAY_OLD",$config));
        $this->curl_timeout = $this->wx_config['CURL_TIMEOUT'];
	}

	/**
	 * 	作用：格式化参数，签名过程需要使用
	 */
	function formatBizQueryParaMap($paraMap, $urlencode)
	{
		$buff = "";
		ksort($paraMap);
		foreach ($paraMap as $k => $v)
		{
		    if($urlencode)
		    {
			   $v = urlencode($v);
			}
			//$buff .= strtolower($k) . "=" . $v . "&";
			$buff .= $k . "=" . $v . "&";
		}
		$reqPar='';
		if (strlen($buff) > 0) 
		{
			$reqPar = substr($buff, 0, strlen($buff)-1);
		}
		return $reqPar;
	}
	
	/**
	 * 	作用：生成签名
	 */
	public function getSign($Obj)
	{
		foreach ($Obj as $k => $v)
		{
			$Parameters[$k] = $v;
		}
		//签名步骤一：按字典序排序参数
		ksort($Parameters);
		$String = $this->formatBizQueryParaMap($Parameters, false);
		//echo '【string1】'.$String.'</br>';
		//签名步骤二：在string后加入KEY
		$String = $String."&key=".$this->wx_config['partner_key'];
		//echo "【string2】".$String."</br>";
		//签名步骤三：MD5加密
		$String = md5($String);
		//echo "【string3】 ".$String."</br>";
		//签名步骤四：所有字符转为大写
		$result_ = strtoupper($String);
		//echo "【result】 ".$result_."</br>";
		return $result_;
	}
	


	/**
	 * 	作用：以post方式提交xml到对应的接口url
	 */
	public function postXmlCurl($xml,$url,$second=30)
	{		
        //初始化curl        
       	$ch = curl_init();
		//设置超时
		curl_setopt($ch, CURLOP_TIMEOUT, $second);
        //这里设置代理，如果有的话
        //curl_setopt($ch,CURLOPT_PROXY, '8.8.8.8');
        //curl_setopt($ch,CURLOPT_PROXYPORT, 8080);
        curl_setopt($ch,CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
        curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,FALSE);
		//设置header
		curl_setopt($ch, CURLOPT_HEADER, FALSE);
		//要求结果为字符串且输出到屏幕上
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		//post提交方式
		curl_setopt($ch, CURLOPT_POST, TRUE);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
		//运行curl
        $data = curl_exec($ch);
		curl_close($ch);
		//返回结果
		if($data)
		{
			curl_close($ch);
			return $data;
		}
		else 
		{ 
			$error = curl_errno($ch);
			echo "curl出错，错误码:$error"."<br>"; 
			echo "<a href='http://curl.haxx.se/libcurl/c/libcurl-errors.html'>错误原因查询</a></br>";
			curl_close($ch);
			return false;
		}
	}

	/**
	 * 	作用：使用证书，以post方式提交xml到对应的接口url
	 */
	function postXmlSSLCurl($xml,$url,$second=30)
	{
		$ch = curl_init();
		//超时时间
		curl_setopt($ch,CURLOPT_TIMEOUT,$second);
		//这里设置代理，如果有的话
        //curl_setopt($ch,CURLOPT_PROXY, '8.8.8.8');
        //curl_setopt($ch,CURLOPT_PROXYPORT, 8080);
        curl_setopt($ch,CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
        curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,FALSE);
		//设置header
		curl_setopt($ch,CURLOPT_HEADER,FALSE);
		//要求结果为字符串且输出到屏幕上
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,TRUE);
		//设置证书
		//使用证书：cert 与 key 分别属于两个.pem文件
		//默认格式为PEM，可以注释
		curl_setopt($ch,CURLOPT_SSLCERTTYPE,'PEM');
		curl_setopt($ch,CURLOPT_SSLCERT, $this->config["SSLCERT_PATH"]);
		//默认格式为PEM，可以注释
		curl_setopt($ch,CURLOPT_SSLKEYTYPE,'PEM');
		curl_setopt($ch,CURLOPT_SSLKEY, $this->config["SSLKEY_PATH"]);
		//post提交方式
		curl_setopt($ch,CURLOPT_POST, true);
		curl_setopt($ch,CURLOPT_POSTFIELDS,$xml);
		$data = curl_exec($ch);
		//返回结果
		if($data){
			curl_close($ch);
			return $data;
		}
		else { 
			$error = curl_errno($ch);
			echo "curl出错，错误码:$error"."<br>"; 
			echo "<a href='http://curl.haxx.se/libcurl/c/libcurl-errors.html'>错误原因查询</a></br>";
			curl_close($ch);
			return false;
		}
	}
	
	/**
	 * 	作用：打印数组
	 */
	function printErr($wording='',$err='')
	{
		print_r('<pre>');
		echo $wording."</br>";
		var_dump($err);
		print_r('</pre>');
	}


    /**
     * 	作用：生成可以获得code的url
     */
    function createOauthUrlForCode($redirectUrl)
    {
        $wx_config = $this->wx_config;
        $urlObj["appid"] = $wx_config['APPID'];
        $urlObj["redirect_uri"] = "$redirectUrl";
        $urlObj["response_type"] = "code";
        $urlObj["scope"] = "snsapi_base";
        $urlObj["state"] = "STATE"."#wechat_redirect";
        $bizString = $this->formatBizQueryParaMap($urlObj, false);

        return "https://open.weixin.qq.com/connect/oauth2/authorize?".$bizString;
    }

    /**
     * 	作用：生成可以获得openid的url
     */
    function createOauthUrlForOpenid()
    {
        $wx_config = $this->wx_config;
        $urlObj["appid"] = $wx_config['APPID'];
        $urlObj["secret"] = $wx_config['APPSECRET'];
        $urlObj["code"] = $this->code;
        $urlObj["grant_type"] = "authorization_code";
        $bizString = $this->formatBizQueryParaMap($urlObj, false);
        return "https://api.weixin.qq.com/sns/oauth2/access_token?".$bizString;
    }


    /**
     * 	作用：通过curl向微信提交code，以获取openid
     */
    function getOpenid()
    {
        $url = $this->createOauthUrlForOpenid();
        //初始化curl
        $ch = curl_init();
        //设置超时
        curl_setopt($ch, CURLOP_TIMEOUT, $this->curl_timeout);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,FALSE);
        curl_setopt($ch,CURLOPT_SSL_VERIFYHOST,FALSE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        //运行curl，结果以jason形式返回
        $res = curl_exec($ch);
        curl_close($ch);
        //取出openid
        $data = json_decode($res,true);
        $this->openid = $data['openid'];
        return $this->openid;
    }

    /**
     * 	作用：设置code
     */
    function setCode($code_)
    {
        $this->code = $code_;
    }

    /**
     * 	作用：设置jsapi的参数
     */
    public function getParameters()
    {
        $wx_config = $this->wx_config;
        $this->parameters["appId"] = $wx_config['APPID'];
        $this->parameters["timeStamp"] = strval(time());
        $this->parameters["nonceStr"] = createNoncestr();
        $this->parameters["package"] = $this->getPackage();
        $this->parameters["signType"] = "SHA1";
        $this->parameters["paySign"] = $this->createSign();
        $this->parameters = json_encode($this->parameters);

        return $this->parameters;
    }

    function createSign()
    {
        $data['appid']=$this->parameters["appId"];
        $data['timestamp']=$this->parameters["timeStamp"];
        $data['noncestr']=$this->parameters["nonceStr"];
        $data['package']=$this->parameters["package"];
        $data['appkey']=$this->wx_config["pay_sign_key"];
        $string=$this->formatBizQueryParaMap($data,false);
        return sha1($string);

    }

    function setPackageParameter($parameter, $parameterValue)
    {
        $this->package[trim($parameter)] = trim($parameterValue);
    }

    public function getPackage()
    {
        try
        {
            //检测必填参数
            if($this->package["out_trade_no"] == null)
            {
                throw new Exception("缺少统一支付接口必填参数out_trade_no！"."<br>");
            }elseif($this->package["body"] == null){
                throw new SDKRuntimeException("缺少统一支付接口必填参数body！"."<br>");
            }elseif ($this->package["total_fee"] == null ) {
                throw new SDKRuntimeException("缺少统一支付接口必填参数total_fee！"."<br>");
            }elseif ($this->package["notify_url"] == null) {
                throw new SDKRuntimeException("缺少统一支付接口必填参数notify_url！"."<br>");
            }
            $this->package['bank_type']="WX";
            $this->package['fee_type']='1';
            $this->package["partner"] =  $this->wx_config['partner_id'];//商户号
            $this->package["spbill_create_ip"] = $_SERVER['REMOTE_ADDR'];//终端ip
            $this->package["input_charset"] = "UTF-8";
            $string2=$this->formatBizQueryParaMap($this->package,true);
            $sign = $this->getSign($this->package);

            return $string2.'&sign='.$sign;
        }catch (Exception $e)
        {
            die($e->getMessage());
        }

    }


}





?>
