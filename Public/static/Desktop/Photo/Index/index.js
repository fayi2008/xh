/*
 * Author:fay
 * Date:2015-10-26
 * desc:印象模块首页
 *
 * */
$(function() {
    function Photo() {
        this.init = function() {
            $(".web-bar-way[data-type=travels]").addClass("now").siblings().removeClass("now");
            ajax(0);
            scle();
            order();
            show_detail();
            releaseBox_bind();
            next();
            pl_zan();
        };

        function ajax(start) {
            var ordertype = $.getUrlParam("ordertype");
            if (ordertype) {
                $(".order-item[data-type=" + ordertype + "]").addClass("checked").siblings().removeClass("checked");
            }
            $.getJSON("/photo.json", {
                start:start ? start :0,
                ordertype:ordertype ? ordertype :"id"
            }).done(function(rs) {
                if (rs.status) {
                    if (rs.data) {
                        view(rs.data,start);
                    }
                }
            });
        }
        function view(rs,start) {
            var limit = 20;

            if (rs.data.length) {
                for (var i in rs.data) {
                    var datas = rs.data[i];
                    var html = "";
                    html += '<div class="photo-item" data-id="' + datas.id + '">';
                    html += '<div class="photo-img"  data-id="' + datas.id + '"><img src="' + $._LOCAL_IMGURL_(datas.file_url) + '"></div>';
                    html += '<div class="photo-content">' + datas.description + "</div>";
                    html += '<div class="photo-tool">';
                    html += '<div class="zan"  data-id="' + datas.id + '">点赞(<span>' + datas.support_num + '</span>)</div><div class="pl">评论(' + datas.comment_count + ")</div>";
                    html += "</div>";
                    html += "</div>";
                    $(".list-" + i % 4).append(html);
                    $(".photo-item[data-id=" + datas.id + "]").data("rs", datas);
                }

                if (rs.count > (+start+limit)) {
                    $(".photo-list").after('<div class="next" data-start="' + (+start + limit) + '">加载更多</div>');
                }else{
                    $('.next').remove()
                }
                pl_zan();
            } else {}
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
        function order() {
            $(".order-item").on("click", function() {
                var wh = $(window).height();
                $(window).scrollTop(wh - 70 - 52);
                var ordertype = $(this).attr("data-type");
                var url_ordertype = $.getUrlParam("ordertype");
                if (url_ordertype != ordertype) {
                    to_url({
                        ordertype:ordertype
                    });
                }
            });
        }
        function to_url(opt) {
            var opti = {
                ordertype:$.getUrlParam("ordertype") ? $.getUrlParam("ordertype") :"id",
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0"
            };
            var opts = $.extend(opti, opt);
            location.href = "/photo?ordertype=" + opts.ordertype;
        }
        function show_detail() {
            $("body").on("click", ".photo-item>div", function(e) {
                var _this = $(this);
                var data = _this.data("rs");
                var id = _this.parent().attr("data-id");
                if (!$(this).hasClass("photo-tool")) {
                    location.href = "/photo/" + id + ".html";
                }
            });
        }
        function detail_view(rs) {
            var ph = $(window).height() * .8;
            var html = '<div class="_mask"></div>';
            html += '<div class="photo-rs">';
            html += '<div class="photo-rs-close"></div>';
            html += '<div class="photo-rs-box">';
            html += '<div class="photo-rs-img"><img style="width:' + rs.width + "px;height:" + rs.height + "px;margin-left:-" + rs.left + "px;margin-top: -" + rs.top + 'px;"  src="' + $._LOCAL_IMGURL_(rs.file_url) + '"></div>';
            html += '<div class="photo-rs-author">';
            html += '<div class="photo-rs-head" style="background-image: url(' + $._LOCAL_IMGURL_(rs.head_img) + ')"></div>';
            html += '<div class="photo-rs-name">' + rs.nickname + "</div>";
            html += '<div class="photo-rs-desc">' + rs.description + "</div>";
            html += '<div class="photo-rs-time">' + $.formatDate(new Date(rs.create_time * 1e3), "yyyy-MM-dd") + "</div>";
            html += "</div>";
            html += "</div>";
            html += '<div class="pl-box">';
            html += '<div class="pl-submit-box">';
            if (window.USER_CONFIG) {
                html += '<div class="has-login">';
                html += '<div class="pl-tool"><div class="zan" data-id="' + rs.id + '">点赞(<span>' + rs.support_num + "</span>)</div></div>";
                html += '<textarea id="plText"></textarea>';
                html += '<div class="pl-submit" data-id="' + rs.id + '">发表</div>';
                html += "</div>";
            } else {
                html += '<div class="no-login">';
                html += '<div class="no-login-tip">你并无登录，请登录以后再进行操作</div>';
                html += '<div class="login-submit" data-id="' + rs.id + '">登录</div>';
                html += "</div>";
            }
            html += "</div>";
            html += '<div class="pl-list" style="height: ' + (ph - 200) + 'px;">';
            html += '<ul class="pl-list-ul">';
            html += "</ul>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            if (!$(".photo-rs").length) {
                $("body").append(html);
                $(".photo-rs-close").on("click", function() {
                    $(".photo-rs").remove();
                    $("._mask").remove();
                });
                $(".login-submit").on("click", function() {
                    $._singin_({
                        success:function() {
                            location.reload();
                        }
                    });
                });
                pl_ajax(rs.id);
                submit_pl();
            }
        }
        function pl_zan() {
            $("body").off("click", ".zan").on("click", ".zan", function() {
                if (!USER_CONFIG.id) {
                    $._singin_({
                        success:function() {
                            location.reload();
                        }
                    });
                    return false;
                }
                var _this = $(this), now_num = _this.find("span").html();
                $.post("/comment/support.json", {
                    id:_this.attr("data-id"),
                    module:2
                }, "JSON").done(function(rs) {
                    if (rs && rs.status) {
                        _this.html("点赞(" + (+now_num + 1) + ")");
                    } else {}
                });
            });
        }
        function submit_pl() {
            $(".pl-submit").on("click", function() {
                var text = $("#plText").val(), id = $(this).attr("data-id"), _this = $(this);
                if (!text.length) {
                    $.XHalert({
                        content:"请输入评论"
                    });
                    return false;
                }
                if (text.length > 20) {
                    $.XHalert({
                        content:"评论文字请小于200字"
                    });
                    return false;
                }
                $(this).html("正在发表...").off("click");
                $.post("/comment", {
                    module:2,
                    id:id,
                    content:text
                }, "JSON").done(function(rs) {
                    if (rs && rs.status) {
                        pl_ajax(id);
                    }
                }).complete(function() {
                    submit_pl();
                    _this.html("发表");
                });
            });
        }
        function pl_ajax(id) {
            $.getJSON("/comment.json", {
                module:2,
                id:id
            }).done(function(rs) {
                if (rs && rs.status) {
                    if (rs.data) {
                        if (rs.data.length) {
                            var html = "";
                            for (var i in rs.data) {
                                var datas = rs.data[i];
                                html += "<li>";
                                html += '<div class="pl-head" style="background-image: url(' + $._LOCAL_IMGURL_(datas.head_img) + ')"></div>';
                                html += '<div class="pl-content">';
                                html += '<span class="pl-name">' + datas.nickname + ":</span>";
                                html += '<span class="pl-desc">' + datas.content + "</span>";
                                html += "</div>";
                                html += '<div class="pl-time">';
                                html += $.formatDate(new Date(datas.create_time * 1e3), "yyyy-MM-dd");
                                html += "</div>";
                                html += "</li>";
                            }
                            $(".pl-list-ul").html(html);
                            new IScroll(".pl-list", {
                                click:true,
                                scrollX:false,
                                scrollY:true,
                                scrollbars:true,
                                interactiveScrollbars:false,
                                invertWheelDirection:false,
                                mouseWheel:true
                            });
                        } else {
                            $(".pl-list-ul").html("暂时没有评论");
                        }
                    }
                }
            });
        }

        function releaseBox_bind(){
            $(".oreder-release").on("click", function() {
                releaseBox();
            });

            if(location.hash.substr(1) == 'release'){
                releaseBox();
            }
        }
        function releaseBox() {
                if (window.USER_CONFIG.id) {
                    var html = '<div class="_mask"></div>';
                    html += '<div class="submit-box">';
                    html += '<div class="submit-box-close"></div>';
                    html += '<div class="submit-box-title">发布照片</div>';
                    html += '<div class="image-box"><form action="/user/upload" method="post" id="img"><input name="image" id="image" type="file"></form></div>';
                    html += '<textarea id="content" placeholder="请输入简介"></textarea>';
                    html += '<div class="release-submit">发表</div>';
                    html += "</div>";
                    if (!$(".submit-box").length) {
                        $("body").append(html);
                        $(".submit-box-close").on("click", function() {
                            $("._mask").remove();
                            $(".submit-box").remove();
                        });
                        upload_img();
                        submit_release();
                    }
                } else {
                    $._singin_({
                        success:function() {
                            location.reload();
                        },
                        close:function() {}
                    });
                }
        }
        function upload_img() {
            $("#image").on("change", function() {
                var iframe = false;
                var browser=navigator.appName;
                var b_version=navigator.appVersion;
                var version=b_version.split(";");
                if(version[1])
                {
                    var trim_Version=version[1].replace(/[ ]/g,"");
                }else{
                    var trim_Version='';
                }

                if(browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0"||trim_Version=="MSIE9.0")){
                    iframe = true;
                }
                $("#img").ajaxSubmit({
                    beforeSubmit:function() {},
                    success:function(rs) {
                        if(browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0"||trim_Version=="MSIE9.0")){
                            rs = eval("("+rs+")");
                        }
                        if(rs.status) {
                            //$('.image-box').remove('.__mask')
                            $(".image-box").css({
                                "background-image": "url(" + $._LOCAL_IMGURL_(rs.file) + ")"
                            });
                            $(".image-box").data("rs", rs);
                        }else{
                            $.XHalert({
                                content:rs.msg
                            });
                        }
                    },
                    iframe:iframe
                });
            });
        }
        function submit_release() {
            $(".release-submit").on("click", function() {
                var img = $(".image-box").data("rs"), content = $("#content").val(), _this = $(this);
                if (!img) {
                    $.XHalert({
                        content:"请上传图片"
                    });
                    return false;
                }
                if (!content) {
                    $.XHalert({
                        content:"请输入简介"
                    });
                    return false;
                }
                if (content.length > 200) {
                    $.XHalert({
                        content:"简介请勿超过200字"
                    });
                    return false;
                }
                _this.off("click").html("正在发表");
                $.post("/photo.json", {
                    description:content,
                    file_url:img.file,
                    width:img.width,
                    height:img.height,
                    size:img.size
                }, "JSON").done(function(rs) {
                    if (rs && rs.status) {
                        $("._mask").remove();
                        $(".submit-box").remove();
                        location.reload();
                        /*var html = "";
                        html += '<div class="photo-item" data-id="' + rs.data + '">';
                        html += '<div class="photo-img"><img src="' + $._LOCAL_IMGURL_(img.file) + '"></div>';
                        html += '<div class="photo-content">' + content + "</div>";
                        html += '<div class="photo-tool">';
                        html += '<div class="zan"  data-id="' + rs.data + '">点赞(<span>0</span>)</div><div class="pl">评论(0)</div>';
                        html += "</div>";
                        html += "</div>";
                        $(".list-0").prepend(html);*/
                    }
                }).complete(function() {
                    submit_release();
                    _this.html("发表");
                });
            });
        }
    }
    var photo = new Photo();
    photo.init();
});