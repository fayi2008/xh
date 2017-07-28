(function(){
    /**
     * 将长地址 格式化成 两段式地址
     * @param v
     * @returns {*}
     */
    function format_addr(v){
        if(!v) return [];
        v = v.replace(/(\(|（)[\w\W]*(\)|）)/,'');
        //console.log(v);
        var tmp = v.split(/[市县]/);
        var last = v;

        if(tmp.length > 1){
            last = tmp[tmp.length - 1];
        }
        tmp = last.replace(/([镇乡区])/,"$1,").split(",");

        if(tmp.length ==2){
            return tmp;
        }else
            return [last , 0];
    }

    /**
     * 格式化 poi 详情数据
     * @param d:待处理数据
     * @param corss：图钉对象
     * @returns {*}
     */
    function format_poi(d , corss){
        d.addr = format_addr(d.address);
        d.icon = d.icon ? (config.path + d.logo) : d.image ? d.image : '';
        d.sex = d.sex == "1" ? "男" : "女";
        d.dist = cross.distance(mapx.latlng(d));
        // 导游
        if(d.guide_id){
            d.addr = ["导游证编号", d.guide_no];
        }
        return d;
    }

    /**
     * 格式化 用于地图显示的poi数据
     * @param data: object,缓存数据对象t
     * @param d : array,待处理数据
     * @param type:poi类型
     * @param cross:图钉
     */
    function format_data(data , d , type ,cross){
        for(var i in d){
            //var p = mapx.proj.gc2bd(d[i].lat , d[i].lon);
            var id = d[i].id;
            var pos = mapx.latlng(d[i].lat , d[i].lon);
            data[id] = {
                "id":id,
                "lat":d[i].lat,"lng":d[i].lon || d[i].lng ,
                "icon":d[i].image ? config.path + d[i].image : '/static/Mobile/service/img/icon_type_0.jpg',/*d[i].type*/
                "position":pos,
                "name":d[i].name,
                "short_name":d[i].short_name || d[i].name,
                "dist": cross.distance(pos),
                "address":d[i].address,
                "request_id":d[i].request_id,
                "type":d[i].type
            }
            if(type == "4") {
                data[id].icon = 'assets/toilet.png';
                data[id].short_name = "";
            }
        }
    }

    /**
     * 将 过滤条件 转换为 可读形式
     * @param data
     * @returns {{count: (*|g.count|status.count|CKEDITOR.dom.nodeList.count|number|count), type: string, filter: Array}}
     */
    function format_filter(data){
        var arr = [];
        var d = data.filter;
        var t = "商户";
        if(data.type == '1') t = '餐厅';
        if(data.type == '0') t = '酒店';

        for(var i in d){
            var el = $("#j_option [filter-key='"+i+"']");
            var field = el.parents(".condition").find('h4').html();
            var value;
            //console.log(el)
            if(el.attr("filter-type") == 'radio'){
                value = el.find("li[data-id='"+ d[i]+"']").html();
            }else if(el.attr("filter-type") == 'range'){
                value = el.parents(".condition").find("span:eq("+el.val()+")").html();
            }
            arr.push({key:field , value:value , ori_value:d[i]});
        }

        return {"count": data.count , 'type':t , 'filter':arr};
    }

    function format_detail(d){
        var fields = {};
        if(d.type=="2") {
            fields = {
                "service_content":"主营菜系",
                "desc":"就餐方式",
                "box_num":"包间数",
                "total_num":"餐位数",
                "business_hours":"营业时间",
                "average_spend":"餐饮均价",
                "park":"停车场"
            };
        }else if(d.type=="1") {
            fields = {
                "service_content":"主营菜系",
                "desc":"休闲娱乐",
                "room_num":"客房数",
                "bed_num":"床位数",
                "room_lowest_price":"房间起价",
                "average_spend":"餐饮均价",
                "park":"停车场"
            };
        }else if(d.type=="3") {
            fields = {
                "service_content":"主要服务",
                "room_num":"客房数",
                "bed_num":"床位数",
                "room_lowest_price":"房间起价",
                "average_spend":"餐饮均价",
                "park":"停车场"
            };
        }
        var vs = [];
        for(var i in fields){
            if(d[i] && d[i]!="0" && d[i]!="0.00" ){
                vs.push([fields[i] , d[i]]);
            }
        }
        return vs;
    }


    function checkSession(fn){

        signin(fn);
        /*$.LOGIN(function(){
            fn();
        });*/
    }

    var signin = (function(){
        var tpl = $('<div class="mod-signin"><div class="wrap"><button class="close"></button><h3>请输入手机号验证身份</h3><input type="text" class="mobile" placeholder="请输入手机号"><input type="text" class="code" placeholder="请输入验证码"><button class="getcode">获取验证码</button><button class="check">确定</button></input></input></div></div>'),
            mobile = window.localStorage.getItem('user_token'),
            handler;
        var fn;
        function checksign(){
            $.post('/User/Index/checkLogin',function(resp){
                if(resp.status){
                    fn && fn();
                }else{
                    setsign();
                }
            });
        }

        function getcode(){
            var mobile = $(".mod-signin .mobile").val();
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
        }

        $('body').on('click','.mod-signin a.getcode:not(.disabled)' , function(){
            getcode();
        }).on('click','.mod-signin button.check',function(){
            checkcode();
        }).on('click','.mod-signin a.close',function(){
            clear();
        });

        return function(v){
            fn = v;
            mobile ? checksign() : setsign();
        }
    }());

    /**
     * 使用腾讯地图 实时导航
     * @param to，目标位置
     */
    function nav(to){
        mapx.location.getPosition(function(d){
            if(d.status == 0){
                var from = mapx.proj.wgs2gcj(data.latitude , data.longitude);
                var route = 'http://navi.map.qq.com/nav/drive?start='+from.lng+','+from.lat+'&dest='+to.lng+','+to.lat+'&ref=mobilemap&nohighway=0&noround=0&notoll=0&traffic=1&cond=0&mt=0';
                $("#j_modal_nav iframe").attr('src' , route);
                $('body').addClass("mode-nav");
            }else{
                ui.alert("提示",d.detail);
            }
        })
    }

    /**
     * 生成star
     * @param el
     */
    function render_star(el){
        el.find(".star").each(function(){
            var el = $(this);
            var star = parseFloat(el.attr("data-star") || el.html());
            $('<i/>').prependTo(el).css({"paddingLeft":+(star * 20)+"%"})
        });
    }

    var feature = {
        'ios':!!navigator.userAgent.match(/mobile/i) && !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    }

    var mobile = ('ontouchstart' in  document.documentElement);
    var click = mobile ? "touchend" : 'click';
    var move = mobile ? "touchmove" : 'mousemove';
    var evt = {
        "down":mobile ? "touchstart" : 'click',
        "click":click,
        "move":move,
        "tap":"tap"
    };
    window.utils = {
        "format_poi" : format_poi,
        "format_data":format_data,
        "format_filter":format_filter,
        "format_detail":format_detail,

        "render_star":render_star,

        //"checkSession":checkSession,
        "feature":feature,

        "nav":nav,
        "evt":evt
    }
})();