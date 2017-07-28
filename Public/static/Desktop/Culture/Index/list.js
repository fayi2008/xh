/*
 * Author:fay
 * Date:2016-03-30
 * desc:文化模块列表页
 *
 * */
$(function() {
    function List() {
        var limit = 12;
        this.init = function() {
            $(".web-bar-way[data-type=culture]").addClass("now").siblings().removeClass("now");
            cate_view();
            search();
            ajax();
        };
        function ajax() {
            var type = $.getUrlParam("type") ? $.getUrlParam("type") :0, start = $.getUrlParam("start") ? $.getUrlParam("start") :0;
            $.getJSON("/culture/culture_search.json", {
                cate_id:type,
                start:start,
                limit:limit
            }).done(function(rs) {
                if (rs.status) {
                    view(rs.data);
                }
            });
        }
        function search(){
            $('.search').on('focus',function(){
                $(this).val('');
                $('.search-list').html('');
            });
            //$('.search').on('focusout',function(){
            //
            //    $('.search-list').html('');
            //});
            $('.search').on('keyup',function(){

                if($('.search').val().length>1) {
                    var name = $(this).val();

                    $.getJSON("/culture/culture_search.json", {
                        name: name
                    }).done(function (rs) {
                        var html = '';
                        if (rs.data && rs.data.data && rs.data.data.length) {
                            for (var i in rs.data.data) {
                                if (i < 8) {
                                    var datas = rs.data.data[i];
                                    html += '<a href="/culture/' + datas.id + '.html">' + datas.title + '</a>';
                                }
                            }
                            $('.search-list').html(html);
                        }
                    });
                }

            });
        }

        function view(rs) {
            if (rs.data.length) {
                var html = "";
                var hang = Math.ceil(rs.data.length / 3);
                for (var i = 0; i < hang; i++) {
                    var l = 3;
                    html += '<div class="wh-item">';
                    if (i == hang - 1) {
                        l = rs.data.length % 3 == 0 ? "3" :rs.data.length % 3;
                    }
                    for (var j = 0; j < l; j++) {
                        var datas = rs.data[i * 3 + j];
                        html += '<a class="wh"  style="background-image: url(' + $._LOCAL_IMGURL_(datas.thumb) + ')" href="/culture/' + datas.id + '.html">';
                        html += '<div class="wh-img"></div>';
                        html += '<div class="wh-tag">' + datas.bname + "</div>";
                        html += '<div class="wh-name">' + datas.title + "</div>";
                        html += "</a>";
                    }
                    html += "</div>";
                }
                $(".wh-list").html(html);
                page(rs.data.length, rs.results);
            } else {
                $(".wh-page").hide();
            }
        }
        function cate_view() {
            var rs = window.LIST_CATE;
            if (rs.status == 1) {
                var html = '<div data-type="0">全部</div>';
                for (var i in rs.data) {
                    var datas = rs.data[i];
                    html += '<div data-type="' + datas.id + '">' + datas.name + "</div>";
                }
                $(".tag").html(html);
                var type = $.getUrlParam("type") ? $.getUrlParam("type") :0;
                $(".tag>div[data-type=" + type + "]").addClass("check").siblings().removeClass("check");
                tag();
            }
        }
        function tag() {
            $(".tag>div").on("click", function() {
                var tag = $(this).attr("data-type");
                href({
                    start:0,
                    type:tag
                });
            });
        }
        //页面跳转事件
        function href(opt) {
            var options = {
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0",
                type:$.getUrlParam("type") ? $.getUrlParam("type") :"0"
            };
            var opts = $.extend(options, opt);
            location.href = "/culture/list.html?start=" + opts.start + "&type=" + opts.type;
        }
        function page(leng, count) {
            var start = $.getUrlParam("start") ? $.getUrlParam("start") :"0";
            if (start==0&&+start + leng >= count) {
                $(".wh-page").hide();
            }
            $(".last").on("click", function() {
                if (+start != 0) {
                    href({
                        start:+start - limit
                    });
                }
            });
            $(".next").on("click", function() {
                if (+start + leng < +count) {
                    href({
                        start:+start + limit
                    });
                }
            });
        }
    }
    var list = new List();
    list.init();
});