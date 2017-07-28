<?php

/**
 * 首页
 */

namespace Common\Controller;

class BusinessController extends \Think\Controller\RestController {
	
	/**
	 * 初始化调用方法
	 */
	public function _initialize() {
        $this->assign("js_version", APP_DEBUG ? "v=" . time() : "v=" . APP_VERSION);

        $user = session('business');
        if ($user == null || $user['id'] == null)
        {
            redirect('/business/pub/login');    
        }else{
            $this->assign('user',$user);
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
        //TODO
		return true;
	}

    /**
     * 上传图片文件
     * @param string $dirname
     * @param array $exts
     */
    public function upload($dirname='business',$exts=array('jpg', 'jpeg', 'png', 'gif','bmp'))
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

}
