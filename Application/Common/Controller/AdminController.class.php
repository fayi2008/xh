<?php

/**
 * 首页
 */

namespace Common\Controller;

class AdminController extends \Think\Controller\RestController {
	
	/**
	 * 初始化调用方法
	 */
	public function _initialize() {
        $this->assign("js_version", APP_DEBUG ? "v=" . time() : "v=" . APP_VERSION);

        $user = session('admin');
		if(MODULE_NAME=="Panorama"&&CONTROLLER_NAME=="Admin")
		{
			if($user == null || $user['id'] == null)
			{
				$user = session('business');
			}
		}
        if ($user == null || $user['id'] == null)
        {
            redirect('/admin/pub/login');    
        }else{
        	$request_uri= $_SERVER['REQUEST_URI'];
        	
        	if(strripos($request_uri,"?")!==false){
        		$pos=strripos($request_uri,"?");
        		
        		$request_uri=substr($request_uri,0, $pos);
        	}
        	$logic_access=new \System\Logic\AccessLogic();
        	//var_dump($request_uri);
			if(MODULE_NAME=="Panorama"&&CONTROLLER_NAME=="Admin")
			{
				if($user)
				{
					$access_flag=true;
				}else{
					$access_flag=false;
				}
			}else{
				$access_flag=$logic_access->check_access($user['role_id'],$request_uri);
			}
        	
        	if($access_flag){
        		$this->assign('user',$user);
        	}else{
        		
        		redirect('/admin/pub/login','3',"没有权限");
        	}
           
        }
		$this->assign('httphost',$_SERVER['HTTP_HOST']);
        if (method_exists($this, '_init')) {
            $this->_init();
        }
	}



	/**
	 * 权限判断
	 * @param int  $roleid 角色ID
	 */
	private function check_access($roleid) {
		return true;
	}

    /**
     * 上传图片文件
     * @param string $dirname
     * @param array $exts
     */
    public function upload($dirname='admin',$exts=array('jpg', 'jpeg', 'png', 'gif','bmp'))
    {   
    	header("Access-Control-Allow-Origin:*");
        $config = array(
            'maxSize'    =>    100*1024*1024,  //单位是b
            'savePath'   =>    $dirname.'/',
            'saveName'   =>    array('date','Y-m-d-H-i-s'.rand(1,100)),
            'rootPath'   =>   C('UPLOAD_PATH'),
            'autoSub'    =>    true,
            'subName'    =>    array('date','Ymd'),
        );
        $config['exts'] = $exts;
        $upload = new \Think\Upload($config);// 实例化上传类

        $info=$upload->upload();
    	if(!$info) {// 上传错误提示错误信息
    		$msg=APP_DEBUG?$upload->getError():'上传失败！';
    		$this->ajaxReturn(array('status'=>0,'msg'=>$msg));
    		exit;
    	}else{
    		$first=current($info);
    		$filename=C('UPLOAD_PATH').$first['savepath'].$first['savename'];
    		$imgArr=getimagesize($filename);
    		$this->ajaxReturn(array('status'=>1,
    				'file'=>$first['savepath'].$first['savename'],'size'=>$first['size'],
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
	protected function ajaxReturn($data,$type='',$json_option=JSON_UNESCAPED_UNICODE) {
		if(empty($type)) $type  =   C('DEFAULT_AJAX_RETURN');
		switch (strtoupper($type)){
			case 'JSON' :
				// 返回JSON数据格式到客户端 包含状态信息键值
				header('Content-Type:application/json; charset=utf-8');
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

}
