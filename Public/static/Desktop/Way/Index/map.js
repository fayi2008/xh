/*
 * Author:fay
 * Date:2015-10-23
 * desc:路线地图模块地图展示
 *
 * */
$(function() {
    function Map() {
        var day = $.getUrlParam("day");
        //初始化
        this.init = function() {
            $(".web-bar-way[data-type=way]").addClass("now").siblings().removeClass("now");
            if (day) {
                view(day);
                collect();
            }
        };
        //页面渲染
        function view(day_rs) {
            var wh = $(window).height();
            $("#map").height(wh - 70);
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
            var days = {}, day_currer = {};

            for (var i in rs.data.poi) {
                var datas = rs.data.poi[i];
                if (days[datas.day] && days[datas.day].length) {
                    days[datas.day].push(datas);
                } else {
                    days[datas.day] = [];
                    days[datas.day].push(datas);
                }
            }
            choose_day(days, day_rs);
            right_box(days[day_rs]);
            map_init(days[day_rs]);
        }
        //列表页初始化
        function right_box(rs) {
            var wh = $(window).height();
            $(".right-box").height(wh - 150);
            var html = "";
            for (var i in rs) {
                var datas = rs[i];
                html += '<li class="right-tour-item">';
                html += '<div class="right-box-name">' + datas.name + "</div>";
                html += '<div class="right-box-img" style="background-image: url(' + $._LOCAL_IMGURL_(datas.image) + ')"></div>';
                html += '<div class="right-box-time">建议游玩时间：' + (parseInt(datas.waster_time / 60) > 0 ? parseInt(datas.waster_time / 60) + "小时" :"") + datas.waster_time % 60 + "分钟</div>";
                html += "</li>";
            }
            $(".right-tour-list").html(html);
            $(".right-tour-list").height(rs.length * 190);
            new IScroll(".right-tour-box", {
                click:true,
                scrollX:false,
                scrollY:true,
                scrollbars:true,
                interactiveScrollbars:false,
                invertWheelDirection:false,
                mouseWheel:true
            });
        }
        //选天
        function choose_day(rs, now_day) {
            //console.log(rs)
            var html = "";
            $(".now-day").html("第" + now_day + "天");
            for (var i in rs) {
                html += '<li data-type="' + i + '">第' + i + "天</li>";
            }
            $(".day-choose-val").html(html);
            $(".now-day").off("click").on("click", function() {
                $(".day-choose-val").toggleClass("show");
            });
            $(".day-choose-val>li").off("click").on("click", function() {
                var $this = $(this);
                $(".day-choose-val").removeClass("show");
                //$('.now-day').html('第'+$this.attr('data-type')+'天')
                view($this.attr("data-type"), now_day);
            });
        }
        //地图数据初始化
        function ComplexCustomOverlay(point, opt) {
            this._point = point;
            this._opt = opt;
        }
        ComplexCustomOverlay.prototype = new BMap.Overlay();
        ComplexCustomOverlay.prototype.initialize = function(map) {
            this._map = map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._html = document.createElement("div");
            this._html.setAttribute("data-id", this._opt.id);
            this._html1 = document.createElement("div");
            this._html1.className = "map-alert-tips";
            this._html1.setAttribute("data-id", this._opt.id);
            this._html.className = "map-alert";
            var html = '<div class="map-alert-box">';
            html += '<div class="map-alert-close" data-id="' + this._opt.id + '"></div>';
            html += '<div class="map-alert-name">' + this._opt.name + "</div>";
            html += '<div class="map-alert-img" style="background-image: url(' + $._LOCAL_IMGURL_(this._opt.image) + ')"></div>';
            html += '<div class="map-alert-desc">' + this._opt.description + "</div>";
            if(this._opt.pano_key) {
                html += '<div class="map-alert-pano"><a href="/panorama#poi='+this._opt.id+'" class="">全景</a></div>';
            }
            html += "</div>";
            this._html.innerHTML = html;
            map.getPanes().labelPane.appendChild(this._html);
            map.getPanes().labelPane.appendChild(this._html1);
        };
        ComplexCustomOverlay.prototype.draw = function() {
            var map = this._map;
            var pixel = map.pointToOverlayPixel(this._point);
            this._html.style.left = pixel.x + 22 + "px";
            this._html.style.top = pixel.y - 150 + "px";
            this._html1.style.left = pixel.x + 5 + "px";
            this._html1.style.top = pixel.y - 10 + "px";
        };
        function map_init(rs) {
            var ww = $(window).width();
            $("#map").width(ww - 240);
            var map = new BMap.Map("map", {
                enableMapClick:false,
                MapStyle:[ "water", "land" ]
            });
            // 创建地图实例
            var bdp = mapx.proj.gcj2bd(rs[0].lat, rs[0].lon);
            var top_right_navigation = new BMap.NavigationControl({
                anchor:BMAP_ANCHOR_TOP_RIGHT
            });
            map.addControl(top_right_navigation);
            var point = new BMap.Point(+bdp[1], +bdp[0]);
            // 创建点坐标
            map.centerAndZoom(point, 16);
            // 初始化地图，设置中心点坐标和地图级别
            var myIcon = new BMap.Icon("/static/Desktop/Img/way/map_tips.png", new BMap.Size(26, 32));
            var pois = {}, poi_name = [],poi_latlng=[]
            for (var i in rs) {
                var datas = rs[i];
                var bdpoi = mapx.proj.gcj2bd(datas.lat, datas.lon);
                // 创建地图实例
                var pt = new BMap.Point(+bdpoi[1], +bdpoi[0]);
                var poi_latlng_item={
                    lat:datas.lat,
                    lng:datas.lon
                }
                poi_latlng.push(poi_latlng_item)
                poi_name.push(datas.name);
                var marker2 = new BMap.Marker(pt, {
                    icon:myIcon
                });
                // 创建标注
                marker2.map_data = rs[i];
                pois[datas.id] = marker2;
                map.addOverlay(marker2);
            }
            var poi_alert = {};
            for (var i in pois) {
                pois[i].addEventListener("click", function(ev) {
                    var datas = this.map_data;
                    var bdpoi = mapx.proj.gcj2bd(datas.lat, datas.lon);
                    // 创建地图实例
                    var now_point = new BMap.Point(+bdpoi[1], +bdpoi[0]);
                    // 创建点坐标
                    map.panTo(now_point, 16);
                    // 初始化地图，设置中心点坐标和地图级别
                    if (!this.had_alert) {
                        this.had_alert = 1;
                        var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(+bdpoi[1], +bdpoi[0]), datas);
                        map.addOverlay(myCompOverlay);
                        poi_alert[datas.id] = myCompOverlay;
                    } else {
                        this.had_alert = 0;
                        //poi_alert[i]=myCompOverlay
                        $(".map-alert[data-id=" + datas.id + "]").remove();
                        $(".map-alert-tips[data-id=" + datas.id + "]").remove();
                    }
                });
            }
            // console.log(pois)
            $("body").off("click", ".map-alert-close").on("click", ".map-alert-close", function() {
                var id = $(this).attr("data-id");
                if (pois[id].had_alert && pois[id].had_alert == 1) {
                    pois[id].had_alert = 0;
                }
                $(".map-alert[data-id=" + id + "]").remove();
                $(".map-alert-tips[data-id=" + id + "]").remove();
            });
            if (poi_name.length > 1) {
                var poi_names = [].concat(poi_name);
                var walk = {};
                if (poi_names.splice(1, -1)) {
                    walk["waypoints"] = [];
                    for (var i in poi_names.slice(1, -1)) {
                        walk["waypoints"].push(poi_names[i]);
                    }
                }
                // console.log(walk)
                var walk = new BMap.DrivingRoute(map, {
                    renderOptions:{
                        map:map,
                        autoViewport:true
                    }
                });
                var start=new BMap.Point(poi_latlng[0].lng,poi_latlng[0].lat),
                    end=new BMap.Point(poi_latlng[poi_name.length - 1].lng,poi_latlng[poi_name.length - 1].lat);
                //console.log(poi_latlng,start,end)
                walk.search(start, end);
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
    var map = new Map();
    map.init();
});