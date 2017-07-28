/*
 * Author:fay
 * Date:2016-03-30
 * desc:新闻模块列表页
 *
 * */
$(function() {
    function NewList() {
        this.init = function() {
            $(".web-bar-way[data-type=culture]").addClass("now").siblings().removeClass("now");
            cate_view();
            ajax();
        };
        function cate_view() {
            var rs = window.LIST_CATE;
            var html = '<div data-type="0" class="cate-item">全部</div>';
            for (var i in rs) {
                var datas = rs[i];
                if (rs.length > 8) {
                    if (i < 6) {
                        var html1 = '<div data-type="' + datas.id + '" class="cate-item">' + datas.name + "</div>";
                        $(".list").append(html1);
                    } else {
                        var html2 = '<div data-type="' + datas.id + '" class="cate-item">' + datas.name + "</div>";
                        $(".more-list").append(html2);
                    }
                }
                if (rs.length <= 7) {
                    html += '<div data-type="' + datas.id + '" class="cate-item">' + datas.name + "</div>";
                }
            }
            if (rs.length <= 8) {
                $(".tips-bar").html(html);
            }
            var cate = $.getUrlParam("cate") ? $.getUrlParam("cate") :0;
            $(".cate-item[data-type=" + cate + "]").addClass("check").siblings().removeClass("check");
            $(".cate-item").on("click", function() {
                var cate = $(this).attr("data-type");
                href({
                    cate:cate,
                    start:0
                });
            });
        }
        function ajax() {
            var cate = $.getUrlParam("cate") ? $.getUrlParam("cate") :0, start = $.getUrlParam("start") ? $.getUrlParam("start") :0;
            $.getJSON("/culture/news.json", {
                cate:cate,
                start:start,
                limit:20
            }).done(function(rs) {
                if (rs) {
                    view(rs.data);
                }
            });
        }
        function view(rs) {
            if (rs.data.length) {
                var html = "";
                for (var i in rs.data) {
                    var datas = rs.data[i];
                    html += '<a href="/culture/news/' + datas.id + '.html" class="item">';
                    html += '<div class="item-img" style="background-image: url(' + $._LOCAL_IMGURL_(datas.thumbnails) + ')"></div>';
                    html += '<div class="item-title">' + datas.title + "</div>";
                    html += '<div class="item-time">' + datas.datatime + "</div>";
                    html += '<div class="item-desc">' + ($._DELHTML_(datas.content).length > 180 ? $._DELHTML_(datas.content).substr(0, 175) + "..." :$._DELHTML_(datas.content)) + "</div>";
                    html += "</a>";
                }
                $(".list-box").html(html);
                page_view(rs.count);
            }
        }
        //页面跳转事件
        function href(opt) {
            var options = {
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0",
                cate:$.getUrlParam("cate") ? $.getUrlParam("cate") :"0"
            };
            var opts = $.extend(options, opt);
            location.href = "/culture/news/list.html?start=" + opts.start + "&cate=" + opts.cate;
        }
        //分页计算渲染
        function page_view(count) {
            var nowpage = $.getUrlParam("start");
            var limit = 20;
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
            var start = $.getUrlParam("start");
            var limit = 20;
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
    var newlist = new NewList();
    newlist.init();
});