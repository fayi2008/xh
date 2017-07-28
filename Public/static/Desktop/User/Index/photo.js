/*
 * Author:fay
 * Date:2015-10-26
 * desc:用户模块我的印象
 *
 * */
$(function() {
    function Photo() {
        this.init = function() {
            $(".web-bar-navigation>a").removeClass("now");
            ajax(0);
            scle();
            show_detail();
            next();
        };
        function ajax(start) {
            var ordertype = $.getUrlParam("ordertype");
            if (ordertype) {
                $(".order-item[data-type=" + ordertype + "]").addClass("checked").siblings().removeClass("checked");
            }
            $.getJSON("/user/photo.json", {
                start:start ? start :0,
                ordertype:ordertype ? ordertype :"id"
            }).done(function(rs) {
                if (rs.status) {
                    if (rs.data) {
                        view(rs.data);
                    }
                }
            });
        }
        function view(rs) {
            var limit = 20;
            var start = $.getUrlParam("start") ? $.getUrlParam("start") :0;
            if (rs.data.length) {
                for (var i in rs.data) {
                    var datas = rs.data[i];
                    var html = "";
                    html += '<div class="photo-item" data-id="' + datas.id + '">';
                    html += '<div class="photo-img"  data-id="' + datas.id + '"><img src="' + $._LOCAL_IMGURL_(datas.file_url) + '"></div>';
                    html += '<div class="photo-content">' + datas.description + "</div>";
                    html += '<div class="photo-tool">';
                    html += '<div class="zan">点赞(' + datas.support_num + ')</div><div class="pl">评论(' + datas.comment_count + ")</div>";
                    html += '<div class="del" data-id="' + datas.id + '"></div>';
                    html += "</div>";
                    html += "</div>";
                    $(".list-" + i % 4).append(html);
                    $(".photo-item[data-id=" + datas.id + "]").data("rs", datas);
                }
                if (start + rs.data.length < rs.count) {
                    $(".photo-list").after('<div class="next" data-start="' + (+start + limit) + '">下一步</div>');
                }
                del();
            } else {}
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
                        $.getJSON("/photo/delete?id=" + id).done(function(rs) {
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
        function next() {
            $("body").on("click", ".next", function() {
                var start = $(this).attr("data-start");
                $(this).remove();
                ajax(start);
            });
        }
        function scle() {
            var wh = $(window).height();
            $(".content").css({
                "padding-top":wh - 70 - 52 + "px"
            });
        }
        function show_detail() {
            $("body").on("click", ".photo-img", function() {
                var _this = $(this);
                var data = _this.data("rs");
                var id = _this.attr("data-id");
                location.href = "/photo/" + id + ".html?owner=1";
            });
        }
    }
    var photo = new Photo();
    photo.init();
});