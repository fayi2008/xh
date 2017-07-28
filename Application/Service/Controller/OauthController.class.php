<?php
namespace  Service\Controller;

class  OauthController extends \Common\Controller\BaseController{
	protected  $logic;
	public  function _init(){
		$this->logic=new \Service\Logic\OauthLogic();
		C('VIEW_PATH',APP_ROOT.'Template/Mobile/Service/Index/');
	}
	
	function wait()
    {
        $open_id=session('open_id');
        if(!$open_id)
        {
            $open_id=$this->getOpenId();
            session('open_id',$open_id,86400);
        }
 
        if($open_id)
        {
            $this->logic->checkWait($open_id);
        }else{
            exit('获取open_id失败');
        }

        $this->display(C('VIEW_PATH').'wait.html');
    }

    function getRequests()
    {
    	//session('open_id','o2f1muF7DDsMnOYp9_ZHj-Vs77eY');
    	$open_id=session('open_id');
        if(!$open_id)
        {
            $open_id=$this->getOpenId();
            session('open_id',$open_id,86400);
        }
      
        if($open_id)
        {
           $this->logic->checkWait($open_id);
        }else{
            exit('获取open_id失败');
        }
        $wx_worker=session('wx_worker');
        $oauthId=$wx_worker['id'];
		$poiInfo=M('k_business_poi')->where('id='.$wx_worker['poi_id'])->find();
		if(!$poiInfo['receive_status']){
			echo '该商家点已经被超级管理员关闭！';
			exit();
		}
        $info=M('k_oauth_user')->where('id='.$oauthId)->find();
        $this->assign('receive_status',$info['receive_status']);
//         echo "<pre/>";
//         var_dump($wx_worker,$info);exit();//ward 205-12-17
      //  $this->display(ROOT.'/pages/waiter/wait.html');
        $this->display(C('VIEW_PATH').'wait.html');
    }

    /**
     * Description: 绑定
     * Author: Jason
     */
    public function bind() {
//     	$testArr=array('id'=>'1','openid'=>'o2f1muOTWIhUaTQWPjee6plFCXtw','subscribe'=>'heheh');
//     	$user_info=session('wx_worker',$testArr);
//     	session('open_id','o2f1muOTWIhUaTQWPjee6plFCXtw');
    	
        $open_id=session('open_id');
        if(!$open_id)
        {
            $open_id=$this->getOpenId();
            session('open_id',$open_id,86400);
        }
        if($open_id)
        {
           $this->logic->checkOpenId($open_id);
        }else{
            exit('获取open_id失败');
        }
        $res=session('wx_worker');
        $this->display(C('VIEW_PATH').'bind.html');

    }
    
    public function unbind(){
    	$open_id=session('open_id');
    	if(!$open_id)
    	{
    		$open_id=$this->getOpenId();
    		session('open_id',$open_id,86400);
    	}
    	
    	if($open_id)
    	{
    		$this->logic->checkOpenId($open_id);
    	}else{
    		exit('获取open_id失败');
    	}
    	
      	$user_info=session('wx_worker');
        if(!$user_info)
        {
            $this->ajaxReturn(array('status'=>false,'info'=>'身份信息不存在'));
        }
    	
    	$res=$this->logic->unbind($user_info['id']);
    	
    	if($res!==false){
            //$this->display(ROOT.'/pages/waiter/unbind.html');
    		$this->display(C('VIEW_PATH').'unbind.html');
    	}else{
            //$this->display(ROOT.'/pages/waiter/unbinderror.html');
    		$this->display(C('VIEW_PATH').'unbinderror.html');
    	}
    }

    function bindpoi()
    {
        $user_info=session('wx_worker');
        if(!$user_info){
            $this->ajaxReturn(array('status'=>false,'info'=>'身份信息不存在'));
        }

        $key=$_POST['key'];
        if(!$key)
        {
            $this->ajaxReturn(array('status'=>false,'info'=>'key不存在'));
        }
        $phone=$_POST['phone'];
        if(!$phone)
        {
            $this->ajaxReturn(array('status'=>false,'info'=>'电话号码不存在'));
        }
       
        $res=$this->logic->bindPoi($key,$user_info['id'],$phone);
        if($res!==false)
        {
            $this->ajaxReturn(array('status'=>true,'info'=>'绑定成功,请每日在公众号发送‘签到’保证公众号可以正常服务'));
        }else{
            $this->ajaxReturn(array('status'=>false,'info'=>'验证失败，key输入有误'));
        }

    }


    /**
     * Description: 绑定
     * Author: Jason
     */
    public function bind_service() {
        $open_id=session('open_id');
        if(!$open_id)
        {
            $open_id=$this->getOpenId();
            session('open_id',$open_id,86400);
        }
       
        if($open_id)
        {
           $this->logic->checkOpenId($open_id);
        }else{
            exit('获取open_id失败');
        }

        $this->display(C('VIEW_PATH').'bind_service.html');
    }

    public function do_bind_service() {
        $user_info=session('wx_worker');
        if(!$user_info)
        {
            $this->ajaxReturn(array('status'=>false,'info'=>'身份信息不存在'));
        }
        $key=$_POST['key'];
        if(!$key)
        {
            $this->ajaxReturn(array('status'=>false,'info'=>'key不存在'));
        }
       
        $res=$this->logic->bindService($key,$user_info['id']);
        if($res!==false)
        {
            $this->ajaxReturn(array('status'=>true,'info'=>'绑定成功,请每日在公众号发送‘签到’保证公众号可以正常服务'));
        }else{
            $this->ajaxReturn(array('status'=>false,'info'=>'验证失败，key输入有误'));
        }
    }


    private function getOpenId()
    {
        $state = I('get.state');
        $weixin = new \Common\Lib\Api\WxChat();
        $user_agent = strtolower($_SERVER['HTTP_USER_AGENT']);
        if (!$state && strpos($user_agent, "micromessenger") !== false) {
            $back_url="http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $redirect_url='http://' . C('API_DOMAIN') . '/Wx/Wx/getcodenew?backurl=' . urlencode(urlencode($back_url));
            $weixin->getCodeInWeb($redirect_url);
            exit;
        }else{
            $code = I('get.code');
            if ($code) {
                $res = $weixin->getOpenIdByCode($code);
                $openid = $res['openid'];
                return $openid;
            }
        }
        return false;
    }

    
    
   
    
  
   

    public function phonelist()
    {
        $user_info=session('wx_worker');
        if(!$user_info)
        {
            $this->ajaxReturn(array('status'=>false,'info'=>'身份信息不存在'));
        }
       // $this->ajaxReturn(array('status'=>true,'data'=>$user_info));
       
        $res=$this->logic->getPhoneList($user_info['poi_id'],$user_info['id']);
        if($res!==false)
        {
            $this->ajaxReturn(array('status'=>true,'data'=>$res));
        }else{
            $this->ajaxReturn(array('status'=>false,'info'=>'没有管理员信息'));
        }
    }
    /**
     * 开/关 --接单
     */
    public function switchReceive(){
    	$info=session('wx_worker');
    	if(!$info)
    	{
    		$this->ajaxReturn(array('status'=>false,'info'=>'身份信息不存在'));
    	}
    	$status=$_GET['status'];
    	//$service=new \Home\Oauth\UserService();
        $res=$this->logic->updateReceiveStatus($info['id'],intval($status));
        if($res!==false){
        	$this->ajaxReturn(array('status'=>true,'receive_status'=>$res['receive_status'], 'info'=>'成功'));
        }else{
        	$this->ajaxReturn(array('status'=>false,'info'=>'没有管理员信息'));
        }
    }
}