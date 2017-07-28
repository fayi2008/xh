<?php
namespace Test\Controller;
use Think\Controller;
class IndexController extends Controller {
    public function index(){
        echo send_message_new('15858177440','您的验证码为125677');
    }

    public function read(){
        if ($data = I ( 'post.' ) ) {
            echo implode(',', $data['tags']);
        }
    }
}