$(function(){

    $.LOGIN=function(callback){

        ajax()

        function ajax(){
            //view()
            var mobile=localStorage.getItem('logomap_2_login')
            if(mobile){
                $.ajax({
                    url:'/User/Index/checkLogin',
                    type:'post',
                    data:{mobile:mobile}
                }).done(function(rs){
                    if(rs.status){
                        callback()
                    }else{
                        view()

                    }
                })
                //view()
            }else{
                view()
            }

        }

        function view(){

            var html='<input type="tel" class="login-btn" id="phone" placeholder="请输入手机号">'
                //'<input type="password" class="login-btn" id="password" placeholder="请输入密码">' +
                //'<div class="regiter">没有账号？赶快注册</div>'
            $.yconfirm({
                content:html,
                title:'请填写手机号后操作',
                submit_text:'确定',
                onload:function(){
                    regiter()
                },
                submit:function(){

                    submit()
                },
                cancel:function(){
                    $.yalert.close()
                }
            })

        }

        function submit(){
            var mobile=$('#phone').val(),password=$('#password').val()
            if(!mobile){
                alert('请输入手机号码！')
                return false
            }
            //if(!password){
            //    alert('请输入密码！')
            //    return false
            //}


            $.ajax({
                url:'/User/Index/login',
                type:'post',
                dataType:'json',
                data:{mobile:mobile,password:password}
            }).done(function(rs){
                if(rs.status){

                    localStorage.setItem('logomap_2_login',mobile)
                   // localStorage.setItem('logomap_2_id',id)
                    $.yalert.close()
                    callback()
                    //alert(rs.msg)

                }else{
                    //$.yalert.close()
                    alert(rs.msg)

                }
            })
        }

        function regiter(){
            $('.regiter').on('click',function(){
                $.yalert.close()
                $.REGISTER(callback)
            })
        }

    }

    $.LOGIN.CLOSE=function(){
        $.yalert.close()

    }


    $.REGISTER=function(callback){

        ajax()

        function ajax(){
            view()
        }

        function view(){

            var htmls='<input type="tel" class="login-btn" id="phone" placeholder="请输入手机号">' +
                //'<input type="text" class="login-btn" id="name" placeholder="请输入姓名">' +
                //'<input type="text" class="login-btn" id="password" placeholder="请输入密码">'+
                '<div class="back-login"><<返回登录</div>'
            $.yalert({
                content:htmls,
                submit_text:'注册',
                title:'注册',
                onload:function() {
                    back_login()
                },
                submit:function(){

                    submit()
                },
                cancel:function(){

                    $.yalert.close()
                }
            })
        }

        function back_login(){
            $('.back-login').on('click',function(){
                $.yalert.close()
                $.LOGIN(callback)
            })
        }

        function submit(){
            var mobile=$('#phone').val(),password=$('#password').val(),name=$('#name').val()
            if(!mobile){
                alert('请输入手机号码！')
                return false
            }
            //if(!password){
            //    alert('请输入密码！')
            //    return false
            //}
            //if(!name){
            //    alert('请输入姓名！')
            //    return false
            //}

            $.ajax({
                url:'/User/Index/register',
                type:'post',
                dataType:'json',
                data:{mobile:mobile,password:password,name:name}
            }).done(function(rs){
                if(rs.status){
                    $.yalert.close()
                    callback()
                    //alert(rs.msg)

                }else{
                    //$.yalert.close()
                    alert(rs.msg)

                }
            })
        }

    }

    $.REGISTER.CLOSE=function(){
        $.yalert.close()

    }

    //添加黑色遮罩
    var _addBlank = (function () {
        var type = type;
        var w = $(window).width(), h = $(window).height();
        var htmls = '<div class="back-black" black-type="' + type + '" style="height:' + h + 'px"></div>'

        function add() {

            $('body').append(htmls)
            $(window).resize(function () {
                var w = $(window).width(), h = $(window).height()
                $('.back-black').width(w).height(h)
            })


        }

        function close() {
            $('.back-black[black-type=' + type + ']').remove()

        }

        return {
            add: add,
            close: close
        }
    })($)

    $.addBlack = function () {

        _addBlank.add()

        this.close = function () {
            _addBlank.close()
        }

        return this
    }

    //弹窗公用方法
    var _alert_box = function () {

        var a = $.addBlack()

        this.add = function (option, yconfirm) {
            var opts = {
                id: '',
                title: '提示',
                content: '',
                submit_text: '确定',
                cancel_text: '取消',
                onload:function(e){},
                submit: function (e) {
                },
                cancel: function (e) {
                }
            }
            var w = $(window).width(), h = $(window).height()

            var opt = $.extend(opts, option)
            var htmls = ''

            htmls += '<div class="yalert_box" '
            if (opt.id) {
                htmls += ' id="' + opt.id + '"'
            }
            htmls += '>';
            htmls += '<div class="yalert_box_top">' + opt.title + '</div>'
            htmls += '<div class="yalert_box_tip">' + opt.content + '</div>'
            htmls += '<div class="yalert_box_btn">';
            if (yconfirm) {
                htmls += '<a class="yalert_box_submit" id="yalert_box_quxiao">' + opt.cancel_text + '</a>'
                htmls += '<a class="yalert_box_submit" id="yalert_box_queding">' + opt.submit_text + '</a>'
            } else {
                htmls += '<a class="yalert_box_submit" id="yalert_box_queding" style="width: 100%;">' + opt.submit_text + '</a>'
            }


            htmls += '</div>'
            htmls += '</div>'

            $('input,textarea').focusout()
            $('.yalert_box').remove()


            $('body').append(htmls)

            opt.onload()
            $('#yalert_box_queding').off('click').on('click', function () {

                if (option.submit) {
                    opt.submit($(this))
                } else {
                    $('.yalert_box').remove()
                    a.close()
                }

            });
            if (yconfirm) {
                $('#yalert_box_quxiao').off('click').on('click', function () {
                    if (option.cancel) {
                        opt.cancel($(this))
                    } else {
                        $('.yalert_box').remove()
                        a.close()
                    }

                })
            }

        };


        this.close = function () {
            $('.yalert_box').remove()
            a.close()
        };

        return this;

    }
    //确认窗
    $.yalert = function (option, submit) {
        var yalert = new _alert_box()

        if (typeof(option) == 'object') {

            yalert.add(option, 0)
        } else {

            var datas = {
                content: option,
                submit: submit
            }
            yalert.add(datas, 0)

        }

    }
    $.yalert.close=function(){
        $('.yalert_box').remove()
        $('.back-black').remove()
    }
    //有取消的
    $.yconfirm = function (option) {
        var yalert = new _alert_box()
        yalert.add(option, 1)

    }




})