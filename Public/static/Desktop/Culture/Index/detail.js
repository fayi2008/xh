/*
 * Author:fay
 * Date:2016-03-30
 * desc:文化模块详情页
 *
 * */
$(function() {
    function Detail() {
        this.init = function() {
            $(".web-bar-way[data-type=culture]").addClass("now").siblings().removeClass("now");
            view();
        };
        function view() {
            var rs = window.CULTURE;
            
            if (rs.status == 1) {
                if (rs.data) {
                    var datas = rs.data;
                    $(".item-head").html('<div style="background-image:url(' + $._LOCAL_IMGURL_(datas.thumb) + ')"></div>');
                    $(".item-name").html(datas.title);
                    $(".item-cate").html(datas.bname);
                    $(".item-desc-font").html(datas.excerpt);

                    var browser=navigator.appName
                    var b_version=navigator.appVersion
                    var version=b_version.split(";");
                    if(version[1]){
                        var trim_Version=version[1].replace(/[ ]/g,"");
                    }else{
                        var trim_Version='';
                    }
                    //alert(browser+'|||'+trim_Version)
                    if((browser=="Microsoft Internet Explorer" && (trim_Version=="MSIE8.0"||trim_Version=="MSIE9.0"))||(browser=="Netscape" &&trim_Version=="WOW64")||(browser=="Netscape" &&trim_Version=="WOW86")) {

                        var html = '<embed type="audio/mp3" width="500" height="30"  class="video-culture" id="video_culture"  src="http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=' + encodeURIComponent($._DELHTML_(datas.excerpt)) + '" autostart=true loop=false></embed>'
                        $('.item-desc-font').after(html)

                    }else{
                        var html = '<audio class="video-culture"  width="500" height="30"  controls="controls" src="http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=' +$._DELHTML_(datas.excerpt) + '" autoplay="autoplay"></audio>'
                        $('.item-desc-font').after(html)
                    }


                    //关联文化
                    if (datas.relation.length) {
                        var html1 = "";
                        for (var i in datas.relation) {
                            var datas1 = datas.relation[i];
                            html1 += '<a href="/culture/' + datas1.id + '.html">#' + datas1.title + "</a>";
                        }
                        $(".data-tuijian").html(html1);
                    } else {
                        $(".item-tuijian").hide();
                    }
                    if (datas.many_image) {
                        $(".item-wh-list").append("<h1>相册</h1>");
                        var imgl = JSON.parse(datas.many_image);
                        var html_img = "";
                        for (var i in imgl) {
                            var datas_img = imgl[i];
                            html_img += '<div class="item-desc-pic-item" data-img="' + datas_img + '" style="background-image:url(' + $._LOCAL_IMGURL_(datas_img) + ')"></div>';
                        }
                        $(".item-desc-pics").html(html_img);
                        $(".item-desc-pics").width(imgl.length * 175);
                        var isc = new IScroll(".item-desc-pic-box", {
                            mouseWheel:true,
                            scrollbars:true,
                            scrollX:true,
                            scrollY:false,
                            click:true
                        });
                        var ji = 700;
                        $(".item-desc-pic-left").on("click", function() {
                            var nowx = isc.x;
                            var isci = parseInt(nowx / ji);
                            if (nowx <= -700) {
                                isc.scrollTo((isci + 1) * ji, 0);
                            }
                        });
                        $(".item-desc-pic-right").on("click", function() {
                            var nowx = isc.x;
                            var isci = parseInt(nowx / ji);
                            var maxx = imgl.length * 175;
                            if ((isci - 1) * ji > -maxx) {
                                isc.scrollTo((isci - 1) * ji, 0);
                            }
                        });
                        $(".item-desc-pic-item").on("click", function() {
                            var img_url = $(this).attr("data-img");
                            var html = "";
                            var img = new Image();
                            img.src = $._LOCAL_IMGURL_(img_url);
                            img.onload = function() {
                                html += '<div class="_mask"></div>';
                                html += '<div class="culture-image" style="background-image:url(' + $._LOCAL_IMGURL_(img_url) + ");width:" + img.width + "px;height:" + img.height + "px;margin-left:-" + (img.width / 2 + 5) + "px;margin-top:-" + (img.height / 2 + 5) + 'px;"><div class="culture-image-close"></div></div>';
                                $("body").append(html);
                                $("._mask,.culture-image-close").on("click", function() {
                                    $("._mask").remove();
                                    $(".culture-image").remove();
                                });
                            };
                        });
                    } else {
                        $(".item-pic").remove();
                    }
                    //$(".item-wh-list").append("<h1>简介</h1>");
                    var wh_list = [];

                    if (datas.attrs) {
                        wh_list = datas.attrs;
                        if (wh_list.length) {
                            var html = "", html1 = "";
                            for (var i in wh_list) {
                                if (wh_list[i].value) {
                                    html += '<div class="item-list-wh"><h1>' + wh_list[i].name + '</h1><div class="item-list-wh-desc">' + wh_list[i].value + "</div></div>";
                                    //html1 += "<h1>" + wh_list[i].name + "</h1>";
                                }
                            }
                            $(".item-list").html(html);
                            //$(".item-wh-list").append(html1);
                        }
                    }


                    $(".item-content").html(datas.content);


                    var wh_content = [];
                    $(".item-content").find("h1").each(function(i) {
                        var $this = $(this);
                        var tal = {};
                        tal["id"] = "h1" + i;
                        tal["name"] = $this.html();
                        $this.attr('id','c_'+i)
                        var html1 = '<a href="#c_'+i+'" data-id="' + ("h1" + i) + '">' + $this.html() + "</a>";
                        $(".item-wh-list").append(html1);
                    });
                    $("h1").each(function() {
                        var text = $(this).text();
                        $(this).attr("data-name", text);
                    });
                }
            }
        }
    }
    var detail = new Detail();
    detail.init();
});