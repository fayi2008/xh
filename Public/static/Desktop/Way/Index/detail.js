/*
 * Author:fay
 * Date:2015-10-23
 * desc:路线列表模块路线详情
 *
 * */
$(function() {
    function Detail() {
        this.init = function() {
            $(".web-bar-way[data-type=way]").addClass("now").siblings().removeClass("now");
            view();
            collect();
        };
        //页面渲染
        function view() {
            var rs = WAY_DETAIL_DATA;

            if (rs.flag == 1) {
                $(".collect").html("已收藏").attr("data-type", 1);
            }
            if (rs.flag == 0) {
                $(".collect").html("收藏行程").attr("data-type", 0);
            }
            if (rs.flag == -1) {
                $(".collect").html("收藏行程").attr("data-type", -1);
            }
            if (rs && rs.data && rs.data.poi) {
                var html = "";
                var day = {};
                for (var i in rs.data.poi) {
                    var datas = rs.data.poi[i];
                    if (day[datas.day] && day[datas.day].length) {
                        day[datas.day].push(datas);
                    } else {
                        day[datas.day] = [];
                        day[datas.day].push(datas);
                    }
                }
                //console.log(day)
                for (var i in day) {
                    var datas = day[i];

                    datas.sort(function(a, b) {
                        a["listorder"] < b["listorder"];
                    });
                    html += '<div class="way-day">';
                    html += '<span class="way-day-number">' + i + "</span>";
                    html += '<span class="way-day-number-name">第' + i + "天</span>";
                    html += '<a class="to-map" href="/way/map/' + rs.data.way.id + ".html?day=" + i + '">查看地图</a>';
                    for (var j in datas) {
                        html += '<span class="way-day-name">' + datas[j].name + "</span>";
                        if (j < datas.length - 1) {
                            html += '<span class="way-finger"></span>';
                        }
                    }
                    html += "</div>";
                    for (var j in datas) {
                        html += '<div class="way-tour">';
                        html += '<div class="way-tour-name-box">';
                        html += '<span class="way-tour-tip">0</span>';
                        html += '<span class="way-tour-name">' + datas[j].name + "</span>";
                        html += '<span class="way-tour-time">建议游玩时间：' + (parseInt(datas[j].waster_time / 60) > 0 ? parseInt(datas[j].waster_time / 60) + "小时" :"") + datas[j].waster_time % 60 + "分钟</span>";
                        html += "</div>";
                        html += '<div class="way-tour-img"><img src="' + $._LOCAL_IMGURL_(datas[j].image) + '" alt="' + datas[j].name + '"></div>';
                        html += '<div class="way-tour-content">' + datas[j].description + "</div>";
                        html += "</div>";
                    }
                }
                $(".way-detail-box").append(html);
            }
        }
        function collect() {
            $(".collect").on("click", function() {
                var id = $(this).attr("data-id");
                var type = $(this).attr("data-type");
                if (type == 1 || type == 0) {
                    $.post("/user/collect.json", {
                        way:id
                    }, "json").done(function(rs) {
                        if (rs.status) {
                            if (rs.data == 1) {
                                $(".collect").html("已收藏").attr("data-type", 1);
                            }
                            if (rs.data == 0) {
                                $(".collect").html("收藏行程").attr("data-type", 0);
                            }
                        }
                    });
                } else {
                    $._singin_({
                        success:function() {
                            location.reload();
                        }
                    });
                }
            });
        }
    }
    var detail = new Detail();
    detail.init();
});