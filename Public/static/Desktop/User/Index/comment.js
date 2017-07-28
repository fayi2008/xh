/*
 * Author:fay
 * Date:2016-03-30
 * desc:用户模块我的评论
 *
 * */
$(function() {
    function Comment_photo() {
        this.init = function() {
            ajax();
        };
        function ajax() {
            var start = $.getUrlParam("start") ? $.getUrlParam("start") :"0";
            $.getJSON("/user/comment.json", {
                module:2,
                start:start
            }).done(function(rs) {
                if (rs.data) {
                    view(rs.data);
                }
            });
        }
        function view(rs) {
            if (rs.data && rs.data.length) {
                var html = "";
                for (var i in rs.data) {
                    var datas = rs.data[i];
                    html += '<div class="comment-photo-item ' + (i % 2 == 0 ? "" :"item-r") + '">';
                    html += "<div>";
                    html += '<div class="comment-photo-time">';
                    html += "<span>发布评论</span>";
                    html += '<span class="comment-photo-times"></span>';
                    html += "</div>";
                    html += '<div class="comment-photo-content">';
                    html += datas.content;
                    html += "</div>";
                    html += '<div class="comment-photo-tool">';
                    //html += '<!--<div class="zan">点赞数：168</div>-->'
                    //html += '<div class="del"  data-id="'+datas.id+'">删除</div>'
                    html += "</div>";
                    html += '<a href="/photo/' + datas.module_id + '.html" class="comment-photo-img" style="background-image: url(' + $._LOCAL_IMGURL_(datas.file_url) + ')"></a>';
                    html += "</div>";
                    html += "</div>";
                }
                $(".comment-photo-box").append(html);
                page_view(rs.count);
            }
        }
        //页面跳转事件
        function href(opt) {
            var options = {
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0"
            };
            var opts = $.extend(options, opt);
            location.href = "/user/comment.html?start=" + opts.start;
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
            var start = $.getUrlParam("start"), day = $.getUrlParam("day"), ordertype = $.getUrlParam("ordertype");
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
    var comment_photo = new Comment_photo();
    comment_photo.init();
});