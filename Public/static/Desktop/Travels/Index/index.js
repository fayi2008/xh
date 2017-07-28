/*
 * Author:fay
 * Date:2016-03-30
 * desc:游记模块列表页
 * */
$(function() {
    function Travels() {
        this.init = function() {
            $(".web-bar-way[data-type=travels]").addClass("now").siblings().removeClass("now");
            ajax();
            check();
        };
        function ajax() {
            var start = $.getUrlParam("start"), ordertype = $.getUrlParam("ordertype");
            $(".order-item[data-type=" + ordertype + "]").addClass("checked").siblings().removeClass("checked");
            $.getJSON("/travels.json", {
                start:start ? start :0,
                limit:15,
                ordertype:ordertype ? ordertype :"id"
            }).done(function(rs) {
                if (rs.status) {
                    view(rs.data);
                }
            });
        }
        function check() {
            $(".order-item").on("click", function() {
                var type = $(this).attr("data-type");
                //$(this).addClass('checked').siblings().removeClass('checked')
                href({
                    ordertype:type,
                    start:0
                });
            });
        }
        function view(rs) {
            if (rs.data.length) {
                var html = "";
                for (var i in rs.data) {
                    var datas = rs.data[i];
                    html += '<a class="travels-item ' + (i % 3 == 0 ? "no-left" :"") + '" href="/travels/' + datas.id + '.html">';
                    html += '<div class="travels-item-img" style="background-image: url(' + (datas.thumb ? $._LOCAL_IMGURL_(datas.thumb) :"/static/Desktop/Img/img.png") + ')"></div>';
                    html += '<div class="travels-item-content">';
                    html += '<div class="travels-item-title">' + datas.title + "</div>";
                    html += '<div class="travels-item-desc">' + ($._DELHTML_(datas.content).length > 200 ? $._DELHTML_(datas.content).substr(0, 200) + "..." :$._DELHTML_(datas.content)) + "</div>";
                    html += '<div class="travels-item-tool"><div class="zan">' + datas.support_num + '</div><div class="pl">' + datas.comment_count + "</div></div>";
                    html += "</div>";
                    html += '<div class="travels-item-author">';
                    html += '<div class="travels-item-avatar" style="background-image: url(' + (datas.head_img ? $._LOCAL_IMGURL_(datas.head_img) :"/static/Desktop/Img/user.png") + ')"></div>';
                    html += '<div class="travels-item-author-name">' + datas.nickname + "</div>";
                    html += '<div class="travels-item-day">' + $.formatDate(new Date(datas.create_time * 1e3), "yyyy-MM-dd") + "</div>";
                    html += "</div>";
                    html += "</a>";
                }
                $(".travels-list").html(html);
                page_view(rs.count);
            }
        }
        //页面跳转事件
        function href(opt) {
            var options = {
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0",
                ordertype:$.getUrlParam("ordertype") ? $.getUrlParam("ordertype") :"id"
            };
            var opts = $.extend(options, opt);
            location.href = "/travels/?start=" + opts.start + "&ordertype=" + opts.ordertype;
        }
        //分页计算渲染
        function page_view(count) {
            var nowpage = $.getUrlParam("start");
            var limit = 15;
            var page = Math.ceil(count / limit);
            var html = "";
            if (page > 5) {
                if (nowpage != 0) {
                    html += '<a page="dian">... </a>';
                }
                html += '<a class="now" page="' + nowpage / limit + '">' + +nowpage / limit + "</a>";
                if (+page - nowpage > 5) {
                    for (var i = 1; i < 5; i++) {
                        html += '<a page="' + (+nowpage + i) / limit + '">' + (+nowpage + i + 1) + "</a>";
                    }
                    html += '<a page="dian">...</a>';
                } else {
                    for (var i = 0; i < +page - nowpage / limit; i++) {
                        html += '<a page="' + i + '">' + i + "</a>";
                    }
                }
            } else if (page == 1) {
                $(".page-box").hide();
            } else {
                for (var i = 0; i < page; i++) {
                    html += '<a class="' + (nowpage / limit == i ? "now" :"") + '" page="' + i + '">' + (i + 1) + "</a>";
                }
            }
            $(".page-num").html(html);
            pages();
        }
        //分页点击事件
        function pages() {
            var start = $.getUrlParam("start"), day = $.getUrlParam("day"), ordertype = $.getUrlParam("ordertype");
            var limit = 15;
            $(".last-page").on("click", function() {
                if (+start > 0) {
                    var starts = +start - limit;
                    var data = {
                        start:starts
                    };
                    href(data);
                }
            });
            $(".next-page").on("click", function() {
                if (+start / limit < $(".page-num>a").length) {
                    var starts = +start + limit;
                    var data = {
                        start:starts
                    };
                    href(data);
                }
            });
            $(".page-num>a:not(.dian)").on("click", function() {
                var pages = $(this).attr("page") * limit;
                var data = {
                    start:pages
                };
                href(data);
            });
        }
    }
    var travels = new Travels();
    travels.init();
});