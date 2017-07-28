/**
 * 登陆模块
 */
(function($){
    if(!$) return;

    var ui = xh.require('xh.ui'), SHA256 = xh.require('xh.base.sha256'),
        user_data = xh.require('xh.user');

    if(!ui.alert){
        ui.alert = function(a , b){
            alert(b);
        }
    }

    var tpl = $('<div class="mod-signin"><button class="close"></button><div class="sign-wrap in-wrap select"><div class="nav"><button rel="c-0"class="select">账号密码登录</button><button rel="c-1">手机验证登录</button></div><div class="box c-0 select"><input type="text"class="username"placeholder="请输入手机号"><input type="password"class="password"placeholder="请输入密码"><button class="signin">登录</button><button class="next" rel="up-wrap">注册</button></div><div class="box c-1"><input type="text"class="username"placeholder="请输入手机号"><input type="text"class="code"placeholder="请输入验证码"><button class="getcode">获取验证码</button><button class="signin">登录</button><button class="next" rel="up-wrap">注册</button></div></div> <div class="sign-wrap up-wrap"><div class="nav"><button class="select">账号注册</button></div><div class="box select"><input type="text"class="username reg-username" placeholder="请输入手机号" /><span class="public_mobile_name">公开</span><input name="public_mobile" class="public_mobile" type="checkbox" value="1" /><input type="text"class="password"placeholder="请输入密码"><input type="text"class="code"placeholder="请输入验证码"><button class="getcode">获取验证码</button><button class="signup">注册</button><button class="next" rel="in-wrap">登录</button></div></div></div>'),
        session = window.sessionStorage['session'],
        handler, mobile;

    var callback;

    function getcode(){
        var mobile = $(".sign-wrap.select .box.select .username").val();
        if(!(/^1\d{10}$/gi.test(mobile))){
            ui.alert({title:"提示",content:"请输入有效的手机号"});
            return;
        }
        $(".sign-wrap.select .getcode").addClass("disabled");
        $.getJSON("/user/verifiy.json",{"mobile":mobile},function(resp){
            if(resp.status == "1"){
                window.localStorage.setItem('user_token',mobile);
                setcode();
            }else{
                ui.alert({title:"提示",content:"获取验证码失败，请稍后重试"});
                $(".sign-wrap.select .getcode").removeClass("disabled");
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
                timer.html("获取验证码").removeClass("disabled");

            }
        }
        if(handler) window.clearTimeout(handler);
        process();
    }

    function checkRequired(v){
        for(var i= 0,l=v.length;i<l;i++){
            if(v[i][0]){
                ui.alert({
                    title:'提示',
                    content:v[i][1],
                    onok:function() {
                        if (v[i][2]) $(v[i][2]).focus();
                    }
                });
                return false;
            }
        }
        return true;
    }

    function signup(){
        var el = $('.mod-signin .sign-wrap.select .box.select');
        var pre = '.mod-signin .sign-wrap.select .box.select';
        var public_val;
        if($('.public_mobile:checked').val()=='1')
        {
            public_val=1;
        }else{
            public_val=0;
        }
        var data = {
            nickname: 'u_' + new Date().getTime(),
            mobile  : el.find('.username').val(),
            msg     : el.find('.code').val(),
            password: SHA256(el.find('.password').val()),
            public_mobile:public_val,
            xh_sign:SHA256(XH_SIGN)
        }
        var raw = {'password':el.find('.password').val()};
        //console.log(data);
        var c = [
            [!data.mobile,'账户不能为空',pre + ' .username'],
            [!raw.password,'密码不能为空',pre + ' .password'],
            [/\s/g.test(raw.password),'密码不能含有空格',pre + ' .password'],
            [raw.password.length<6 || raw.password.length>15,'密码长度为6-15位',pre + ' .password'],
            [!data.msg,'验证码不能为空',pre + ' .code']
        ];
        if(checkRequired(c)){
            $.post('/user/register.json', data,'json').done(function(resp){
                if(resp.status){
                    //location.reload();
                    xh.user = user_data = window.USER_DATA = resp.data;
                    clear();
                    callback && callback(true);
                }else{
                    ui.alert({title:"提示",content:resp.msg});
                }
            })
        }
    }

    function signin(){
        var el = $('.mod-signin .sign-wrap.select .box.select');
        var pre = '.mod-signin .sign-wrap.select .box.select';
        var signin_by_code = el.hasClass('c-1');
        var username = el.find('.username').val();
        var password = el.find('.password').val();
        var code     = el.find('.code').val();
        var req = signin_by_code ?
            [
                [!(/^1\d{10}$/.test(username)) , '请输入有效的手机号',pre+' .username'],
                [!code , '请输入有效的验证码',pre+' .code'],
            ] : [
                [!username,'请输入用户名',pre+' .username'],
                [!password,'请输入密码',pre+' .password'],
                [/\s/g.test(password),'密码不能含有空格',pre + ' .password']

        ];
        var paras = signin_by_code ?
            {'mobile':username , 'msg':code, xh_sign:SHA256(window.XH_SIGN)} :
            {'mobile':username , 'password':SHA256(password),xh_sign:SHA256(window.XH_SIGN)};

        if(checkRequired(req)){
            $.post('/user/login.json',paras,function(resp){
                if(resp.status){
                    //location.reload();
                    xh.user = user_data = window.USER_DATA = resp.data;
                    sessionStorage['user.id'] = resp.data.id;
                    sessionStorage['user.mobile'] = resp.data.mobile;

                    clear();
                    callback && callback(true);
                }else{
                    ui.alert({title:"提示",content:resp.msg});
                }
            });
        }
    }

    function signout(cb){
        $.post('/user/logout.json',function(resp){
            if(resp.status){
                xh.user = user_data = window.USER_DATA = {};
                sessionStorage.removeItem('user.id');
                sessionStorage.removeItem('user.mobile');
            }
            cb && cb(resp);
            //location.href = '/user';
        },'json');
    }

    function clear(){
        $(".mod-signin").remove();
    }


    function setsign(callback){
        $('body').append(tpl);
        if(first == false){
            $('body').on('click','.mod-signin button.getcode:not(.disabled)' , function(){
                getcode();
            }).on('click','.mod-signin button.signin',function(){
                signin();
            }).on('click','.mod-signin button.close',function(){
                clear();
            }).on('click','.nav button',function(){
                var el = $(this);
                var rel = el.attr('rel');
                el.addClass('select').siblings().removeClass('select');
                $('.box.'+rel).addClass('select').siblings('.box').removeClass('select');
            }).on('click','.next',function(){
                var rel = $(this).attr('rel');
                $('.mod-signin .sign-wrap.'+rel).addClass('select').siblings('.sign-wrap').removeClass('select');
            }).on('click','.mod-signin button.signup',function(){
                signup();
            }).on('click','.mod-signin .close',function(){
                callback && callback(false)
            });
            first = true;
        }
        $('.mod-signin input:first-child').focus();
    }

    var first = false;


    ui.signin = function(v){
        callback = v;
        if(sessionStorage['user.id'] || (user_data && user_data.id) ){
            callback && callback(true);
        }else{
            setsign(callback);
        }
    }
    ui.signout = function(v){
        signout(v);
    }
}(jQuery));

(function($) {
    var share = (function() {

        var options;
        var iswx = !!~window.navigator.userAgent.toLowerCase().indexOf("micromessenger");

        var tpl = '<div class="share-wrap"><div class="wechat-share-tips"></div><div class="box-wechat-qrcode"><div class="wechat-qrcode-close">×</div><div class="wechat-qrcode-title">扫码或保存</div><div class="wechat-qrcode-img" id="j_wx_qrcode"></div><div class="wechat-qrcode-txt">邀请好友扫一扫分享给TA<br>或者<br><p class="left-txt"><strong>长按上图保存二维码</strong>，使用微信扫一扫右上角的"相册"扫码，再分享好友或朋友圈</p></div></div><div class="share-box"><div class="share-title">分享到</div><div class="share-con"><div class="wechat share-link" id="J-float-wechat" data-way="wechat"><em class="ic-share-wechat"></em><div class="txt">微信</div></div><div class="qzone share-link" data-way="qzone"><em class="ic-share-qzone"></em><div class="txt">QQ空间</div></div><div class="weibo share-link" data-way="weibo"><em class="ic-share-weibo"></em><div class="txt">新浪微博</div></div></div><div class="share-btn">取消</div></div></div>';

        var parse = function(str, data) {
            return str.replace(/\{ *([\w_]+) *\}/g, function(str, key) {
                var value = data[key];
                if (value === undefined) {
                    //console.log('No value provided for variable ' + str);
                    value = "{" + key + "}";
                } else if (typeof value === 'function') {
                    value = value(data);
                }
                return value;
            })
        };

        function bind() {
            $('.share-wrap').on('click', '.share-box .share-link', function() {
                var mode = $(this).attr('data-way');
                setShare(mode);
            });

            $('.share-wrap').on('click' , '.wechat-qrcode-close' , function(){
                toggle_qrcode();
            });

            $('.share-wrap').on('click' , '.share-box .share-btn' , function(){
                $('.share-wrap').remove();
            });

            $('.share-wrap').on('click' , '.wechat-share-tips',function(){
                $('.share-wrap').removeClass('wechat-tip');
            });
        }

        function main(opts) {
            if ($('.share-wrap').length == 0) {
                $('body').append(tpl);
                bind();
            }
            options = opts;
            options.title = options.title || document.title;
            options.title = '【'+options.title+'】';
            options.url = options.url || encodeURIComponent(document.location.href);
        }

        function toggle_qrcode(){
            $('.share-wrap').toggleClass('qrcode');
            
        }

        var links = {
            'qzone': 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&pics={thumb}&summary={desc}',
            'weibo': 'http://v.t.sina.com.cn/share/share.php?url={url}&title={title}{desc}&pic={thumb}',
        }

        function setShare(mode) {
            //console.log('link:'+mode)
            if (links[mode]) {
                location.href = parse(links[mode] , options);
            }

            if(mode == 'wechat'){
                if(iswx){
                    $('.share-wrap').addClass('wechat-tip');
                }else{
                    $('#j_wx_qrcode').empty().qrcode({
                        width:180,
                        height:180,
                        text:location.href
                    });
                    
                    var strDataURI = $('#j_wx_qrcode canvas')[0].toDataURL();
                    $('#j_wx_qrcode').html('<img src="'+strDataURI+'"/>');
                    // var strDataURI = oCanvas.toDataURL("image/jpeg");
                    toggle_qrcode();
                }
                
            }
        }


        return main;
    }());

    xh.share = share;
}(jQuery));