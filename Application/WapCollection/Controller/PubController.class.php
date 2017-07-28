<?php
namespace WapCollection\Controller;
Use WapCollection\Logic\PubLogic;
class PubController extends \Think\Controller\RestController {
    //后台登陆界面
    public function login() {
        $this->display();
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
        session('culture',null);
        redirect("login");
    }

    public function dologin() {
    	
        $logic=new  PubLogic();
        $res=$logic->dologin();
      
        if($res)
        {
            if ($_POST['ajax'] != 1) {
                $this->ajaxReturn(array('status' => 1, 'url' => '/WapCollection/admin'));
            } else {
                $this->ajaxReturn(array('status' => 1, 'url' => '/WapCollection/admin'));
            }
        }else{
           $this->ajaxReturn(array('status' => 0, 'url' => '/WapCollection/admin','info'=>$logic->getError()));
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