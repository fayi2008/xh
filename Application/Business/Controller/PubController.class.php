<?php
namespace Business\Controller;
Use Business\Logic\PubLogic;
class PubController extends \Think\Controller\RestController {
    //后台登陆界面
    public function login() {
        $this->display();
    }
    /**
     * 找回密码
     */
    public function sendMail() {
        if(IS_POST)
        {
            $verify = $_POST['verify'];
            if (!check_verify($verify)) {
                $this->error("验证码错误！");
            }
            $name = $_POST['username'];
            $info=M("users")->where("user_login='".$name."'")->find();
            if($info)
            {
                $info=M("users")->where("user_login='".$name."'")->find();
                if($info)
                {
                    if(!$info['user_email']){
                        $this->error("您未设置您的帐户邮箱，请联系管理员修改密码！");
                    }
                    $pass_code=make_char(6,1);
                    $info['pass_code']=base64_encode($pass_code);
                    $res=M("users")->save($info);
                    if($res)
                    {
                        smtpmail("酒店管理系统找回密码服务",$info['user_email'],'',"您的新密码为{$pass_code}，<a href='http://".$_SERVER['HTTP_HOST']."/Admin/Public/passwordReset/id/".$info['ID']."/passcode/".$info['pass_code']."'>请点击这里激活密码</a>");
                        $this->success("新密码已发送到您的邮箱，请登录邮箱查看并激活新密码",U('Pub/index/login'));
                        exit;
                    }else{
                        $this->error("系统错误！");
                    }

                }else{
                    $this->error("您输入的帐号不存在！");
                }
            }
        }
        $this->display('sendMail');
    }

    function passwordReset()
    {
        $id=intval($_GET['id']);
        $code=$_GET['passcode'];
        $info=M("users")->find($id);
        if(!$info)
        {
            $this->error("非法操作,请重新操作",U("Pub/sendMail"));
        }else{
            if($info['pass_code']==$code)
            {
                $pass=password_encrypt(base64_decode($code));
                $info['user_pass']=$pass;
                $info['pass_code']="";
                $res=M("users")->save($info);
                if($res)
                {
                    $this->success("密码激活成功！",U("Pub/login"));
                }else{
                    $this->error("系统错误,请联系管理员",U("Pub/login"));
                }
            }else{
                $this->error("非法操作,请重新操作",U("Pub/sendMail"));
            }
        }

    }


    public function logout() {
        session('business',null);
        redirect("login");
    }

    public function dologin() {
    	
        $logic=new PubLogic();
        $res=$logic->dologin();
        if($res)
        {
            if ($_POST['ajax'] != 1) {
                $this->redirect('/business/admin');
            } else {
                $this->ajaxReturn(array('status' => 1, 'url' => '/business/admin'));
            }
        }else{
            $this->error($logic->getError(), U('/business'));
        }

    }
    function show_verify($num=false)
    {
        $config=array(
            'length'     => I('get.length', 4),
            'imageH'     => I('get.height', 50),
            'imageW'     => I('get.width', 238),
            'fontSize'   => I('get.size', 20),
            'useCurve'   => FALSE,
            'fontttf'    => '2.ttf',
        );
        if($num)
        {
            $config['codeSet']='0123456789';
        }
        $verify = new \Think\Verify($config);
        $verify->entry(1);
    }



}