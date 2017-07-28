<?php

/**
 * 首页
 */

namespace Common\Controller;

use App\Logic\AppLogic;

class BaseController extends \Think\Controller\RestController
{
    //初始化方法
    function _initialize()
    {
        if(C('MOBILE_HOST'))
        {
            if(strtolower($_SERVER['HTTP_HOST'])==strtolower(C('MOBILE_HOST')))
            {
                define('WEB_TYPE','Mobile');
            }else if(strtolower($_SERVER['HTTP_HOST'])==strtolower(C('TABLET_HOST'))){
                define('WEB_TYPE','Tablet');
				$logic=new AppLogic();
				if(isset($_GET['app_id']))
				{
					$app_info=$logic->getInfo($_GET['app_id']);
					session('app_info',$app_info);
				}
				if(session('app_info'))
				{
					$logic->click(session('app_info.id'));
					$this->assign('app_info',session('app_info'));
				}
            }else{
                define('WEB_TYPE','Desktop');
            }
        }else{
            if(check_wap())
            {
                define('WEB_TYPE','Mobile');
            }else{
                define('WEB_TYPE','Desktop');
            }
        }


        $this->assign("js_version", APP_DEBUG ? "v=" . time() : "v=" . APP_VERSION);
        if(session('user.id'))
        {
            $this->assign('user',json_encode(session('user')));
        }
        if (method_exists($this, '_init')) {
            $this->_init();
        }

        if(!IS_AJAX)
		{
			$this->assign('weather',$this->weather());
		}
		//用于用户注册，登录的验证--
		$time=time();
		$sign=session('xh_sign');
		if(session('xh_sign_time')+10*60<$time){//10分钟内sign不变
			$sign=hq_encrypt($time);
			session('xh_sign',$sign);
			session('xh_sign_time',$time);
		}	
		$this->assign('xh_sign',$sign);
		if(isset($_GET['useapp']))
		{
			session('useapp',intval($_GET['useapp']));
		}
		if(session('useapp'))
		{
			$this->assign('useapp',session('useapp'));
		}else{
			$this->assign('useapp',0);
		}
        $agent=$_SERVER["HTTP_USER_AGENT"];
        if(false!==strpos($agent,'MicroMessenger')){
       		 //$this->getWxOpenid();
        }
    }


	function weather(){
		$weather=S('weather');
		if(isset($weather)&&$weather){
			return $weather;
		}else {
			$weatherUrl = 'http://api.map.baidu.com/telematics/v3/weather?location=%E6%9D%AD%E5%B7%9E&output=json&ak=43nQqsCAYPe6lmd28NYu0iRY';
			$weatherStr = file_get_contents($weatherUrl);
			S('weather',$weatherStr,7200);
			return $weatherStr;
		}

	}

    function _empty()
    {

        header("HTTP/1.0 404 Not Found");

        $this->display('/404');

    }

    /**
     * Description: getWxInfo 获取微信登陆信息
     * Author: Jason
     */
    function getWxInfo()
    {
        //todo
    }
    
    /** 
     * 获得微信openid
     */
    function getWxOpenid(){
    	exit('getWxOpenid');
    	if(!session('wx_openid')){
    		$fromUrl=$_SERVER['HTTP_HOST'];
    	
    		if(false!==strpos('panorama.hqkeji.cn',$fromUrl)){
    			//购物节(测试服)
    			$appid=C('WECHAT_APPID');
    			$secret=C('WECHAT_APPSECRET');
    			$redirectUrl='http://panorama.hqkeji.cn'. $_SERVER["REQUEST_URI"];
    		}
    		if(false!==strpos('www.logomap.com',$fromUrl)){
    			$appid=C('WECHAT_APPID');
    			$secret=C('WECHAT_APPSECRET');
    			$redirectUrl='http://www.logomap.com'. $_SERVER["REQUEST_URI"];
    		}
    		
    		if(empty($_GET['code'])){
    			header("Content-type: text/html; charset=utf-8");
    			$redirectUrl=urlencode($redirectUrl);
    			$url ='https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$appid.'&redirect_uri='.$redirectUrl.'&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
    			$httpRes=redirect($url);//该url必须要用redirect不能用curl操作
    			exit();
    		}else{
    			$code=$_GET['code'];
    			if(empty($code)||!is_string($code)){
    				return false;
    			}
    			$url='https://api.weixin.qq.com/sns/oauth2/access_token?appid='.$appid.'&secret='.$secret.'&code='.$code.'&grant_type=authorization_code';
    			$res=http($url);
    			$res = json_decode($res, true);
    			if(empty($res['openid'])){
    				return false;
    			}
    			session('wx_code',$code);
    			session('wx_openid',$res['openid']);
    		}
    	}
    	$userLogic=new \User\Logic\UserLogic();
    	$info=$userLogic->getInfoByOpenId();
    	if(empty($info)){
    		$userId=$userLogic->addUserData();
    		session('guest.id',$userId);
    	}else{
    		session('guest',$info);
    	}
    }
    
    
    /**
     * 上传图片文件
     * @param string $dirname
     * @param array $exts
     */
    public function upload($cutFlag=0,$dirname='index',$exts=array('jpg', 'jpeg', 'png', 'gif','bmp'))
    {
   		
    	header("Access-Control-Allow-Origin:*");
    	$config = array(
    			'maxSize'    =>    100*1024*1024,  //单位是b
    			'savePath'   =>    $dirname.'/',
    			'saveName'   =>    array('date','Y-m-d-H-i-s'.rand(1,100)),
    			'rootPath'   =>    C('UPLOAD_PATH'),
    			'autoSub'    =>    true,
    			'subName'    =>    array('date','Ymd'),
    	);
    	$config['exts'] = $exts;
    	$upload = new \Think\Upload($config);// 实例化上传类
    	
    	$info=$upload->upload();
    
    	if(!$info) {// 上传错误提示错误信息
    		$msg=APP_DEBUG?$upload->getError():'上传失败！';
    		$this->ajaxUploadReturn(array('status'=>0,'msg'=>$msg));
    		exit;
    	}else{
    		$first=current($info);
    		$filename=C('UPLOAD_PATH').$first['savepath'].$first['savename'];
    		$imgArr=getimagesize($filename);
    		$file=$first['savepath'].$first['savename'];//截取之前的图片及路径
    		if($cutFlag){
    			
    			$cutFile=$this->cutPic($file);//截取之后的结果
    			if($cutFile!==false){
    				$file=$cutFile;
    			}
    		}
    		$this->ajaxUploadReturn(array('status'=>1,
    				'file'=>$file,'size'=>$first['size'],
    				'width'=>$imgArr[0],'height'=>$imgArr[1]));
    	}
    }

	/**
	 * Ajax方式返回数据到客户端
	 * @access protected
	 * @param mixed $data 要返回的数据
	 * @param String $type AJAX返回数据格式
	 * @param int $json_option 传递给json_encode的option参数
	 * @return void
	 */
	protected function ajaxUploadReturn($data,$type='',$json_option=JSON_UNESCAPED_UNICODE) {
		if(empty($type)) $type  =   C('DEFAULT_AJAX_RETURN');
		switch (strtoupper($type)){
			case 'JSON' :
				// 返回JSON数据格式到客户端 包含状态信息键	值
				if(strpos($_SERVER["HTTP_USER_AGENT"],"MSIE 9.0")||strpos($_SERVER["HTTP_USER_AGENT"],"MSIE 8.0"))
				{
					header('Content-Type:text/html; charset=utf-8');
				}else{
					header('Content-Type:application/json; charset=utf-8');
				}
				exit(json_encode($data,$json_option));
			case 'XML'  :
				// 返回xml格式数据
				header('Content-Type:text/xml; charset=utf-8');
				exit(xml_encode($data));
			case 'JSONP':
				// 返回JSON数据格式到客户端 包含状态信息
				header('Content-Type:application/json; charset=utf-8');
				$handler  =   isset($_GET[C('VAR_JSONP_HANDLER')]) ? $_GET[C('VAR_JSONP_HANDLER')] : C('DEFAULT_JSONP_HANDLER');
				exit($handler.'('.json_encode($data,$json_option).');');
			case 'EVAL' :
				// 返回可执行的js脚本
				header('Content-Type:text/html; charset=utf-8');
				exit($data);
			default     :
				// 用于扩展其他返回格式数据
				Hook::listen('ajax_return',$data);
		}
	}
    
    /**
     * 截取图片
     * @param string $dirname
     * @param array $exts
     */
    private function cutPic($picDir,$baseHeight=135,$baseWidth=135){
		$newPicDir=C('UPLOAD_PATH').$picDir;
    	if(!file_exists($newPicDir)){
			return false;
		}
		$arr=getimagesize($newPicDir);//获得图片信息
		$picWidth =$arr[0];//源图片的宽
		$picHeight =$arr[1];//源图片的高
		//根据图片类型，获得图片的句柄
		switch($arr[2]){
			case 1:
				$img=imagecreatefromgif($newPicDir);
				$name=basename($newPicDir,'.gif');
				break;
			case 2:
				$img=imagecreatefromjpeg($newPicDir);
				$name=basename($newPicDir,'.jpg');
				break;
			case 3:
				$img=imagecreatefrompng($newPicDir);
				$name=basename($newPicDir,'.png');
				break;
		}
		//获得放大（缩小）的比例
		$ratioWidth=$picWidth/$baseWidth;
		$ratioHeight=$picHeight/$baseHeight;
		if($ratioHeight>$ratioWidth){
			$ratio=1/$ratioWidth;
		}else{
			$ratio=1/$ratioHeight;
		}
		//图片等比例放大（缩小）后的宽和高
		$newWidth =$picWidth * $ratio;
		$newHeight = $picHeight * $ratio;
		
		//用于处理截图图片的参数
		$picX=0;
		$picY=0;
		if($newHeight>$newWidth){//如果高大于宽
			$picY=($newHeight-$baseHeight)/2;
		}else{//如果高小于宽
			$picX=($newWidth-$baseWidth)/2;
		}
		//开始处理图片（1先放大或缩小到规定的比例，2截取处理后最中间的部分
		if(function_exists("imagecopyresampled")){
			//放大（缩小）
			$tempImg = imagecreatetruecolor($newWidth,$newHeight);
			imagecopyresampled($tempImg,$img,0,0,0,0,$newWidth,$newHeight,$picWidth,$picHeight);
			//截取图片
			$newImg=imagecreatetruecolor($baseWidth,$baseHeight);
			imagecopyresampled($newImg,$tempImg,0,0,$picX,$picY,$baseWidth,$baseHeight,$baseWidth,$baseHeight);
		}else{
			//放大（缩小）
			$tempImg = imagecreate($newWidth,$newHeight);
			imagecopyresized($tempImg,$img,0,0,0,0,$newWidth,$newHeight,$picWidth,$picHeight);
			//截取图片
			$newImg=imagecreate($baseWidth,$baseHeight);
			imagecopyresized($newImg,$tempImg,0,0,$picX,$picY,$baseWidth,$baseHeight,$baseWidth,$baseHeight);
		}
		
		$dir=dirname($picDir);
		
		$name=$dir.'/'.$name.'-c.jpg';
		
		imagejpeg($newImg,C('UPLOAD_PATH').$name);
		imagedestroy($tempImg);
		imagedestroy($newImg);
		return $name;
	} 

}
