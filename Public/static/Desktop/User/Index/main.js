/*
 * Author:fay
 * Date:2016-03-30
 * desc:用户模块公用部分
 *
 * */
$(function () {
    function Main() {
        this.init = function () {
            $(".web-bar-way").removeClass("now");
            $(".user-center").addClass("now");
            check_user();
            singout();
        };
        function check_user() {
            if (window.USER_CONFIG && window.USER_CONFIG.id) {
                alert_update(window.USER_CONFIG);
                $.getScript("/static/public/jquery.form.js", function () {
                    update_hading(window.USER_CONFIG);
                });
                var type = $(".bar").attr("data-type");
                $.getScript("/static/Desktop/User/Index/" + window.DATA_TYPE + ".js", function (rs) {
                });
            } else {
                $._singin_({
                    success: function (rs) {
                        location.reload()
                        alert_update(rs.data);
                        $.getScript("/static/public/jquery.form.js", function () {
                            update_hading(rs.data);
                        });
                        var type = $(".bar").attr("data-type");
                        $.getScript("/static/Desktop/User/Index/" + type + ".js", function (rs) {
                        });

                    },
                    close: function () {
                        location.href = "/";
                    }
                });
            }
        }

        function alert_update(rs) {
            $(".head").css({
                "background-image": "url(" + (rs.head_img ? $._LOCAL_IMGURL_(rs.head_img) : "/static/Desktop/Img/user.png") + ")"
            });
            $(".name").html(rs.nickname);
            $(".tool").on("click", function () {
                update(rs, 1);
            });
            $(".tool-name").on("click", function () {
                update(rs, 2);
            });
        }

        function update(rs, type) {
            var html = "";
            html += '<div class="_mask"></div>';
            html += '<div class="update-box">';

            //html += '<div class="update-title">';
            //html += "密码修改";
            //html += "</div>";
            //html += '<div class="update-item">'
            //html += '<div class="update-name">手机号：</div><div class="update-tool"></div>'
            //html += '</div>'
            if (type == 2) {
                if(rs.public_mobile==1)
                {
                    public_mobile_check_str='checked';
                }else{
                    public_mobile_check_str='';
                }
                html += '<div class="update-title">';
                html += "基础信息修改";
                html += "</div>";
                html += '<div class="update-item">';
                html += '<div class="update-name">昵称：</div><div class="update-tool"><input type="text" class="nike-name" value="' + rs.nickname + '"></div>';
                html += '<div class="update-tips name-tips" ></div>';
                html += '<div class="update-name">公开手机号：</div><div class="update-tool"><input type="checkbox" class="public_mobile" value="1" '+public_mobile_check_str+' /></div>';
                html += "</div>";
                html += '<div class="update-but-box"><div class="update-but update-submit">修改</div><div class="update-but update-cancel">取消</div></div>';
            } else {
                html += '<div class="update-bar"><div class="checks">原密码修改密码</div><div>验证码修改密码</div></div>';
                html+='<div class="u-box">'
                html += '<div class="u1">';
                html += '<div class="update-item">';
                html += '<div class="update-name">原密码：</div><div class="update-tool"><input type="password" class="old-password"></div>';
                html += '<div class="update-tips old-password-tips"></div>';
                html += "</div>";
                html += '<div class="update-item">';
                html += '<div class="update-name">设置密码：</div><div class="update-tool"><input type="password" class="password"></div>';
                html += '<div class="update-tips password-tips"></div>';
                html += "</div>";
                html += '<div class="update-item">';
                html += '<div class="update-name">确认密码：</div><div class="update-tool"><input type="password" class="check-password"></div>';
                html += '<div class="update-tips check-password-tips"></div>';
                html += "</div>";
                html += '<div class="update-but-box"><div class="update-but update-submit">修改</div><div class="update-but update-cancel">取消</div></div>';
                html += "</div>";
                html += '<div class="u2">';
                html += '<div class="update-item">';
                html += '<div class="update-name">验证码：</div><div class="update-tool"><input type="test" class="yzm"><div class="send">发送</div></div>';
                html += '<div class="update-tips yzm-tips"></div>';
                html += "</div>";
                html += '<div class="update-item">';
                html += '<div class="update-name">设置密码：</div><div class="update-tool"><input type="password" class="password2"></div>';
                html += '<div class="update-tips password2-tips"></div>';
                html += "</div>";
                html += '<div class="update-item">';
                html += '<div class="update-name">确认密码：</div><div class="update-tool"><input type="password" class="check-password2"></div>';
                html += '<div class="update-tips check-password2-tips"></div>';
                html += "</div>";
                html += '<div class="update-but-box"><div class="update-but update-submit2">修改</div><div class="update-but update-cancel">取消</div></div>';
                html += "</div>";
                html += "</div>";
            }

            html += "</div>";
            if (!$(".update-box").length) {
                $("body").append(html);
                update_event();
                send_msg()
                update_submit(type)
                update_by_msg(type)
            }
        }

        function update_event() {
            $('.update-bar>div').on('click',function(){
                $(this).addClass('checks').siblings().removeClass('checks')
                var index=$(this).index()
                $('.u'+(index+1)).show().siblings().hide();
            })


            $(".update-cancel").on("click", function () {
                $(".update-box").remove();
                $("._mask").remove();
            });

            $(".check-password").on("input", function () {
                var password = $(".password").val(), check_password = $(".check-password").val();
                if (password != check_password) {
                    $(".check-password-tips").html("两次输入的密码不一样");
                } else {
                    $(".check-password-tips").html("");
                }
            });
            $(".check-password2").on("input", function () {
                var password = $(".password2").val(), check_password = $(".check-password2").val();
                if (password != check_password) {
                    $(".check-password2-tips").html("两次输入的密码不一样");
                } else {
                    $(".check-password2-tips").html("");
                }
            });
        }

        function send_msg(){
            if($('.send').length){
                $('.send').on('click',function(){
                    if(USER_CONFIG&&USER_CONFIG.mobile){
                        $.getJSON("/user/verifiy.json", {
                            mobile:USER_CONFIG.mobile
                        }).done(function(rs) {
                            if (rs.status) {
                                $(".send").off("click").html("请60秒后重试");
                                var second = 0;
                                var i = setInterval(function() {
                                    second++;
                                    $(".send").html("请" + (60 - second) + "秒后重试");
                                    if (second == 60) {
                                        clearInterval(i);
                                        send_msg()
                                        $(".send").html("发送验证码");
                                    }
                                }, 1e3);
                            }
                        });
                    }
                })
            }
        }

        function update_by_msg(type){
            $('.update-submit2').on('click',function(){
                var  password = $(".password2").val(), check_password = $(".check-password2").val(),yzm=$('.yzm').val();
                var bol = 0;
                var data = {};
                //console.log($.SHA256(password))
                if (type == 1) {
                    if (!password) {
                        $('.password-tips').html('请输入需要修改的密码');
                        bol = 1;
                    } else {
                        $('.password-tips').html('');
                    }
                    if (password != check_password) {
                        $(".check-password-tips").html("两次输入的密码不一样");
                        bol = 1;
                    } else {
                        $(".check-password-tips").html("");
                    }
                    if (!yzm) {
                        $(".yzm-tips").html("验证码不能为空");
                        bol = 1;
                    } else {
                        $(".yzm-tips").html("");
                    }

                    data['password'] = $.SHA256(password);
                    data['mobile']=USER_CONFIG.mobile;
                    data['msg']=yzm;
                    data['xh_sign'] = $.SHA256(window.XH_SIGN);
                }
                if (bol == 1) {
                    return false;
                }
                $(".update-submit2").off("click").html("正在提交");
                $.post("/user/profile_s.json", data).done(function (rs) {
                    $.XHalert({
                        content: rs.msg,
                        submit: function (_this) {
                            //var _this = this;
                            if (rs.status) {
                                if (type == 1) {
                                    $._signout_({
                                        success: function () {
                                            location.reload();
                                        }
                                    });
                                } else {
                                    location.reload();
                                }
                            } else {
                                _this.close();
                            }
                        }
                    });
                }).complete(function () {
                    update_by_msg(type);
                    $(".update-submit2").html("修改");
                });
            })
        }

        function update_submit(type) {
            $(".update-submit").on("click", function () {
                var username = $(".nike-name").val(), password = $(".password").val(), check_password = $(".check-password").val(), old_password = $(".old-password").val();
                var bol = 0;
                var data = {}
               // console.log($.SHA256(password))
                if (type == 2) {
                    if (!username) {
                        $(".name-tips").html("昵称不能为空");
                        bol = 1;
                    } else {
                        $(".name-tips").html("");
                    }

                    data['nickname'] = username;
                    var public_val;
                    if($('.public_mobile:checked').val()=='1')
                    {
                        public_val=1;
                    }else{
                        public_val=0;
                    }
                    data['public_mobile']=public_val;
                }

                if (type == 1) {
                    if (!password) {
                        $('.password-tips').html('请输入需要修改的密码');
                        bol = 1;
                    } else {
                        $('.password-tips').html('');
                    }
                    if (password != check_password) {
                        $(".check-password-tips").html("两次输入的密码不一样");
                        bol = 1;
                    } else {
                        $(".check-password-tips").html("");
                    }
                    if (!old_password) {
                        $(".old-password-tips").html("原密码不能为空");
                        bol = 1;
                    } else {
                        $(".old-password-tips").html("");
                    }

                    data['password'] = $.SHA256(password);
                    data['old_pwd'] = $.SHA256(old_password);
                    data['xh_sign'] = $.SHA256(window.XH_SIGN);
                }
                if (bol == 1) {
                    return false;
                }
                $(".update-submit").off("click").html("正在提交");
                $.post("/user/profile.json", data).done(function (rs) {
                    $.XHalert({
                        content: rs.msg,
                        submit: function (_this) {

                            if (rs.status) {
                                if (type == 1) {
                                    $._signout_({
                                        success: function () {
                                            location.reload();
                                        }
                                    });
                                } else {
                                    location.reload();
                                }
                            } else {
                                _this.close();
                            }
                        }
                    });
                }).complete(function () {
                    update_submit(type);
                    $(".update-submit").html("修改");
                });
            });
        }

        function singout() {
            $(".signout").on("click", function () {
                $.XHalert({
                    content: "是否需要登出？",
                    yconfirm: 1,
                    submit: function (self) {
                        self.close();
                        $._signout_({
                            success: function (rs) {
                                $.XHalert({
                                    content: rs.msg,
                                    submit: function () {
                                        location.reload();
                                    }
                                });
                            },
                            fail: function (rs) {
                                $.XHalert({
                                    content: rs.msg
                                });
                            }
                        });
                    }
                });
            });
        }

        function update_hading(rs) {
            $(".head").on("click", function () {
                var html = '<div class="_mask"></div>';
                html += '<div class="submit-box">';
                html += '<div class="submit-box-close"></div>';
                html += '<div class="submit-box-title">修改头像</div>';
                html += '<div class="image-box" style="' + (rs.head_img ? "background-image: url(" + $._LOCAL_IMGURL_(rs.head_img) + ");" : "") + '"><form action="/user/upload" method="post" id="img"><input name="image" id="image" type="file"><input name="cut" value="1" type="hidden"></form></div>';
                html += '<div class="release-submit">修改</div>';
                html += "</div>";
                if (!$(".submit-box").length) {
                    $("body").append(html);
                    $(".submit-box-close").on("click", function () {
                        $("._mask").remove();
                        $(".submit-box").remove();
                    });
                    upload_img();
                }
            });
        }

        function update_head() {
            $(".release-submit").off("click").on("click", function () {
                var head_img = $(".image-box").data("rs")["file"];
                $(".release-submit").off("click").html("正在提交");
                $.post("/user/profile.json", {
                    head_img: head_img
                }).done(function (rs) {
                    $.XHalert({
                        content: rs.msg,
                        submit: function (self) {
                            self.close()
                            if (rs.status) {
                                location.reload();
                            } else {

                            }
                        }
                    });
                }).complete(function () {
                    update_head();
                    $(".release-submit").html("修改");
                });
            });
        }

        function upload_img() {
            $("#image").off("change").on("change", function () {
                var iframe = false;
                var browser=navigator.appName
                var b_version=navigator.appVersion
                var version=b_version.split(";");
                if(version[1])
                {
                    var trim_Version=version[1].replace(/[ ]/g,"");
                }else{
                    var trim_Version='';
                }
                if(browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0"||trim_Version=="MSIE9.0")){
                    iframe = true;
                }
                $("#img").ajaxSubmit({
                    beforeSubmit: function () {
                    },
                    success: function (rs) {
                        if(browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0"||trim_Version=="MSIE9.0")){
                            rs = eval("("+rs+")");
                        }
                        //$('.image-box').remove('.__mask')
                        $(".image-box").css({
                            "background-image": "url(" + $._LOCAL_IMGURL_(rs.file) + ")"
                        });
                        $(".image-box").data("rs", rs);
                        update_head();
                    },
                    iframe:iframe
                });
            });
        }
    }

    var main = new Main();
    main.init();
});