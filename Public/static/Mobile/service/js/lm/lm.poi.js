(function(){

    var app, map,
        data  = {}, labels = {} ,
        disablePoi = false, useHistory = false, firstRun = true, sync = false;

    var center, bound, type, radius = 3000, filter = {}, ori_filter, ori_type;
    var click = ('ontouchstart' in  document) ? "touchend" : 'click';
    window.data = data;

    function init(v)
    {
        app = v;
        useHistory = app.getOptions('history');
        sync = app.getOptions('sync');
        map = app.getMap();
        bind();
        ///Poi/Index/radius?r=500&t=1&lat=30.254475&lng=120.168205
    }

    function start()
    {
        if(app.getOptions('forceCenter') === true){
            var pos = map.getCenter();
            mapx.location.geoCoding(pos.lat , pos.lng , function(d){
                document.title = d.addressComponent.district.replace(/[县市区]/g,"") + "游助手";
                //console.log(d);
            })

            updatePoi();
        }else{
            mapx.location.getIPLocation(function(d){
                var lat = d.location.lat,
                    lng = d.location.lng;
                document.title = d.ad_info.city.replace(/市/g,"") + "游助手";
                center = [lat , lng];
                map.setCenter(mapx.latlng(center));
                updatePoi();
            })

        }

    }

    function save(pois){
        utils.format_data(data , pois , type , cross);
        //console.log('update poi');
        render();
    }

    /**
     *
     * @param force
     * @param f
     */
    function updatePoi(force , fn)
    {
        var c = map.getCenter();
        if(bound && bound.containsPoint(c) && force!== true){
            return;
        }

        center = [c.lat , c.lng];
        bound = mapx.utils.getBoundFromRadius(mapx.latlng(center) , 3000);
        ///Poi/Index/radius
        //console.log(JSON.stringify(filter));
        var conv = mapx.proj.bd2gcj(center[0] , center[1]);
        $.getJSON(api.pois,{
            "radius":radius,
            "lat":conv[0],
            "lng":conv[1],
            "type":type,
            "filter":JSON.stringify(filter)
        }, function(d){
            if(d.status == 1){
                d = d.data;
                save(d);
                fn && fn(d.length);
            }else
            {
                fn && fn(0);
            }
        });
    }

    var act = {
        'bind':function(){
            // 路由，如果 useHistory == false 时，路由只执行一次
            // 详情弹窗
            mapx.utils.router('detail/:id' , function(id){
                act.showDetail(id);
                tour.nav_reset();
            }, !useHistory);
            // 普通弹窗
            mapx.utils.router('iw/:id' , function(id){
                //console.log('show:infowindow')
                if($('#infowindow').hasClass('full')){
                    $('#infowindow').removeClass('full');
                }else{
                    act.showIw(id);
                }
                tour.nav_reset();
            },!useHistory);

            //回到地图
            mapx.utils.router('' , function(){
                act.hide();
            },!useHistory);

        },

        'setIw' : function(id){
            if(useHistory){
                location.hash = '#!iw/' + id;
            }else{
                this.showIw(id);
            }
        }
        ,
        'setClose' : function(){
            if(useHistory){
                location.hash = '';
            }else{
                act.hide();
            }
        },
        'setDetail' : function(id){
            id = id || $('#infowindow').attr('data-id');
            if(useHistory){
                location.href = '#!detail/' + id;
            }else{
                act.showDetail(id);
            }
        },
        'showDetail' : function(id){


            //var height = $("#map_container").height() / 2 - 200 / 2;
            //map.panBy(0 , -height);

            act.showIw(id , function(){
                if($('#infowindow').hasClass('show') == false){
                    $('#infowindow').addClass('show');
                }
                $('#infowindow').addClass('full');
            });
           /* $.getJSON('/article/Index/lists/poi_id/'+id,function(data){
                if(data.status == 1){
                    var d = data.data;
                }
            })*/
        },
        //弹窗
        'showIw' : function(i, fn){
            var setShow = function(d){
                var addr = d.address.split(/[。，（ ]/)[0];
                var onsale = d.onsale ? d.onsale.title : (d.desc || "详细介绍") ;
                $('#iw_logo').css({'backgroundImage':'url('+d.icon+')'});
                $('#iw_title').html( d.name );


                var detail=d.detail
                if(d.detail&&d.detail.length>10){
                    d.detail.substr(0,10)+'...'
                }
                $('#iw_desc').html(
                    "诚信评分："+ d.star +
                    (d.room_lowest_price && d.room_lowest_price!="0.00" ? ("，房间起价："+d.room_lowest_price):"") +
                    (d.average_spend && d.average_spend!="0.00" ? ("，餐饮均价："+ d.average_spend):"")
                );
                //$('#iw_desc').html( "<strong>简介</strong>："+detail);
                $(".j-detail").html(d.detail);
                $('#iw_address,.icon-address').html( addr );
                var bg =  '/static/Mobile/service/img/bg_'+ d.hotel + '.png';
                $('#iw_mask').css({'backgroundImage':'url('+bg+')'});
                $('#flipsnap img').attr('src', d.icon);

                if(d.pictures && d.pictures.length){
                    var fp = mapx.select(d.pictures , "pic_url");
                    if(fp) ui.flipsnap('#flipsnap',{'photos':fp});
                }

                $('#infowindow').addClass('show').attr('data-id' , d.id);
                $('#iw_fav').removeClass('select');

                var tell = d.phone == null ? "" : d.phone;

                $('#iw_phone').attr('href','tel:' + tell);

                $('.icon-phone').html('电话预定 ' + tell);
                $('#infowindow .footer').removeClass("hide-hotel hide-food");
                $("#infowindow .j_review").attr("data-id", d.id);
                if(d.hotel != '1')
                    $('#infowindow .footer').addClass("hide-hotel");
                if(d.food != '1')
                    $('#infowindow .footer').addClass("hide-food");
                if(d.receive_status==0){
                    $('#infowindow .footer').addClass("hide-hotel hide-food");
                }

                map.panTo(d.position);

                $("#j_detail").html(
                    mapx.vm($("#tpl_detail").html() , utils.format_detail(d) )
                );

            }

            if(data[i] && data[i]["all_data"] && $('#infowindow').attr('data-id') == i){
                var d = data[i];
                setShow(d);
                fn && fn();
            }else{
                if(data[i] && data[i].type == "4"){
                    return;
                }
                //TODO "/Poi/Index/poi/id/"+i
                $.getJSON(api.poi,{'id':i}, function(d){
                    if(d.status == 1 && d.data.type !="4") {
                        d = d.data;

                        data[i] = mapx.extend(d,{
                            "lng": d.lon ,
                            "icon":d.logo ? (config.path + d.logo) : d.image ? d.image : 'assets/img.png',
                            "position":mapx.latlng(d.lat , d.lon),
                            "detail": d.service_content,
                            "star": d.sum == "0" ? "0" : (d.score / d.sum).toFixed(1),
                            "all_data":true
                        });

                        setShow(data[i]);
                        fn && fn();
                    }
                })
            }

        },

        'hide' : function(){
            if($('#infowindow').hasClass('full')){
                $('#infowindow').removeClass('full');
            }
            if($('#infowindow').hasClass('show')){
                $('#infowindow').removeClass('show').attr('data-id','').addClass('load-review');
                $('#j_review_cnt').html('');
                $('#infowindow .footer').removeClass("hide-hotel,hide-food");
            }
        }

    }

    function bind(){
        map.addEventListener("moveend", render);
        map.addEventListener("zoomend", render);
        map.addEventListener("zoomstart", preRender);
        map.addEventListener("movestart", preRender);
        map.addEventListener("movestart", preRender);

        // 点击label
        $('body').on(click, '.mapx-label' , function(e){
            if(!disable) {
                act.setIw($(this).attr('data-id'));
                e.preventDefault();
                e.stopPropagation();
            }
        });

        // detail 关闭
        $('#j_close,#infowindow .close').on(click , function(){
            act.setClose();
        });

        // 收藏
        $('#infowindow').on(click , '#iw_fav' , function(){
            $(this).toggleClass('select');
        });

        // 进入 detail
        $('#infowindow .header,#iw_desc').on('click', function(){
            act.setDetail();
        });

        // 地图空白区 点击
        $('#map_container').on(click , function(e){
            //没有点击在label
            if($(e.target).parent().hasClass('mapx-label') == false){
                if($('#infowindow').hasClass('show')){
                    act.setClose();
                }
            }
        });

        /*$("#infowindow").on(click, ".j_nav", function(){
            var id = $("#infowindow").attr("data-id");
            var target = data[id].name;
            var pos = data[id].position.lng + "," + data[id].position.lat;
            //var here = loc.get();
            utils.nav(pos);
            *//*if(here){
                //console.log("http://apis.map.qq.com/uri/v1/routeplan?type=bus&from=我的位置&fromcoord="+here.lat+","+here.lng+"&to="+target+"&tocoord="+pos+"&policy=1&referer=hqtec")
                location.href = "http://apis.map.qq.com/uri/v1/routeplan?type=bus&from=我的位置&fromcoord=39.980683,116.302&to="+target+"&tocoord="+pos+"&policy=1&referer=hqtec";
            }else{
                ui.alert("提示","由于无法定位您的当前位置，导航暂不可用")
            }*//*

        });*/

        /* 显示 wc */
        $("#j_toilet").on(click , function(){
            if($("#j_toilet").hasClass("process") == false){
                $(this).toggleClass('select');
                if($(this).hasClass('select')){
                    fetch("4");
                }else{
                    fetch();
                }
            }
        });

        setTimeout(function(){
            act.bind();
        },15);
    }

    /**
     *
     * @param t 类型
     * @param f 过滤条件
     */
    function fetch(t , f , fn){
        clear();
        //console.log('ori',ori_filter);
        if(t === undefined){
        // 加载 吃住
            data = {};type = "";radius = 3000;
            filter = ori_filter || {};
            if(ori_type) type = ori_type;
            type="";
            updatePoi(true);
        }else if(t === "-1"){
            //清空所有
            type = "";radius = 3000;filter = {};
        }else if(t == "0" || t == "1"){
            // 加载其他
            filter = f;type = t;
            data = {};radius = 10000;
            //console.log('0,1',filter);

            updatePoi(true , fn);
        }else{
            ori_filter = filter;ori_type = type;
            filter = f;type = t;
            data = {};radius = 10000;

            updatePoi(true , fn);
        }

    }

    var render_handler;
    function render(){
        //labels[]
        if(render_handler == undefined){
            render_handler = requestAnimationFrame(render_);
        }
    }

    var disable = false;
    function preRender(){
        disable = true;
        //动态更新数据
        if(sync){

        }
    }

    var mode_once = false;
    function render_()
    {
        // 检测 poi 更新
        if(!focus_mode) updatePoi();

        if(disablePoi){
            clear();
        }else{
            disable = false;
            if(lastZoom === undefined) lastZoom = map.getZoom();

            var all = getRenderables() || {}, exist = {};
            if(focus_mode) all = data;
            for(var id in labels){
                if(all[id] == undefined){
                    remove(id);
                }else{
                    exist[id] = labels[id];
                }
            }

            for(var id in all){
                if(exist[id] == undefined){
                    add(id);
                }
            }
        }

        lastZoom = map.getZoom();

        render_handler  = undefined;
    }

    // v 与 h 相交
    function intersect(h , v)
    {
        var px = map.pointToPixel(v);
        var hx  = map.pointToPixel(h);
        return ( (Math.abs(hx.x - px.x) < 120) && (Math.abs(hx.y - px.y) < 54) );
    }

    var lastZoom;
    function getRenderables()
    {
        var here = map.getBounds(), renderables = {};

        //取出范围内的所有点
        for(var i in data){
            if( here.containsPoint(data[i].position) )
            {
                renderables[i] = data[i];
            }
        }

        // 最高级别 视野内的全部显示
        if(map.getZoom() == 18){
            return renderables;
        }

        // TODO 需要补充一个 平均分布的算法
        var ave, pre = {};

        //平移时
        if(map.getZoom() >= lastZoom){
            // 已存在点 和 所有的点 取交集，ave 显示集 保存要显示的点 ， pre 处理集 保存预处理点
            for(var i in renderables){
                if(labels[i]){
                    if(ave==undefined) ave = {};
                    ave[i] = renderables[i];
                }else{
                    // 新点集合中
                    pre[i] = renderables[i];
                }
            }

        }else{
            //缩放时，所有都要处理
            pre = renderables;
        }

        for(var i in pre){
            //如果为空 将第一个点作为必显示点
            if(ave==undefined){
                ave = {};
                ave[i] = pre[i];
            }else{
                // 处理集 如果与 要显示集 相交，则剔除；否则 加入到 显示集
                var r = false;
                for(var j in ave){
                    r = r || intersect(ave[j].position , pre[i].position);
                    if(r) break;
                }

                if(r == false)  ave[i] = pre[i];
            }
        }

        return ave;
    }

    function add(i)
    {
        labels[i] = mapx.label( data[i].position , data[i] )
            .setMap(map);
    }

    function remove(i)
    {
        labels[i].setMap(null);
        delete labels[i];
    }

    function clear()
    {
        for(var i in labels){
            remove(i);
        }
    }

    var focus_mode = false;
    function focus(v){
        if(v === null || v === undefined){
            focus_mode = false;
            $(".mapx-label.mapx-focus").removeClass("mapx-focus");
            clear();
            //data = {};
            updatePoi(true);
        }else{
            clear();
            data = {};
            focus_mode = true;
            map.setZoom(16);
            save(v);

            map.setViewport( mapx.select(data , "position")  );
            return data;
        }

    }


    var focusTo = (function(){
        var pan_handler, id;

        var process = function(){

            if($(".mapx-label[data-id="+id+"]").length){
                $(".mapx-label.mapx-focus").removeClass("mapx-focus");
                //console.log($(".mapx-label"));
                $(".mapx-label[data-id="+id+"]").addClass("mapx-focus");
            }else{
                requestAnimationFrame(process);
            }
        }

        return function(v){

            if(data[v]){
                id = v;
                map.panTo( data[id].position );
            }
            process();
        }
    }());

    var poi =  {
        'init' : init,
        'add' : 'add',
        'clear':'clear',
        "focus": focus,
        "fetch":fetch,
        "focusTo":focusTo,
        "iw" : function(v){
            if(v === undefined || v === null){
                act.setClose();
            }else{
               act.showIw(v)
            }
        },
        'start':start,
        'getData':function(id){ return data[id]; }
    }

    window.poi = poi;

}());

app && poi.init(app);

