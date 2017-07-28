var signin = (function(){
    var ui = window.ui || {"alert":function(a,b){
            alert(b);
        }};
    var tpl = $('<div class="mod-signin"><div class="wrap"><button class="close"></button><h3>请输入手机号验证身份</h3><input type="text" class="mobile" placeholder="请输入手机号"><input type="text" class="code" placeholder="请输入验证码"><button class="getcode">获取验证码</button><button class="check">确定</button></input></input></div></div>'),
        session = window.sessionStorage['session'],
        handler, mobile;
    var fn;
    function checksign(){
        $.post('/User/Index/checkLogin',function(resp){
            if(resp.status){
                window.sessionStorage['session'] = "1";
                fn && fn();
            }else{
                setsign();
            }
        });
    }

    function getcode(){
        mobile = $(".mod-signin .mobile").val();
        if(!(/^1\d{10}$/gi.test(mobile))){
            ui.alert("提示","请输入有效的手机号");
            return;
        }
        $(".mod-signin .getcode").addClass("disabled");
        $.getJSON("/verify/code",{"mobile":mobile},function(resp){
            if(resp.status == "1"){
                window.localStorage.setItem('user_token',mobile);
                setcode();
            }else{
                ui.alert("提示","获取验证码失败，请稍后重试");
            }
        })
    }

    function setcode(){
        var tick = 90,
            el = $('.mod-signin'),
            timer = el.find('.getcode');
        var process = function(){
            timer.html(--tick+"秒后再次获取");
            if(tick>0){
                handler = window.setTimeout(process,1000);
            }else{
                timer.html("获取验证码");
            }
        }
        if(handler) window.clearTimeout(handler);
        process();
    }

    function checkcode(){
        var mobile = $(".mod-signin .mobile").val();
        var code = $(".mod-signin .code").val();
        if(!(/^1\d{10}$/gi.test(mobile))){
            ui.alert("提示","请输入有效的手机号");
            return;
        }
        if(!code){
            ui.alert("提示","请输入有效的验证码");
            return;
        }
        $.post('/User/Index/login',{'mobile':mobile,'code':code},function(resp){
            if(resp.status){
                window.localStorage['user_token'] = mobile;
                window.sessionStorage['session'] = "1";
                clear();
                fn && fn();
            }else{
                ui.alert("提示","请输入有效的验证码");
            }

        });
    }

    function clear(){
        $(".mod-signin").remove();
    }

    function setsign(){
        $('body').append(tpl);
        if(first == false){
            $('body').on('click','.mod-signin button.getcode:not(.disabled)' , function(){
                getcode();
            }).on('click','.mod-signin button.check',function(){
                checkcode();
            }).on('click','.mod-signin button.close',function(){
                clear();
            });
            first = true;
        }
    }
    var first = false;

    return function(v){
        fn = v;
        //已登陆
        if(session){
            fn()
        }else{
            checksign();
        }
    }
}());