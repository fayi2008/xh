<?php

/**
 * 首页
 */

namespace Common\Controller;

class CultureController extends \Think\Controller\RestController {
	
	/**
	 * 初始化调用方法
	 */
	public function _initialize() {
        $this->assign("js_version", APP_DEBUG ? "v=" . time() : "v=" . APP_VERSION);

        $user = session('culture');
        $user['id']=100;
        if ($user == null || $user['id'] == null)
        {
            redirect('/WapCollection/pub/login');    
        }else{
            $this->assign('user',$user);
        }
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
    		$this->ajaxReturn(array('status'=>0,'msg'=>$msg));
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
    		$this->ajaxReturn(array('status'=>1,
    				'file'=>$file,'size'=>$first['size'],
    				'width'=>$imgArr[0],'height'=>$imgArr[1]));
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
