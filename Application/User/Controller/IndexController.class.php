<?php
namespace User\Controller;

use User\Logic\UserLogic;
class IndexController extends \Common\Controller\BaseController {
	protected $logic;
    public  function _init(){
    	C('VIEW_PATH',APP_ROOT.'/Template/'.WEB_TYPE.'/User/');

        $this->logic=new UserLogic();	
    }
    /**
     * Description: index 个人中心
     * Author: Jason
     * Date:
     */
    public function index_get_html(){
        $this->assign('class','index');
        $this->display('index');
    }



	/**
	 * Description: index 个人中心 我的印象
	 * Author: fay
	 * Date:20151105
	 */
	public function photo_get_html(){
		$this->assign('class','photo');
		$this->display('photo');
	}

	/**
	 * Description: index 个人中心 我收藏的路线
	 * Author: ting
	 * Date:20151109
	 */
	public function way_get_html(){
		$this->assign('class','way');
		$this->display('way');
	}

	/**
	 * Description: index 个人中心 我的游记
	 * Author: fay
	 * Date:20151105
	 */
	public function travels_get_html(){
		$this->assign('class','travels');
		$this->display('travels');
	}
	/**
	 * Description: index 个人中心 我的评论
	 * Author: fay
	 * Date:20151105
	 */
	public function comment_get_html(){
		$this->assign('class','comment');
		$this->display('comment');
	}
	/**
	 * Description: index 个人中心 我的评论
	 * Author: fay
	 * Date:20151105
	 */
	public function travels_comment_get_html(){
		$this->assign('class','travels_comment');
		$this->display('travels_comment');
	}

	/**
	 * Description: index 个人中心 我的评论
	 * Author: jason
	 * Date:20151105
	 */
	public function news_comment_get_html(){
		$this->assign('class','news_comment');
		$this->display('news_comment');
	}

	/**
	 * Description: index 个人中心 用户订单列表
	 * Author: fay
	 * Date:20151105
	 */
	public function order_get_html(){
		$this->assign('class','order');
		$this->display('order');
	}

    /**
     * Description: index 用户个人中心展示给用户的注册信息
     * Author: ward
     * Date: 2015-10-28
     * Return:json
     */
	public function index_get_json(){
		$res=$this->logic->getUserInfo();
		if(!empty($res)){
			$this->ajaxReturn(array('status'=>1,'data'=>$res));
		}else{
			$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
		}
	}

    /**
     * Description: index 获取登陆页面
     * Author: Jason
     * Date:
     */
    public function login_get_html(){
        echo "login_get_html";
    }

    /**
     * Description: login_post 登陆验证
     * Author: ward
     * Date: 2015-10-28
     * Param: $_POST('mobile'=>'账号','password'=>'密码')
     */
    public function login_post(){
    	
    	$password=$_POST['password'];
    	$mobile=$_POST['mobile'];
    	$msg=$_POST['msg'];//短信码\
    	$sign=$_POST['xh_sign'];
		//var_dump($sign,hash('sha256', session('xh_sign')));exit();
    	
    	if(!empty($msg)&&empty($password)){
    		$res=$this->logic->doLoginByMsg($mobile,$msg,$sign);
    	}else{
    		$account=$mobile;
    		$res=$this->logic->doLoginByPwd($account,$password,$sign);
    	}
    	if($res){
    		$this->logic->updateLoginInfo();//更新登录信息
    		$this->ajaxReturn(array('status'=>1,'msg'=>'登录成功！','data'=>session('user')));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
    	}
    }
    
    /**
     * Description: logout_post 注销
     * Author: ward
     * Date: 2015-10-28
     */
    public function logout_post(){
    	session('user',null);
    	$userId=session('user.id');
    	if(empty($userId)){
    		$this->ajaxReturn(array('status'=>1,'msg'=>'注销成功！'));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>'注销失败！'));
    	}
    }
    

    /**
     * Description: index 显示注册页面
     * Author: Jason
     * Date:
     */
    public function register_get_html(){
    	echo "register_get_html";
    }

    /**
     * Description: register_post 提交注册信息
     * Author: ward
     * Date: 2015-10-28
     * Param: $_POST('msg'=>'短信码','password'=>'密码','mobile'=>'手机号','nickname'=>'昵称')
     * 
     */
    public function register_post(){
        $regInfo=$_POST;
        $sign=$_POST['xh_sign'];
    	$res=$this->logic->registerUser($regInfo,$sign);
    	if($res){
    		$this->ajaxReturn(array('status'=>1,'msg'=>'注册成功！'));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
    	}
    }

    
//     /**
//      * Description: profile_get_html 编辑个人信息
//      * Author: ward
//      * Date:
//      */
//     public  function profile_get_html(){
    	
//     }
    
    
    /**
     * Description: profile_put 编辑个人信息（修改头像、昵称、密码（短信验证、旧密码））
     * 				如忘记了旧密码则无法通过此方法修改密码
     * Author: ward
     * Param: $_POST('password'=>'密码','head_img'=>'头像','nickname'=>'昵称')
     * Date:
     */
    public  function profile_put(){
    	$userInfo=$_POST;
    	$sign=$_POST['xh_sign'];
    	$res=$this->logic->updateUserInfo($userInfo,$sign);
    	if($res!==false){
    		$this->ajaxReturn(array('status'=>1,'msg'=>'修改成功！'));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
    	}
    }
	
    /**
     * Description: resetpwd_put 通过手机验证码方式修改密码,
     * 			            而通过旧密码修改新密码则用profile_put方法
     * Author: ward
     * Param: $_POST('password'=>'密码','mobile'=>'手机号','msg'=>'验证码','xh_sign')
     * 
     * Date:
     */
    public function resetpwd_put(){
    	$userInfo=$_POST;
    	$sign=$_POST['xh_sign'];
    	$res=$this->logic->updatePwd($userInfo,$sign);
    	if($res!==false){
    		$this->ajaxReturn(array('status'=>1,'msg'=>'修改成功！'));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
    	}
    }
    
    
   /**
     * Description: verifiy_get_json 用户获得手机短信验证码
     * Author: Jason
     * Date:
     */
    public function  verifiy_get_json(){
    	$mobile=$_GET['mobile'];
    	$res=$this->logic->getVerifiyMsg($mobile);
    	if($res){
    		$this->ajaxReturn(array('status'=>1));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>$this->logic->getError()));
    	}
    }
    
    /**
     * Description: upload 前端上传图片的公共接口
     * Author: ward
     * Date:
     */
    public  function upload_post(){
    	
    	$userId=session('user.id');
    	if(empty($userId)){
    		$this->ajaxReturn(array('status'=>0,'msg'=>'请先登录！'));
    		exit;
    	}
    	$cutFlag=intval($_POST['cut']);
    	if($cutFlag){
    		$res=parent::upload(1);
    	}else{
    		$res=parent::upload();
    	}
    	return $res;
    }
    
   
    
    /**
     * Description: comment_get_json 用户获得自己发布的评论
     * Author: ward
     * Date: 2015-11-10
     * Param: $_GET
     */
    public function comment_get_json(){
    	$selectArr=$_GET;
    	$data=$this->logic->getMyComment($selectArr);
    	if(false===$data){
    		$this->ajaxReturn(array('status'=>0,'msg'=>'系统错误！'));
    	}else{
    		$this->ajaxReturn(array('status'=>1,'data'=>$data));
    	}
    }
    
    /**
     * Description: travels_get_json 用户获得自己发布的游记
     * Author: ward
     * Date: 2015-11-10
     * Param: $_GET
     */
    public function travels_get_json(){
    	$selectArr=$_GET;
    	$data=$this->logic->getMyTravels($selectArr);
    	if(false===$data){
    		$this->ajaxReturn(array('status'=>0,'msg'=>'系统错误！'));
    	}else{
    		$this->ajaxReturn(array('status'=>1,'data'=>$data));
    	}
    }
    
    /**
     * Description: travels_get_json 用户获得自己发布的照片
     * Author: ward
     * Date: 2015-11-10
     * Param: $_GET(分页参数)
     */
    public function photo_get_json(){
    	$selectArr=$_GET;
    	$data=$this->logic->getMyPhoto($selectArr);
    	if(false===$data){
    		$this->ajaxReturn(array('status'=>0,'msg'=>'系统错误！'));
    	}else{
    		$this->ajaxReturn(array('status'=>1,'data'=>$data));
    	}
    }
    
    
     /**
     * Description: collect_get_json 用户获得自己收藏的路线
     * Author: ward
     * Date: 2015-11-12
     * Param: $_GET(分页参数)
     */
    public function  collect_get_json(){
    	$selectArr=$_GET;
    	$data=$this->logic->getMyCollect($selectArr);
    	if(false===$data){
    		$this->ajaxReturn(array('status'=>0,'msg'=>'系统错误！'));
    	}else{
    		$this->ajaxReturn(array('status'=>1,'data'=>$data));
    	}
    }
    
    
    /**
     * Description: collect_post 用户收藏（取消收藏）路线
     * Author: ward
     * Date: 2015-11-12
     * Return json('status'=>1,data=>'1表示收藏0表示取消收藏')//
     */
    public  function  collect_post(){
    	$wayId=intval($_POST['way']);
    	$res=$this->logic->updateCollectWay($wayId);
    	if($res['status']>0){
    		$this->ajaxReturn(array('status'=>1,'data'=>intval($res['msg'])));
    	}else{
    		$this->ajaxReturn(array('status'=>0,'msg'=>'系统错误！'));
    	}
    	
    }

}