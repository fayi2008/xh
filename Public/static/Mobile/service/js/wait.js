$(function () {

    function _wait() {
        var todaypoi = {}, poi = {}
        this.init = function () {
            $(".next-page").hide();
            phone()
            init(1);
            kaiguan()
            qiehuan()
            lunxun()
            clicks();
            next();
        };
        function init(page) {

            $.ajax({
                url: "/Service/Business/lists?page=" + page,
                dataType: "json",
                type: "get"
            }).done(function (rs) {
                //alert(JSON.stringify(rs))
                if (rs.status) {
                    view(rs.data, page);
                } else {

                }
            }).fail(function (err) {
                //alert(JSON.stringify(err))
            })

        }
        function phone(){
            $.ajax({
                url: "/Service/Oauth/phonelist",
                dataType: "json",
                type: "get"
            }).done(function (rs) {
                if (rs.status) {
                    //alert(JSON.stringify(rs))
                    var list=''
                    for(var i in rs.data){

                        if(i==rs.data.length-1){
                            list+=rs.data[i].phone
                        }else{
                            list+=rs.data[i].phone+','
                        }
                    }

                    $('.user').html('与您绑定同一商户的用户有:'+list)
                } else {

                }
            }).fail(function(err){
                alert(JSON.stringify(err))
            })
        }
        function lunxun() {
            $.ajax({
                url: "/Service/Business/today",
                dataType: "json",
                type: "get"
            }).done(function (rs) {
                //alert(JSON.stringify(rs))
                if (rs.status) {
                    views(rs.data);

                    if(rs.last) {
                        var oldid = $('.new-dingdan').attr('aid')
                        if (oldid != rs.last.id) {
                            if (rs.last.admin_status == 6) {
                                $('.new-dingdan').html(tishis(rs.last.admin_status)).attr('aid', rs.last.id).show()
                                setTimeout(function () {
                                    $('.new-dingdan').hide()
                                }, 1000)
                            }
                        }
                    }
                    //alert(rs.sum+'********'+rs.did)
                    if(rs.sum&&rs.did){

                        $('.show-sum').html('今日收到来自用户的请求'+rs.sum+'次，抢单成功'+rs.did+'次')
                    }

                } else {

                }
            }).always(function () {
                setTimeout(function () {
                    lunxun()
                }, 2000)

            }).fail(function (err) {
                //alert(JSON.stringify(err))
            })
        }


        function views(rs) {

            var html = "";
            if (rs.length == 0) {
                html = '<div style="text-align: center;">暂时没有新的订单</div>'
                $(".today").html(html);
                return
            }



            for (var i in rs) {
                var datas = rs[i];

                if (todaypoi.length != rs.length) {
                    mapreturn(datas.lat, datas.lon, 'today')
                }
                var poi_zb={
                    lat:datas.p_lat,lng:datas.p_lon
                    },
                    user_zb={
                        lat:datas.lat,lng:datas.lon
                    }
                var class_type='住宿'

                if(datas.request_type==1){
                    class_type='餐饮'
                }
                var juli=distance(poi_zb,user_zb)
                //alert(distance(poi_zb,user_zb))
                html += '<li oid="' + datas.id + '" class="' + (datas.auto_status == 1 ? "qiang" : "") + '">';
                html += '<div class="title">'
                + datas.poi_name
                + '('
                    + (datas.auto_status == 1 ? ("<i class='red-font'>用户主动"+class_type+"请求</i>") : "系统推荐"+class_type+"请求")
                + ')</div>';
                html += '<div class="show">订单时间：<i>' + datas.date_time + "</i></div>"
                html += "<div class='poi-box'>发送位置：<span class='blue-font poi_" + datas.lat.replace('.', '_') + datas.lon.replace('.', '_') + "'>" + todaypoi['poi_' + datas.lat.replace('.', '_') + datas.lon.replace('.', '_')] + "</span> 附近</div>";
                html+='<div class="poi-box">离店距离：<span class="blue-font">'+parseInt(juli)+'米</span></div>'
                html += '<div class="btn-box" request_id="' + datas.request_id + '" tel="' + datas.phone + '" oid="' + datas.id + '">';
                var usr= datas.user_status;
                switch (datas.admin_status) {
                    case "0":
                        html += onehtml(datas);
                        break;

                    case "1":
                        html += twohtml(datas.phone);
                        break;

                    case "2":
                        html += three(datas.phone,usr);
                        break;

                    case "3":
                        html += tishi(1,undefined,usr);
                        break;

                    case "4":
                        html += tishi(4, datas.phone,usr);
                        break;
                    case "5":
                        html += tishi(5, datas.phone,usr);
                        break;
                    case "6":
                        html += tishi(6, datas.phone,usr);
                        break;
                    case "9":
                        html += tishi(9, datas.phone);
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
            if (rs.length == 0 && page == 1) {
                html = '<div style="text-align: center;">暂时没有历史订单</div>'
                $(".history").html(html);
                return
            }
            for (var i in rs) {
                var datas = rs[i];
                if (todaypoi.length != rs.length) {
                    mapreturn(datas.lat, datas.lon, 'list')
                }
                var poi_zb={
                        lat:datas.p_lat,lng:datas.p_lon
                    },
                    user_zb={
                        lat:datas.lat,lng:datas.lon
                    }

                var class_type='住宿'

                if(datas.request_type==1){
                    class_type='餐饮'
                }

                var juli=distance(poi_zb,user_zb)
                html += '<li oid="' + datas.id + '" class="' + (datas.auto_status == 1 ? "qiang" : "") + '">';
                html += '<div class="title">' + datas.poi_name + '(' + (datas.auto_status == 1 ? "<i class='red-font'>用户主动"+class_type+"请求</i>" : "系统推荐"+class_type+"请求") + ')</div>'
                html += '<div class="show">订单时间：<i>' + datas.date_time + "</i></div>"
                html += "<div class='poi-box'>发送定位：<span class='blue-font poi_" + datas.lat.replace('.', '_') + datas.lon.replace('.', '_') + "'>" + poi['poi_' + datas.lat.replace('.', '_') + datas.lon.replace('.', '_')] + "</span> 附近</div>";
                html+='<div class="poi-box">离店距离：<span class="blue-font">'+parseInt(juli)+'米</span></div>'
                html += '<div class="btn-box" tel="' + datas.phone + '" oid="' + datas.id + '" request_id="' + datas.request_id + '">';
                var usr = datas.user_status;
                switch (datas.admin_status) {
                    case "0":
                        html += onehtml(datas);
                        break;

                    case "1":
                        html += twohtml(datas.phone);
                        break;

                    case "2":

                        html += three( datas.phone , usr);
                        break;

                    case "3":
                        html += tishi(1,undefined,usr);
                        break;
                    case "4":
                        html += tishi(4, datas.phone,usr);
                        break;
                    case "5":
                        html += tishi(5, datas.phone,usr);
                        break;
                    case "6":
                        html += tishi(6, datas.phone,usr);
                        break;
                    case "9":
                        html += tishi(9, datas.phone);
                        break;
                    default:
                        html += tishi(0);
                        break;
                }
                html += "</div>";
                html += "</li>";
            }
            html += '<div class="next-page" page="' + (page * 1 + 1) + '">下一页</div>'
            $(".history").append(html);
            next()

        }

        function next() {
            $(".next-page").on("click", function () {
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
            var html = '<div class="two"><a class="btn btn-yel tel" href="tel:' + tel + '" type="">联系客户</a></div>';

            html += '<div class="three"><span class="btn btn-status btn-blud agree-to" type="2">达成意向</span><span class="btn btn-status btn-red refuse-to"  type="3">未达成意向</span></div>';
            return html;
        }

        function three(tel,usr) {
            var html = "";
            if(usr == 3) html += "<div class='status'><span class='c_r'>用户未达成意向</span>，<span class='c_g'>商家达成意向</span></div>";
            else if(usr == 2) html += "<div class='status'><span class='c_g'>双方达成意向</span></div>";
            html += '<div class="two"><a class="btn btn-yel tel" href="tel:' + tel + '" type="">联系客户</a></div>';
            html += '<div class="three"><span class="btn btn-status btn-blud agree-to" type="4">确认到店</span><span class="btn btn-status btn-red refuse-to"  type="5">未到店</span></div>';
            return html;
        }

        //判断订单状态
        function tishi(type , tel , usr){
            // admin_status 3
            var html;
            if(type == 1){
                if(usr == 2) html = "<span class='c_g'>用户达成意向</span>，<span class='c_r'>商家未达成意向</span>";
                else if(usr == 3) html = "<span class='c_r'>双方未达成意向</span>";
            }else if(type==4){
                if(usr == 2) html = "<span class='c_g'>用户达成意向</span>，<span class='c_g'>商家确定到店消费</span>";
                else if(usr == 3) html = "<span class='c_r'>用户未达成意向</span>，<span class='c_g'>商家确定到店消费</span>";
            }else if(type==5){
                if(usr == 2) html = "<span class='c_g'>用户达成意向</span>,<span class='c_r'>商家确定未到店消费</span>";
                else if(usr == 3) html = "<span class='c_r'>用户未达成意向</span>，<span class='c_r'>商家确定未到店消费</span>";
            }
            if(html) return "<div class='status'>"+html+"</div>";

            switch (type) {
                case 0:
                    return '<div class="no-order">待抢单</div>';
                    break;

                case 1:
                    return '<div class="no-order">未与客户达成意向</div>';
                    break;

                case 2:
                    return '<div class="two"><a class="btn btn-yel tel" href="tel:' + tel + '" type="">联系客户</a></div>';
                    break;

                case 3:
                    return '<div class="no-order">订单已被客户取消</div>';
                    break;
                case 5:
                    return '<div class="no-order">未到店消费</div>';
                    break;
                case 4:
                    return '<div class="two"><a class="btn btn-yel tel" href="tel:' + tel + '" type="">联系客户</a></div><div class="yes-order">商家已确认客户到店</div>';
                    break;
                case 6:
                    return '<div class="no-order">已被抢单</div>';
                    break;
                case 9:
                    return '<div class="no-order">已失效</div>'
                    break;
                default:
                    return '<div class="no-order">无状态</div>';
                    break;
            }
        }
        function tishi2(type, tel) {
            switch (type) {
                case 0:
                    return '<div class="no-order">待抢单</div>';
                    break;

                case 1:
                    return '<div class="no-order">未与客户达成意向</div>';
                    break;

                case 2:
                    return '<div class="two"><a class="btn btn-yel tel" href="tel:' + tel + '" type="">联系客户</a></div>';
                    break;

                case 3:
                    return '<div class="no-order">订单已被客户取消</div>';
                    break;
                case 5:
                    return '<div class="no-order">未到店消费</div>';
                    break;
                case 4:
                    return '<div class="two"><a class="btn btn-yel tel" href="tel:' + tel + '" type="">联系客户</a></div><div class="yes-order">商家已确认客户到店</div>';
                    break;
                case 6:
                    return '<div class="no-order">已被抢单</div>';
                    break;
                case 9:
                    return '<div class="no-order">已失效</div>'
                    break;
                default:
                    return '<div class="no-order">无状态</div>';
                    break;
            }
        }
        // 判断最近一条订单的状态
        function tishis(type) {
            switch (type) {
                case 0:
                    return '最近一条订单 <span class="no-order">正在抢单</span>'
                    break;
                case 1:
                    return '最近一条订单 <span class="no-order">已抢单</span>'


                    break;

                case 2:
                    return '最近一条订单 <span class="no-order">已达成协议</span>'
                    break;

                case 3:
                    return '最近一条订单 <span class="no-order">未达成协议</span>'
                    break;
                case 4:
                    return '最近一条订单 <span class="no-order">未确认</span>'
                    break;
                case 5:
                    return '最近一条订单<span class="no-order">已确认</span>'
                    break;

                case 6:
                    return '最近一条订单 已被其他用户抢单'
                    break;
                case 9:
                    return '最近一条订单 <span class="no-order">已失效</span>'
                    break;
                default:
                    return '最近一条订单 <span class="no-order">无状态</span>'
                    break;
            }
        }

        function clicks() {
            $(".order-list").on("click", ".btn-status", function () {
                var $this = $(this), ele = $this.parent().parent();
                var type = $(this).attr("type"),
                    id = ele.attr("oid"),
                    tel = ele.attr("tel"),
                    time = $('#time').val(),
                    request_id=ele.attr('request_id')

                $(".order-list").off("click", ".btn-status")
                /*alert(JSON.stringify({
                    id: id,
                    status: type,
                    request_id:request_id
                }));*/
                $.ajax({
                    url: "/Service/Business/response",
                    data: {
                        id: id,
                        status: type,
                        request_id:request_id
                    },
                    dataType: "json",
                    type: "get"
                }).done(function (rs) {
                    //alert(JSON.stringify(rs))
                    if (rs.status) {
                        //switch (type) {
                        //    case "1":
                        //        ele.html(twohtml(tel));
                        //        break;
                        //
                        //    case "2":
                        //
                        //        ele.html(tishi(2, tel));
                        //        break;
                        //
                        //    case "3":
                        //
                        //        ele.html(tishi(1));
                        //        break;
                        //
                        //    case "4":
                        //        ele.html(tishi(4, tel));
                        //        break;
                        //}
                    } else {
                        //alert(rs.info)
                    }
                }).complete(function () {
                    clicks()
                })

            })


        }


        function qiehuan() {
            $('.type>li').on('click', function () {
                var index = $(this).index()
                $(this).addClass('cur').siblings().removeClass('cur')
                $('.list-box').find('ul:eq(' + index + ')').show().siblings().hide()
            })

        }

        function mapreturn(lat, lng, type) {

            var url = 'http://api.map.baidu.com/geocoder/v2/?callback=?'
            $.getJSON(url, {
                ak: '1159a04bd74d50a16251757a2661ab88',
                output: 'json',
                pois: '1',
                coordtype: 'gcj02ll',
                location: lat + ',' + lng
            }).done(function (rs) {

                //console.log(rs)
                var poi = rs.result.formatted_address;
                $('.poi_' + lat.replace('.', '_') + lng.replace('.', '_')).html(poi)
                if (type == 'today') {


                    todaypoi['poi_' + lat.replace('.', '_') + lng.replace('.', '_')] = poi
                } else {
                    poi['poi_' + lat.replace('.', '_') + lng.replace('.', '_')] = poi
                }


                //now(poi)
            });


        }

        function kaiguan() {
            if (receive_status == '1') {
                $('.isorder').removeClass('noorder')
            } else {
                $('.isorder').addClass('noorder')
            }

            $('.isorder').on('click', function () {
                var $this = $(this)
                $.ajax({
                    url: '/Service/Oauth/switchReceive',
                    dataType: "json",
                    type: "get"
                }).done(function (rs) {
                    if (rs.status) {
                        if (rs.receive_status == '1') {
                            $this.removeClass('noorder')
                        } else {
                            $this.addClass('noorder')
                        }
                    }
                })


            })
        }

        function distance(p1 , p2){
            var toRad = Math.PI / 180 , toDeg = 180 / Math.PI;
            var EARTH_RADIUS = 6378137.0 , PI = Math.PI;

            var lat1 = p1.lat , lng1 = p1.lng , lat2 = p2.lat , lng2 = p2.lng;
            lat1 = lat1 * toRad;
            lat2 = lat2 * toRad;$

            var a = lat1 - lat2;
            var b = lng1 * toRad - lng2 * toRad;

            var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(b / 2), 2)));
            s = s * 6378137;
            s = Math.round(s * 10000) / 10000.0;
            return s;
        }

    }

    var wait = new _wait();
    wait.init();
});