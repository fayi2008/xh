/*
 * Author:fay
 * Date:2016-03-30
 * desc:全局登陆模块
 *
 * */
//登陆扩展
$._singin_ = function(opt) {
    var options = {
        before_submit1:function() {},
        //提交前
        before_submit2:function() {},
        //提交前
        close:function() {},
        success:function() {},
        //登陆成功
        fail:function() {}
    };
    var opts = $.extend(options, opt);
    var mask = '<div class="login-mask"></div>';
    if (!$(".login-mask").length) {
        $("body").append(mask);
    }
    var html = '<div class="login-box">';
    html += '<div class="login-close"><span></span></div>';
    html += '<div class="login-title"><div type="1" class=" checked">账号密码登录</div><div type="2">手机验证登录</div></div>';
    html += '<div class="login-content">';
    html += '<div class="type1">';
    html += '<div class="login-input"><span></span><input type="text" id="username" placeholder="账号"></div>';
    html += '<div class="login-tips" type="username"></div>';
    html += '<div class="login-input"><span></span><input type="password" id="password" placeholder="密码"></div>';
    html += '<div class="login-tips" type="password"></div>';
    html += '<div class="login-button-box"><div class="login-button login-submit1">登录</div></div>';
    html += '<div class="login-right signup-to">立刻注册</div>';
    html += "</div>";
    html += '<div class="type2">';
    html += '<div class="login-input"><span></span><input type="tel" id="mobile" placeholder="手机号"></div>';
    html += '<div class="login-tips" type="mobile"></div>';
    html += '<div class="login-input"><span></span><input type="text" id="mark" placeholder="验证码"><div class="send-mark">发送验证码</div></div>';
    html += '<div class="login-tips" type="mark"></div>';
    html += '<div class="login-button-box"><div class="login-button login-submit2">登录</div></div>';
    html += '<div class="login-right signup-to">立刻注册</div>';
    html += "</div>";
    html += "</div>";
    html += "</div>";
    $("body").append(html);
    //切换登陆方式
    $(".login-title>div").on("click", function() {
        $(this).addClass("checked").siblings().removeClass("checked");
        var type = $(this).attr("type");
        $(".type" + type).show().siblings().hide();
    });
    //登陆跳转到注册
    $(".signup-to").on("click", function() {
        $(".login-box").remove();
        $._signup_();
    });
    //关闭登陆窗口
    $(".login-close>span").on("click", function() {
        $(".login-box").remove();
        $(".login-mask").remove();
        opts.close();
    });
    //发送验证码
    $(".send-mark").on("click", function() {
        if (!$("#mobile").val()) {
            $(".login-tips[type=mobile]").html("*手机号不能为空");
            return false;
        } else {
            $(".login-tips[type=mobile]").html("");
        }
        if(!/^1\d{10}$/gi.test($("#mobile").val())){

            $(".login-tips[type=mobile]").html("*请输入正确的手机号");

        } else {
            $(".login-tips[type=mobile]").html("");
        }

    });
    zhlogin();
    //登陆按钮事件
    function zhlogin() {
        $(".login-submit1").on("click", function() {
            opts.before_submit1();
            var username = $("#username").val(), password = $("#password").val();
            var bol = 1;
            if (!username) {
                $(".login-tips[type=username]").html("*用户名不能为空");
                bol = 0;
            } else {
                $(".login-tips[type=username]").html("");
            }
            if (!password) {
                $(".login-tips[type=password]").html("*密码不能为空");
                bol = 0;
            } else {
                $(".login-tips[type=password]").html("");
            }
            if (bol == 0) {
                return false;
            }
            $(".login-submit1").off("click")
            $.post("/user/login.json", {
                password: $.SHA256(password),
                mobile:username,
                xh_sign:$.SHA256(window.XH_SIGN)
            }, "json").done(function(rs) {
                if (rs.status == 1) {
                    $(".login-box").remove();
                    $(".login-mask").remove();
                    opts.success(rs);
                } else {
                    $(".login-box").remove();
                    $(".login-mask").remove();
                    $._singin_(opts);
                    $.XHalert({
                        content:rs.msg
                    });
                }
            }).fail(function(err) {
                $(".login-box").remove();
                $(".login-mask").remove();
                $._singin_(opts);
                alert(JSON.stringify(err));
            }).complete(function() {
                //zhlogin();
            });
        });
    }
    //发送验证码
    function mark() {
        $(".send-mark").on("click", function() {
            if (!$("#mobile").val()) {
                $(".login-tips[type=mobile]").html("*手机号不能为空");
                return false;
            } else {
                $(".login-tips[type=mobile]").html("");
            }
            if(!/^1\d{10}$/gi.test($("#mobile").val())){

                $(".login-tips[type=mobile]").html("*请输入正确的手机号");
                bol = 0;
            } else {
                $(".login-tips[type=mobile]").html("");
            }
            $(".send-mark").off("click")
            $.getJSON("/user/verifiy.json", {
                mobile:$("#mobile").val()
            }).done(function(rs) {
                if (rs.status) {
                    $(".send-mark").off("click").html("请60秒后重试");
                    var second = 0;
                    var i = setInterval(function() {
                        second++;
                        $(".send-mark").html("请" + (60 - second) + "秒后重试");
                        if (second == 60) {
                            clearInterval(i);
                            mark();
                            $(".send-mark").html("发送验证码");
                        }
                    }, 1e3);
                }
            });
        });
    }
    mark();
    marklogin();
    function marklogin() {
        $(".login-submit2").on("click", function() {
            opts.before_submit2();
            var bol = 1;
            if (!$("#mobile").val()) {
                $(".login-tips[type=mobile]").html("*手机号不能为空");
                bol = 0;
            } else {
                $(".login-tips[type=mobile]").html("");
            }
            if(!/^1\d{10}$/gi.test($("#mobile").val())){

                $(".login-tips[type=mobile]").html("*请输入正确的手机号");
                bol = 0;
            } else {
                $(".login-tips[type=mobile]").html("");
            }

            if (!$("#mark").val()) {
                $(".login-tips[type=mark]").html("*验证码不能为空");
                bol = 0;
            } else {
                $(".login-tips[type=mark]").html("");
            }
            if (bol == 0) {
                return false;
            }
            $(".login-submit2").off("click")
            $.post("/user/login.json", {
                msg:$("#mark").val(),
                mobile:$("#mobile").val(),
                xh_sign:$.SHA256(window.XH_SIGN)
            }, "json").done(function(rs) {
                if (rs.status == 1) {
                    $(".login-box").remove();
                    $(".login-mask").remove();
                    opts.success(rs);
                } else {
                    $(".login-box").remove();
                    $(".login-mask").remove();
                    $._singin_(opts);
                    $.XHalert({
                        content:rs.msg
                    });
                }
            }).fail(function(err) {
                $(".login-box").remove();
                $(".login-mask").remove();
                $._singin_(opts);
                alert(JSON.stringify(err));
            }).complete(function() {
                //marklogin();
            });
        });
    }
};

//注册扩展
$._signup_ = function(opt) {
    var options = {
        before_submit:function() {},
        //提交前
        success:function() {},
        //注册成功
        fail:function() {}
    };
    var opts = $.extend(options, opt);
    var mask = '<div class="login-mask"></div>';
    if (!$(".login-mask").length) {
        $("body").append(mask);
    }
    var html = '<div class="signup-box">';
    html += '<div class="signup-close"><span></span></div>';
    html += '<div class="signup-title">注册</div>';
    html += '<div class="signup-content">';
    html += '<div class="signup-input"><div class="signup-name">昵称</div><input type="text" placeholder="请输入昵称"  id="name"></div>';
    html += '<div class="signup-tips" type="name"></div>';
    html += '<div class="signup-input"><div class="signup-name">手机号</div><input type="text"  id="mobile"></div>';
    html += '<div class="signup-tips" type="mobile"></div>';
    html += '<div class="signup-input"><div class="signup-name">验证码</div><input type="text" id="mark"><div class="send-mark">发送验证码</div></div>';
    html += '<div class="signup-tips" type="mark"></div>';
    html += '<div class="signup-input"><div class="signup-name">密码</div><input placeholder="请输入密码" type="password" id="password"></div>';
    html += '<div class="signup-tips" type="password"></div>';
    html += '<div class="signup-input"><div class="signup-name">确认密码</div><input placeholder="请再次输入密码" type="password" id="confirm_password"></div>';
    html += '<div class="signup-tips" type="confirm_password"></div>';
    html += '<div class="signup-input"><div class="signup-name">公开手机号</div><input type="checkbox" id="public_mobile" name="public_mobile" value="1" /></div>';
    html += '<div class="signup-button-box"><div class="signup-button signup-submit">注册</div></div>';
    html += '<div class="signup-right singin-to">立即登陆</div>';
    html += "</div>";
    html += "</div>";
    $("body").append(html);
    //关闭注册
    $(".signup-close>span").on("click", function() {
        $(".login-mask").remove();
        $(".signup-box").remove();
        location.reload();
    });
    //跳转到登陆
    $(".singin-to").on("click", function() {
        $(".signup-box").remove();
        $._singin_();
    });
    //发送验证码
    function mark() {
        $(".send-mark").on("click", function() {
            if (!$("#mobile").val()) {
                $(".signup-tips[type=mobile]").html("*手机号不能为空");
                return false;
            }else if($("#mobile").val().length != 11 ){
            	 $(".signup-tips[type=mobile]").html("*手机号长度不符");
                 return false;
            }else {
                $(".signup-tips[type=mobile]").html("");
            }
            if(!/^1\d{10}$/gi.test($("#mobile").val())){

                $(".login-tips[type=mobile]").html("*请输入正确的手机号");

            } else {
                $(".login-tips[type=mobile]").html("");
            }
            $(".send-mark").off("click");
            $.getJSON("/user/verifiy.json", {
                mobile:$("#mobile").val()
            }).done(function(rs) {
                if (rs.status) {
                    $(".send-mark").off("click").html("请60秒后重试");
                    var second = 0;
                    var i = setInterval(function() {
                        second++;
                        $(".send-mark").html("请" + (60 - second) + "秒后重试");
                        if (second == 60) {
                            clearInterval(i);
                            mark();
                            $(".send-mark").html("发送验证码");
                        }
                    }, 1e3);
                }
            });
        });
    }
    mark();
    //密码长度验证
    $("#password").on("keyup", function() {
        if ($("#password").val().length > 5) {
        	if($.trim($("#password").val())==""){
        		$(".signup-tips[type=password]").html("*密码输入不能为空格");
        	}else{
        		$(".signup-tips[type=password]").html("");
        	}
            
        }else {
            $(".signup-tips[type=password]").html("*密码请输入6位以上");
        }
    });
    //2次密码相同
    $("#confirm_password").on("keyup", function() {
        if ($("#confirm_password").val() == $("#password").val()) {
            $(".signup-tips[type=confirm_password]").html("");
        } else {
            $(".signup-tips[type=confirm_password]").html("*两次输入的密码不一致");
        }
    });
    zhuce();
    //注册事件
    function zhuce() {
        $(".signup-submit").on("click", function() {
            opts.before_submit();
            var bol = 1;
            if (!$("#name").val()) {
                $(".signup-tips[type=name]").html("*昵称不能为空");
                bol = 0;
            } else {
                $(".signup-tips[type=name]").html("");
            }
            if (!$("#mobile").val()) {
                $(".signup-tips[type=mobile]").html("*手机号不能为空");
                bol = 0;
            } else {
                $(".signup-tips[type=mobile]").html("");
            }
            if(!/^1\d{10}$/gi.test($("#mobile").val())){

                $(".login-tips[type=mobile]").html("*请输入正确的手机号");
                bol = 0;

            } else {
                $(".login-tips[type=mobile]").html("");
            }
            if (!$("#mark").val()) {
                $(".signup-tips[type=mark]").html("*验证码不能为空");
                bol = 0;
            } else {
                $(".signup-tips[type=mark]").html("");
            }
            if (!$("#password").val()) {
                $(".signup-tips[type=password]").html("*密码不能为空");
                bol = 0;
            }else if($("#password").val().length < 6){
            	$(".signup-tips[type=password]").html("*密码不能小于6位字符");
            	bol = 0;
            }else {
                $(".signup-tips[type=password]").html("");
            }
            
            if (!$("#confirm_password").val()) {
                $(".signup-tips[type=confirm_password]").html("*确认密码不能为空");
                bol = 0;
            }else {
                $(".signup-tips[type=confirm_password]").html("");
            }                 
            
            if (bol == 0) {
                return false;
            }
            $(".signup-submit").off("click").html("正在提交");
            var public_val;
            if($('input[name="public_mobile"]:checked').val()=='1')
            {
                public_val=1;
            }else{
                public_val=0;
            }
            var data = {
                nickname:$("#name").val(),
                mobile:$("#mobile").val(),
                msg:$("#mark").val(),

                password: $.SHA256($("#password").val()),
                public_mobile:public_val,
                xh_sign:$.SHA256(window.XH_SIGN)
            };
            $.post("/user/register.json", data, "json").done(function(rs) {
                $.XHalert({
                    content:rs.msg,
                    submit:function(_this) {
                        //var _this = this;
                        if (rs.status) {
                            location.reload();
                        } else {
                            _this.close();
                        }
                    }
                });
            }).complete(function() {
                $(".signup-submit").html("注册");
                zhuce();
            });
        });
    }
};

//登出扩展
$._signout_ = function(opt) {
    var options = {
        success:function() {},
        fail:function() {}
    };
    var opts = $.extend(options, opt);
    $.post("/user/logout.json").done(function(rs) {
        if (rs.status == 1) {
            opts.success(rs);
        } else {
            opts.fail(rs);
        }
    });
};