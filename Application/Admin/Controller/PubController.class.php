<?php
namespace Admin\Controller;
Use Admin\Logic\PubLogic;
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
            $info=M("admins")->where("ACCOUNT='".$name."'")->find();
            if($info)
            {
                $info=M("admins")->where("ACCOUNT='".$name."'")->find();
                if($info)
                {
                    if(!$info['email']){
                        $this->error("您未设置您的帐户邮箱，请联系管理员修改密码！");
                    }
                    $pass_code=make_char(6,1);
                    $info['PASS_CODE']=$pass_code;
                    $info['ID']=$info['id'];
                    $res=M("admins")->save($info);
       
                    if($res)
                    {
                        smtpmail("酒店管理系统找回密码服务",$info['email'],'',"您的新密码为{$pass_code}，<a href='http://".$_SERVER['HTTP_HOST']."/Admin/Pub/passwordReset/id/".$info['id']."/passcode/".$pass_code."'>请点击这里激活密码</a>");
                        $this->success("新密码已发送到您的邮箱，请登录邮箱查看并激活新密码",U('admin/pub/login'));
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
        $info=M("admins")->where("ID=$id")->find();
       
        if(!$info)
        {    
            $this->error("非法操作,请重新操作",U("Pub/sendMail"));
        }else{
            if($info['pass_code']==$code)
            {
                $pass=password_encrypt($code);
                $info1['PASSWORD']=$pass;
                $info1['ID']=$id;
                $info1['PASS_CODE']="";
                $res=M("admins")->save($info1);
                if($res)
                {
                    $this->success("密码激活成功！",U("admin/Pub/login"));
                }else{
                    $this->error("系统错误,请联系管理员",U("admin/Pub/login"));
                }
            }else{
                $this->error("非法操作,请重新操作",U("Pub/sendMail"));
            }
        }

    }


    public function logout() {
        //unset($_SESSION['ADMIN_ID']);
    	
        session('admin',null);//ward 2016-02-22
        session(null);
        redirect("login");
    }

    public function dologin() {
        $logic=new PubLogic();
        $res=$logic->dologin();
        if($res)
        {
            if ($_POST['ajax'] != 1) {
                $this->redirect('/admin');
            } else {
                $this->ajaxReturn(array('status' => 1, 'url' => '/admin'));
            }
        }else{
            $this->error($logic->getError(), U('/admin'));
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