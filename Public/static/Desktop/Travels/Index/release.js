/*
 * Author:fay
 * Date:2016-03-30
 * desc:游记模块发表页
 *
 * */
$(function() {
    function Release() {
        var UED = "";
        this.init = function() {
            $(".web-bar-way[data-type=travels]").addClass("now").siblings().removeClass("now");
            if (window.USER_CONFIG.id) {
                ueditor();
                submit();
                upload_img();
            } else {
                $._singin_({
                    success:function() {
                        location.reload();
                    }
                });
            }
        };
        function ueditor() {
            UED = UE.getEditor("container", {
                toolbars:[ [ "fullscreen", "source", "undo", "redo" ], [ "bold", "italic", "underline", "fontborder", "strikethrough", "superscript", "subscript", "removeformat", "formatmatch", "autotypeset", "pasteplain", "|", "forecolor", "backcolor", "insertorderedlist", "insertunorderedlist", "selectall", "cleardoc", "inserttable" ], [ "simpleupload", "insertimage", "insertunorderedlist", "imageleft", "imageright", "background", "insertorderedlist", "insertunorderedlist", "link", "unlink", "map", "justifyleft", "justifyright", "justifycenter", "justifyjustify", "customstyle", "time", "date" ] ]
            });
        }
        function upload_img() {
            $("#image").on("change", function() {
                var iframe = false;
                var browser=navigator.appName
                var b_version=navigator.appVersion
                var version=b_version.split(";");
                if(version[1]){
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
                        //$('.image-box').remove('.__mask')
                        $(".image-box").css({
                            "background-image":"url(" + $._LOCAL_IMGURL_(rs.file) + ")"
                        });
                        $(".image-box").data("rs", rs);
                    },
                    iframe:iframe
                });
            });
        }
        function submit() {
            $(".submit").on("click", function() {
                var title = $(".title").val(), content = UED.getContent(), thumb = $(".image-box").data("rs");
                if (!title) {
                    $.XHalert({
                        content:"请输入标题"
                    });
                    return false;
                }
                if (!thumb) {
                    $.XHalert({
                        content:"请先上传封面图"
                    });
                    return false;
                }
                if (!UED.getContentTxt) {
                    $.XHalert({
                        content:"请输入内容"
                    });
                    return false;
                }
                $(".submit").off("click").html("正在发表...");
                $.post("/travels", {
                    title:title,
                    content:content,
                    thumb:thumb["file"]
                }, "JSON").done(function(rs) {
                    if (rs.status) {
                        $.XHalert({
                            content:"添加成功,是否继续添加？",
                            yconfirm:1,
                            submit:function(self) {
                                self.close();
                                location.reload();
                            },
                            cancel:function() {
                                location.href = "/travels";
                            }
                        });
                    } else {
                        $.XHalert({
                            content:rs.msg
                        });
                    }
                }).complete(function() {
                    submit();
                    $(".submit").html("发布游记");
                });
            });
        }
    }
    var release = new Release();
    release.init();
});