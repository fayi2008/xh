/*
 * Author:fay
 * Date:2016-03-30
 * desc：用户模块首页
 *
 * */
$(function() {
    function Index() {
        this.init = function() {
            ajax();
        };
        function ajax() {
            var start = $.getUrlParam("start") ? $.getUrlParam("start") :"0";
            $.getJSON("/user/collect.json", {
                start:start
            }).done(function(rs) {
                if (rs.status) {
                    view(rs.data);
                }
            });
        }
        function view(rs) {
            if (rs.data && rs.data.length) {
                var html = "";
                for (var i in rs.data) {
                    var datas = rs.data[i];
                    html += '<div  class="list-item">';
                    html += '<a href="/way/' + datas.id + '.html" class="way-img" style="background-image: url(' + $._LOCAL_IMGURL_(datas.image_uri) + ');"></a>';
                    html += '<div class="item-content">';
                    html += '<div class="name-bar"><a class="way-name" href="/way/' + datas.id + '.html">' + datas.title + "</a>";
                    html += '<span class="way-type">宗教文化</span><span class="way-type">自然景观</span><span class="way-type">饮食文化</span><span class="way-type">名胜古迹</span>';
                    html += "</div>";
                    html += '<div class="way-bar">';
                    html += '<span class="way-item-name">红权科技(杭州)有限公司</span><span class="way-finger"></span><span class="way-item-name">千岛湖建国酒店</span>';
                    html += "</div>";
                    html += '<div class="way-content">' + datas.introduction + "</div>";
                    html += '<div class="del" data-id="' + datas.id + '">取消收藏</div>';
                    html += "</div>";
                    html += "</div>";
                }
                $(".list-box").html(html);
                page_view(rs.count);
                collent();
            }
        }
        function collent() {
            $(".del").on("click", function() {
                var _this = $(this);
                var id = $(this).attr("data-id");
                $(".del").off("click")
                $.XHalert({
                    content:"是否取消收藏？",
                    yconfirm:1,
                    submit:function(self) {
                        self.close();
                        $.post("/user/collect.json", {
                            way:id
                        }, "json").done(function(rs) {
                            if (rs.status == 1) {
                                if (rs.data == 0) {
                                    _this.parent().parent().remove();
                                }
                            }
                        }).complete(function() {
                            collent();
                        });
                    },
                    cancel:function(self) {
                        self.close();
                    }
                });
            });
        }
        //页面跳转事件
        function href(opt) {
            var options = {
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0",
                ordertype:$.getUrlParam("ordertype") ? $.getUrlParam("ordertype") :"time"
            };
            var opts = $.extend(options, opt);
            location.href = "/user/travels.html?start=" + opts.start + "&ordertype=" + opts.ordertype;
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
    var index = new Index();
    index.init();
});