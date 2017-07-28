/*
 * Author:fay
 * Date:2016-03-30
 * desc:用户模块订单页
 *
 * */
$(function() {
    function Order() {
        this.init = function() {
            init();
        };
        function init() {
            var status = $.getUrlParam("status") ? $.getUrlParam("status") :"0", start = $.getUrlParam("start") ? $.getUrlParam("start") :"0";
            $(".status-list>div[data-type=" + status + "]").addClass("check").siblings().removeClass("check");
            $(".status-list>div").on("click", function() {
                var status = $(this).attr("data-type");
                href({
                    start:0,
                    status:status
                });
            });
            ajax();
        }
        function ajax() {
            var status = $.getUrlParam("status") ? $.getUrlParam("status") :"0", start = $.getUrlParam("start") ? $.getUrlParam("start") :"0";
            $.getJSON("/business/getorders.json", {
                status:status,
                limit:10,
                start:start
            }).done(function(rs) {
                if (rs.status) {
                    view(rs.data);
                }
            });
        }
        function view(rs) {
            if (rs.rows.length) {
                var html = "";
                for (var i in rs.rows) {
                    var datas = rs.rows[i];
                    var huo = JSON.parse(rs.rows[i].origin_data);

                    html += '<div class="item" data-id="' + datas.id + '">';
                    html += '<div class="item-img" style="background-image: url('+(huo.small_img? $._LOCAL_IMGURL_(huo.small_img):'')+')"></div>';
                    html += '<div class="item-content">';
                    html += '<div class=""><span class="item-title">订单号：</span><span class="item-show">' + datas.id + "</span></div>";
                    html += '<div><span class="item-title">商品名：</span><span class="item-show">' + huo.name + "</span></div>";
                    html += '<div><span class="item-title">购买数量：</span><span class="item-show">' + datas.num + "</span></div>";
                    html += '<div><span class="item-title">预定人：</span><span class="item-show">' + datas.booking_name + "</span></div>";
                    html += '<div><span class="item-title">预留电话：</span><span class="item-show">' + datas.mobile + "</span></div>";
                    html += "<div></div>";
                    html += "</div>";
                    html += '<div class="item-prize">';
                    html += "<div>总价</div>";
                    html += '<div class="price">￥' + datas.num * huo.price + "</div>";
                    html += '<div class="status">';
                    if (datas.trading_status == 0) {
                        html += '<div data-id="' + datas.id + '" class="o-btn pay-btn">去付款</div>';
                    }
                    if (datas.trading_status == 1) {
                        html += '<div data-id="' + datas.id + '"  class="o-btn qr-btn">确认收货</div>';
                    }
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                }
                $(".list-box").html(html);
                pay();
                qr();
            }
        }
        function pay() {
            $(".pay-btn").on("click", function() {
                var id = $(this).attr("data-id");
                location.href = "/business/pay_get.html?id=" + id;
            });
        }
        function qr() {
            $(".qr-btn").on("click", function() {
                var id = $(this).attr("data-id");
                $.XHalert({
                    content:"是否确认收货？",
                    yconfirm:1,
                    submit:function(self) {
                        self.close();

                        $.getJSON("/business/confirm.json", {
                            order_id:id
                        }, function(rs) {
                            if (rs.status == 1) {
                                $(".item[data-id=" + id + "]").remove();
                            }
                        }).complete(function() {
                            qr();
                        });
                    }
                });
            });
        }
        //页面跳转事件
        function href(opt) {
            var options = {
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0",
                status:$.getUrlParam("status") ? $.getUrlParam("status") :"0"
            };
            var opts = $.extend(options, opt);
            location.href = "/user/order.html?status=" + opts.status;
        }
    }
    var order = new Order();
    order.init();
});