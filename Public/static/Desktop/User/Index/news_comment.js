/*
 * Author:fay
 * Date:2016-03-30
 * desc:用户模块游记评论
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
                module:3,
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
                    var img = datas.thumbnails ? '/upload/'+datas.thumbnails :"/static/Desktop/Img/img.png";
                    html += '<div class="comment-travels-item ' + (i % 2 == 0 ? "" :"item-r") + '">';
                    html += "<div>";
                    html += '<div class="comment-travels-time">';
                    html += "<span>评论内容</span>";
                    html += '<span class="comment-travels-times">' + $.formatDate(new Date(datas.create_time * 1e3), "yyyy-MM-dd") + "</span>";
                    html += "</div>";
                    html += '<div class="comment-travels-content">';
                    html += datas.content;
                    html += "</div>";
                    //html+='<div class="del" data-id="'+datas.id+'">删除</div>'
                    html += '<div class="comment-travels-author-box" >';
                    html += '<div class="comment-travels-author-img" style="background-image: url(' + img + ')"></div>';
                    html += '<a class="comment-travels-author-title" href="/culture/news/' + datas.module_id + '.html">' + datas.title + "</a>";
                    html += '<div class="comment-travels-author-tools">';
                    html += '<div class="comment-travels-author-name">作者：' + datas.writer + "</div>";
                    html += '<div class="comment-travels-author-tool">';
                    //html+='<!--<div class="zan">点赞100</div>-->
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                    html += "</div>";
                }
                $(".comment-travels-box").append(html);
                page_view(rs.count);
            }
        }
        //function del(){
        //    $('.del').on('click',function(){
        //        var id=$(this).attr('data-id')
        //        $.getJSON(''=id).done(function(){
        //
        //        })
        //    })
        //
        //}
        //页面跳转事件
        function href(opt) {
            var options = {
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0"
            };
            var opts = $.extend(options, opt);
            location.href = "/user/comment/travels.html?start=" + opts.start;
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