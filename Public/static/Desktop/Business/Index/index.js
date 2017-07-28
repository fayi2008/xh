/*
 * Author:fay
 * Date:2016-03-30
 * desc:商务模块商家列表页
 *
 * */
$(function() {
    function Index() {
        this.init = function() {
            $(".web-bar-way[data-type=business]").addClass("now").siblings().removeClass("now");
            ajax();
            change();
        };
        function ajax() {
            var start = $.getUrlParam("start") ? $.getUrlParam("start") :0, tag = $.getUrlParam("tag") ? $.getUrlParam("tag") :"2";
            var limit = $.getUrlParam("limit") ? $.getUrlParam("limit") :15;
            $(".order-item[data-type=" + tag + "]").addClass("check").siblings().removeClass("check");
            $.getJSON("/business/merchantlist.json", {
                start:start,
                limit:limit,
                tag:tag
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
                    recommend_icon='';
                    if(datas.recommend==1)
                    {
                        recommend_icon="<img src='/assets/images/recommend.gif' />";
                    }
                    var pano = datas.pano_key ? '<span class="d3tips"></span>' :"";
                    html += '<a href="/business/' + datas.id + '.html" class="shop-item ' + (i % 3 == 0 ? "no-l" :"") + '">';
                    html += '<div class="shop-img" style="background-image: url(' + $._LOCAL_IMGURL_(datas.image) + ')"></div>';
                    html += '<div class="shop-desc">';
                    html += '<div class="shop-name">' + datas.name + pano + recommend_icon +"</div>";
                    html += '<div class="shop-addr">地址：' + (datas.address.length > 11 ? datas.address.substr(0, 12) + "..." :datas.address) + "</div>";
                    html += '<div class="shop-tel">电话：' + datas.phone + "</div>";
                    html += "</div>";
                    html += "</a>";
                }
                $(".shop-list").html(html);
                page_view(rs.results);
            }
        }
        function change() {
            $(".order-item").on("click", function() {
                var tag = $(this).attr("data-type");
                href({
                    start:0,
                    tag:tag
                });
            });
        }
        //页面跳转事件
        function href(opt) {
            var options = {
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0",
                tag:$.getUrlParam("tag") ? $.getUrlParam("tag") :"2"
            };
            var opts = $.extend(options, opt);
            location.href = "/business/?start=" + opts.start + "&tag=" + opts.tag;
        }
        //分页计算渲染
        function page_view(count) {
            var offset = $.getUrlParam("start");
            var limit = 15;
            var nowpage = 1+offset / limit;
            var page = Math.ceil(count / limit);
            var html = "";
            if (page > 5) {
                if (nowpage > 3) {
                    if((nowpage-5)>0)
                    {
                        html += '<a page="' + (nowpage-5) + '">... </a>';
                    }else{
                        html += '<a page="1">... </a>';
                    }
                    html += '<a page="' + (nowpage-2) + '">' + (nowpage-2) + "</a>";
                    html += '<a page="' + (nowpage-1) + '">' + (nowpage-1) + "</a>";
                    html += '<a class="now" page="' + nowpage + '">' + nowpage + "</a>";
                    if (page - nowpage > 2) {
                        for (var i = 1; i < 3; i++) {
                            html += '<a page="' + (+nowpage + i) + '">' + (+nowpage + i) + "</a>";
                        }
                        if((nowpage+5)>page)
                        {
                            html += '<a page="' + page + '">...</a>';
                        }else{
                            html += '<a page="' + (nowpage+5) + '">...</a>';
                        }
                    } else {
                        for (var i = 1; i < (+page - nowpage+1); i++) {
                            html += '<a page="' + (nowpage+i) + '">' + (nowpage+i) + "</a>";
                        }
                    }
                }else{
                    for (var i = 1; i < (nowpage+1); i++) {
                        html += '<a class="' + (nowpage== i ? "now" :"") + '" page="' + i + '">' + i + "</a>";
                    }
                    for (var i = 1; i < (+5 - nowpage+1); i++) {
                        html += '<a page="' + (nowpage+i) + '">' + (nowpage+i) + "</a>";
                    }
                    if((nowpage+5)>page)
                    {
                        html += '<a page="' + page + '">...</a>';
                    }else{
                        html += '<a page="' + (nowpage+5) + '">...</a>';
                    }
                }
            } else if (page == 1) {
                $(".page-box").hide();
            } else {
                for (var i = 0; i < page; i++) {
                    html += '<a class="' + (nowpage== (i+1) ? "now" :"") + '" page="' + (i+1) + '">' + (i + 1) + "</a>";
                }
            }
            $(".page-num").html(html);
            pages();
        }
        //分页点击事件
        function pages() {
            var start = $.getUrlParam("start");
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
                var pages = ($(this).attr("page")-1) * limit;
                var data = {
                    start:pages
                };
                href(data);
            });
        }
    }
    var index = new Index();
    index.init();
});