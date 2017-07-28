$(function () {
    var signin = xh.require('xh.ui.signin');
    function _wait() {
        this.init = function () {
            signin(function () {
                change()
                init(1)
                //dyinit(1)
                getLists()
                next()
                refesh()

            })
        };

        function refesh() {
            $('.refesh').on('click', function () {
                location.reload()
            })
        }

        function change() {
            $('.list-box>li').on('click', function () {
                var index = $(this).index()
                $(this).addClass('cur').siblings().removeClass('cur')
                $('.order-list-box>div:eq(' + index + ')').show().siblings().hide()
            })
        }

        function init(page) {
            var tel = localStorage.getItem('logomap_2_login')
            $.ajax({
                url: "/Service/User/requestTitle?page=" + page,
                dataType: "json",
                type: "get"
            }).done(function (rs) {
               // console.log(rs)
                if (rs.status) {
                    view(rs.data, page);
                } else {

                }
            })

        }

        function dyinit(page) {
            $.ajax({
                url: "/Service/User/requestGuide?page=" + page,
                dataType: "json",
                type: "get"
            }).done(function (rs) {
                //console.log(rs)
                if (rs.status) {
                    dyview(rs.data, page);
                } else {

                }
            })

        }

        function getLists(id) {
            $('.order-list').on('click', '.openlist', function () {
                var $this = $(this)

                $this.parent().parent().find('.shoplist').toggleClass('zhankai')
                if ($this.parent().parent().find('.shoplist').hasClass('zhankai')) {
                    $this.html('<span class="up"></span>详情')
                } else {
                    $this.html('<span class="down"></span>详情')

                }

            })
            $('.dy-order-list').on('click', '.openlist', function () {
                var $this = $(this)

                $this.parent().parent().find('.shoplist').toggleClass('zhankai')
                if ($this.parent().parent().find('.shoplist').hasClass('zhankai')) {
                    $this.html('<span class="up"></span>详情')
                } else {
                    $this.html('<span class="down"></span>详情')

                }

            })

        }

        function view(rs, page) {
            rs = rs || [];
            var html = ''
            if (page == 1 && rs.length == 0) {
                $('.order-list').html('<div class="none-list">您还没有意向商户，快去<a href="/pages/waiter/tour.html">体验</a>吧！</div>')
                return
            }
            for (var i in rs) {
                var datas = rs[i]
                //mapreturn(datas.lat,datas.lon)

                html += '<li rid="' + datas.id + '">'
                html += '<div class="title">' + (datas.auto_status == '0' ? '系统推荐订单' : '我发起的订单') + '<div oid="' + datas.id + '" class="openlist"><span class="down"></span>详情</div></div>'
                html += '<div class="content" rid="' + datas.id + '">'
                html += '<div>订单类型：<span class="red-font">' + (datas.request_type == '1' ? '我要吃' : '我要住') + '</span></div>'
                //html += '<div>发起地点：<span class="blue-font poi_'+datas.lat.replace('.','_')+datas.lon.replace('.','_')+'">'+datas.date_time+'</span> 附近</div>'
                html += '<div>发起时间：<span class="blue-font">' + datas.date_time + '</span></div>'

                if (datas.auto_status != '0') {
                    html += '<div>发送酒店：<span class="blue-font">' + datas.lists[0].name + '</span></div>'
                }

                var ispj = 0
                for (var j in datas.lists) {
                    if (datas.lists[j].eval_status != 1) {
                        if ( datas.lists[j].user_status == 2 || datas.lists[j].user_status == 4 || datas.lists[j].user_status == 5) {
                            ispj = 1

                        }
                    }else{
                        ispj =2
                    }

                }
                if (ispj == 1) {
                    html += '<a class="pj" href="/pages/waiter/pingjia.html?rid=' + datas.id + '&type=1">评价</a>'
                }else if(ispj==2){
                    html += '<div class="haspj">已评价</div>'
                }else{

                }


                html += '</div>'
                html += '<ul class="shoplist zhankai">' + listView(datas.lists, datas.id) + '</ul>'
                html += '</li>'

            }

            $('.order-list').append(html)
            if (rs.length > 9) {
                $('.next-page').show()

                $('.next-page').attr('page', page * 1 + 1)
            }
        }

        function dyview(rs, page) {
            var html = ''
            if (page == 1 && rs.length == 0) {
                $('.dy-order-list').html('<div class="none-list">您还没有导游订单，快去<a href="/pages/waiter/tour.html">体验</a>吧！</div>')
                return
            }
            for (var i in rs) {
                var datas = rs[i]
                //mapreturn(datas.lat,datas.lon)

                html += '<li rid="' + datas.id + '">'
                html += '<div class="title">导游订单<div oid="' + datas.id + '" class="openlist"><span class="down"></span>详情</div></div>'
                html += '<div class="content" rid="' + datas.id + '">'
                html += '<div>发起时间：<span class="blue-font">' + datas.date_time + '</span></div>'
                //html += '<div>发起地点：<span class="blue-font poi_'+datas.lat.replace('.','_')+datas.lon.replace('.','_')+'">'+datas.date_time+'</span> 附近</div>'
                var ispj = 0
                for (var j in datas.lists) {
                    if (datas.lists[j].eval_status != 1) {
                        if (datas.lists[j].user_status == 2 || datas.lists[j].user_status == 4 || datas.lists[j].user_status == 5) {
                            ispj = 1

                        }
                    }else{
                        ispj =2
                    }

                }

                if (ispj == 1) {
                    html += '<a class="pj" href="/pages/waiter/pingjia.html?rid=' + datas.id + '&type=2">评价</a>'
                }else if(ispj==2){
                    html += '<div class="haspj">已评价</div>'
                }else{

                }
                html += '</div>'
                html += '<ul class="shoplist zhankai">' + dylistView(datas.lists, datas.id) + '</ul>'
                html += '</li>'

            }

            $('.dy-order-list').append(html)
            if (rs.length > 9) {
                $('.dy-next-page').show()

                $('.dy-next-page').attr('page', page * 1 + 1)
            }
        }


        function mapreturn(lat, lng) {
            var url = 'http://api.map.baidu.com/geocoder/v2/?callback=?'
            $.getJSON(url, {
                ak: '1159a04bd74d50a16251757a2661ab88',
                output: 'json',
                pois: '1',
                coordtype: 'gcj02ll',
                location: lat + ',' + lng
            }).done(function (rs) {


                var poi = rs.result.formatted_address;
                $('.poi_' + lat.replace('.', '_') + lng.replace('.', '_')).html(poi)
                //now(poi)
            });

        }

        function next() {
            $('.next-page').on('click', function () {
                $(this).hide()
                var page = $(this).attr('page')
                init(page)
            })
            $('.dy-next-page').on('click', function () {
                $(this).hide()
                var page = $(this).attr('page')
                dyinit(page)
            })
        }

        function listView(rs, rid) {
            var html = ''
            var isnull=0
            for (var i in rs) {
                var datas = rs[i]

                if((+datas.admin_status)>0&&(+datas.admin_status)<6) {
                    html += '<li lat="' + datas.lat + '" lng="' + datas.lon + '" phone="' + datas.phone + '">'
                    html += '<a style="color:#4f9bc2;" href="tour.html?noloc#!detail/' + datas.poi_id + '">' + datas.name + '</a>'
                    html += '<span class="shop-status">' + tishi(datas.user_status) + '</span>'
                    html += '</li>'
                    isnull=1
                }
            }

            if(isnull==0){
                html='<li>没有商家响应</li>'
            }
            return html

        }

        function dylistView(rs, rid) {
            var html = ''
            var isnull=0
            for (var i in rs) {
                var datas = rs[i]
                if((+datas.admin_status)>0&&(+datas.admin_status)<6) {
                    html += '<li lat="' + datas.lat + '" lng="' + datas.lon + '" phone="' + datas.phone + '">'
                    html += '<a  style="color:#4f9bc2;" href="tour.html?noloc#!guide/' + datas.guide_id + '">' + datas.name + '</a>'
                    html += '<span class="shop-status">' + dytishi(datas.user_status) + '</span>'
                    html += '</li>'
                    isnull=1
                }
            }
            if(isnull==0){
                html='<li>没有导游响应</li>'
            }
            return html

        }

        function pingjia() {
            $('.order-list').on('click', '.pingjia', function () {
                var id = $(this).attr('oid')
                location.href = '/pages/waiter/pingjia.html?id=' + id
            })


        }

        function tishi(type) {
            switch (type) {
                case '0':
                    return '<span class="yes-order">未处理</span>';
                    break
                case '1':
                    return '<span class="no-order">正在处理</span>';
                    break;

                case '2':
                    return '<span class="yes-order">已达成意向</span>';
                    break;

                case '3':
                    return '<span class="no-order">未达成意向</span>';
                    break;
                case '4':
                    return '<span class="yes-order">商家确认您已到店消费</span>';
                    break;
                case '5':
                    return '<span class="no-order">商家确认您未到店消费</span>';
                    break;
                case '9':
                    return '<span class="no-order">系统取消订单</span>';
                    break;
                default:
                    return '<span class="no-order">无状态</span>';
                    break;
            }
        }

        function dytishi(type) {
            switch (type) {
                case '0':
                    return '<span class="yes-order">未处理</span>';
                    break
                case '1':
                    return '<span class="no-order">正在处理</span>';
                    break;

                case '2':
                    return '<span class="yes-order">已达成意向</span>';
                    break;

                case '3':
                    return '<span class="no-order">未达成意向</span>';
                    break;
                case '4':
                    return '<span class="yes-order">导游确认</span>';
                    break;
                case '5':
                    return '<span class="no-order">导游确认</span>';
                    break;
                case '9':
                    return '<span class="no-order">系统取消订单</span>';
                    break;
                default:
                    return '<span class="no-order">无状态</span>';
                    break;
            }
        }

    }

    var wait = new _wait();
    wait.init();
});