$(function() {

    function _wait() {
        var todaypoi={},poi={}
        this.init = function() {

            $(".next-page").hide();
            init(1);
            kaiguan()
            qiehuan()
            lunxun()
            clicks();
            next();
        };
        function init(page) {

            $.ajax({
                url:"/Guide/Receive/lists?page="+page,
                dataType:"json",
                type:"get"
            }).done(function(rs) {

                if (rs.status) {
                    view(rs.data,page);
                }else{

                }
            })

        }

        function lunxun(){
            $.ajax({
                url:"/Guide/Receive/today",
                dataType:"json",
                type:"get"
            }).done(function(rs) {
                //alert(JSON.stringify(rs))
                if (rs.status) {
                    views(rs.data);
                }else{

                }
            }).always(function(){
                setTimeout(function(){
                    lunxun()
                },2000)

            }).fail(function(err){
                alert(JSON.stringify(err))
            })
        }



        function views(rs){

            var html = "";
            if(rs.length==0){
                html='<div style="text-align: center;">暂时没有新的订单</div>'
                $(".today").html(html);
                return
            }
            for (var i in rs) {
                var datas = rs[i];

                if(todaypoi.length!=rs.length){
                    mapreturn(datas.lat,datas.lon,'today')
                }

                html += '<li oid="' + datas.id + '" class="' + (datas.auto_status == 1 ? "qiang" :"") + '">';
                html+='<div class="title">'+datas.poi_name+ '('+ (datas.auto_status == 1 ? "<i class='red-font'>用户主动请求</i>" :"系统推荐请求") +')</div>'
                html += '<div class="show">于 <i>' + datas.date_time + "</i> 收到来自 <i>" + datas.name + "</i>的预定</div>"
                html +="<div class='poi-box'>发送定位：<span class='blue-font poi_"+datas.lat.replace('.','_')+datas.lon.replace('.','_')+"'>"+todaypoi['poi_'+datas.lat.replace('.','_')+datas.lon.replace('.','_')]+"</span> 附近</div>";
                html+='<div class="poi-box">预约时间：<span class="blue-font">'+datas.book_time+'</span></div>'
                html += '<div class="btn-box" request_id="'+datas.request_id+'" tel="' + datas.phone + '" oid="' + datas.id + '">';
                switch (datas.admin_status) {
                    case "0":
                        html += onehtml(datas);
                        break;

                    case "1"://已抢单
                        html += twohtml(datas.phone);
                        break;

                    case "2"://达成意向
                        html += three(datas.phone);
                        break;

                    case "3"://未达成意向
                        html += tishi(3);
                        break;

                    case "4":
                        html += tishi(4,datas.phone);
                        break;
                    case "5":
                        html += tishi(5,datas.phone);
                        break;
                    default:
                        html += tishi(0);
                        break;
                }
                html += "</div>";
                html += "</li>";
            }
            $(".today").html(html);
        }
        function view(rs, page) {
            var html = "";
            if(rs.length==0&&page==1){
                html='<div style="text-align: center;">暂时没有历史订单</div>'
                $(".history").html(html);
                return
            }
            for (var i in rs) {
                var datas = rs[i];
                if(todaypoi.length!=rs.length){
                    mapreturn(datas.lat,datas.lon,'list')
                }
                html += '<li oid="' + datas.id + '" class="' + (datas.auto_status == 1 ? "qiang" :"") + '">';
                html+='<div class="title">'+datas.poi_name+ '('+ (datas.auto_status == 1 ? "<i class='red-font'>用户主动请求</i>" :"系统推荐请求") +')</div>'
                html += '<div class="show">于 <i>' + datas.date_time + "</i> 收到来自 <i>" + datas.name + "</i>的预定</div>"
                html +="<div class='poi-box'>发送定位：<span class='blue-font poi_"+datas.lat.replace('.','_')+datas.lon.replace('.','_')+"'>"+poi['poi_'+datas.lat.replace('.','_')+datas.lon.replace('.','_')]+"</span> 附近</div>";
                html+='<div class="poi-box">预约时间：<span class="blue-font">'+datas.book_time+'</span></div>'
                html += '<div class="btn-box" request_id="'+datas.request_id+'" tel="' + datas.phone + '" oid="' + datas.id + '">';
                switch (datas.admin_status) {
                    case "0":
                        html += onehtml(datas);
                        break;

                    case "1":
                        html += twohtml(datas.phone);
                        break;

                    case "2":

                        html += three(datas.phone);
                        break;

                    case "3":
                        html += tishi(3);
                        break;
                    case "4":
                        html += tishi(4,datas.phone);
                        break;
                    case "5":
                        html += tishi(5,datas.phone);
                        break;
                    default:
                        html += tishi(0);
                        break;
                }
                html += "</div>";
                html += "</li>";
            }
            html+='<div class="next-page" page="'+(page*1+1)+'">下一页</div>'
            //alert(html)
            $(".history").append(html);
            next()

        }
        function next() {
            $(".next-page").on("click", function() {
                var page = $(this).attr("page");
                $(this).remove();
                init(page);
            });

        }
        function onehtml() {
            var html = '<div class="one"><span class="btn btn-status btn-red order-agree" type="1">抢单</span>'
            return html;
        }
        function twohtml(tel) {
            var html = '<div class="two"><a class="btn btn-yel tel" href="tel:'+tel+'" type="">联系客户</a></div>';
            html+='<div class="three"><span class="btn btn-status btn-blud agree-to" type="2">达成意向</span><span class="btn btn-status btn-red refuse-to"  type="3">未达成意向</span></div>';
            return html;
        }
        function three(tel) {
            var html = '<div class="two"><a class="btn btn-yel tel" href="tel:' + tel + '" type="">联系客户</a></div>';
            html += '<div class="three"><span class="btn btn-status btn-blud agree-to" type="4">已提供服务</span><span class="btn btn-status btn-red refuse-to"  type="5">未提供服务</span></div>';
            return html;
        }
        function tishi(type,tel) {
            switch (type) {
                case 1:
                    return '<div class="no-order">未与客户达成意向</div>';
                    break;

                case 2:

                    return '<div class="two"><a class="btn btn-yel tel" href="tel:'+tel+'" type="">联系客户</a></div><div class="yes-order">已与客户达成意向</div>';
                    break;

                case 3:
                    return '<div class="no-order">未达成意向</div>';
                    break;
                case 4:
                    return '<div class="two"><a class="btn btn-yel tel" href="tel:'+tel+'" type="">联系客户</a></div><div class="yes-order">已提供服务</div>';
                    break;
                case 5:
                    return '<div class="two"><a class="btn btn-yel tel" href="tel:'+tel+'" type="">联系客户</a></div><div class="yes-order">未提供服务</div>';
                    break;
                default:
                    return '<div class="no-order">无状态</div>';
                    break;
            }
        }
        function clicks() {
            $(".order-list").on("click", ".btn-status", function() {
                var $this = $(this), ele = $this.parent().parent();
                var type = $(this).attr("type"), id = ele.attr("oid"), tel = ele.attr("tel"),request_id=ele.attr('request_id')


                $.ajax({
                    url:"/Guide/Receive/response",
                    data:{
                        id:id,
                        status:type,
                        request_id:request_id
                    },
                    dataType:"json",
                    type:"get"
                }).done(function(rs) {


                    //alert(JSON.stringify(rs))
                    //alert(JSON.stringify(rs))
                    if (rs.status) {
                        //switch (type) {
                        //    case "1":
                        //        ele.html(twohtml(tel));
                        //        break;
                        //
                        //    case "2":
                        //        ele.html(three(tel));
                        //        break;
                        //
                        //    case "3":
                        //        ele.html(tishi(3));
                        //        break;
                        //
                        //    case "4":
                        //        ele.html(tishi(4,tel));
                        //        break;
                        //    case "5":
                        //        ele.html(tishi(5,tel));
                        //        break;
                        //}
                    }else{
                        alert(rs.info)
                    }
                }).fail(function(err){
                    alert(JSON.stringify(err))
                })
            });

        }


        function qiehuan(){
            $('.type>li').on('click',function(){
                var index=$(this).index()
                $(this).addClass('cur').siblings().removeClass('cur')
                $('.list-box').find('ul:eq('+index+')').show().siblings().hide()
            })

        }

        function mapreturn(lat,lng,type){

            var url='http://api.map.baidu.com/geocoder/v2/?callback=?'
            $.getJSON(url,{ak:'1159a04bd74d50a16251757a2661ab88',output:'json',pois:'1',coordtype:'gcj02ll',location:lat+','+lng}).done(function(rs){

                //console.log(rs)
                var poi = rs.result.formatted_address;
                $('.poi_'+lat.replace('.','_')+lng.replace('.','_')).html(poi)
                if(type=='today'){


                    todaypoi['poi_'+lat.replace('.','_')+lng.replace('.','_')]=poi
                }else{
                    poi['poi_'+lat.replace('.','_')+lng.replace('.','_')]=poi
                }


            });


        }

        function kaiguan(){
            if(receive_status=='1'){
                $('.isorder').removeClass('noorder')
            }else{
                $('.isorder').addClass('noorder')
            }

            $('.isorder').on('click',function(){
                var $this=$(this)
                $.ajax({
                    url:'/Guide/Receive/slide_receive',
                    dataType:"json",
                    type:"get"
                }).done(function(rs){
                    //alert(JSON.stringify(rs))
                    if(rs.status){
                        if(rs.receive_status=='1'){
                            $this.removeClass('noorder')
                        }else{
                            $this.addClass('noorder')
                        }
                    }
                })


            })
        }

    }
    var wait = new _wait();
    wait.init();
});