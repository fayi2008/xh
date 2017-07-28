<?php

namespace Common\Lib\Api;

class WxChat {

	/**
	 * 微信推送过来的数据或响应数据
	 * @var array
	 */
	private $data = array();

	/**
	 * 主动发送的数据
	 * @var array
	 */
	private $send = array();

    const HOTEL_CONSUME_TMP_ID_SHORT='OPENTM202506979';
	/**
	 * 获取微信推送的数据
	 * @return array 转换为数组后的数据
	 */
	public function request() {
		if(!$this->auth())
        {
            \Think\Log::record("未通过签名认证");
            exit("未通过签名认证");
        }
		if (IS_GET) {
			exit($_GET['echostr']);
		} else {
            $xml_cont=file_get_contents("php://input");
			$xml = new \SimpleXMLElement($xml_cont);
            //\Think\Log::record(file_get_contents("php://input"));
			if(!$xml)
            {
                \Think\Log::record("不存在xml数据",'ERR',true);
                exit;
            }
			foreach ($xml as $key => $value) {
				$this->data[$key] = strval($value);
			}
//             if(APP_DEBUG)
//             {
//                 \Think\Log::record($xml_cont,'INFO',true);
//             }
		}
		return $this->data;
	}

	/**
	 * * 被动响应微信发送的信息（自动回复）
	 * @param  string $to      接收用户名
	 * @param  string $from    发送者用户名
	 * @param  array  $content 回复信息，文本信息为string类型
	 * @param  string $type    消息类型
	 * @param  string $flag    是否新标刚接受到的信息
	 * @return string          XML字符串
	 */
	public function response($content, $type = 'text', $flag = 0) {
		/* 基础数据 */
		$this->data = array(
			'ToUserName'	 => $this->data['FromUserName'],
			'FromUserName'	 => $this->data['ToUserName'],
			'CreateTime'	 => NOW_TIME,
			'MsgType'		 => $type,
		);

		/* 添加类型数据 */
		$this->$type($content);

		/* 添加状态 */
		$this->data['FuncFlag'] = $flag;
		
		/* 转换数据为XML */
		$xml = new \SimpleXMLElement('<xml></xml>');
		$this->data2xml($xml, $this->data);
		exit($xml->asXML());
	}

    /**
     * * 上传媒体文件
     *
     * @param string $content   内容
     * @param string $openid   	发送者用户名
     * @param string $type   	类型
     * @return array 返回的信息
     */
    public function upload($file,$type) {
        /* 基础数据 */
        $accesstoken = $this->getToken();
        $params['media'] = $file;
        $url="http://file.api.weixin.qq.com/cgi-bin/media/upload?access_token={$accesstoken}&type={$type}";
        $restr=http($url , array('from'=>"logomap"),'POST' ,array(),$params);
        $res=json_decode($restr,true);
        return $res;
    }

	/**
	 * * 主动发送消息
	 *
	 * @param string $content   内容
	 * @param string $openid   	发送者用户名
	 * @param string $type   	类型
	 * @return array 返回的信息
	 */
	public function sendMsg($content, $openid = '', $type = 'text', $url_decode=false) {
		/* 基础数据 */
		$this->send ['touser'] = $openid;
		$this->send ['msgtype'] = $type;

		/* 添加类型数据 */
		$sendtype = 'send' . $type;
		$this->$sendtype($content);

		/* 发送 */
        if($url_decode)
        {
            $sendjson = urldecode(json_encode($this->send));
        }else{
            $sendjson = json_encode($this->send);
        }

		$restr = $this->send($sendjson);
		return $restr;
	}

	/**
	 * 发送文本消息
	 * 
	 * @param string $content
	 *        	要发送的信息
	 */
	private function sendtext($content) {
		$this->send ['text'] = array(
			'content' => $content
		);
	}

	/**
	 * 发送图片消息
	 * 
	 * @param string $content
	 *        	要发送的信息
	 */
	private function sendimage($content) {
		$this->send ['image'] = array(
			'media_id' => $content
		);
	}

	/**
	 * 发送视频消息
	 * @param  string $video 要发送的信息
	 */
	private function sendvideo($video) {
		list (
			$video ['media_id'],
			$video ['title'],
			$video ['description']
			) = $video;

		$this->send ['video'] = $video;
	}

	/**
	 * 发送语音消息
	 * 
	 * @param string $content
	 *        	要发送的信息
	 */
	private function sendvoice($content) {
		$this->send ['voice'] = array(
			'media_id' => $content
		);
	}

	/**
	 * 发送音乐消息
	 * 
	 * @param string $music
	 *        	要发送的信息
	 */
	private function sendmusic($music) {
		list (
			$music ['title'],
			$music ['description'],
			$music ['musicurl'],
			$music ['hqmusicurl'],
			$music ['thumb_media_id']
			) = $music;

		$this->send ['music'] = $music;
	}

	/**
	 * 发送图文消息
	 * @param  string $news 要回复的图文内容
	 */
	private function sendnews($news) {
		$articles = array();
		foreach ($news as $key => $value) {
			list(
				$articles[$key]['title'],
				$articles[$key]['description'],
				$articles[$key]['url'],
				$articles[$key]['picurl']
				) = $value;
			if ($key >= 9) {
				break;
			} //最多只允许10调新闻
		}
		$this->send['news']['articles'] = $articles;
	}

	/**
	 * * 获取微信用户的基本资料
	 * 
	 * @param string $openid   	发送者用户名
	 * @return array 用户资料
	 */
	public function user($openid = '') {
		if ($openid) {
			header("Content-type: text/html; charset=utf-8");
			$url = 'https://api.weixin.qq.com/cgi-bin/user/info';
			$params = array();
			$params ['access_token'] = $this->getToken();
			$params ['openid'] = $openid;
		//	var_dump($params);exit('rerward1206');
			$httpstr = http($url, $params);
			$harr = json_decode($httpstr, true);
			return $harr;
		} else {
			return false;
		}
	}
	
	/**
	 * * 获取微信用户的基本资料
	 *
	 * @param string $openid   	发送者用户名
	 * @return array 用户资料------ward 7-27
	 * 
	 */
//	public function user_new($openid = '',$access_tokens) {
//		if ($openid) {
//			header("Content-type: text/html; charset=utf-8");
//			$url = 'https://api.weixin.qq.com/cgi-bin/user/info';
//			$params = array();
//			$params ['access_token'] = $this->getAcessToken($appid='wx76dcc5e65cc93052',$secret='73e2a78b7d6d6657f2d98960402d89b8');
//			$params ['openid'] = $openid;
//			$httpstr = http($url,$params);
//			$harr = json_decode($httpstr, true);
//			return $harr;
//		} else {
//			return false;
//		}
//	}
    /**
     * * 获取关注微信用户列表
     *
     * @param string $openid   	发送者用户名
     * @return array 用户资料
     */
    public function getUserList($next_openid) {

            header("Content-type: text/html; charset=utf-8");
            $url = 'https://api.weixin.qq.com/cgi-bin/user/get';
            $params = array();
            $params ['access_token'] = $this->getToken();
            $params ['next_openid'] = $next_openid;
            $httpstr = http($url, $params);
            $harr = json_decode($httpstr, true);
            return $harr;

    }

	/**
	 * 生成菜单
	 * @param  string $data 菜单的str
	 * @return string  返回的结果；
	 */
	public function setMenu($data = NULL) {
		$access_token = $this->getToken();
		$url = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token={$access_token}";
		$menustr = http($url, $data, 'POST', array("Content-type: text/html; charset=utf-8"), true);
		return $menustr;
	}

	/**
	 * 回复文本信息
	 * @param  string $content 要回复的信息
	 */
	private function text($content) {
		$this->data['Content'] = $content;
	}

	/**
	 * 回复音乐信息
	 * @param  string $music 要回复的音乐
	 */
	private function music($music) {
		list(
			$music['Title'],
			$music['Description'],
			$music['MusicUrl'],
			$music['HQMusicUrl']
			) = $music;
		$this->data['Music'] = $music;
	}

	/**
	 * 回复图文信息
	 * @param  string $news 要回复的图文内容
	 */
	private function news($news) {
		$articles = array();
		foreach ($news as $key => $value) {
// 			list(
// 				$articles[$key]['Title'],
// 				$articles[$key]['Description'],
// 				$articles[$key]['PicUrl'],
// 				$articles[$key]['Url']
// 				) = $value;
// 			if ($key >= 9) {
// 				break;
// 			} //最多只允许10调新闻
			
			$articles[$key]['Title']=$value['Title'];
			$articles[$key]['Description']=$value['Description'];
			$articles[$key]['PicUrl']=$value['PicUrl'];
			$articles[$key]['Url']=$value['Url'];
		}
		$this->data['ArticleCount'] = count($articles);
		$this->data['Articles'] = $articles;
	}

	/**
	 * 主动发送的信息
	 * @param  string $data    json数据
	 * @return string          微信返回信息
	 */
	private function send($data = NULL) {
		$access_token = $this->getToken();
		$url = "https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token={$access_token}";
		$restr = http($url, $data, 'POST', array("Content-type: text/html; charset=utf-8"), true);
		return $restr;
	}

    /**
     * Description: setIndustry设置模板所属行业
     * @param int $industry_id1
     * @param int $industry_id2
     * @return string
     * Author: Jason
     */
    public function setIndustry($industry_id1=11,$industry_id2=2) {

        $access_token = $this->getToken();
        $url = "https://api.weixin.qq.com/cgi-bin/template/api_set_industry?access_token={$access_token}";
        $data['industry_id1']=$industry_id1;
        $data['industry_id2']=$industry_id2;
        $json_data=json_encode($data);
        $restr = http($url, $json_data, 'POST', array("Content-type: text/html; charset=utf-8"), true);
        return $restr;
    }

    /**
     * Description: addTemplateId 添加模板，获取模板ID
     * @param string $template_id_short
     * @return string
     * Author: Jason
     */
    public function addTemplateId($template_id_short='') {
        $access_token = $this->getToken();
        $url = "https://api.weixin.qq.com/cgi-bin/template/api_add_template?access_token={$access_token}";
        $data['template_id_short']=$template_id_short;
        $json_data=json_encode($data);
        $restr = http($url, $json_data, 'POST', array("Content-type: text/html; charset=utf-8"), true);
        return $restr;
    }

    /**
     * Description: getHotelConsumeTemplateId获取酒店消费模板
     * Author: Jason
     */
    public function getHotelConsumeTemplateId()
    {

        $hotel_template_id= F('HOTEL_CONSUM_TEMPLATE_ID'.C('WECHAT_APPID'));
        if(!$hotel_template_id)
        {
            $this->setIndustry();
            $res=$this->addTemplateId(self::HOTEL_CONSUME_TMP_ID_SHORT);
            $data=json_decode($res,true);
            if($data['errmsg']=='ok')
            {
                F('HOTEL_CONSUM_TEMPLATE_ID'.C('WECHAT_APPID'),$data['template_id']);
            }
        }else{
            return $hotel_template_id;
        }
    }

    /**
     * 发送模版消息
     * @param  string $data    array数据
     * @return string          微信返回信息
     */
    public function templateMsg($send_data = NULL,$openid = '',$type="hotel_consume",$click_url="",$topcolor="#FF0000") {
        $access_token = $this->getToken();
        //tp_log('发送模板token'.$access_token);
        $url = "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token={$access_token}";
        $data['touser']=$openid;
        switch ($type){
            case 'hotel_consume':
                $template_id=$this->getHotelConsumeTemplateId();
                //tp_log('发送模板tem_id'.$template_id);
                break;
            case 'logomap_shop':
            	$template_id='WwYUPYQsPgP8pcHd167uj8ZeHTZJRjfSvxDNB3c0R98';
            	break;
            case 'notice': //待处理通知
            		$template_id='NjSkkXlbnEiqVLB4T0OCkDErmT-Y6vYh-Av22SuqOOU';
            		//tp_log('发送模板tem_id'.$template_id);
            		break;
        }
        $data['template_id']=$template_id;
        $data['url']=$click_url;
        $data['topcolor']=$topcolor;
        $data['data']=$send_data;
        $json_data=json_encode($data);
        $restr = http($url, $json_data, 'POST', array("Content-type: text/html; charset=utf-8"), true);
        tp_log('发送模板信息结果'.$restr);
        return $restr;
    }

	/**
	 * 数据XML编码
	 * @param  object $xml  XML对象
	 * @param  mixed  $data 数据
	 * @param  string $item 数字索引时的节点名称
	 * @return string
	 */
	private function data2xml($xml, $data, $item = 'item') {
		foreach ($data as $key => $value) {
			/* 指定默认的数字key */
			is_numeric($key) && $key = $item;

			/* 添加子元素 */
			if (is_array($value) || is_object($value)) {
				$child = $xml->addChild($key);
				$this->data2xml($child, $value, $item);
			} else {
				if (is_numeric($value)) {
					$child = $xml->addChild($key, $value);
				} else {
					$child = $xml->addChild($key);
					$node = dom_import_simplexml($child);
					$node->appendChild($node->ownerDocument->createCDATASection($value));
				}
			}
		}
	}

	/**
	 * 对数据进行签名认证，确保是微信发送的数据
	 * @param  string $token 微信开放平台设置的TOKEN
	 * @return boolean       true-签名正确，false-签名错误
	 */
	private function auth() {
		/* 获取数据 */
		$data = array($_GET['timestamp'], $_GET['nonce'], C('WECHAT_TOKEN'));
		$sign = $_GET['signature'];
		/* 对数据进行字典排序 */
		sort($data,SORT_STRING);
        $tmpstr=implode($data);
		/* 生成签名 */
		$signature = sha1($tmpstr);
        //\Think\Log::record($signature);
		return $signature === $sign;
	}

	/**
	 * 获取保存的accesstoken
	 */
	private function getToken($appid='',$secret='') {
        if(!$appid)
        {
            $appid=C('WECHAT_APPID');
        }
        if(!$secret)
        {
            $secret=C('WECHAT_APPSECRET');
        }
		static $stoken = null;
		// 从缓存获取ACCESS_TOKEN
		is_null($stoken) && $stoken = F('WX_S_TOKEN'.$appid);
		if (is_array($stoken)) {
			$nowtime = time();
			// 判断缓存里面的TOKEN保存了多久
			$difftime = $nowtime - $stoken ['tokentime'];
			// TOKEN有效时间7200 判断超过7000就重新获取;
			if ($difftime > 7000||!$stoken['token']) {
				// 去微信获取最新ACCESS_TOKEN
                $url='http://'.C('API_DOMAIN')."/wx/wx/get_token";
                $data=array(
                    'sign'=>'logomap@2015',
                    'appid'=>$appid,
                    'secret'=>$secret
                );
                $res=http($url,$data,'POST');
                $stoken = json_decode($res,true);
				// 放进缓存
                F('WX_S_TOKEN'.$appid, $stoken);
                $accesstoken=$stoken ['token'];
			} else {
				$accesstoken = $stoken ['token'];
			}
		} else {
			// 去微信获取最新ACCESS_TOKEN
            $url='http://'.C('API_DOMAIN')."/wx/wx/get_token";
            $data=array(
                'sign'=>'logomap@2015',
                'appid'=>$appid,
                'secret'=>$secret
            );
            $res=http($url,$data,'POST');
            $stoken = json_decode($res,true);
            F('WX_S_TOKEN'.$appid, $stoken); // 放进缓存
            $accesstoken=$stoken ['token'];
		}
		return $accesstoken;
	}
	

    /**
     * 获取保存的accesstoken提供给第三方使用
     */
    public function getBusinessToken($appid,$secret) {
        static $stoken = null;
        // 从缓存获取ACCESS_TOKEN
        is_null($stoken) && $stoken = F('WX_S_TOKEN'.$appid);
        if (is_array($stoken)) {
            $nowtime = time();
            // 判断缓存里面的TOKEN保存了多久
            $difftime = $nowtime - $stoken ['tokentime'];
            // TOKEN有效时间7200 判断超过7000就重新获取;
            if ($difftime > 7000||!$stoken['token']) {
                // 去微信获取最新ACCESS_TOKEN
                $url='http://'.C('API_DOMAIN')."/wx/wx/get_token";
                $data=array(
                    'sign'=>'logomap@2015',
                    'appid'=>$appid,
                    'secret'=>$secret
                );
                $res=http($url,$data,'POST');
                $stoken = json_decode($res,true);
                // 放进缓存
                F('WX_S_TOKEN'.$appid, $stoken);
            }
        } else {
            // 去微信获取最新ACCESS_TOKEN
            $url='http://'.C('API_DOMAIN')."/wx/wx/get_token";
            $data=array(
                'sign'=>'logomap@2015',
                'appid'=>$appid,
                'secret'=>$secret
            );
            $res=http($url,$data,'POST');
            $stoken = json_decode($res,true);
            F('WX_S_TOKEN'.$appid, $stoken); // 放进缓存
        }
        return $stoken;
    }

	/**
	 * 重新从微信获取accesstoken
	 */
	private function getAcessToken($appid='',$secret='') {
        $appid = $appid?$appid:C('WECHAT_APPID');
        $appsecret = $secret?$secret:C('WECHAT_APPSECRET');
        $token_num=F('access_token_num'.$appid);
        $today=date('Ymd');
        if(!isset($token_num[$today]))
        {
            $token_num[$today]=0;
        }
        if($token_num[$today]>=1000)
        {
            return false;
        }

		$url = 'https://api.weixin.qq.com/cgi-bin/token';
		$params = array();
		$params ['grant_type'] = 'client_credential';
		$params ['appid'] = $appid;
		$params ['secret'] = $appsecret;
		$httpstr = http($url, $params);

        $token_num[$today]++;
        F('access_token_num'.$appid,$token_num);
        tp_log(get_client_ip().' 今日调用次数:'.$token_num[$today]."\n APPID:".$appid."\n 调用accessToken内容:\n".$httpstr,"INFO",'access_token');
		$harr = json_decode($httpstr, true);
		return $harr['access_token'];
	}

    /**
     * Description: getApiToken 总接口专用，请勿随意使用
     * Author: Jason
     */
    function getApiToken($appid='',$secret='')
    {
        if(!$appid)
        {
            $appid=C('WECHAT_APPID');
        }
        if(!$secret)
        {
            $secret=C('WECHAT_APPSECRET');
        }
        static $apitoken = null;
        // 从缓存获取ACCESS_TOKEN
        is_null($apitoken) && $apitoken  = F('WX_S_TOKEN'.$appid);
        if (is_array($apitoken)) {
            $nowtime = time();
            // 判断缓存里面的TOKEN保存了多久
            $difftime = $nowtime - $apitoken ['tokentime'];
            // TOKEN有效时间7200 判断超过7000就重新获取;
            if ($difftime > 7000||!$apitoken ['token']) {
                // 去微信获取最新ACCESS_TOKEN
                $accesstoken = $this->getAcessToken($appid,$secret);
                $apitoken ['tokentime'] = time();
                $apitoken ['datetime'] = toDate();
                $apitoken ['token'] = $accesstoken;
                // 放进缓存
                F('WX_S_TOKEN'.$appid, $apitoken);
            }
        } else {
            // 去微信获取最新ACCESS_TOKEN
            $accesstoken = $this->getAcessToken($appid,$secret);
            $apitoken ['tokentime'] = time();
            $apitoken ['datetime'] = toDate();
            $apitoken ['token'] = $accesstoken;
            F('WX_S_TOKEN'.$appid, $apitoken); // 放进缓存
        }
        return $apitoken;
    }

    /**
     * 网页中获取code
     * @param $redirect_url
     * @param $scope 'snsapi_base'|'snsapi_userinfo'
     */
    function getCodeInWeb($redirect_url,$scope='snsapi_base',$appid="")
    {
        $appid = $appid?$appid:C('WECHAT_APPID');
        $url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$appid.'&redirect_uri='.urlencode($redirect_url).'&response_type=code&scope='.$scope.'&state=hqtec#wechat_redirect';
     	header("Location:$url");
    }

    function getCode($scope='snsapi_base',$appid="")
    {
        $appid = $appid?$appid:C('WECHAT_APPID');
        $redirect_url='http://' . C('API_DOMAIN') . '/Wx/Wx/getcodecontent';
        $url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$appid.'&redirect_uri='.urlencode($redirect_url).'&response_type=code&scope='.$scope.'&state=hqtec#wechat_redirect';
        header("Location:$url");
    }

    /**
     * 网页中获取openid
     * @param $code
     */
    function getOpenIdByCode($code,$appid="",$secret="")
    {
        $appid = $appid?$appid:C('WECHAT_APPID');
        $secret= $secret?$secret:C('WECHAT_APPSECRET');
        $url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='.$appid.'&secret='.$secret.'&code='.$code.'&grant_type=authorization_code';
        $httpstr=http($url);
        $res=json_decode($httpstr, true);
        return $res;
    }

    /**外部使用
     * Description: getJsTicket
     * @return mixed
     * Author: Jason
     */
    function getJsTicket($appid='',$secret='')
    {
        if(!$appid)
        {
            $appid=C('WECHAT_APPID');
        }
        if(!$secret)
        {
            $secret=C('WECHAT_APPSECRET');
        }
        static $jsapi_ticket = null;
        // 从缓存获取ACCESS_TOKEN
        is_null($jsapi_ticket) && $jsapi_ticket = S('WX_JSAPI_TICKET'.$appid);
        if (is_array($jsapi_ticket)) {
            $nowtime = time();
            // 判断缓存里面的TOKEN保存了多久
            $difftime = $nowtime - $jsapi_ticket ['get_time'];
            // TOKEN有效时间7200 判断超过7000就重新获取;
            if ($difftime > 7000||!$jsapi_ticket['ticket']) {
                $url='http://'.C('API_DOMAIN')."/Wx/Wx/get_ticket";
                $data=array(
                    'sign'=>'logomap@2015',
                    'appid'=>$appid,
                    'secret'=>$secret
                );
                $res=http($url,$data,'POST');
                $jsapi_ticket = json_decode($res,true);
                // 放进缓存
                S('WX_JSAPI_TICKET'.$appid, $jsapi_ticket); // 放进缓存
            }
        } else {
            // 去微信获取最新ACCESS_TOKEN
            $url='http://'.C('API_DOMAIN')."/wx/wx/get_ticket";
            $data=array(
                'sign'=>'logomap@2015',
                'appid'=>$appid,
                'secret'=>$secret
            );
            $res=http($url,$data,'POST');
            $jsapi_ticket = json_decode($res,true);
            S('WX_JSAPI_TICKET'.$appid, $jsapi_ticket); // 放进缓存
        }
        return $jsapi_ticket['ticket'];
    }

    /**
     * 私有方法
     * Description: getJsapiTicket
     * @return mixed
     * Author: Jason
     */
    private function getJsapiTicket($appid='',$secret='')
    {
        if(!$appid)
        {
            $appid=C('WECHAT_APPID');
        }
        if(!$secret)
        {
            $secret=C('WECHAT_APPSECRET');
        }
        $access_token = $this->getToken($appid,$secret);
        $url='https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='.$access_token.'&type=jsapi';
        $httpstr=http($url);
        $res=json_decode($httpstr, true);
        return $res;
    }

    /**
     * Description: getApiJsTicket总接口api模块调用，请勿随意调用
     * @return mixed
     * Author: Jason
     */
    function getApiJsTicket($appid='',$secret='')
    {
        if(!$appid)
        {
            $appid=C('WECHAT_APPID');
        }
        if(!$secret)
        {
            $secret=C('WECHAT_APPSECRET');
        }
        static $jsapi_ticket = null;
        // 从缓存获取ACCESS_TOKEN
        is_null($jsapi_ticket) && $jsapi_ticket = S('WX_JSAPI_TICKET'.$appid);
        if (is_array($jsapi_ticket)) {
            $nowtime = time();
            // 判断缓存里面的TOKEN保存了多久
            $difftime = $nowtime - $jsapi_ticket ['get_time'];
            // TOKEN有效时间7200 判断超过7000就重新获取;
            if ($difftime > 7000 || !$jsapi_ticket['ticket']) {
                // 去微信获取最新ACCESS_TOKEN
                $res=$this->getJsapiTicket($appid,$secret);
                $jsapi_ticket ['get_time'] = time();
                $jsapi_ticket ['date_time'] = toDate();
                $jsapi_ticket ['ticket'] = $res['ticket'];
                S('WX_JSAPI_TICKET'.$appid, $jsapi_ticket); // 放进缓存
            }
        } else {
            // 去微信获取最新ACCESS_TOKEN
            $res=$this->getJsapiTicket($appid,$secret);
            $jsapi_ticket ['get_time'] = time();
            $jsapi_ticket ['date_time'] = toDate();
            $jsapi_ticket ['ticket'] = $res['ticket'];
            S('WX_JSAPI_TICKET'.$appid, $jsapi_ticket); // 放进缓存
        }
        return $jsapi_ticket;
    }

    function createTicketSignature($noncestr,$timestamp,$url)
    {
        $ticket = $this->getJsTicket();
        $data = array('jsapi_ticket='.$ticket, "noncestr=".$noncestr, "timestamp=".$timestamp,'url='.$url);

        /* 对数据进行字典排序 */
        //sort($data,SORT_STRING);
        $tmpstr=implode('&',$data);
        /* 生成签名 */
        $signature = sha1($tmpstr);
        //\Think\Log::record($signature);
        return $signature;
    }

    function download($media_id) {
    /* 基础数据 */
    $accesstoken = $this->getToken();
    $url="http://file.api.weixin.qq.com/cgi-bin/media/get?access_token={$accesstoken}&media_id={$media_id}";
    $res=http_return_header($url);
    return $res;
	}
	
	/**
	 * 获取永久素材列表(认证后的订阅号可用)
	 * 
	 * @param string $type
	 *        	素材的类型,图片（image）、视频（video）、语音 （voice）、图文（news）
	 * @param int $offset
	 *        	全部素材的偏移位置，0表示从第一个素材
	 * @param int $count
	 *        	返回素材的数量，取值在1到20之间
	 * @return boolean|array 返回数组格式:
	 *         array(
	 *         'total_count'=>0, //该类型的素材的总数
	 *         'item_count'=>0, //本次调用获取的素材的数量
	 *         'item'=>array() //素材列表数组，内容定义请参考官方文档
	 *         )
	 */
	public function getForeverList($type, $offset, $count) {
		$accesstoken = $this->getToken();
		if (! $accesstoken)
			return false;
		$data = array (
				'type' => $type,
				'offset' => $offset,
				'count' => $count 
		);
		$url = "https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token={$accesstoken}" ;
		$result = http($url, json_encode ( $data ), 'POST', array("Content-type: text/html; charset=utf-8"), true);
		$json = json_decode ( $result, true );
		return $json;
			
	}

	/**
	 * 获取永久素材(认证后的订阅号可用)
	 * 返回图文消息数组或二进制数据，失败返回false
	 * @param string $media_id 媒体文件id
	 * @return boolean|array|raw data
	 */
	function getForeverMedia($media_id) {
		$accesstoken = $this->getToken();
		if (! $accesstoken)
			return false;
		$data = array (
				'media_id' => $media_id
		);
		$url = "https://api.weixin.qq.com/cgi-bin/material/get_material?access_token={$accesstoken}" ;
		$result = http_return_header($url, json_encode ( $data ), 'POST', array("Content-type: text/html; charset=utf-8"), true);
// 		$json = json_decode ( $result, true );
		return $result;
	}




	
    /**
     * 卡券模块：开发者需调用该接口上传商户图标至微信服务器，获取相应 logo_url，用于卡券创建。
     * @param:buffer 图片文件流
     * @author:freddy
     * @2015-6-15
     */
    public function uploadimg($buffer=NULL){
    	$accesstoken = $this->getToken();
    	if (! $accesstoken)
    		return false;
    	$url="https://api.weixin.qq.com/cgi-bin/media/uploadimg?access_token={$accesstoken}";

    	$data=array(
    			'buffer'=>$buffer,
    	);
    	$restr=http($url,array('from'=>"logomap"),'POST' ,array(),$data);
        $res=json_decode($restr,true);
    	return $res;
    }
    
    /**
     * 卡券模块:获得卡券的最新颜色列表，用于卡券创建。
     * @author:freddy
     * @2015-6-15
     */
    public function getcolors($data=NULL){
    	$accesstoken = $this->getToken();
    	if (! $accesstoken)
    		return false;
    	$url="https://api.weixin.qq.com/card/getcolors?access_token={$accesstoken}";
    	$restr=http($url , $data,'GET' ,array("Content-type: text/html; charset=utf-8"));
    	$restr=json_decode($restr);
    	return $restr;
    }
    /**
     * 卡券模块：用于编辑卡券基础信息。
     * @param：data 需根据微信接口文档设置好参数传进来
     * @author:frima
     * @2015-8-25
     */
    public function  editCard($data=NULL){
        $accesstoken = $this->getToken();
        if (! $accesstoken)
            return false;
        $url="https://api.weixin.qq.com/card/update?access_token={$accesstoken}";
        $data=json_encode($data,JSON_UNESCAPED_UNICODE);
        $restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
        return json_decode($restr,true);
    }
    /**
     * 卡券模块：用于创建一类新的卡券，获取 card_id。
     * @param：data 需根据微信接口文档设置好参数传进来
     * @author:freddy
     * @2015-6-15
     */
    public function  CreateCard($data=NULL){
    	$accesstoken = $this->getToken();
    	if (! $accesstoken)
    		return false;
    	$url="https://api.weixin.qq.com/card/create?access_token={$accesstoken}";
    	$data=json_encode($data,JSON_UNESCAPED_UNICODE);
    	$restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
    	return $restr;
    }
    
    /**
     * 创建卡券二维码，得到二维码ticket（注：获取二维码 ticket 后，开发者可用 ticket 换取二维码图片详情）
     * @author:Freddy
     * @date:2015-6-16
     */
    public function getCardTicket($data=NULL){
    	$accesstoken = $this->getToken();
    	if (!$accesstoken)
        {
            return false;
        }
    	$url="https://api.weixin.qq.com/card/qrcode/create?access_token={$accesstoken}";
    	$data=json_encode($data,JSON_UNESCAPED_UNICODE);
    	$restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
        //var_dump($restr);
        $restr=json_decode($restr,true);
    	return $restr;
    }
    
    /**
     * 根据ticket生成二维码
     * @author:Freddy
     * @date:2015-6-16
     */
    function showQrcode($data='',$ticket=NULL){
        if(!$ticket)
        {
            $ticket=$this->getCardTicket($data);
            $ticket=$ticket['ticket'];
        }
    	$ticket=urlencode($ticket);
    	$url="https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket={$ticket}";
    	$restr=http($url ,"",'GET' ,array("Content-type: text/html; charset=utf-8"));
        header('Content-type: image/jpeg');
    	return $restr;
    }

    /**
     * Description: createJsCardTicket 获取卡券js的ticket给各模块调用
     * 需要指定C('WECHAT_APPID')，C('WECHAT_APPSECRET')
     * @return mixed
     * Author: Jason
     */
    function createJsCardTicket()
    {
        static $jsCardTicket = null;
        // 从缓存获取card_js_ticket
        is_null($jsCardTicket) && $jsCardTicket = S('WX_JSCARD_TICKET'.C('WECHAT_APPID'));

        if (is_array($jsCardTicket)) {
            $nowtime = time();
            // 判断缓存里面的card_js_ticket保存了多久
            $difftime = $nowtime - $jsCardTicket ['get_time'];
            // card_js_ticket有效时间7200 判断超过7000就重新获取;
            if ($difftime > 7000||!$jsCardTicket['ticket']) {
                // 去微信获取最新card_js_ticket
                $url='http://'.C('API_DOMAIN')."/wx/wx/get_card_js_ticket";
                $data=array(
                    'sign'=>'logomap@2015',
                    'appid'=>C('WECHAT_APPID'),
                    'secret'=>C('WECHAT_APPSECRET')
                );
                $res=http($url,$data,'POST');
                $jsCardTicket = json_decode($res,true);
                // 放进缓存
                S('WX_JSCARD_TICKET'.C('WECHAT_APPID'), $jsCardTicket);
                $ticket = $jsCardTicket ['ticket'];
            } else {
                $ticket = $jsCardTicket ['ticket'];
            }
        } else {
            // 去微信获取最新card_js_ticket
            $url='http://'.C('API_DOMAIN')."/wx/wx/get_card_js_ticket";
            $data=array(
                'sign'=>'logomap@2015',
                'appid'=>C('WECHAT_APPID'),
                'secret'=>C('WECHAT_APPSECRET')
            );
            $res=http($url,$data,'POST');
            $jsCardTicket = json_decode($res,true);
            S('WX_JSCARD_TICKET'.C('WECHAT_APPID'), $jsCardTicket); // 放进缓存
            $ticket=$jsCardTicket ['ticket'];
        }
        return $ticket;
    }

    /**
     * Description: createCardTicketSignature生成卡券js签名
     * @param $noncestr
     * @param $timestamp
     * @param $card_id
     * @param $code
     * @param $openid
     * @return string
     * Author: Jason
     */
    function createCardTicketSignature($noncestr,$timestamp,$card_id,$code,$openid)
    {
        $ticket = $this->createJsCardTicket();
        $data = array($ticket,$noncestr,$timestamp,$card_id,$code,$openid);

        /* 对数据进行字典排序 */
        sort($data,SORT_STRING);
        $tmpstr=implode('',$data);
        /* 生成签名 */
        $signature = sha1($tmpstr);
        //\Think\Log::record($signature);
        return $signature;
    }

    /**
     * Description: 总接口api.logomap.com专用（请勿随意调用）
     * @return mixed
     * Author: Jason
     */
    function getApiCardTicket($appid,$secret)
    {
        static $jscard_ticket = null;
        // 从缓存获取card_js_ticket
        is_null($jscard_ticket) && $jscard_ticket = S('WX_JSCARD_TICKET'.$appid);
        if (is_array($jscard_ticket)) {
            $nowtime = time();
            // 判断缓存里面的card_js_ticket保存了多久
            $difftime = $nowtime - $jscard_ticket ['get_time'];
            // card_js_ticket有效时间7200 判断超过7000就重新获取;
            if ($difftime > 7000 || !$jscard_ticket['ticket']) {
                // 去微信获取最新card_js_ticket
                $res=$this->getJsCardTicket($appid,$secret);
                $jscard_ticket ['get_time'] = time();
                $jscard_ticket ['ticket'] = $res['ticket'];
                S('WX_JSCARD_TICKET'.$appid, $jscard_ticket); // 放进缓存
            }
        } else {
            // 去微信获取最新card_js_ticket
            $res=$this->getJsCardTicket($appid,$secret);
            $jscard_ticket ['get_time'] = time();
            $jscard_ticket ['ticket'] = $res['ticket'];
            S('WX_JSCARD_TICKET'.$appid, $jscard_ticket); // 放进缓存
        }
        return $jscard_ticket;
    }

 /**
 * 私有方法
 * Description: getJsCardTicket 获取卡券js的ticket
 * @return mixed
 * Author: Jason
 */
    private function getJsCardTicket($appid,$secret)
    {
        $access_token_info = $this->getApiToken($appid,$secret);
        $access_token=$access_token_info['token'];
        $url='https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='.$access_token.'&type=wx_card';
        $httpstr=http($url);
        $res=json_decode($httpstr, true);
        return $res;
    }
    
    /**
     * 删除商户卡券，（注意： 如用户在商家删除卡券前已领取一张或多张该卡券依旧有效。 
     * 即删除卡券不能删除已被用户领取，保存在微信客户端中的卡券。）
     * @author:Freddy
     * @date:2015-6-16
     */ 
	function deleteCard($card_id){
		$accesstoken = $this->getToken();
		if (! $accesstoken)
			return false;
		$url="https://api.weixin.qq.com/card/delete?access_token={$accesstoken}";
        $data=array('card_id'=>$card_id);
		$data=json_encode($data);
		$restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
		$restr=json_decode($restr,true);
		return $restr;
	}
    
	/**
	 * 查询卡券详情
	 * @author:Freddy
     * @date:2015-6-16
	 */
	function getCard($data=NULL){
		$accesstoken = $this->getToken();
		if (! $accesstoken)
			return false;
		$url="https://api.weixin.qq.com/card/get?access_token={$accesstoken}";
		$data=json_encode($data);
		$restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
		$restr=json_decode($restr);
		return $restr;
	}
	
	/**
	 * 设置测试用户白名单（由于卡券有审核要求，为方便公众号调试，
	 * 可以设置一些测试帐号，这些帐号可领取未通过审核的卡券，体验整个流程）
	 * @author:Freddy
	 * @date:2015-6-16
	 */
	function setWhitelist($data=NULL){
		$accesstoken = $this->getToken();
		if (! $accesstoken)
			return false;
		$url="https://api.weixin.qq.com/card/testwhitelist/set?access_token={$accesstoken}";
		$data=json_encode($data);
		$restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
		$restr=json_decode($restr);
		return $restr;
	}
	
	/**
	 * 批量查询卡列表
	 * @author:Freddy
	 * @date:2015-6-16
	 */
	function batchgetCard($data=NULL){
		$accesstoken = $this->getToken();
		if (! $accesstoken)
			return false;
		$url="https://api.weixin.qq.com/card/batchget?access_token={$accesstoken}";
		$data=json_encode($data);
		$restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
		$restr=json_decode($restr);
		return $restr;
	}

    /**
     * Description: cardConsume 核销卡券接口
     * @param $CardId
     * @param $UserCardCode
     * @return bool|mixed|string
     * Author: Jason
     */
    function cardConsume($UserCardCode,$CardId)
    {
        $accesstoken = $this->getToken();
        if (! $accesstoken)
            return false;
        $url="https://api.weixin.qq.com/card/code/consume?access_token={$accesstoken}";
        $data=json_encode(array('code'=>$UserCardCode,'card_id'=>$CardId));
        $restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
        $restr=json_decode($restr,true);
        return $restr;
    }

    /**
     * Description: cardDecrypt 卡券码解密
     * @param $encrypt_code
     * @return bool|mixed|string
     * Author: Jason
     */
    function cardDecrypt($encrypt_code)
    {
        $accesstoken = $this->getToken();
        if (! $accesstoken)
            return false;
        $url="https://api.weixin.qq.com/card/code/decrypt?access_token={$accesstoken}";
        $data=json_encode(array('encrypt_code'=>$encrypt_code));
        $restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
        $restr=json_decode($restr,true);
        return $restr;
    }

    /**
     * Description: cardChangeQuantity修改库存
     * @param $card_id
     * @param $increase_stock_value
     * @param $reduce_stock_value
     * @return bool|mixed|string
     * Author: Jason
     */
    function cardChangeQuantity($card_id,$increase_stock_value='',$reduce_stock_value='')
    {
        $accesstoken = $this->getToken();
        if (! $accesstoken)
            return false;
        $url="https://api.weixin.qq.com/card/modifystock?access_token={$accesstoken}";
        $data=array(
            'card_id'=>$card_id,
        );
        if($increase_stock_value)
        {
            $data['increase_stock_value']=$increase_stock_value;
        }
        if($reduce_stock_value)
        {
            $data['reduce_stock_value']=$reduce_stock_value;
        }
        $data=json_encode($data);
        $restr=http($url , $data,'POST' ,array("Content-type: text/html; charset=utf-8"));
        $restr=json_decode($restr,true);
        return $restr;
    }

    /**
     * Description: addPoi 添加门店
     * @param $data
     * @return bool|mixed|string
     * Author: frima
     */
    function addPoi($data){
    	$accesstoken = $this->getToken();
        if (! $accesstoken)
            return false;
        $url="http://api.weixin.qq.com/cgi-bin/poi/addpoi?access_token={$accesstoken}";
        foreach ($data as $key => $value) {
        	if($key!="status" && $key!="business_id" && $key!="business_type" && $key!= "create_time" && $key!= "photo_list" && $key!="categories" && $key!="id")
        	{
        		$json['business']['base_info'][$key] = $value;
        	} 	
        }
        $json['business']['base_info']['sid'] = $data['id'];
        $photo_list = explode(',', $data['photo_list']);
        foreach ($photo_list as $key => $value) {
        	$json['business']['base_info']['photo_list'][$key] = array(
        													'photo_url'=>$value
        														);
        }    
        $json['business']['base_info']['categories'] = array(0=>$data['categories']);
        $senddata = json_encode($json,JSON_UNESCAPED_UNICODE);
        $restr=http($url , $senddata,'POST' ,array("Content-type: text/html; charset=utf-8"));
        $errmsg=json_decode($restr,true);
        return $errmsg;
    }

    /**
     * Description: poiList 门店列表
     * @param null
     * @return json_data
     * Author: frima
     */
    function poiList($begin,$limit){
    	$accesstoken = $this->getToken();
        if (! $accesstoken)
            return false;
    	$url="https://api.weixin.qq.com/cgi-bin/poi/getpoilist?access_token={$accesstoken}";
    	$senddata = json_encode(array('begin' => $begin,'limit' => $limit));
        $restr=http($url,$senddata,'POST' ,array("Content-type: text/html; charset=utf-8"));
        return $restr;
    }

    /**
     * Description: deletePoi 删除门店
     * @param poi_id
     * @return string
     * Author: frima
     */

    function deletePoi($poi_id){
    	$accesstoken = $this->getToken();
        if (! $accesstoken)
            return false;
        $url="https://api.weixin.qq.com/cgi-bin/poi/delpoi?access_token={$accesstoken}";
    	$senddata = json_encode(array('poi_id' => $poi_id));
        $restr=http($url,$senddata,'POST' ,array("Content-type: text/html; charset=utf-8"));
        $errmsg=json_decode($restr,true);
        return $errmsg;
    }

    /**
     * Description: updatePoi 修改门店
     * @param data
     * @return string
     * Author: frima
     */

    function updatePoi($data){
    	$accesstoken = $this->getToken();
        if (! $accesstoken)
            return false;
        $url="https://api.weixin.qq.com/cgi-bin/poi/updatepoi?access_token={$accesstoken}";
    	foreach ($data as $key => $value) {
        	if($key!="status" && $key!="business_id" && $key!="business_type" && $key!= "create_time" && $key!= "photo_list" && $key!="categories" && $key!="id")
        	{
        		$json['business']['base_info'][$key] = $value;
        	} 	
        }
        $json['business']['base_info']['sid'] = $data['id'];
        $photo_list = explode(',', $data['photo_list']);
        foreach ($photo_list as $key => $value) {
        	$json['business']['base_info']['photo_list'][$key] = array(
        													'photo_url'=>$value
        														);
        }    
        $json['business']['base_info']['categories'] = array(0=>$data['categories']);
        $senddata = json_encode($json,JSON_UNESCAPED_UNICODE);
        $restr=http($url,$senddata,'POST' ,array("Content-type: text/html; charset=utf-8"));
        $errmsg=json_decode($restr,true);
        return $errmsg;
    }

}
