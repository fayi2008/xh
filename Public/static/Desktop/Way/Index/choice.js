/*
 * Author:fay
 * Date:2015-10-26
 * desc:推荐路线条件选择模块
 *
 * */
$(function() {
    function Choice() {
        this.init = function() {
            $(".web-bar-way[data-type=way]").addClass("now").siblings().removeClass("now");
            view();
            to_list();
            close_tag();
            search_tour();
            remove_tour();
            checked2();
        };
        //tag_config
        var tag_list = [ {
            name:"宗教信仰"
        }, {
            name:"自然景观"
        }, {
            name:"美食小吃"
        }, {
            name:"名胜古迹"
        } ];
        //初始化
        function view() {
            var html1 = "";
            for (var i in tag_list) {
                html1 += '<li  data-type="' + (+i + 1) + '" class="">';
                html1 += '<div class="choice-list-img item' + (+i + 1) + '"></div>';
                html1 += '<div class="choice-list-name-box">';
                html1 += '<span class="choice-list-hook"></span>';
                html1 += '<span class="choice-list-name">' + tag_list[i].name + "</span>";
                html1 += "</div>";
                html1 += "</li>";

            }
            $(".choice-list").html(html1);
            checked1();
            add_tour();
            tour_view(WAY_CHOICE_DATA);
            if (location.hash == "#tour") {
                $(".choice-box1").hide();
                $(".choice-box2").show();
            }
        }
        function tour_view(rs) {
            var html2 = "";
            for (var i in rs.data) {
                var datas = rs.data[i];
                if (i < 8) {
                    html2 += '<li class="tour2-item" style="background-image:url(' + $._LOCAL_IMGURL_(datas.image) + ')" data-img="' + datas.image + '" data-name="' + datas.name + '" data-type="' + datas.id + '"><div class="tour-name">' + datas.name + '</div><div class="tour-close"></div></li>';
                }
            }
            $(".tour2").html(html2);
        }
        //
        function add_tour() {
            $(".add-tour").on("click", function() {
                if ($(".checked").length) {
                    $(".choice-box1").hide();
                    $(".choice-box2").show();
                    location.hash = "tour";
                } else {
                    $.XHalert({
                        content:"请选择一个路线偏好"
                    });
                }
            });
            $(".to-last").on("click", function() {
                $(".choice-box1").show();
                $(".choice-box2").hide();
                location.hash = "";
            });
        }
        //搜索景点
        function search_tour() {
            $(".choice-box2-name").on("keyup", function() {
                if ($(this).val() && $(this).val().length > 1) {
                    $.getJSON("/way/index/getGoodsPoi", {
                        name:$(this).val()
                    }).done(function(rs) {
                        if (rs.status) {
                            if (rs.data) {
                                tour_view(rs);
                                $(".tour2-title").html("搜索结果");
                            }
                        }
                    });
                } else {
                    tour_view(WAY_CHOICE_DATA);
                    $(".tour2-title").html("推荐景点");
                }
            });
            $(".input-close").on("click", function() {
                $(".choice-box2-name").val("");
                tour_view(WAY_CHOICE_DATA);
                $(".tour2-title").html("推荐景点");
            });
        }
        //选择景点
        function checked2() {
            $(".tour2").on("click", ".tour2-item", function() {
                var html = $(this)[0].outerHTML;
                var id = $(this).attr("data-type");
                if (!$(".tour1>li[data-type=" + id + "]").length) {
                    $(".tour1").append(html);
                }
            });
        }
        //移除选择景点
        function remove_tour() {
            $(".tour1").on("click", ".tour-close", function() {
                $(this).parent().remove();
            });
        }
        //选择偏好
        function checked1() {
            $(".choice-list>li").on("click", function() {
                $(this).toggleClass("checked");
                var id = $(this).attr("data-type");
                if ($(this).hasClass("checked")) {
                    var html = '<li data-type="' + id + '">';
                    html += '<div class="choice-box2-tag-img item' + id + '"></div>';
                    html += '<div class="choice-box2-tag-name">' + tag_list[+id - 1].name + "</div>";
                    html += '<div class="choice-box2-tag-close"></div>';
                    html += "</li>";
                    if (!$(".choice-box2-tag>li[data-type=" + id + "]").length) {
                        $(".choice-box2-tag").append(html);
                    }
                } else {
                    $(".choice-box2-tag>li[data-type=" + id + "]").remove();
                }
            });
        }
        function close_tag() {
            $(".choice-box2-tag").on("click", ".choice-box2-tag-close", function() {
                var id = $(this).parent().attr("data-type");
                $(".choice-list>li[data-type=" + id + "]").removeClass("checked");
                $(this).parent().remove();
            });
        }
        function to_list() {
            $(".to-way-list").on("click", function() {
                var tag_id = "";
                $(".checked").each(function(i) {
                    if (i + 1 == +$(".checked").length) {
                        tag_id += $(this).attr("data-type");
                    } else {
                        tag_id += $(this).attr("data-type") + ",";
                    }
                });
                var poi_id = "";
                $(".tour1>li").each(function(i) {
                    if (i + 1 == $(".tour1>li").length) {
                        poi_id += $(this).attr("data-type");
                    } else {
                        poi_id += $(this).attr("data-type") + ",";
                    }
                });
                location.href = "/way?tag_id=" + tag_id + "&poi_id=" + poi_id + "&type=0";
            });
        }
    }
    var choice = new Choice();
    choice.init();
});