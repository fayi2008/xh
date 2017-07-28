/*
 * Author:fay
 * Date:2016-03-30
 * desc:游记模块详情页
 *
 * */
$(function() {
    function Detail() {
        var limit = 20;
        this.init = function() {
            $(".web-bar-way[data-type=travels]").addClass("now").siblings().removeClass("now");
            if (TRAVEL_LIST_DATA) {
                view();
            } else {
                $.XHalert({
                    content:"文章正在审核，请稍后再看"
                });
            }
        };
        function view() {
            var datas = TRAVEL_LIST_DATA;
            $(".data-author-head").css({
                "background-image":"url(" + $._LOCAL_IMGURL_(datas.head_img) + ")"
            });
            $(".data-author-name").html("作者：" + datas.nickname);
            $(".data-author-title").html(datas.title);
            $(".data-author-content").html(datas.content);
            $(".dianzan").html("点赞：<span>" + datas.support_num + "</span>");
            $(".pinglun").html("评论：<span>" + datas.comment_count + "</span>");
            if (+datas.comment_status == 0) {
                $(".comment-box").remove();
            }
            pl_ajax(datas.id, 0);
            dianzan(datas.id);
            submit_ajax(datas.id);
        }
        function dianzan(id) {
            $(".dianzan").on("click", function() {
                var _this = $(this), now_num = _this.find("span").html();
                $.post("/comment/support.json", {
                    id:id,
                    module:1
                }, "JSON").done(function(rs) {
                    if (rs && rs.status) {
                        _this.html("点赞：<span>" + (+now_num + 1) + "</span>");
                    } else {
                        if(rs.status==0&&rs.msg)
                        {
                            alert('操作失败：'+rs.msg );
                        }
                    }
                });
            });
        }
        function pl_ajax(id, start) {
            $.getJSON("/comment.json", {
                module:1,
                id:id,
                start:start
            }).done(function(rs) {
                if (rs && rs.status) {
                    if (rs.data.data) {
                        if (rs.data.data.length) {
                            var html = "";
                            for (var i in rs.data.data) {
                                var datas = rs.data.data[i];
                                html += "<li>";
                                html += '<div class="comment-list-head" style="background-image: url(' + $._LOCAL_IMGURL_(datas.head_img) + ')"></div>';
                                html += '<div class="comment-item">';
                                html += '<div class="comment-item-user"><span class="nickname">' + datas.nickname + '</span><span class="create_time">发表时间：' + $.formatDate(new Date(datas.create_time * 1000), "yyyy-MM-dd  HH:mm:ss") + '</span><span class=""></span>';
                                html += "</div>";
                                html += '<div class="comment-item-view">' + datas.content.replace(/[\r\n]/g, "<br/>") + "</div>";
                                html += "</div>";
                                html += "</li>";
                            }
                            $(".pl-list-ul").append(html);
                            if (+start + +rs.data.data.length < +rs.data.count) {
                                $(".pl-list-ul").after('<div class="next-page" data-next="' + (+start + +limit) + '">下一页</div>');
                            }
                            pl_next(id);
                            $(".pinglun").html("评论：<span>" + rs.data.count + "</span>");
                        } else {}
                    }
                }
            });
        }
        function pl_next(id) {
            $(".next-page").on("click", function() {
                var start = $(this).attr("data-next");
                pl_ajax(id, start);
                $(".next-page").remove();
            });
        }
        function submit_ajax(id) {
            $(".pl-submit").on("click", function() {
                if (!USER_CONFIG.id) {
                    $._singin_({
                        success:function() {
                            location.reload();
                        }
                    });
                    return false;
                }
                var text = $("#plText").val(), _this = $(this);
                if (!text.length) {
                    $.XHalert({
                        content:"请输入评论"
                    });
                    return false;
                }
                if (text.length > 200) {
                    $.XHalert({
                        content:"评论文字请小于200字"
                    });
                    return false;
                }
                $(this).html("正在发表...").off("click");
                $(document).off("keyup");
                $.post("/comment", {
                    module:1,
                    id:id,
                    content:text
                }, "JSON").done(function(rs) {
                    if (rs && rs.status) {
                        location.reload();
                        /*var html = "";
                        html += "<li>";
                        html += '<div class="comment-list-head" style="background-image: url(' + $._LOCAL_IMGURL_(USER_CONFIG.head_img) + ')"></div>';
                        html += '<div class="comment-item">';
                        html += '<div class="comment-item-user"><span class="nickname">' + USER_CONFIG.nickname + '</span><span class="create_time">发表时间：' + $.formatDate(new Date(), "yyyy-MM-dd HH:mm:ss") + '</span><span class=""></span>';
                        html += "</div>";
                        html += '<div class="comment-item-view">' + text.replace(/[\r\n]/g, "<br/>") + "</div>";
                        html += "</div>";
                        html += "</li>";
                        $(".pl-list-ul").append(html);
                        $("#plText").val("");*/
                    }
                }).complete(function() {
                    submit_ajax(id);
                    _this.html("发表");
                });
            });
            $(document).on("keydown", function(e) {
                if (event.keyCode == 13 && event.ctrlKey) {
                    var text = $("#plText").val();
                    if (!text.length) {
                        $.XHalert({
                            content:"请输入评论"
                        });
                        return false;
                    }
                    if (text.length > 200) {
                        $.XHalert({
                            content:"评论文字请小于200字"
                        });
                        return false;
                    }
                    $(".pl-submit").html("正在发表...").off("click");
                    $(document).off("keyup");
                    $.post("/comment", {
                        module:1,
                        id:id,
                        content:text
                    }, "JSON").done(function(rs) {
                        if (rs && rs.status) {
                            location.reload();
                            /*var html = "";
                            html += "<li>";
                            html += '<div class="comment-list-head" style="background-image: url(' + $._LOCAL_IMGURL_(USER_CONFIG.head_img) + ')"></div>';
                            html += '<div class="comment-item">';
                            html += '<div class="comment-item-user"><span class="nickname">' + USER_CONFIG.nickname + '</span><span class="create_time">发表时间：' + $.formatDate(new Date(), "yyy-MM-hh") + '</span><span class=""></span>';
                            html += "</div>";
                            html += '<div class="comment-item-view">' + text.replace(/[\r\n]/g, "<br/>") + "</div>";
                            html += "</div>";
                            html += "</li>";
                            $(".pl-list-ul").append(html);
                            $("#plText").val("");*/
                        }
                    }).complete(function() {
                        submit_ajax(id);
                        $(".pl-submit").html("发表");
                    });
                }
            });
            $("#plText").on("input", function() {
                var len = $(this).val().length;
                $(".fonts").html(len);
            });
        }
    }
    var detail = new Detail();
    detail.init();
});