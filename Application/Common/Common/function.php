<?php

/**
 * 打印输出数据到文件
 * @param type $data 需要打印的数据
 * @param type $replace 是否要替换打印
 * @param string $pathname 打印输出文件位置
 * @author Anyon Zou <cxphp@qq.com>
 */
function p($data, $replace = false, $pathname = NULL) {
	is_null ( $pathname ) && $pathname = RUNTIME_PATH . date ( 'Ymd' ) . '_print.txt';
	$model = $replace ? FILE_APPEND : FILE_USE_INCLUDE_PATH;
	if (is_array ( $data )) {
		file_put_contents ( $pathname, print_r ( $data, TRUE ), $model );
	} else {
		file_put_contents ( $pathname, $data, $model );
	}
}

/**
 * 处理插件钩子
 *
 * @param string $hook
 *        	钩子名称
 * @param mixed $params
 *        	传入参数
 * @return void
 * @author Anyon Zou <cxphp@qq.com>
 */
function hook($hook, $params = array()) {
	\Think\Hook::listen ( $hook, $params );
}

/**
 * 简单对称加密算法之加密
 *
 * @param String $string
 *        	需要加密的字串
 * @param String $skey
 *        	加密EKY
 * @return String 加密后的字符串
 * @author Anyon Zou <cxphp@qq.com>
 */
function encode($string = '', $skey = 'cxphp') {
	$skey = str_split ( base64_encode ( $skey ) );
	$strArr = str_split ( base64_encode ( $string ) );
	$strCount = count ( $strArr );
	foreach ( $skey as $key => $value ) {
		$key < $strCount && $strArr [$key] .= $value;
	}
	return str_replace ( '=', 'cxphp', join ( '', $strArr ) );
}

/**
 * 简单对称加密算法之解密
 *
 * @param String $string
 *        	需要解密的字串
 * @param String $skey
 *        	解密KEY
 * @return String 解密后的字符串
 * @author Anyon Zou <cxphp@qq.com>
 */
function decode($string = '', $skey = 'cxphp') {
	$skey = str_split ( base64_encode ( $skey ) );
	$strArr = str_split ( str_replace ( 'cxphp', '=', $string ), 2 );
	$strCount = count ( $strArr );
	foreach ( $skey as $key => $value ) {
		if ($key < $strCount && $strArr [$key] [1] === $value) {
			$strArr [$key] = $strArr [$key] [0];
		} else {
			break;
		}
	}
	return base64_decode ( join ( '', $strArr ) );
}

/**
 * 检测用户是否登录
 *
 * @return boolean false-未登录, Array-登录
 * @author Anyon Zou <cxphp@qq.com>
 */
function is_login() {
	$user = session ( 'user' );
	return empty ( $user ) ? false : $user;
}

/**
 * 快速时间格式生成
 *
 * @param type $time
 *        	时间载
 * @param type $format
 *        	时间格式
 * @return type 格式化后的时间
 */
function toDate($time = null, $format = 'Y-m-d H:i:s') {
	is_null ( $time ) && $time = time ();
	return date ( $format, $time );
}

/**
 * 检测验证码
 *
 * @param integer $id
 *        	验证码ID
 * @param string $prefix
 *        	跨模块调用session模块名，如api，admin，home
 * @return boolean 检测结果
 * @author Anyon Zou <cxphp@qq.com>
 */
function check_verify($code, $id = 1, $prefix = '') {
	$verify = new \Think\Verify ();
	if (! $prefix) {
		$prefix = C ( 'SESSION_PREFIX' );
	}
	return $verify->check ( $code, $id, $prefix );
}

/**
 * 清空缓存
 */
function clear_cache() {
	$dirs = array ();
	$noneed_clear = array (
			".",
			".." 
	);
	$rootdirs = array_diff ( scandir ( RUNTIME_PATH ), $noneed_clear );
	foreach ( $rootdirs as $dir ) {
		if ($dir != "." && $dir != "..") {
			$dir = RUNTIME_PATH . $dir;
			if (is_dir ( $dir )) {
				array_push ( $dirs, $dir );
				$tmprootdirs = scandir ( $dir );
				foreach ( $tmprootdirs as $tdir ) {
					if ($tdir != "." && $tdir != "..") {
						$tdir = $dir . '/' . $tdir;
						if (is_dir ( $tdir )) {
							array_push ( $dirs, $tdir );
						}
					}
				}
			}
		}
	}
	$dirtool = new \Common\Lib\Util\Dir ( RUNTIME_PATH );
	foreach ( $dirs as $dir ) {
		$dirtool->del ( $dir );
	}
}

/**
 * 生成参数列表,以数组形式返回
 */
function sp_param_lable($tag = '') {
	$param = array ();
	$array = explode ( ';', $tag );
	foreach ( $array as $v ) {
		list ( $key, $val ) = explode ( ':', trim ( $v ) );
		$param [trim ( $key )] = trim ( $val );
	}
	return $param;
}

/**
 * 全局获取验证码图片 生成的是个HTML的img标签
 * length=4&size=20&width=238&height=50
 * length:字符长度
 * size:字体大小
 * width:生成图片宽度
 * heigh:生成图片高度
 *
 * @param type $imgparam
 *        	图片的属性设置
 * @param type $imgattrs
 *        	IMG标签
 * @return type
 */
function show_verify_img($imgparam = 'length=4&size=15&width=238&height=50', $imgattrs = 'style="cursor: pointer;" title="点击获取"') {
	$src = U ( 'Pub/show_verify', $imgparam );
	// $src = "http://api.logomap.com/Index/Index/show_verify?".$imgparam;
	return $img = <<<hello
<img onclick='this.src+="?"'  src="$src" $imgattrs />
hello;
}

/**
 * 10
 * 返回指定id的菜单
 * 同上一类方法，jquery treeview 风格，可伸缩样式
 *
 * @param $myid 表示获得这个ID下的所有子级        	
 * @param $effected_id 需要生成treeview目录数的id        	
 * @param $str 末级样式        	
 * @param $str2 目录级别样式        	
 * @param $showlevel 直接显示层级数，其余为异步显示，0为全部限制        	
 * @param $ul_class 内部ul样式
 *        	默认空 可增加其他样式如'sub-menu'
 * @param $li_class 内部li样式
 *        	默认空 可增加其他样式如'menu-item'
 * @param $style 目录样式
 *        	默认 filetree 可增加其他样式如'filetree treeview-famfamfam'
 * @param $dropdown 有子元素时li的class
 *        	$id="main";
 *        	$effected_id="mainmenu";
 *        	$filetpl="<a href='\$href'><span class='file'>\$label</span></a>";
 *        	$foldertpl="<span class='folder'>\$label</span>";
 *        	$ul_class="" ;
 *        	$li_class="" ;
 *        	$style="filetree";
 *        	$showlevel=6;
 *        	sp_get_menu($id,$effected_id,$filetpl,$foldertpl,$ul_class,$li_class,$style,$showlevel);
 *        	such as
 *        	<ul id="example" class="filetree ">
 *        	<li class="hasChildren" id='1'>
 *        	<span class='folder'>test</span>
 *        	<ul>
 *        	<li class="hasChildren" id='4'>
 *        	<span class='folder'>caidan2</span>
 *        	<ul>
 *        	<li class="hasChildren" id='5'>
 *        	<span class='folder'>sss</span>
 *        	<ul>
 *        	<li id='3'><span class='folder'>test2</span></li>
 *        	</ul>
 *        	</li>
 *        	</ul>
 *        	</li>
 *        	</ul>
 *        	</li>
 *        	<li class="hasChildren" id='6'><span class='file'>ss</span></li>
 *        	</ul>
 */
function sp_get_menu($id = "main", $effected_id = "mainmenu", $filetpl = "<span class='file'>\$label</span>", $foldertpl = "<span class='folder'>\$label</span>", $ul_class = "", $li_class = "", $style = "filetree", $showlevel = 6, $dropdown = 'hasChild') {
	$site_nav = F ( "site_nav_" . $id );
	if (empty ( $site_nav )) {
		$nav_obj = new \Admin\Model\NavModel ();
		if ($id == "main") {
			$navcat_obj = new \Admin\Model\NavCatModel ();
			$main = $navcat_obj->where ( "active=1" )->find ();
			$id = $main ['navcid'];
		}
		$navs = $nav_obj->where ( "cid=$id" )->order ( array (
				"listorder" => "ASC" 
		) )->select ();
		foreach ( $navs as $key => $nav ) {
			$href = $nav ['href'];
			$hrefold = $href;
			$href = unserialize ( stripslashes ( $nav ['href'] ) );
			if (empty ( $href )) {
				if ($hrefold == "home") {
					$href = __ROOT__ . "/";
				} else {
					$href = $hrefold;
				}
			} else {
				$default_app = strtolower ( C ( "DEFAULT_GROUP" ) );
				$href = U ( $href ['action'], $href ['param'] );
				$g = C ( "VAR_GROUP" );
				$href = preg_replace ( "/\/$default_app\//", "/", $href );
				$href = preg_replace ( "/$g=$default_app&/", "", $href );
			}
			$nav ['href'] = $href;
			$navs [$key] = $nav;
		}
		F ( "site_nav", $navs );
	}
	
	$tree = new \Common\Lib\Util\Tree ();
	$tree->init ( $navs );
	return $tree->get_treeview_menu ( 0, $effected_id, $filetpl, $foldertpl, $showlevel, $ul_class, $li_class, $style, 1, FALSE, $dropdown );
}

/*
 * 作用：写入新消息
 * 参数：$from	发送者id
 * $to		消息接受者id
 * $content 消息内容
 * $targetid 相应数据表中的id的值
 * $mestype可选值：topic_comment(话题评论)、topic_answer(话题回复)、topic_collect(话题收藏)、topic_love(喜欢)
 */
function insertMes($from, $to, $content, $targetid, $mestype) {
	$data = array (
			'mes_from' => $from,
			'mes_to' => $to,
			'mes_content' => $content,
			'post_time' => time (),
			'target_id' => $targetid,
			'mes_type' => $mestype,
			'mes_status' => '2' 
	); // 未读
	
	return M ( 'Message' )->add ( $data );
}

/*
 * 作用：查看用户消息
 * 参数：$uid	查询用户id
 * $status		消息接受者id
 * $mestype可选值：topic_comment(话题评论)、topic_answer(话题回复)、topic_collect(话题收藏)、topic_love(喜欢)
 * 注意：查询时仅限于members,message,topic三张表，因此只能查询三张表中的信息
 */
function getMes($uid, $type, $status = 2) {
	$DbPre = C ( 'DB_PREFIX' );
	$sql = 'select a.*,b.user_login_name,b.ID,c.topic_id,c.topic_cid,c.title
    		from ' . $DbPre . 'message a left join __MEMBERS__ b
    		on a.mes_from=b.ID left join __TOPIC__ c on a.target_id=c.topic_id
    		where a.mes_status=' . $status . ' and mes_type=\'' . $type . '\' and a.mes_to=' . $uid . ' order by a.post_time desc';
	return $topic_comment = M ()->query ( $sql );
}

// 获取站内消息数量
function getMesNum() {
	if (! isset ( $_SESSION ["MEMBER_id"] ))
		return;
	return M ( 'Message' )->where ( 'mes_status=2 and mes_to=' . $_SESSION ["MEMBER_id"] )->count ();
}

// 面包屑导航
function sp_bread_nav($nav_id) {
	$navTable = M ( 'Nav' );
	$path = $navTable->where ( "id=$nav_id" )->getField ( 'path' );
	if (! $path) {
		return array ();
	}
	$path = str_replace ( '-', ',', $path );
	return $navTable->where ( "id in ({$path})" )->order ( 'id' )->select ();
}

/**
 * 发起一个HTTP/HTTPS的请求
 *
 * @param $url 接口的URL        	
 * @param $params 接口参数
 *        	array('content'=>'test', 'format'=>'json');
 * @param $method 请求类型
 *        	GET|POST
 * @param $multi 图片信息        	
 * @param $extheaders 扩展的包头信息        	
 * @return string
 */
function http($url, $params = array(), $method = 'GET', $extheaders = array(), $multi = false) {
	if (! function_exists ( 'curl_init' ))
		exit ( 'Need to open the curl extension' );
	$method = strtoupper ( $method );
	$ci = curl_init ();
	curl_setopt ( $ci, CURLOPT_USERAGENT, 'PHP-SDK OAuth2.0' );
	curl_setopt ( $ci, CURLOPT_CONNECTTIMEOUT, 3 );
	curl_setopt ( $ci, CURLOPT_TIMEOUT, 3 );
	curl_setopt ( $ci, CURLOPT_RETURNTRANSFER, true );
	curl_setopt ( $ci, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt ( $ci, CURLOPT_SSL_VERIFYHOST, false );
	curl_setopt ( $ci, CURLOPT_HEADER, false );
	$headers = ( array ) $extheaders;
	switch ($method) {
		case 'POST' :
			curl_setopt ( $ci, CURLOPT_POST, TRUE );
			if (! empty ( $params )) {
				if ($multi) {
					foreach ( $multi as $key => $file ) {
						$params [$key] = '@' . $file;
					}
					curl_setopt ( $ci, CURLOPT_POSTFIELDS, $params );
					$headers [] = 'Expect: ';
				} else {
					if (is_array ( $params )) {
						curl_setopt ( $ci, CURLOPT_POSTFIELDS, http_build_query ( $params ) );
					} else {
						curl_setopt ( $ci, CURLOPT_POSTFIELDS, $params );
					}
				}
			}
			break;
		case 'DELETE' :
		case 'GET' :
			$method == 'DELETE' && curl_setopt ( $ci, CURLOPT_CUSTOMREQUEST, 'DELETE' );
			if (! empty ( $params )) {
				$url = $url . (strpos ( $url, '?' ) ? '&' : '?') . (is_array ( $params ) ? http_build_query ( $params ) : $params);
				// echo $url;
			}
			break;
	}
	curl_setopt ( $ci, CURLINFO_HEADER_OUT, TRUE );
	curl_setopt ( $ci, CURLOPT_URL, $url );
	if ($headers) {
		curl_setopt ( $ci, CURLOPT_HTTPHEADER, $headers );
	}
	
	$response = curl_exec ( $ci );
	curl_close ( $ci );
	return $response;
}

/**
 * 发起一个HTTP/HTTPS的请求
 *
 * @param $url 接口的URL        	
 * @param $params 接口参数
 *        	array('content'=>'test', 'format'=>'json');
 * @param $method 请求类型
 *        	GET|POST
 * @param $multi 图片信息        	
 * @param $extheaders 扩展的包头信息        	
 * @return string
 */
function http_return_header($url, $params = array(), $method = 'GET', $extheaders = array(), $multi = false) {
	if (! function_exists ( 'curl_init' ))
		exit ( 'Need to open the curl extension' );
	$method = strtoupper ( $method );
	$ci = curl_init ();
	curl_setopt ( $ci, CURLOPT_USERAGENT, 'PHP-SDK OAuth2.0' );
	curl_setopt ( $ci, CURLOPT_CONNECTTIMEOUT, 3 );
	curl_setopt ( $ci, CURLOPT_TIMEOUT, 3 );
	curl_setopt ( $ci, CURLOPT_RETURNTRANSFER, true );
	curl_setopt ( $ci, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt ( $ci, CURLOPT_SSL_VERIFYHOST, false );
	curl_setopt ( $ci, CURLOPT_HEADER, true );
	$headers = ( array ) $extheaders;
	switch ($method) {
		case 'POST' :
			curl_setopt ( $ci, CURLOPT_POST, TRUE );
			if (! empty ( $params )) {
				if ($multi) {
					foreach ( $multi as $key => $file ) {
						$params [$key] = '@' . $file;
					}
					curl_setopt ( $ci, CURLOPT_POSTFIELDS, $params );
					$headers [] = 'Expect: ';
				} else {
					if (is_array ( $params )) {
						curl_setopt ( $ci, CURLOPT_POSTFIELDS, http_build_query ( $params ) );
					} else {
						curl_setopt ( $ci, CURLOPT_POSTFIELDS, $params );
					}
				}
			}
			break;
		case 'DELETE' :
		case 'GET' :
			$method == 'DELETE' && curl_setopt ( $ci, CURLOPT_CUSTOMREQUEST, 'DELETE' );
			if (! empty ( $params )) {
				$url = $url . (strpos ( $url, '?' ) ? '&' : '?') . (is_array ( $params ) ? http_build_query ( $params ) : $params);
				// echo $url;
			}
			break;
	}
	curl_setopt ( $ci, CURLINFO_HEADER_OUT, TRUE );
	curl_setopt ( $ci, CURLOPT_URL, $url );
	if ($headers) {
		curl_setopt ( $ci, CURLOPT_HTTPHEADER, $headers );
	}
	$res = curl_exec ( $ci );
	list ( $h_content, $content ) = explode ( "\r\n\r\n", $res, 2 );
	$headers = explode ( "\r\n", $h_content );
	foreach ( $headers as $head ) {
		list ( $name, $value ) = explode ( ':', $head );
		$header [strtolower ( trim ( $name ) )] = trim ( $value );
	}
	$header['http_code']=curl_getinfo($ci, CURLINFO_HTTP_CODE);
	$response ['header'] = $header;
	$response ['content'] = $content;
	curl_close ( $ci );
	return $response;
}
function sendmail($title, $to, $content_path = "", $altBody = "", $attach = "", $from = "admin@hqtec.hqtec", $replyto = "") {
	import ( "Common.Lib.Util.class", "", ".phpmailer.php" );
	
	// Create a new PHPMailer instance
	$mail = new \Common\Lib\Util\PHPMailer ();
	$mail->CharSet = "UTF-8";
	// Set PHPMailer to use the sendmail transport
	$mail->isSendmail ();
	// Set who the message is to be sent from
	$mail->setFrom ( $from );
	// Set an alternative reply-to address
	if ($replyto) {
		$mail->addReplyTo ( $replyto );
	}
	
	// Set who the message is to be sent to
	$mail->addAddress ( $to );
	// Set the subject line
	$mail->Subject = $title;
	// Read an HTML message body from an external file, convert referenced images to embedded,
	// convert HTML into a basic plain-text alternative body
	if ($content_path) {
		$mail->msgHTML ( file_get_contents ( $content_path ), dirname ( __FILE__ ) );
	}
	
	// Replace the plain text body with one created manually
	if ($altBody) {
		$mail->AltBody = $altBody;
	}
	
	// Attach an image file
	if ($attach) {
		$mail->addAttachment ( $attach );
	}
	
	// send the message, check for errors
	if (! $mail->send ()) {
		return "Mailer Error: " . $mail->ErrorInfo;
	} else {
		return true;
	}
}
function smtpmail($title, $to, $content_path = "", $altBody = "", $attach = "", $replyto = "", $from = "admin@hqtec.cn") {
	import ( "Common.Lib.Util.class", "", ".phpmailer.php" );
	import ( "Common.Lib.Util.class", "", ".smtp.php" );
	// Create a new PHPMailer instance
	$mail = new \Common\Lib\Util\PHPMailer ();
	$mail->CharSet = "UTF-8";
	// Tell PHPMailer to use SMTP
	$mail->isSMTP ();
	// Enable SMTP debugging
	// 0 = off (for production use)
	// 1 = client messages
	// 2 = client and server messages
	$mail->SMTPDebug = 0;
	// Ask for HTML-friendly debug output
	// $mail->Debugoutput = 'html';
	// Set the hostname of the mail server
	$mail->Host = "smtp.exmail.qq.com";
	// Set the SMTP port number - likely to be 25, 465 or 587
	$mail->Port = 465;
	// Whether to use SMTP authentication
	$mail->SMTPAuth = true;
	$mail->SMTPSecure = "ssl"; // SMTP 协议
	                           // Username to use for SMTP authentication
	$mail->Username = "admin@hqtec.cn";
	// Password to use for SMTP authentication
	$mail->Password = "hq123456";
	// Set who the message is to be sent from
	$mail->setFrom ( $from );
	// Set an alternative reply-to address
	if ($replyto) {
		$mail->addReplyTo ( $replyto );
	}
	// Set who the message is to be sent to
	$mail->addAddress ( $to );
	// Set the subject line
	$mail->Subject = $title;
	// Read an HTML message body from an external file, convert referenced images to embedded,
	// convert HTML into a basic plain-text alternative body
	if ($content_path) {
		$mail->msgHTML ( file_get_contents ( $content_path ), dirname ( __FILE__ ) );
	} else if ($altBody) {
		$mail->msgHTML ( $altBody, dirname ( __FILE__ ) );
	}
	// Replace the plain text body with one created manually
	if ($altBody) {
		$mail->AltBody = $altBody;
	}
	// Attach an image file
	if ($attach) {
		$mail->addAttachment ( $attach );
	}
	
	// send the message, check for errors
	if (! $mail->send ()) {
		return "Mailer Error: " . $mail->ErrorInfo;
	} else {
		return true;
	}
}

/**
 * 检查请求是否来自移动端
 *
 * @return bool
 */
function check_wap() {
	// 如果有HTTP_X_WAP_PROFILE则一定是移动设备
	if (isset ( $_SERVER ['HTTP_X_WAP_PROFILE'] )) {
		return true;
	}
	if (isset ( $_SERVER ['HTTP_VIA'] )) {
		// 找不到为flase,否则为true
		return stristr ( $_SERVER ['HTTP_VIA'], "wap" ) ? true : false;
	}
	if (isset ( $_SERVER ['HTTP_X_NOKIA_CONNECTION_MODE'] ))
		return true;
	if (isset ( $_SERVER ['HTTP_X_UP_CALLING_LINE_ID'] ))
		return true;
	if (isset ( $_SERVER ['HTTP_USER_AGENT'] )) {
		$clientkeywords = array (
				"ucweb",
				"iphone",
				"240x320",
				"acer",
				"acoon",
				"acs-",
				"abacho",
				"ahong",
				"airness",
				"alcatel",
				"amoi",
				"android",
				"anywhereyougo.com",
				"applewebkit/525",
				"applewebkit/532",
				"asus",
				"audio",
				"au-mic",
				"avantogo",
				"becker",
				"benq",
				"bilbo",
				"bird",
				"blackberry",
				"blazer",
				"bleu",
				"cdm-",
				"compal",
				"coolpad",
				"danger",
				"dbtel",
				"dopod",
				"elaine",
				"eric",
				"etouch",
				"fly ",
				"fly_",
				"fly-",
				"go.web",
				"goodaccess",
				"gradiente",
				"grundig",
				"haier",
				"hedy",
				"hitachi",
				"htc",
				"huawei",
				"hutchison",
				"inno",
				"ipaq",
				"ipod",
				"jbrowser",
				"kddi",
				"kgt",
				"kwc",
				"lenovo",
				"lg ",
				"lg2",
				"lg3",
				"lg4",
				"lg5",
				"lg7",
				"lg8",
				"lg9",
				"lg-",
				"lge-",
				"lge9",
				"longcos",
				"maemo",
				"mercator",
				"meridian",
				"micromax",
				"midp",
				"mini",
				"mitsu",
				"mmm",
				"mmp",
				"mot-",
				"moto",
				"nec-",
				"netfront",
				"newgen",
				"nexian",
				"nf-browser",
				"nintendo",
				"nitro",
				"nokia",
				"nook",
				"novarra",
				"obigo",
				"palm",
				"panasonic",
				"pantech",
				"philips",
				"phone",
				"pg-",
				"playstation",
				"pocket",
				"pt-",
				"qc-",
				"qtek",
				"rover",
				"sagem",
				"sama",
				"samu",
				"sanyo",
				"samsung",
				"sch-",
				"scooter",
				"sec-",
				"sendo",
				"sgh-",
				"sharp",
				"siemens",
				"sie-",
				"softbank",
				"sony",
				"spice",
				"sprint",
				"spv",
				"symbian",
				"tablet",
				"talkabout",
				"tcl-",
				"teleca",
				"telit",
				"tianyu",
				"tim-",
				"toshiba",
				"tsm",
				"up.browser",
				"utec",
				"utstar",
				"verykool",
				"virgin",
				"vk-",
				"voda",
				"voxtel",
				"vx",
				"wap",
				"wellco",
				"wig browser",
				"wii",
				"windows ce",
				"wireless",
				"xda",
				"xde",
				"zte",
				"ipad" 
		);
		// 从HTTP_USER_AGENT中查找手机浏览器的关键字
		if (preg_match ( "#(" . implode ( '|', $clientkeywords ) . ")#i", strtolower ( $_SERVER ['HTTP_USER_AGENT'] ) )) {
			return true;
		}
	}
	// 协议法，因为有可能不准确，放到最后判断
	if (isset ( $_SERVER ['HTTP_ACCEPT'] )) {
		// 如果只支持wml并且不支持html那一定是移动设备
		// 如果支持wml和html但是wml在html之前则是移动设备
		if ((strpos ( $_SERVER ['HTTP_ACCEPT'], 'vnd.wap.wml' ) !== false) && (strpos ( $_SERVER ['HTTP_ACCEPT'], 'text/html' ) === false || (strpos ( $_SERVER ['HTTP_ACCEPT'], 'vnd.wap.wml' ) < strpos ( $_SERVER ['HTTP_ACCEPT'], 'text/html' )))) {
			return true;
		}
	}
	
	return false;
}

/**
 * 生成随机字符串
 *
 * @param int $length        	
 * @param int $type
 *        	0:数字
 * @return string
 */
function make_char($length = 6, $type = 0) {
	
	// 密码字符集，可任意添加你需要的字符
	if (! $type) {
		$chars = array (
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9' 
		);
	} else {
		$chars = array (
				'a',
				'b',
				'c',
				'd',
				'e',
				'f',
				'g',
				'h',
				
				'i',
				'j',
				'k',
				'l',
				'm',
				'n',
				'o',
				'p',
				'q',
				'r',
				's',
				
				't',
				'u',
				'v',
				'w',
				'x',
				'y',
				'z',
				'A',
				'B',
				'C',
				'D',
				
				'E',
				'F',
				'G',
				'H',
				'I',
				'J',
				'K',
				'L',
				'M',
				'N',
				'O',
				
				'P',
				'Q',
				'R',
				'S',
				'T',
				'U',
				'V',
				'W',
				'X',
				'Y',
				'Z',
				
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9' 
		);
	}
	
	// 在 $chars 中随机取 $length 个数组元素键名
	
	$char_txt = '';
	
	for($i = 0; $i < $length; $i ++) {
		
		// 将 $length 个数组元素连接成字符串
		
		$char_txt .= $chars [array_rand ( $chars )];
	}
	
	return $char_txt;
}

// 密码加密
function password_encrypt($password, $str = "hqtec") {
	return substr ( md5 ( $password . substr ( md5 ( $str ), 0, 5 ) ) . md5 ( $password ), 18, 32 );
}

// 红权加密方法加密str，防止密码加密的数据泄露
function hq_encrypt($password, $str = "hqtec") {
	return substr ( md5 ( $password . $str ) . md5 ( $password ), 10, 32 );
}

/**
 * Description: send_message 发送短信服务
 *
 * @param
 *        	$mobile
 * @param
 *        	$content
 * @param int $tpl_id        	
 * @return mixed Author: Jason
 */
function send_message($mobile, $content, $tpl_id = 699) {
	$post_data = array ();
	
	$post_data ['key'] = C ( "SMS.KEY" );
	$post_data ['tpl_id'] = $tpl_id;
	$post_data ['tpl_value'] = urlencode ( $content ); // 短信内容需要用urlencode编码下
	$post_data ['mobile'] = $mobile;
	$url = 'http://apis.haoservice.com/sms/send';
	$o = '';
	foreach ( $post_data as $k => $v ) {
		$o .= "$k=" . $v . '&';
	}
	$post_data = substr ( $o, 0, - 1 );
	$ch = curl_init ();
	curl_setopt ( $ch, CURLOPT_POST, 1 );
	curl_setopt ( $ch, CURLOPT_HEADER, 0 );
	curl_setopt ( $ch, CURLOPT_URL, $url );
	curl_setopt ( $ch, CURLOPT_POSTFIELDS, $post_data );
	curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 ); // 如果需要将结果直接返回到变量里，那加上这句。
	$result = curl_exec ( $ch );
	curl_close ( $ch );
	return $result;
}

/**
 * Description: send_message 发送短信服务
 * @param $mobile
 * @param $content
 * @return mixed Author: Jason
 */
function send_message_new($mobile, $content) {
	$post_data = array ();

	$post_data ['cdkey'] = '3SDK-EHF-0130-MBWNQ';
	$post_data ['password'] = 707377; // 短信内容需要用urlencode编码下
	$post_data ['phone'] = $mobile;
	$post_data ['message'] = '【中软安人】'.$content;
	$url = 'http://sdk4http.eucp.b2m.cn:8080/sdkproxy/sendsms.action';
	$o = '';
	foreach ( $post_data as $k => $v ) {
		$o .= "$k=" . $v . '&';
	}
	$post_data = substr ( $o, 0, - 1 );
	$ch = curl_init ();
	curl_setopt ( $ch, CURLOPT_POST, 1 );
	curl_setopt ( $ch, CURLOPT_HEADER, 0 );
	curl_setopt ( $ch, CURLOPT_URL, $url );
	curl_setopt ( $ch, CURLOPT_POSTFIELDS, $post_data );
	curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 ); // 如果需要将结果直接返回到变量里，那加上这句。
	$result = curl_exec ( $ch );
	curl_close ( $ch );
	return $result;
}

/**
 * 获取剩余短信量
 *
 * @return mixed
 */
function get_sms_info() {
	$post_data = 'key=' . C ( "SMS.KEY" );
	$url = 'http://apis.haoservice.com/sms/status';
	$ch = curl_init ();
	curl_setopt ( $ch, CURLOPT_POST, 1 );
	curl_setopt ( $ch, CURLOPT_HEADER, 0 );
	curl_setopt ( $ch, CURLOPT_URL, $url );
	curl_setopt ( $ch, CURLOPT_POSTFIELDS, $post_data );
	curl_setopt ( $ch, CURLOPT_RETURNTRANSFER, 1 );
	$result = curl_exec ( $ch );
	return $result;
}
function redis_init($host = "", $port = "", $timeout = "", $persistent = "") {
	if (! $host) {
		$host = C ( 'REDIS_HOST' ) ? C ( 'REDIS_HOST' ) : '127.0.0.1';
	}
	
	if (! $port) {
		$port = C ( 'REDIS_PORT' ) ? C ( 'REDIS_PORT' ) : 6379;
	}
	
	if (! $timeout) {
		$timeout = C ( 'DATA_CACHE_TIMEOUT' ) ? C ( 'DATA_CACHE_TIMEOUT' ) : false;
	}
	
	if (! $persistent) {
		$persistent = C ( 'PERSISTENT' ) ? 'pconnect' : 'connect';
	}
	
	$func = $persistent ? 'pconnect' : 'connect';
	$redis = new \Redis ();
	$timeout === false ? $redis->$func ( $host, $port ) : $redis->$func ( $host, $port, $timeout );
	$redis->select ( 0 );
	return $redis;
}

/**
 * XML到数组格式转换
 *
 * @return $array
 */
function xml_decode($xml, $root = 'think') {
	$search = '/<(' . $root . ')>(.*)<\/\s*?\\1\s*?>/s';
	$array = array ();
	if (preg_match ( $search, $xml, $matches )) {
		$array = xml_to_array ( $matches [2] );
	}
	return $array;
}

/**
 * XML到数组格式转换
 *
 * @return $array
 */
function xml_to_array($xml) {
	$search = '/<(\w+)\s*?(?:[^\/>]*)\s*(?:\/>|>(.*?)<\/\s*?\\1\s*?>)/s';
	$array = array ();
	if (preg_match_all ( $search, $xml, $matches )) {
		foreach ( $matches [1] as $i => $key ) {
			$value = $matches [2] [$i];
			if (preg_match_all ( $search, $value, $_matches )) {
				$array [$key] = xml_to_array ( $value );
			} else {
				if ('ITEM' == strtoupper ( $key )) {
					$array [] = html_entity_decode ( $value );
				} else {
					$array [$key] = html_entity_decode ( $value );
				}
			}
		}
	}
	return $array;
}

/**
 * 根据距离排序
 */
function rangeSort($u_lat, $u_lon, $list) {
	/*
	 * u_lat 用户纬度
	 * u_lon 用户经度
	 * list sql语句
	 */
	if (! empty ( $u_lat ) && ! empty ( $u_lon )) {
		foreach ( $list as $row ) {
			$row ['km'] = getDistance ( $u_lat, $u_lon, $row ['latitude'], $row ['longitude'] );
			$row ['km'] = round ( $row ['km'], 2 );
			$res [] = $row;
		}
		if (! empty ( $res )) {
			foreach ( $res as $user ) {
				$ages [] = $user ['km'];
			}
			array_multisort ( $ages, SORT_ASC, $res );
			return $res;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

/**
 * 获取两个坐标点之间的距离，单位km，小数点后2位
 */
function getDistance($lat1, $lng1, $lat2, $lng2) {
	$EARTH_RADIUS = 6378.137;
	$radLat1 = rad ( $lat1 );
	$radLat2 = rad ( $lat2 );
	$a = $radLat1 - $radLat2;
	$b = rad ( $lng1 ) - rad ( $lng2 );
	$s = 2 * asin ( sqrt ( pow ( sin ( $a / 2 ), 2 ) + cos ( $radLat1 ) * cos ( $radLat2 ) * pow ( sin ( $b / 2 ), 2 ) ) );
	$s = $s * $EARTH_RADIUS;
	$s = round ( $s * 100 ) / 100;
	return $s;
}
function rad($d) {
	return $d * M_PI / 180.0;
}

/**
 * 根据IP获取城市sina
 *
 * @author hugh
 *         @date 2014.10.15
 * @param
 *        	$where
 */
function getLocation($ip) {
	if (empty ( $ip ))
		$ip = get_client_ip ();
	
	$str = '';
	$result = array ();
	$url = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json&ip=' . $ip;
	$str = @file_get_contents ( $url );
	
	if ($str) {
		$IpO = json_decode ( $str );
		if ($IpO->ret) {
			$result ['province'] = $IpO->province;
			$result ['city'] = $IpO->city;
			$result ['county'] = $IpO->district;
			$result ['ip'] = $ip;
			$result ['isp'] = $IpO->isp;
		}
	}
	return $result;
}

/**
 * 字符串截取，支持中文和其他编码
 *
 * @static
 *
 * @access public
 * @param string $str
 *        	需要转换的字符串
 * @param string $start
 *        	开始位置
 * @param string $length
 *        	截取长度
 * @param string $charset
 *        	编码格式
 * @param string $suffix
 *        	截断显示字符
 * @return string
 */
function msubstr($str, $start = 0, $length, $charset = "utf-8", $suffix = true) {
	if (function_exists ( "mb_substr" ))
		$slice = mb_substr ( $str, $start, $length, $charset );
	elseif (function_exists ( 'iconv_substr' )) {
		$slice = iconv_substr ( $str, $start, $length, $charset );
		if (false === $slice) {
			$slice = '';
		}
	} else {
		$re ['utf-8'] = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xff][\x80-\xbf]{3}/";
		$re ['gb2312'] = "/[\x01-\x7f]|[\xb0-\xf7][\xa0-\xfe]/";
		$re ['gbk'] = "/[\x01-\x7f]|[\x81-\xfe][\x40-\xfe]/";
		$re ['big5'] = "/[\x01-\x7f]|[\x81-\xfe]([\x40-\x7e]|\xa1-\xfe])/";
		preg_match_all ( $re [$charset], $str, $match );
		$slice = join ( "", array_slice ( $match [0], $start, $length ) );
	}
	return $suffix ? $slice . '...' : $slice;
}
/**
 * 加密流程：
 * 1、加密key,利用MD5加密key得到32位密文，分解密文，按4、12、12、4，分解分别为key1、key2、key3、key4
 * 2、明文头尾加壳，key密文前4位与key密文后4位作为壳
 * 3、des加密，key为第一步key密文得到的key2
 * 4、反转
 * 5、des二次加密，key为第一步key密文得到的key3
 */
// 加密
function code_encrypt($str = "", $key = "") {
	$string = md5 ( $key ); // 密钥加密
	$key1 = substr ( $string, 0, 4 );
	$key2 = substr ( $string, 4, 12 ); // des的key
	$key3 = substr ( $string, 16, 12 );
	$key4 = substr ( $string, 28, 4 );
	
	$str = $key1 . $str . $key4; // 明文加壳
	                             
	// des方法->$key2
	$des = new \Think\Crypt ( 'Des' );
	$str = $des->encrypt ( $str, $key2 ); // des一次加密
	
	$str = strrev ( $str ); // 反转
	$str = $des->encrypt ( $str, $key3 ); // des二次加密
	return $str;
}

// 解密
function code_decrypt($str = "", $key = "") {
	$string = md5 ( $key ); // 密钥加密
	$key1 = substr ( $string, 0, 4 );
	$key2 = substr ( $string, 4, 12 ); // des的key
	$key3 = substr ( $string, 16, 12 );
	$key4 = substr ( $string, 28, 4 );
	
	$des = new \Think\Crypt ( 'Des' );
	$str = $des->decrypt ( $str, $key3 );
	$str = strrev ( $str ); // 反转
	                        // des->$key2
	
	$str = $des->decrypt ( $str, $key2 );
	
	$strlen = strlen ( $str );
	$str = substr ( $str, 4, $strlen - 8 ); // 脱壳
	return $str;
}

/**
 * Description: tp_log 记录错误日志
 *
 * @param
 *        	$content
 * @param string $level
 *        	Author: Jason
 */
function tp_log($content, $level = "ERR", $filename = '') {
	$log_ = new \Think\Log ();
    if($filename)
    {
        $filename.='_';
    }
	$log_name = C ( 'LOG_PATH' ) . $filename . $level . "_" . date ( "Y-m-d" ) . ".log"; // log文件路径
	$log_->write ( '[' . toDate () . '] ' . $content . "\n", $level, "file", $log_name );
}

/**
 * Description: createNoncestr 产生随机字符串，不长于32位
 *
 * @param int $length        	
 * @return string Author: Jason
 */
function createNoncestr($length = 32) {
	$chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	$str = "";
	for($i = 0; $i < $length; $i ++) {
		$str .= substr ( $chars, mt_rand ( 0, strlen ( $chars ) - 1 ), 1 );
	}
	return $str;
}

/**
 * Description: arrayToXml（简单转换）
 *
 * @param
 *        	$arr
 * @return string Author: Jason
 */
function arrayToXml($arr) {
	$xml = "<xml>";
	foreach ( $arr as $key => $val ) {
		if (is_numeric ( $val )) {
			$xml .= "<" . $key . ">" . $val . "</" . $key . ">";
		} else
			$xml .= "<" . $key . "><![CDATA[" . $val . "]]></" . $key . ">";
	}
	$xml .= "</xml>";
	return $xml;
}

/**
 * Description: xmlToArray
 *
 * @param
 *        	$xml
 * @return mixed Author: Jason
 */
function xmlToArray($xml) {
	// 将XML转为array
	$array_data = json_decode ( json_encode ( simplexml_load_string ( $xml, 'SimpleXMLElement', LIBXML_NOCDATA ) ), true );
	return $array_data;
}

/**
 * @Desc: 验证多个email
 *
 * @param : $email        	
 * @return : bool
 * @author : Hugh
 */
function checkMail($email) {
	// 验证多个email
	$email = str_replace ( ',', ";", $email );
	$email = str_replace ( '，', ";", $email );
	$email = str_replace ( '；', ";", $email );
	$email = explode ( ';', $email );
	foreach ( $email as $v ) {
		if ($v != '' && ! filter_var ( $v, FILTER_VALIDATE_EMAIL )) {
			return false;
		}
	}
	return true;
}

/**
 * Description: distance2degree根据纬度把距离换算成度数
 *
 * @param
 *        	$lat纬度
 * @param int $distance
 *        	距离
 *        	Author: Jason
 */
function distance2degree($lat, $distance = 500) {
	$unit = 111319.49077777778;
	$lng = $distance / $unit;
	$tmp = log ( tan ( (90 + $lat) * 0.008726646259971648 ) ) / 0.017453292519943295;
	$tmp = $tmp + $distance / $unit;
	$lat = atan ( exp ( $tmp * 0.017453292519943295 ) ) * 114.59155902616465 - 90 - $lat;
	return array (
			'lng_d' => $lng,
			'lat_d' => $lat 
	);
}

/**
 * Description: create_uuid
 *
 * @param string $prefix        	
 * @return string Author: Jason
 */
function create_uuid($prefix = '') {
	$str = md5 ( uniqid ( mt_rand (), true ) );
	$uuid = substr ( $str, 0, 8 ) . '-';
	$uuid .= substr ( $str, 8, 4 ) . '-';
	$uuid .= substr ( $str, 12, 4 ) . '-';
	$uuid .= substr ( $str, 16, 4 ) . '-';
	$uuid .= substr ( $str, 20, 12 );
	return $prefix . $uuid;
}

/**
 * Description: generateQRImg
 *
 * @param $url 二维码链接        	
 * @param $content 附加内容        	
 * @param $id guid        	
 * @param string $EC_level
 *        	纠错级别
 * @param int $matrixPointSize
 *        	点的大小
 *        	Author: Jason /修改 ：ward
 */
function generateQRImg($url, $id = '', $content = '', $type = 0, $EC_level = 'L', $matrixPointSize = 4) {
	// 文件输出
	import ( 'Common.Lib.phpqrcode.phpqrcode', APP_PATH, '.php' );
	// $filename 生成的文件名
	// 二维码数据
	if (! $id) {
		$id = create_uuid ();
	}
	$qr_url = C ( 'QR_URL' ) . '?id=' . $id;
	$qr_url = $url; // 此处修改过
	                // 纠错级别：L、M、Q、H
	$errorCorrectionLevel = $EC_level;
	// $matrixPointSize 点的大小：1到10
	$dirname = 'tmp/';
	if (! is_dir ( DATA_PATH . $dirname )) {
		mkdir ( DATA_PATH . $dirname, 0777, true );
	}
	
	$filename = DATA_PATH . $dirname . $id . ".png";
	
	\QRcode::png ( $qr_url, $filename, $errorCorrectionLevel, $matrixPointSize, 5 );
	$res = http ( C ( 'UPLOAD_URL' ), array (
			'dirname' => 'erweima' 
	), 'POST', array (), array (
			'file' => $filename 
	) );
	$res = json_decode ( $res, true );
	if ($res ['file']) {
		
		// $model = new \Common\Model\QrcodeModel ();
		// $qrcode_id = $model->addData ( $url, $res ['file'], $id, $content, $type );
		unlink ( $filename );
		return $res ['file'];
		// if ($qrcode_id) {
		// return array (
		// 'qrcode_id' => $id,
		// 'image' => $res ['file']
		// );
		// }
	} else {
		return false;
	}
}
function generatePayQRImg($url, $id = '', $content = '', $type = 0, $EC_level = 'L', $matrixPointSize = 4) {
	// 文件输出
	import ( 'Common.Lib.phpqrcode.phpqrcode', APP_PATH, '.php' );
	// $filename 生成的文件名
	// 二维码数据
	if (! $id) {
		$id = create_uuid ();
	}
	$qr_url = $url;
	
	// 纠错级别：L、M、Q、H
	$errorCorrectionLevel = $EC_level;
	// $matrixPointSize 点的大小：1到10
	$dirname = 'erweima/';
	if (! is_dir ( C ( 'UPLOAD_PATH' ) . $dirname )) {
		mkdir ( C ( 'UPLOAD_PATH' ) . $dirname, 0777, true );
	}
	
	$filename = C ( 'UPLOAD_PATH' ) . $dirname . $id . ".png";
	$name = $dirname . $id . ".png";
	\QRcode::png ( $qr_url, $filename, $errorCorrectionLevel, $matrixPointSize, 5 );
	return $name;
}

/**
 * Description: show_percent 按百分比显示
 *
 * @param
 *        	$str
 * @return string Author: Jason
 */
function show_percent($str) {
	$str = round ( $str, 4 );
	return strval ( $str * 100 ) . '%';
}

/**
 * Description: deldir 删除目录极其目录下文件
 *
 * @param
 *        	$dir
 * @return bool Author: Jason
 *         Date:
 */
function deldir($dir) {
	// 先删除目录下的文件：
	$dh = opendir ( $dir );
	while ( $file = readdir ( $dh ) ) {
		if ($file != "." && $file != "..") {
			$fullpath = $dir . "/" . $file;
			if (! is_dir ( $fullpath )) {
				unlink ( $fullpath );
			} else {
				deldir ( $fullpath );
			}
		}
	}
	
	closedir ( $dh );
	// 删除当前文件夹：
	if (rmdir ( $dir )) {
		return true;
	} else {
		return false;
	}
}
function isMobile() {
	// 如果有HTTP_X_WAP_PROFILE则一定是移动设备
	if (isset ( $_SERVER ['HTTP_X_WAP_PROFILE'] )) {
		return true;
	}
	// 如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
	if (isset ( $_SERVER ['HTTP_VIA'] )) {
		// 找不到为flase,否则为true
		return stristr ( $_SERVER ['HTTP_VIA'], "wap" ) ? true : false;
	}
	// 脑残法，判断手机发送的客户端标志,兼容性有待提高
	if (isset ( $_SERVER ['HTTP_USER_AGENT'] )) {
		$clientkeywords = array (
				'nokia',
				'sony',
				'ericsson',
				'mot',
				'samsung',
				'htc',
				'sgh',
				'lg',
				'sharp',
				'sie-',
				'philips',
				'panasonic',
				'alcatel',
				'lenovo',
				'iphone',
				'ipod',
				'blackberry',
				'meizu',
				'android',
				'netfront',
				'symbian',
				'ucweb',
				'windowsce',
				'palm',
				'operamini',
				'operamobi',
				'openwave',
				'nexusone',
				'cldc',
				'midp',
				'wap',
				'mobile' 
		);
		// 从HTTP_USER_AGENT中查找手机浏览器的关键字
		if (preg_match ( "/(" . implode ( '|', $clientkeywords ) . ")/i", strtolower ( $_SERVER ['HTTP_USER_AGENT'] ) )) {
			return true;
		}
	}
	// 协议法，因为有可能不准确，放到最后判断
	if (isset ( $_SERVER ['HTTP_ACCEPT'] )) {
		// 如果只支持wml并且不支持html那一定是移动设备
		// 如果支持wml和html但是wml在html之前则是移动设备
		if ((strpos ( $_SERVER ['HTTP_ACCEPT'], 'vnd.wap.wml' ) !== false) && (strpos ( $_SERVER ['HTTP_ACCEPT'], 'text/html' ) === false || (strpos ( $_SERVER ['HTTP_ACCEPT'], 'vnd.wap.wml' ) < strpos ( $_SERVER ['HTTP_ACCEPT'], 'text/html' )))) {
			return true;
		}
	}
	return false;
}

/**
 *
 * @param unknown $object_id
 *        	对象ID号
 * @param unknown $type
 *        	日志类型 1 添加 2编辑 3 删除 4 发布 5 是取消
 * @param unknown $content
 *        	当前数据记录
 * @param unknown $desc
 *        	描述
 *        	
 * @return unknown
 */
function AdminLog($object_id, $type, $content, $desc) {
	$log = new \System\Model\AdminLogModel ();
	$logdata ['OBJECT_ID'] = $object_id;
	$logdata ['CREATE_TIME'] = toDate ();
	$logdata ['OPERATION_TYPE_ID'] = $type;
	$logdata ['DESCRIPTION'] = $desc;
	$logdata ['CONTENT'] = $content;
	$logdata ['IP'] = get_client_ip ();
	$logdata ['type'] = intval ( $type );
	$logdata ['ADMIN_ID'] = session ( 'admin.id' );
	$logdata['ADMIN_NAME']=session('admin.nickname');
	$result = $log->add ( $logdata );
	return $result;
}

/**
 * Description: html2js html转换成js用的字符串
 * @param $html
 * @return mixed
 * Author: Jason
 * Date:
 */
function html2js($html)
{
    $str=str_replace('\\','\\\\',$html);
    $str=str_replace("'","\'",$str);
    $str=str_replace('"','\"',$str);
    $str=str_replace('\t','',$str);
    $str= str_replace("\r\n",'',$str);
    return $str;
}

/**
 * Description：根据基础坐标，对传入的poi点数组进行从近到远的快速排序
 * Param:   float lat
 * Param：        float lon
 * Param：       array(0=>array('lat','lon',....),1=>array(...),...)
 * Return 二维数组
 */
  function quickSortForGis($lat,$lon,$arr){
		
	if(count($arr)<=1){
		//$arr[0]['point']=getDistance($lat, $lon,$arr[0]['lat'], $arr[0]['lon']);
		return $arr;
	}//如果个数不大于一，直接返回
	$key=$arr[0];//取一个值，稍后用来比较
	$keyPoint=getDistance($lat, $lon,$arr[0]['lat'], $arr[0]['lon']);
	$left_arr=array();
	$right_arr=array();
	for($i=1;$i<count($arr);$i++){//比$key大的放在右边，小的放在左边；
		$point=getDistance($lat, $lon,$arr[$i]['lat'], $arr[$i]['lon']);

		if($point<=$keyPoint){
			//$arr[$i]['point']=$point;
			$left_arr[]=$arr[$i];
		}else{
			//$arr[$i]['point']=$point;
			$right_arr[]=$arr[$i];
		}
	}
	$left_arr=quickSortForGis($lat,$lon,$left_arr);//进行递归；
	$right_arr=quickSortForGis($lat,$lon,$right_arr);
	$res=array_merge($left_arr,array($key),$right_arr);//将左中右的值合并成一个数组；
	return $res;
}


?>
