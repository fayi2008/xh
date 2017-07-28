(function(){

    var
        // 轮询实例
        io = mapx.socket(api.socket),//

        signin = xh.require('xh.ui.signin'),

        //事件别名
        evt = utils.evt,

        //类型 0 住，1吃，2导游，4wc
        type,

        //检索请求的id
        request_id,

        //轮询有结果时id
        receive_id,

        //当前响应poi点的id
        current_id,

        //当前响应poi点的 信息
        current_data,

        //找导游时 返回的导游数量
        tour_count,

        //是否为最后状态
        close_flag = false;

    // 帮助提示
    var tips_data = {
        "1":"点击确定，系统会把您的要求发送给商家，商家抢单成功后会主动联系您。",
        "2":"请移动地图上的标点，到您要去的景区，确定后导游将响应并主动电话与您沟通",
        "3":"请从下方选择您需要的服务",
        "4":"已响应的商家会主动电话联系您，点击底部的 x 按钮可取消服务",
        "11":"<% = this.name %> 已成功抢单，稍后会电话与您联系",
        "12":"<% = this.msg %>"
    };
    // 帮助
    var tips = (function(){
        function show(id , d , t , fn){

            var str = id==-1 ? $('#tpl_tips').html() : tips_data[id];
            if(d) str = mapx.vm(str , d);
            if(str) {
                $("#j_tips_panel").html(str);
                if(d !== false){
                    $("#tips section").fadeIn(150);
                    process(t || 5000 , fn);
                }

            }
        }
        var handler;
        function process(t , fn){
            if(handler) window.clearTimeout(handler);
            handler = window.setTimeout(function(){
                $("#tips section").fadeOut(150);
                fn && fn();
            },t)
        }
        return {
            "show":show
        }
    }());



    //操作
    var handlers = {
        /**
         * 开启或关闭 等待 面板
         * @param v
         */
        "toggle_iw":function (v){
            if(v===undefined){
                $("body").removeClass("mode-contact");
                $("#iw").removeClass("show-list");
                $('.pop').removeClass("pop");
                cross.set(null);
                ui.loading();
                $.getJSON(api.cancel , {"type":type},function(resp){
                    if(resp.status){
                        ui.loading(null);
                        poi.fetch();
                    }
                });
                //tips.show("3" , false);
            }else
            {

                $("body").addClass("mode-contact");
                poi.iw();
                var target = type==2 ? "导游" : "商户";

                $("#iw").find('.t1').html(target);
                //定向
                if(close_flag){ target = '该'+target; }

                $("#iw").find('.t2').html(target);
            }
        },
        /**
         * 查询面板
         * @param v
         */
        "toggle_search":function(v , refresh){
            if(v === undefined){
                $(".menu a.act.select").removeClass('select');
                $("body").removeClass("mode-option");
                if(refresh !== false) poi.fetch();
            }else{
                type = v;
                $("#j_option").html( $("#tpl_option_"+v).html() );
                requestAnimationFrame(function(){
                    $("body").addClass('mode-option');
                });

                //show().siblings("section").hide();
                $(".menu a[rel="+v+"]").addClass("select").siblings().removeClass('select');
                //$(".options").addClass("show");

                // 原生空间选择时间
                if(utils.feature.ios){
                    $('.datepicker').attr('type' , 'datetime-local');
                }
                //收集过滤字段
                var r = selectFilter();
                //拉取对应类别信息
                poi.fetch(r.type , r.filter);
                poi.iw();
            }
        },
        /**
         * 切换下一家
         */
        "next" : function(){
            $.getJSON(api.next[type] , {
                "receive_id":receive_id,
                "request_id":request_id
            },function(resp){
                if(resp.status == 1){
                    $('body').removeClass('mode-response');
                    io.listen(true);
                }
            })
        },
        /**
         * 用户达成
         */
        "agree" : function(){
            $.getJSON(api.agree[type] , {"id":current_id , "request_id":request_id} , function(resp){
                if(resp.status == '1'){
                    $("body")
                        .addClass("mode-agree")
                        .removeClass('mode-contact mode-response mode-response-full');
                    handlers.toggle_search();
                    handlers.toggle_iw();

                }
            });
        },
        /**
         * 轮询接口响应
         * @param d
         */
        setResp:function(d){
            if(d.status == 1 && d.data.length){
                for(var i in d.data){
                    //商家响应
                    if(d.data[i].admin_status == "1"){
                        //在地图上添加冒泡标志
                        $(".mapx-label[data-id="+d.data[i].id+"]").addClass("pop");
                    }
                }
                receive_id = d.data[0].receive_id;
                current_id = d.data[0].id;
                current_data = utils.format_poi(d.data[0]);
                //console.log(current_data);
                tips.show("11" , current_data);


                handlers.showResp(d.data[0]);
                io.listen(false);
                //var tmp = d.data[0];
            }
            // 兜底
            else if(d.status == "-1"){
                tips.show("12" , d,10000 , function(){
                    tips.show("3",false);
                });
                handlers.toggle_iw(undefined , false);
                io.listen(false);
            }

        },
        /**
         * 显示轮询接收的结果
         */
        "showResp":(function(){
            var resp_full_handler;
            return function (d){
                d.type = type;
                d.want = close_flag;
                utils.render_star(
                    $("#iw .panel").html(
                        mapx.vm($("#tpl_info").html() ,
                            d)
                    )
                );
                $("#j_modal_agree .contact a").attr("href", "tel:"+d.tel);
                $("body").addClass('mode-response');

                if(resp_full_handler){
                    window.clearTimeout(resp_full_handler);
                }
                resp_full_handler = setTimeout(function(){
                    $("body").addClass('mode-response-full');
                },3000)
            }
        }()),
        /**
         * 导航
         */
        "nav" : function(pos){
            if(pos == undefined) pos = current_data.lon + ","+current_data.lat;

            if(pos){
                var to   = pos;
                var from = cross.get().lng + "," + cross.get().lat;
                var route = 'http://map.qq.com/nav/drive?start='+from+'&dest='+to+'&sword=我的位置&eword=目的地&ref=mobilemap&nohighway=0&noround=0&notoll=0&traffic=1&cond=0&mt=0';

                var el = '<iframe src="'+route+'"></frame>'
                $("#j_modal_nav").html(el);
                $('body').addClass("mode-nav");
                /*setTimeout(function(){
                    handlers.close();
                },1000);*/

            }

            //
            //location.href = route;
            //console.log(route);
        },
        /**
         * 界面重置
         */
        "nav_reset":function(){
            if($("body").hasClass("mode-nav")){
                $("body").removeClass("mode-nav");
                window.setTimeout(function(){
                    $("#j_modal_nav").html();
                },700);
            }
        },
        /**
         * 强意愿请求,发特殊 查询 请求
         * @param id
         * @param t
         */
        "want":function(id , t){
            signin(function(){
                ui.loading();
                var p = map.getCenter();
                p = mapx.proj.bd2gcj(p.lat , p.lng);
                type = t;close_flag = true;
                search({id:id ,lat: p[0], lng: p[1]});
            });
        },
        "want_20150728":function(id , t){
            ui.loading();
            var p = map.getCenter();
            var conv = mapx.proj.bd2gcj(p.lat , p.lng);
            //console.log(conv)
            $.getJSON(api.contact,{
                "id":id , "type":t ,
                "lat": conv[0],"lon": conv[1]
            },function(d){
                ui.loading(null);

                if(d.status == 1){

                    ui.alert("提示","您的请求已发送给商户，请耐心等待！");
                }else{
                    ui.alert(d.msg);
                }
            });
        },
        /**
         * 加载评论
         * @param id
         */
        "review":function(p){
            // 查找评论的容器
            var id =  $(p).attr('data-id');
            var el = $(p).parents("div").find(".j_review_cnt");
            var t = $(p).attr('data-type');
            if(!el.hasClass("review-loaded")){
                $.getJSON(api.review[t] , {'id':id} , function(resp){
                    el.html(mapx.vm($("#tpl_review").html() , resp))
                        .addClass("review-loaded");
                });
            };
        },
        /**
         * 关闭筛选面板
         */
        "close":function(){
            $('body').removeClass('mode-contact mode-response mode-response-full mode-agree');
            handlers.toggle_search();
            handlers.toggle_iw();
        },
        "show_guide_detail":function(id){
            //console.log(id)
            $.getJSON(api.detail.guide,{"id":id} , function(resp){
                if(resp.status){
                    utils.render_star
                    (
                        $("#j_detail_tour").html
                        (
                            mapx.vm($("#tpl_detail_tour").html() , utils.format_poi(resp.data))
                        )
                    );
                    $("body").addClass("mode-detail");
                }
            });
        }
    };

    /***
     * 筛选过滤条件
     * @returns {*[]}
     */
    function selectFilter(){
        var els = $("#j_option *[filter-key]");
        //console.log(els)
        var f = {};
        for(var i=0;i< els.length;i++){
            var el = $(els[i]),
                r   = el.attr("filter-type"),
                key = el.attr("filter-key");

            if(r == "radio")
            {
                f[key] = $(el).find(".select").attr("data-id");
            }else if(r == 'input' || r == 'range'){
                var value = $(el).val();
                //if(!value) value = new Date().getTime();
                f[key] = $(el).val();
            }
        }
        var center = map.getCenter();
        var conv = mapx.proj.bd2gcj(center.lat , center.lng);
        return {
            lat:conv[0] , lng:conv[1] , type:type , filter:f
        }
    }

    /**
     * 发起请求
     */
    function search(f){
        var d = f || selectFilter();
        var url = api.filter[type];
        //api.filter[type]
        var data = {
            "lat": d.lat,
            "lng": d.lng,
            "filter":JSON.stringify(d.filter) || {}
        };
        if(d.id) {
            data.id = d.id;
            data.filter = JSON.stringify({"type":"0"});
            data.type = type;
            url = api.contact;
        }
        //console.log(data);
        $.getJSON(url, data , function(resp){

            ui.loading(null);
            if(resp.status == 1){
                // 关闭选项面板
                handlers.toggle_search();
                //打开等待面板
                handlers.toggle_iw(true);
                //保存回话id
                request_id = resp.request;

                tour_count = resp.count || 0;

                //固定 图钉位置
                cross.set();

                //if(type == '2'){focus(resp.data);}
                //开启轮询
                io.listen(true);

            }else{
                //无数据 提示
                ui.alert("提示","5公里范围内没有满足要求的商户");
            }
        });
    }

    /**
     * 初始化
     */
    function init(){
        //绑定轮询回调
        io.on("message" , function(d){
            handlers.setResp(d);
        }).on("before_request" , function(){
            this.data = {"id":request_id , "type":type};
        });

        // 绑定 实时导航的路由
        mapx.utils.router('nav' , function(){
            handlers.nav();
        });
        mapx.utils.router('nav/:pos' , function(pos){
            handlers.nav(pos);
        });

        mapx.utils.router('' , function(){
            handlers.nav_reset();
        });

        //绑定导游详情
        mapx.utils.router('guide/:id' , function(id){
            //console.log('show:guide detail',id)
            handlers.show_guide_detail(id);
        });

        //在发起请求 且 还没有响应时，结束请求
        $("#iw>.close,#iw .panel button[data-type='cancel']").on('click' , function(){
            handlers.toggle_iw(undefined , false);
            io.listen(false);
        });

        //点击右上角的帮助工具
        $("#j_tips").on(evt.click , function(){
            $("#tips section").fadeToggle(150);
        })

        //在poi详情里 点击 我要吃/住
        $(".want").on(evt.click , function(){
            handlers.want($("#infowindow").attr("data-id"),$(this).attr("data-type"));
        });

        // 打开提示
        $('body').on(evt.click , '[act-tips]' , function(){
            var id = $(this).attr('act-tips');
            tips.show(id);
        });

        //换下一家
        $('body').on(evt.click , "#j_switch[data-type='switch']" , function(){
            handlers.next();
        });

        // 达成意向
        $('body').on(evt.click , "#j_agree" , function(){
            handlers.agree();
        });

        // 商家响应完毕，关闭提示
        $('body').on(evt.click , "#j_switch[data-type='cancel']" , function(){
            handlers.close();
        });

        //关闭达成意向面板
        $('body').on(evt.click , "#j_modal_agree .close" , function(){
            $("body").removeClass('mode-agree');
        });
/*
        //去个人中心
        $('body #j_modal_agree').on(evt.click , '.user' , function(){
            location.href = "order.html";
        });
*/

        // 导航
        $('body #j_modal_agree').on(evt.click , '.navi' , function(){
            handlers.nav();
            location.hash = "!nav";
            $("body").removeClass('mode-agree');
        });

        //打开筛选面板
        $("#j_menu").on(evt.click , ".menu a[rel]" , function(e){

            if($(this).hasClass("select")){
                handlers.toggle_search();
            }else{
                var rel = $(this).attr("rel");
                setTimeout(function(){
                    handlers.toggle_search(rel);
                },10);
            }
            $('.search-list').html('')
            e.stopPropagation();
        });

        //通用操作筛选
        $('#j_option').on(evt.click , 'li' , function(){
           $(this).addClass('select').siblings().removeClass('select');
        });

        //操作筛选面板时 加载对应类别
        $("#j_option").on(evt.click , "li" ,function()  {
            var r = selectFilter();
            //console.log(r);
            var v = utils.format_filter(r);
            poi.fetch(r.type , r.filter , function(count){
                v.count = count;
                tips.show(-1 , v);
            });
        });

        // 提交筛选
        $('#j_option').on(evt.click ,'.submit', function(e){
            signin(function(){
                ui.loading();close_flag = false;
                search();
            });
            e.stopPropagation();
        });

        // 关闭筛选
        $("#j_option").on(evt.click ,'.close', function(e){
            handlers.toggle_search();
            e.stopPropagation();
        });

        //找导游 选择时间
        $('#j_menu').on("change",".datepicker" , function(){
            var r = $("#j_guide_picker").val();
            var k = new Date(r);
            if($(this).attr('type') == 'datetime-local'){
                k.setHours(k.getHours() - 8);
            }
            var str = (k.getMonth()+1)+"月"+ k.getDate()+"日"+" " + k.getHours() +"点"
            $('#j_guide_time').html(str);
        });

        // 关闭导游详情
        $("#j_detail_tour").on(evt.click , '.header .close' , function(){
            $('body').removeClass('mode-detail');
        });

        // 查看评价
        $('body').on(evt.click,'.j_review' , function(){
            handlers.review(this);
        });

        // 点击poi logo 或 导游头像时 打开详情
        $('#iw').on(evt.click ,".panel .header" ,function(){

            if(type == "2"){
                utils.render_star
                (
                    $("#j_detail_tour").html
                    (
                        mapx.vm($("#tpl_detail_tour").html() , current_data)
                    )
                );

                $("body").addClass("mode-detail");

            }else{
                poi.iw(current_id);
            }

        });

        $("#infowindow").on(evt.click , ".j_nav" , function(){
            if(!cross.ready()){
                ui.alert('提示','定位未就绪，无法进行导航');
                return;
            }
            var id = $("#infowindow").attr("data-id");
            var data = poi.getData(id);
            var pos = data.lng+"," + data.lat;
            location.hash = "!nav/"+pos;
        });

        // fixed ios bug
        if(utils.feature.ios){
            $("#infowindow .section .footer").css({"position":"absolute","zIndex":1});
            $("#infowindow").on("scroll" , function(){
                //console.log($(this).scrollTop())
                $("#infowindow .full .footer").css({"bottom":0-$("#infowindow").scrollTop()+"px"});

            }).on(evt.click , "ul.tab li" , function(){
                $("#infowindow .full .footer").css({"bottom":0});
            });
        }

        /*check(function(status){
            if(status == false){
                poi.start();
            }
        });*/
        poi.start();
    }

    window.tour = {
        "nav_reset":handlers.nav_reset
    }
    app && init();
}());