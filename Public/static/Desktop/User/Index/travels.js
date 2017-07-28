/*
 * Author:fay
 * Date:2016-03-30
 * desc:用户模块我的游记
 *
 * */
$(function() {
    function Travels() {
        var START = $.getUrlParam("start");
        this.init = function() {
            ajax();
        };
        function ajax() {
            var start = START ? START :0;
            $.getJSON("/user/travels.json", {
                start:start,
                limit:15
            }).done(function(rs) {
                if (rs.status == 1) {
                    view(rs.data);
                }
            });
        }
        function view(rs) {
            if (rs && rs.data && rs.data.length) {
                var html = "";
                for (var i in rs.data) {
                    var datas = rs.data[i];
                    var img = datas.thumb ? $._LOCAL_IMGURL_(datas.thumb) :"/static/Desktop/Img/img.png";
                    html += '<div data-id="' + datas.id + '" class="travels-item ' + (i % 3 == 0 ? "no-left" :"") + '">';
                    html += '<a href="/travels/' + datas.id + '.html?owner=1" class="travels-item-img" style="background-image: url(' + img + ')"></a>';
                    html += '<div class="travels-item-content">';
                    html += '<div class="travels-item-title">' + datas.title + "</div>";
                    html += '<div class="travels-item-desc">' + ($._DELHTML_(datas.content).length > 50 ? $._DELHTML_(datas.content).substr(0, 50) :$._DELHTML_(datas.content)) + "</div>";
                    html += '<div class="travels-item-tool">';
                    html += '<div class="zan">点赞(' + datas.support_num + ")</div>";
                    html += '<div class="pl">评论(' + datas.comment_count + ")</div>";
                    html += '<div class="del" data-id="' + datas.id + '"></div>';
                    html += "</div>";
                    html += "</div>";
                    //html += '<div class="travels-item-author">'
                    //html += '<div class="travels-item-avatar" style="background-image: url(index/20151029/2015-10-29-16-21-196.jpg)"></div>'
                    //html += '<div class="travels-item-author-name">ward</div>'
                    //html += '<div class="travels-item-day">NaN-aN-aN</div>'
                    //html += '</div>'
                    html += "</div>";
                }
                $(".travels-list").html(html);
                page_view(rs.count);
                del();
            }
        }
        function del() {
            $(".del").off("click").on("click", function() {
                var id = $(this).attr("data-id");
                $.XHalert({
                    content:"是否删除？",
                    yconfirm:1,
                    submit:function(self) {
                        self.close();
                        $(".del").off("click");
                        $.getJSON("/travels/delete?id=" + id).done(function(rs) {
                            if (rs.status) {
                                location.reload();
                            }
                        }).complete(function() {
                            del();
                        });
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
    var travels = new Travels();
    travels.init();
});