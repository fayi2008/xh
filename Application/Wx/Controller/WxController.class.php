<?php

namespace Wx\Controller;

use Org\Util\String;

class WxController extends \Think\Controller {
	public function _initialize() {
		// define(HOTEL_ID, 4);
// 		$service = new \Hotel\Base\CommonService ();
// 		$service->hotel_init ( $_GET ['h_id'] );
// 		$isReply = $service->checkWxMenu ( 'Reply' );
// 		define ( ISREPLY, $isReply );
// 		$wx_config = new \Hotel\Wx\ConfigModel ();
// 		$info = $wx_config->where ( 'hotel_id=' . HOTEL_ID )->find ();
// 		C ( 'WECHAT_APPID', $info ['wechat_appid'] );
// 		C ( 'WECHAT_APPSECRET', $info ['wechat_appsecret'] );
	}
	public function index() {
		
		/* 实例微信SDK */
		$weixin = new \Common\Lib\Api\WxChat ();
		/* 获取请求信息 */
		$data = $weixin->request ();
		/* ------updated by hugh 2015-05-07 */
		/* 获取回复信息 */
		// var_dump(ISREPLY);exit;
		list ( $content, $type ) = $this->aotoReply ( $data );
		
		// list($content, $type ) = $this->reply($data);
		
		/* ------updated by hugh 2015-05-07 */
		
		// 接收到的信息入不同的库
		$this->weichatlog ( $data );
		
		/* 响应当前请求 */
		$weixin->response ( $content, $type );
	}
	
	/**
	 * Description: getcode兼容老的请求
	 * Author: Jason
	 */
	function getcode() {
		$state = I ( 'get.state' );
		$code = I ( 'get.code' );
		$backurl = urldecode ( I ( 'get.backurl' ) );
		if (strpos ( $backurl, '?' ) !== false) {
			$backurl .= "&code=" . $code . "&state=" . $state;
		} else {
			$backurl .= "?code=" . $code . "&state=" . $state;
		}
		if ($state) {
			$url_info = parse_url ( $backurl );
			$allow_redirect = false; // 域名是否允许跳转
			foreach ( C ( 'ALLOW_DOMAIN' ) as $domain ) {
				$pos = strpos ( $url_info ['host'], $domain );
				if ($pos !== false) {
					if (strlen ( $url_info ['host'] ) == $pos + strlen ( $domain )) {
						$allow_redirect = true;
						break;
					}
				}
			}
			if ($allow_redirect) {
				redirect ( $backurl );
			} else {
				exit ( "域名不符合要求" );
			}
			redirect ( $backurl );
		}
	}
	
	/**
	 * Description: getcodenew新的获取code的方式
	 * Author: Jason
	 */
	function getcodenew() {
		
		$state = I ( 'get.state' );
		$code = I ( 'get.code' );
		$backurl = urldecode ( I ( 'get.backurl' ) );
		if (strpos ( $backurl, '?' ) !== false) {
			$backurl .= "&code=" . $code . "&state=" . $state;
		} else {
			$backurl .= "?code=" . $code . "&state=" . $state;
		}
		if ($state) {
			$url_info = parse_url ( $backurl );
			$allow_redirect = false; // 域名是否允许跳转
			foreach ( C ( 'ALLOW_DOMAIN' ) as $domain ) {
				$pos = strpos ( $url_info ['host'], $domain );
				if ($pos !== false) {
					if (strlen ( $url_info ['host'] ) == $pos + strlen ( $domain )) {
						$allow_redirect = true;
						break;
					}
				}
			}
			if ($allow_redirect) {
				redirect ( $backurl );
			} else {
				exit ( "域名不符合要求" );
			}
		}
	}
	public function test() {
		$weixin = new \Common\Lib\Api\WxChat ();
		var_dump ( $weixin->test () );
	}
	
	/**
	 * 定制响应信息
	 *
	 * @param array $data
	 *        	接收的数据
	 * @return array; 响应的数据
	 */
	private function aotoReply($data) {
		// 消息类型
		switch ($data ['MsgType']) {
			case 'text' : // 类型是文本的
				if (ISREPLY) {
					return $this->getMsg ( $data ['Content'] );
				} else {
					return $this->getContent ( $data ['Content'] );
				}
			
			case 'event' : // 类型是事件的
			               // 事件类型
				switch ($data ['Event']) {
					case 'subscribe' : // 刚刚关注的
						$info = M ( "oauth_member" )->where ( "openid='" . $data ['FromUserName'] . "' AND _from='wx'" )->find ();
						if ($info) {
							$info ['attention_status'] = 1;
							M ( "oauth_member" )->save ( $info );
						} else {
							$weixin = new \Common\Lib\Api\WxChat ();
							$user_info = $weixin->user ( $data ['FromUserName'] );
							$data = array (
									"_from" => "wx",
									"_name" => $user_info ['nickname'],
									"sex" => $user_info ['sex'],
									"head_img" => $user_info ['headimgurl'],
									'status' => $user_info ['subscribe'],
									"openid" => $user_info ['openid'],
									'create_time' => $user_info ['subscribe_time'],
									"language" => $user_info ['language'],
									"city" => $user_info ['city'],
									"country" => $user_info ['country'],
									"province" => $user_info ['province'],
									'attention_status' => 1 
							);
							M ( "oauth_member" )->add ( $data );
						}
						if (ISREPLY) {
							return $this->getMsg ();
						} else {
							return array (
									C ( 'WECHAT_AUTO_REPLY' ),
									'text' 
							);
						}
					// return array(C('WECHAT_AUTO_REPLY'), 'text');
					case 'unsubscribe' : // 取消关注 FromUserName:
						M ( "oauth_member" )->where ( "openid='" . $data ['FromUserName'] . "' AND _from='wx'" )->save ( array (
								'attention_status' => 2 
						) );
						exit ();
					case 'CLICK' : // 刚刚关注的
						if ($data ['EventKey'] == "contact") {
							if (ISREPLY) {
								return $this->getMsg ();
							} else {
								return array (
										"该功能还在开发中……",
										'text' 
								);
							}
						} else {
							$str = "该功能还在开发中……";
						}
						return array (
								$str,
								'text' 
						);
					case 'user_consume_card' : // 卡券核销
						/*
						 * $weixin = new \Common\Lib\Api\WxChat();
						 * $openid=$data['FromUserName'];
						 * $CardId=$data['CardId'];
						 * $UserCardCode=$data['UserCardCode'];
						 * $weixin->cardConsume($UserCardCode,$CardId);
						 */
						break;
					case 'card_pass_check' : // 卡券核销
						
						$CardId = $data ['CardId'];
						$card_logic = new \Hotel\Card\CardLogic ();
						$card_logic->cardPassCheck ( $CardId );
						break;
					case 'user_get_card' :
						$UserCardCode = $data ['UserCardCode'];
						$where ['code'] = code_encrypt ( $UserCardCode, HOTEL_ID );
						$code_model = new \Hotel\Card\CodeModel ();
						$code_model->where ( $where )->save ( array (
								'is_get' => 1 
						)
						 );
						break;
					
					case 'user_del_card' :
						$UserCardCode = $data ['UserCardCode'];
						$where ['code'] = code_encrypt ( $UserCardCode, HOTEL_ID );
						$code_model = new \Hotel\Card\CodeModel ();
						$code_model->where ( $where )->save ( array (
								'is_get' => 0 
						)
						 );
						break;
					
					case 'poi_check_notify' : // 门店审核通过
						$poimodel = new PoiModel ();
						$nowdata = array();
						$where ['poi_id'] = strval($data ['PoiId']);
						if ($data ['result'] == 'succ') {
							$nowdata ['status'] = 3;
						} else if ($data ['result'] == 'fail') {
							$nowdata ['status'] = 4;
						}
						$poimodel->where ( $where )->save ( $nowdata );
						tp_log(json_encode($data).$poimodel->getLastSql(),'INFO');
						break;
					default :
						return array (
								C ( 'WECHAT_AUTO_DEFAULT' ),
								'text' 
						);
				}
				break;
			default :
				return array (
						C ( 'WECHAT_AUTO_DEFAULT' ),
						'text' 
				);
		}
	}
	
	/**
	 * 文件文章列表及描述
	 *
	 * @param type $content        	
	 * @return type
	 */
	private function getContent($content) {
		// $cache_key = 'WXCONTENT_' . md5($content);
		// $string = S($cache_key);
		/*
		 * if (empty($string)) {
		 * $map = array();
		 * $map['b.wx_status'] = 1;
		 * $map['a.status'] = 1;
		 * $map['b.post_keywords|b.post_title'] = array('like', "%{$content}%");
		 * $list = M('TermRelationships')
		 * ->alias("a")
		 * ->field('b.*')
		 * ->join(C('DB_PREFIX') . "posts b ON a.object_id = b.ID")
		 * ->where($map)
		 * ->limit(5)
		 * ->order("b.post_date desc")->select();
		 * if (!empty($list)) {
		 * $string = "相关的内容：\n";
		 * foreach ($list as $key => $row) {
		 * $url = C('site_host') . U('portal/article/index', array('id' => $row['ID']));
		 * $title = \Org\Util\String::msubstr($row['post_title'], 0, 15, 'utf-8');
		 * $string.=($key + 1) . ". <a href='{$url}'>{$title}</a>\n";
		 * }
		 * S($cache_key, $string, 300);
		 * } else {
		 * if(C('WECHAT_AUTO_DEFAULT'))
		 * {
		 * $string=C('WECHAT_AUTO_DEFAULT');
		 * }else{
		 * $string = "抱歉！没有找到关于\"{$content}\"的内容...";
		 * }
		 * }
		 * }
		 */
		$string = "抱歉！没有找到关于\"{$content}\"的内容...";
		return array (
				$string,
				'text' 
		);
	}
	
	/**
	 * 自动回复列表及描述
	 *
	 * @param type $content        	
	 * @return type
	 */
	private function getMsg($content = '') {
		$map = array ();
		// $map['a.hotel_id'] = $_GET['h_id'];
		$map ['a.status'] = 1;
		if ($content) {
			$msgType = 3;
			// $keywords = $content;
		} else {
			$msgType = 1;
		}
		
		$service = new \Hotel\Wx\ReplyService ();
		$list = $service->getInfo ( $msgType, '', $content );
		if (! empty ( $list )) {
			if ($list ['type'] == 1) {
				$string = $list ['content'];
				if (empty ( $string )) {
					return $this->getDefaultMsg ( $content );
				}
				return array (
						$string,
						'text' 
				);
			} else if ($list ['type'] == 2) {
				
				if (empty ( $list ['content'] )) {
					return $this->getDefaultMsg ( $content );
				} else {
					$content = htmlspecialchars_decode ( $list ['content'] );
					$con = json_decode ( $content );
					$news_item = $con->news_item;
					foreach ( $news_item as $k => $v ) {
						$string [] = array (
								'Title' => $v->title,
								'Description' => $v->digest,
								'PicUrl' => C ( 'IMG_URL' ) . $v->imageURI,
								'Url' => $v->url 
						);
					}
					
					return array (
							$string,
							'news' 
					);
				}
			} else {
				// $string=sprintf($list['title'],$list['content'],$list['imageURI'],$list['URI']);
				
				if (empty ( $list ['title'] ) && empty ( $list ['content'] ) && empty ( $list ['imageURI'] ) && empty ( $list ['URI'] )) {
					return $this->getDefaultMsg ( $content );
				}
				$string [] = array (
						'Title' => $list ['title'],
						'Description' => $list ['content'],
						'PicUrl' => C ( 'IMG_URL' ) . $list ['imageURI'],
						'Url' => $list ['URI'] 
				);
				
				return array (
						$string,
						'news' 
				);
			}
		} else {
			if ($content) {
				return $this->getDefaultMsg ( $content );
			} else {
				if (C ( 'WECHAT_AUTO_REPLY' )) {
					$string = C ( 'WECHAT_AUTO_REPLY' );
				} else {
					$string = "红权科技欢迎你";
				}
				return array (
						$string,
						'text' 
				);
			}
		}
	}
	
	/**
	 * 自动回复列表及描述
	 *
	 * @param type $content        	
	 * @return type
	 */
	private function getDefaultMsg($content) {
		$model = new \Hotel\Wx\ReplyModel ();
		$msgType = 2;
		$service = new \Hotel\Wx\ReplyService ();
		$list = $service->getInfo ( $msgType );
		
		if (! empty ( $list )) {
			if ($list ['type'] == 1) {
				$string = $list ['content'];
				if (empty ( $string )) {
					if (C ( 'WECHAT_AUTO_DEFAULT' )) {
						$string = C ( 'WECHAT_AUTO_DEFAULT' );
					} else {
						$string = "抱歉！没有找到关于\"{$content}\"的内容...";
					}
				}
				return array (
						$string,
						'text' 
				);
			} else {
				if (empty ( $list ['content'] )) {
					
					if (C ( 'WECHAT_AUTO_DEFAULT' )) {
						$string = C ( 'WECHAT_AUTO_DEFAULT' );
					} else {
						$string = "抱歉！没有找到关于\"{$content}\"的内容...";
					}
					return array (
							$string,
							'text' 
					);
				} else {
					$content = htmlspecialchars_decode ( $list ['content'] );
					$con = json_decode ( $content );
					$news_item = $con->news_item;
					foreach ( $news_item as $k => $v ) {
						$string [] = array (
								'Title' => $v->title,
								'Description' => $v->digest,
								'PicUrl' => C ( 'IMG_URL' ) . $v->imageURI,
								'Url' => $v->url 
						);
					}
					
					return array (
							$string,
							'news' 
					);
				}
			}
		} else {
			if (C ( 'WECHAT_AUTO_DEFAULT' )) {
				$string = C ( 'WECHAT_AUTO_DEFAULT' );
			} else {
				$string = "抱歉！没有找到关于\"{$content}\"的内容...";
			}
			return array (
					$string,
					'text' 
			);
		}
	}
	
	/**
	 * 记录请求信息
	 *
	 * @param array $data
	 *        	接收的数据
	 */
	private function weichatlog($data) {
		if ($data ['MsgType'] == 'event') {
			M ( 'wx_event' )->data ( $data )->add ();
		} else {
			M ( 'wx_info' )->data ( $data )->add ();
		}
	}
	public function statistics() {
		$page_id = intval ( $_GET ['page_id'] );
		$adser_id = intval ( $_GET ['adser_id'] );
		if (! $page_id) {
			return 0;
		}
		$where ['page_id'] = $page_id;
		$where ['adser_id'] = $adser_id;
		$where ['date'] = date ( "Y-m-d" );
		
		$info = M ( "wx_statistics" )->where ( $where )->find ();
		$act = $_GET ['act'];
		
		if (! $info) {
			$info = $where;
			switch ($act) {
				case "send" :
					$info ['send_num'] = 1;
					break;
				case "share" :
					$info ['share_num'] = 1;
					break;
				case "weibo" :
					$info ['weibo_num'] = 1;
					break;
				default :
					$info ['click_num'] = 1;
					break;
			}
			
			M ( "wx_statistics" )->add ( $info );
			echo "添加成功";
		} else {
			
			switch ($act) {
				case "send" :
					$info ['send_num'] += 1;
					break;
				case "share" :
					$info ['share_num'] += 1;
					break;
				case "weibo" :
					$info ['weibo_num'] += 1;
					break;
				default :
					$info ['click_num'] += 1;
					break;
			}
			// var_dump($info);
			M ( "wx_statistics" )->save ( $info );
			echo "更新成功";
		}
	}
	public function user_statistics() {
		$page_id = intval ( $_GET ['page_id'] );
		$open_id = $_GET ['open_id'];
		$id = intval ( $_GET ['id'] );
		if (! $page_id) {
			return 0;
		}
		
		if (! $id) {
			$info ['page_id'] = $page_id;
			$info ['open_id'] = $open_id;
			$info ['date'] = date ( "Y-m-d" );
			$info ['timestamp'] = date ( "Y-m-d H:i:s" );
			$info ['ip'] = get_client_ip ();
			$res = M ( "wx_user_statistics" )->add ( $info );
			echo $res;
		} else {
			$where ['id'] = $id;
			$info = M ( "wx_user_statistics" )->where ( $where )->find ();
			$info ['stay_time'] = time () - strtotime ( $info ['timestamp'] );
			M ( "wx_user_statistics" )->save ( $info );
			echo "更新成功";
		}
	}
	function getTicket() {
		$js_content = '';
		// $user_agent=strtolower($_SERVER['HTTP_USER_AGENT']);
		// if(strpos($user_agent,"micromessenger")!==false)
		// {
		$weixin = new \Common\Lib\Api\WxChat ();
		$url = $_GET ['url'];
		$url_info = parse_url ( $url );
		$allow_redirect = false; // 域名是否允许跳转
		foreach ( C ( 'ALLOW_DOMAIN' ) as $domain ) {
			$pos = strpos ( $url_info ['host'], $domain );
			if ($pos !== false) {
				if (strlen ( $url_info ['host'] ) == $pos + strlen ( $domain )) {
					$allow_redirect = true;
					break;
				}
			}
		}
		if ($allow_redirect) {
			$noncestr = make_char ( 8, 1 );
			$signature = $weixin->createTicketSignature ( $noncestr, $_SERVER ['REQUEST_TIME'], $url );
			$jsapiconfig = array (
					'appId' => C ( "WECHAT_APPID" ),
					'timestamp' => $_SERVER ['REQUEST_TIME'],
					'nonceStr' => $noncestr,
					'signature' => $signature 
			);
			// $js_content .= '<script> jsApiConfig='.json_encode($jsapiconfig).';</script>';
			$this->ajaxReturn ( array (
					'data' => $jsapiconfig 
			), 'JSONP' );
		} else {
			exit ( "域名不符合要求" );
		}
		
		// }
	}
	public function download() {
		$media_id = $_GET ['media_id'];
		if (! $media_id) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'info' => "参数错误" 
			), 'JSONP' );
		}
		$weixin = new \Common\Lib\Api\WxChat ();
		$res = $weixin->download ( $media_id );
		$header = $res ['header'];
		$tmp = explode ( '=', $header ['content-disposition'], 2 );
		$file = trim ( $tmp [1], '"' );
		if (! $file) {
			$this->ajaxReturn ( array (
					'status' => 0,
					'info' => "文件不存在" 
			), 'JSONP' );
		}
		if (! is_dir ( C ( 'WX_DOWNLOAD_DIR' ) )) {
			mkdir ( C ( 'WX_DOWNLOAD_DIR' ), 0777, true );
		}
		if (! file_exists ( C ( 'WX_DOWNLOAD_DIR' ) . $file )) {
			file_put_contents ( C ( 'WX_DOWNLOAD_DIR' ) . $file, $res ['content'] );
		}
		$this->ajaxReturn ( array (
				'status' => 1,
				'file' => '/wx/' . $file 
		), 'JSONP' );
	}
	
	
	function get_token()
	{
		if($_POST['sign']=="logomap@2015")
		{
			$appid=$_POST['appid'];
			$secret=$_POST['secret'];
			$weixin = new \Common\Lib\Api\WxChat();
			$res=$weixin->getApiToken($appid,$secret);
			echo json_encode($res);
			exit;
		}else{
			echo false;
		}
	
	}
	
	
	function get_ticket()
	{
		if($_POST['sign']=="logomap@2015")
		{
			$appid=$_POST['appid'];
			$secret=$_POST['secret'];
			$weixin = new \Common\Lib\Api\WxChat();
			$res=$weixin->getApiJsTicket($appid,$secret);
			echo json_encode($res);
			exit;
		}else{
			echo false;
		}
	}
	
}
