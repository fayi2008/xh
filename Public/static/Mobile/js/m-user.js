/**
 * comment 用户评论
 */
(function(){
    var ui = xh.require('xh.ui'),
        app = xh.require('app'),
        evt = xh.require('xh.evt'),
        vm = xh.require('xh.vm');

    app.comment = function(){

        var api  = '/user/comment.json',

            paras = {'module':'', 'start':0, 'limit':20, 'page':0},

            view = $('#tpl').html(),

            count = 0, complete = false,

            wrap = $('.cnt');

        function render(){
            paras.module = $('nav li.select').attr('data-type');
            paras.start = paras.page * paras.limit;

            ui.loading();
            $('footer').show();

            $.getJSON(api , paras , function(resp){
                ui.loading(null);
                count += resp.data.data.length;
                if(count>= resp.data.count){
                    complete = true;
                    $('footer').hide();
                }
                if(paras.page){
                    wrap.append(vm.template(view, resp));
                }else{
                    wrap.html(vm.template(view,resp));
                }
            });
        }

        function del(el){
            $(el).css({'opacity':'0.618'}).slideUp(500,function(){
                $(el).remove();
            })
        }

        function init(){
            $('nav').on(evt.click ,' li:not(.select) ' , function(){
                $(this).addClass('select').siblings('li').removeClass('select');
                render();
            });
            $('.wrap').on(evt.click,'section button' , function(e){
                del($(this).parents('section'));
                e.preventDefault();
            });

            var onScroll = xh.throttle(function(){
                var top = $(window).scrollTop();
                var h = $(window).height();
                var sh = $(document).height();
                if(!complete){
                    if(sh - h - top <= 10 ){
                        paras.page++;
                        render(null , true);
                    }
                }

            },200);

            $(window).on('scroll' , onScroll);
            render();
        }

        init();
    }
}());


/**
 * way 用户收藏线路
 */
(function(){
    var ui  = xh.require('xh.ui'),
        app = xh.require('app'),
        evt = xh.require('xh.evt'),
        vm  = xh.require('xh.vm');

    app.way = function(){
        var api  = '/user/collect.json',

            paras = {'way':'', 'start':0, 'limit':10, 'page':0},

            count = 0, complete = false,

            wrap = $('.wrap'),

            view = $('#tpl').html();

        $('.wrap').on(evt.click,'section:not(.disable) button' , function(e){
            var el = $(this).parents('section'),id = el.attr('data-id');
            el.addClass('disable');
            $.post('/user/collect.json',{"way":id},function(resp){
                if(resp.status){
                    el.slideUp(function(){
                        el.remove();
                    });
                }else{
                    ui.alert({'content':resp.msg});
                    el.removeClass('disable');
                }

            });

            e.preventDefault();
        });

        function init(){
            var onScroll = xh.throttle(function(){
                var top = $(window).scrollTop();
                var h = $(window).height();
                var sh = $(document).height();
                if(!complete){
                    if(sh - h - top <= 10 ){
                        paras.page++;
                        render(null , true);
                    }
                }

            },200);

            $(window).on('scroll' , onScroll);

            render();
        }


        function render() {
            paras.start = paras.page * paras.limit;

            ui.loading();
            $('footer').show();
            $.getJSON(api, paras, function (resp) {
                ui.loading(null);

                count += resp.data.data.length;
                if (count >= resp.data.count) {
                    complete = true;
                    $('footer').hide();
                }
                if (paras.page) {
                    wrap.append(vm.template(view, resp));
                } else {
                    wrap.html(vm.template(view, resp));
                }
            });
        }

        init();
    }
}());


/**
 * index 用户中心主页
 */
(function(){
    var ui  = xh.require('xh.ui'),
        evt = xh.require('xh.evt'),
        upload = xh.require('xh.io.upload'),
        user = xh.require('xh.user'),
        app = xh.require('app');


    function hashChange(){
        var hash = location.hash.substr(1);
        if(hash == '/user/profile'){
            $('body').addClass('account');
        }else{
            $('body').removeClass('account');
            ui.dialog(null);
        }
    }

    function changeAvatar(img){
        $.post('/user/profile.json',{head_img:img}).done(function(resp){
            if(resp.status){
                //ui.alert({content:'修改成功'});
            }
        })
    }

    function signout(){
        ui.signout(function(resp){
            if(resp.status){
                $('.avatar,footer').hide();
                ui.signin(function(status){
                    if(status){
                        //$('.avatar,footer').show();
                        location.reload();
                    }else{
                        location.href = '/';
                    }
                });
            }
        })
    }

    app.home = function(){
        var SHA256 = xh.require('xh.base.sha256');

        hashChange();
        if(xh.user.id){
            $('.i-avatar').css({'backgroundImage':'url('+xh.path.img(USER_DATA.head_img)+')'});
            $('.avatar span,.nickname').html(USER_DATA.nickname);
            if(USER_DATA.public_mobile==1)
            {
                $('input[name="public_mobile"]').attr('checked',true);
            }
            $('.wrap').fadeIn(200);
        }


        $(window).on('hashchange' , function(){
            hashChange();
        })

        $('.wrap').on(evt.click , 'footer button' ,function(){
            signout();
        })

        var file = $('#j_file_field');

        file.on("change" , function(){

            upload({
                el:file[0].files[0] ,
                success : function(resp) {
                    if (resp.status) {
                        $('.i-avatar').css({'backgroundImage': 'url(/upload/' + resp.file + ')'}).removeClass('upload');
                        changeAvatar(resp.file);
                    } else {
                        ui.alert({title: '错误', content: resp.msg})
                    }
                    //console.log(resp);
                }
            });
        });

        $('.wrap').on(evt.click , '#j_modify_nickname',function(){
            ui.dialog('修改昵称','<input name="nickname" value="'+user.nickname+'" placeholder="请输入新的昵称"/>',function(data){
                if(!data.nickname){
                    ui.alert({content:'请输入昵称'});
                }else{
                    $.post('/user/profile.json',{nickname:data.nickname}).done(function(resp){
                        if(resp.status){
                            ui.alert({content:resp.msg , onok:function(){
                                ui.dialog(null);
                                $('.nickname').html(data.nickname);
                            }});
                        }else{
                            ui.alert({content:resp.msg});
                        }
                    })
                }
            })
        });

        $('.wrap').on(evt.click , '#public_mobile',function(){
            var public_val;
            if($('input[name="public_mobile"]:checked').val()=='1')
            {
                public_val=1;
            }else{
                public_val=0;
            }
            $.post('/user/profile.json',{public_mobile:public_val}).done(function(resp){
                if(resp.status){
                    ui.alert({content:resp.msg , onok:function(){
                        ui.dialog(null);
                    }});
                }else{
                    ui.alert({content:resp.msg});
                }
            })
        });

        $('.wrap').on(evt.click , '#j_modify_pwd',function(){
            ui.dialog('修改密码','<input name="old_pwd" type="password" placeholder="请输入原密码"/><input name="password" type="password" placeholder="请输入新密码"/><input name="password2" type="password" placeholder="请确认新密码"/>',function(data){
                var pre = '.dialog';
                var req = [
                    [!data.old_pwd,'请输入原密码',pre + ' input[name=old_pwd]'],
                    [!data.password,'请输入新密码',pre + ' input[name=password]'],
                    [!data.password2,'请确认新密码',pre + ' input[name=password2]'],
                    [data.password != data.password2,'两次输入新密码不一致',pre + ' input[name=password2]'],
                    [/\s/g.test(data.old_pwd),'原密码不能含有空格',pre + ' input[name=old_pwd]'],
                    [/\s/g.test(data.password),'新密码不能包含空格',pre + ' input[name=password]'],
                    [data.password.length<6 ||data.password.length>15 ,'新密码长度6-15位',pre + ' input[name=password]']
                ];
                data.old_pwd = SHA256(data.old_pwd);
                data.password = SHA256(data.password);
                data.xh_sign = SHA256(window.XH_SIGN);
                if( ui.checkRequired(req) ){
                    $.post('/user/profile.json',data).done(function(resp){
                        if(resp.status){
                            ui.alert({content:'修改成功,请重新登录.',onok:function(){
                                history.back();
                                ui.dialog(null);
                                signout();
                            }});

                        }else{
                            ui.alert({content:resp.msg,onok:function(){
                                location.reload();
                            }});
                        }
                    })
                }
            })
        })
    }
}());

/**
 * 印象
 * */
(function(){
    var ui = xh.require('xh.ui'),
        app = xh.require('app'),
        evt = xh.require('xh.evt'),
        vm = xh.require('xh.vm');

    app.photo = function(){

        var api  = '/user/photo.json',

            paras = {'start':0, 'limit':20, 'page':0},

            view = $('#tpl').html(),

            count = 0, complete = false,

            wrap = $('#j_cnt');

        function parse(v){
            var all = v.data.data,
                count = v.data.count;
            var group = [];
            for(var i = count;i>=0;i-=2){
                group = all.splice(i,1).concat(group);
            }
            return [all , group];

        }

        function render(){
            paras.start = paras.page * paras.limit;

            ui.loading();

            $('footer').show();

            $.getJSON(api , paras , function(resp){
                ui.loading(null);

                count += resp.data.data.length;
                if(count>= resp.data.count){
                    complete = true;
                    $('footer').hide();
                }
                if(paras.page){
                    wrap.append(vm.template(view, parse(resp)));
                }else{
                    wrap.html(vm.template(view, parse(resp)));
                }
            });
        }

        function del(el){
            var id = el.attr('data-id');
            ui.alert({'title':'确定删除？','okstr':'是','cancelstr':'否','onok':function(){
                $(el).css({'opacity':'0.618'});
                $.getJSON('/photo/delete?id='+id , function(resp){
                    if(resp.status){
                        el.slideUp(500,function(){
                            $(el).remove();
                        });
                    }else{
                        $(el).css({'opacity':'1'});
                        ui.alert({content:'删除失败'});
                    }
                });
            }
            });

        }

        function init(){
            $('.wrap').on(evt.click,'.item a.del' , function(e){
                //alert('删除印象');
                del($(this).parents('.item'));
                e.preventDefault();
            });

            $('.wrap').on('click' , '.fav:not(.disabled)',function(){
                var el = $(this),
                    num = parseInt(el.html()),
                    id = el.addClass('disabled').attr('data-id');
                ui.signin(function(){
                    $.post('/comment/support',{'module':2,'id':id} , function(resp){

                        if(resp.status){
                            el.addClass('active').html(num+1);
                        }else{
                            if(resp.msg)
                            {
                                alert(resp.msg);
                            }
                        }
                    });
                })
            });

            var onScroll = xh.throttle(function(){
                var top = $(window).scrollTop();
                var h = $(window).height();
                var sh = $(document).height();
                if(!complete){
                    if(sh - h - top <= 10 ){
                        paras.page++;
                        render(null , true);
                    }
                }

            },200);

            $(window).on('scroll' , onScroll);

            render();
        }

        init();
    }
}());


/**
 * 游记
 * */
(function(){

    var ui = xh.require('xh.ui'),
        app = xh.require('app'),
        evt = xh.require('xh.evt'),
        vm = xh.require('xh.vm');

    app.travels = function(){

        var api  = '/user/travels.json',

            paras = {'start':0, 'limit':10, 'page':0},

            view = $('#tpl').html(),

            count = 0, complete = false,

            wrap = $('#j_cnt');

        vm.helper({
            'content' : function(v){
                v = v.replace(/(<[^>]+>|\s|&nbsp;)/g,'');
                if(v.length>100) v = v.substring(0,97) + '...';
                return v;
            }
        });
        //取出显示图 和 内容
        function parse(d){
            for(var i in d.data.data){
                var c = d.data.data[i].content;
                d.data.data[i].image = (c.match(/src\s*=\s*[\'\"]+([^\'\"]+)/) || [0,''])[1];
                d.data.data[i].desc = c.replace(/<img[^>]+>/g,'');
            }
            return d;
        }

        function render(){
            paras.start = paras.page * paras.limit;

            ui.loading();

            $('footer').show();

            $.getJSON(api , paras , function(resp){
                ui.loading(null);

                count += resp.data.data.length;
                if(count>= resp.data.count){
                    complete = true;
                    $('footer').hide();
                }
                if(paras.page){
                    wrap.append(vm.template(view, parse(resp)));
                }else{
                    wrap.html(vm.template(view, parse(resp)));
                }
            });
        }

        function del(el){
            var id = el.attr('data-id');
            ui.alert({'title':'确定删除？','okstr':'是','cancelstr':'否','onok':function(){
                $(el).css({'opacity':'0.618'});
                $.getJSON('/travels/delete?id='+id , function(resp){
                    if(resp.status){
                        el.slideUp(500,function(){
                            $(el).remove();
                        });
                    }else{
                        $(el).css({'opacity':'1'});
                        ui.alert({content:'删除失败'});
                    }
                });
            }});

        }

        function init(){
            $('.wrap').on(xh.evt.click,'section a.del' , function(e){
                del($(this).parents('section'));
                e.preventDefault();
            });

            $('.wrap').on('click' , '.fav:not(.disabled)',function(){
                var el = $(this),
                    num = parseInt(el.html()),
                    id = el.attr('data-id');
                ui.signin(function(status){
                    if(status){
                        el.addClass('disabled');
                        $.post('/comment/support',{'module':1,'id':id} , function(resp){

                            if(resp.status){
                                el.addClass('active').html(num+1);
                            }else{
                                if(resp.msg)
                                {
                                    alert(resp.msg);
                                }
                            }
                        });
                    }
                })
            });

            var onScroll = xh.throttle(function(){
                var top = $(window).scrollTop();
                var h = $(window).height();
                var sh = $(document).height();
                if(!complete){
                    if(sh - h - top <= 10 ){
                        paras.page++;
                        render(null , true);
                    }
                }

            },200);

            $(window).on('scroll' , onScroll);

            render();
        }

        init();
    }
}());

/**
 * 订单
 */
(function(){
    ///business/getorders.json?status=0&limit=10&start=0
    var ui = xh.require('xh.ui'),
        vm = xh.require('xh.vm'),
        evt = xh.require('xh.evt'),
        hash = xh.require('xh.hash'),
        app = xh.require('app');

    var last_status = sessionStorage['order.status'] || hash.status || '1';

    var api = {
            'list':'/business/getorders.json',
            'confirm':'/business/confirm.json'
        },
        view = $('#tpl').html(),
        paras = {'status':last_status,'start':0,'limit':100};

    function init(){
        $('.wrap nav li[data-type='+paras.status+']').addClass('select').siblings('li').removeClass('select');

        $('.wrap').on('click', 'nav li' , function(){
            var el = $(this);
            sessionStorage['order.status'] = paras.status = el.attr('data-type');
            el.addClass('select').siblings('li').removeClass('select');
            render();
        });

        $('.wrap').on('click' , 'a.order-pay' , function(e){
            pay( $(this).attr('data-id'));
        });

        $('.wrap').on('click' , 'a.order-confirm:not(.process)' , function(e){
            order_confirm( $(this) );
        });

        render();
    }

    function pay(order_id){
        location.href = '/business/pay_get.html?id=' + order_id;
    }

    function order_confirm(el){
        var id = el.attr('data-id'), parent = el.parents('.item');
        el.html('正在确认');
        //parent.addClass('process');
        parent.css({'opacity':'0.6'});
        $.getJSON(api.confirm , {order_id:id} , function(resp){
            if(resp.status){
                parent.slideUp(500,function(){
                    parent.remove();
                });
            }else{
                parent.css({'opacity':'1'});
                ui.alert({content:'删除失败'});
                el.html('确认收货');
            }



        })
    }
    function parse(r){
        for(var i in r.data.rows){
            r.data.rows[i].origin_data = JSON.parse( r.data.rows[i].origin_data);
        }
    }

    function render(){
        ui.render( { 'view':view , 'model':api.list , 'paras':paras , 'wrap':'.wrap section','request':function(resp){
                parse(resp);
            }
        });
    }

    app.order = function(){
        init();
    }
}())

/**
 * 初始执行
 */
$(function(){
    var user = xh.require('xh.user'),
        signin = xh.require('xh.ui.signin');
    var mod = $('body').attr('page');

    signin(function(status){
        if(status){
            if(mod in app){
                app[mod].call();
            }
        }
        else{
            if(mod == 'home')
                location.href = '/';
            else
                history.back();
        }
    });
});