/*
 * Author:fay
 * Date:2015-10-23
 * desc:路线列表模块路线列表
 *
 * */
$(function() {
    function Index() {
        this.init = function() {
            $(".web-bar-way[data-type=way]").addClass("now").siblings().removeClass("now");
            view();
            day_init();
            filter_init();
            sort_type();
            day();
        };
        //更具条件初始化天数
        function day_init() {
            var day = $.getUrlParam("day") ? $.getUrlParam("day") :"0";
            $(".filter-condition>li[data-type=" + day + "]").addClass("check").siblings().removeClass("check");
        }
        //根据URI初始化排序
        function filter_init() {
            var ordertype = $.getUrlParam("ordertype") ? $.getUrlParam("ordertype") :"time";
            $(".sort-type>div[data-type=" + ordertype + "]").addClass("checked").siblings().removeClass("checked");
        }
        //页面渲染初始化
        function view() {
            var rs = WAY_LIST_DATA;

            if (rs && rs.data && rs.data.rows.length) {
                var html = "";
                //页面HTML
                for (var i in rs.data.rows) {
                    var datas = rs.data.rows[i];

                    html += '<a href="/way/' + datas.id + '.html" class="list-item">';
                    html += '<div class="way-img" style="background-image: url(' + $._LOCAL_IMGURL_(datas.image_uri) + ");filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + $._LOCAL_IMGURL_(datas.image_uri) + "',sizingMethod='scale');\"></div>";
                    html += '<div class="item-content">';
                    html += '<div class="name-bar">';
                    html += '<span class="way-name">' + datas.title + "</span>";
                    if(datas.tag&&datas.tag.length) {
                        for (var j in datas.tag) {
                            html += '<span class="way-type">' + datas.tag[j] + '</span>';
                        }
                    }
                    html += '</div>';
                    html += '<div class="way-bar">';
                    if(datas.poi&&datas.poi.length) {
                        html += '<span class="way-item-name">' + datas.poi[0].name + "</span>";
                        if (datas.poi.length > 1) {
                            html += '<span class="way-finger"></span><span class="way-item-name">' + datas.poi[datas.poi.length - 1].name + "</span>";
                        }
                    }
                    //for(var j in datas.poi){
                    //
                    //    html+='<span class="way-item-name">'+datas.poi[j].name+'</span>'
                    //
                    //    if(j<datas.poi.length-1){
                    //        html+='<span class="way-finger"></span>'
                    //    }
                    //}
                    html += "</div>";
                    html += '<div class="way-content">';
                    html += $._DELHTML_(datas.introduction).length > 200 ? $._DELHTML_(datas.introduction).substring(0, 200) :$._DELHTML_(datas.introduction);
                    html += "</div>";
                    html += "</div>";
                    html += "</a>";
                }
                $(".list-box").html(html);
                page_view(rs.data.results);
            } else {
                $(".list-box").html("没有找到有效路线！");
            }
        }
        //排序点击事件
        function sort_type() {
            $(".sort-type>div").on("click", function() {
                var _this = $(this);
                var data = {
                    ordertype:_this.attr("data-type") ? _this.attr("data-type") :"time",
                    start:0
                };
                href(data);
            });
        }
        //类型点击事件
        function day() {
            $(".filter-condition>li").on("click", function() {
                var _this = $(this);
                var data = {
                    day:_this.attr("data-type") ? _this.attr("data-type") :"0",
                    start:0
                };
                href(data);
            });
        }
        //页面跳转事件
        function href(opt) {
            var options = {
                day:$.getUrlParam("data-type") ? $.getUrlParam("data-type") :"0",
                page:$.getUrlParam("page") ? $.getUrlParam("page") :"0",
                start:$.getUrlParam("start") ? $.getUrlParam("start") :"0",
                ordertype:$.getUrlParam("ordertype") ? $.getUrlParam("ordertype") :"time",
                tag_id:$.getUrlParam("tag_id") ? "&tag_id=" + $.getUrlParam("tag_id") :"",
                poi_id:$.getUrlParam("poi_id") ? "&poi_id=" + $.getUrlParam("poi_id") :"",
                type:$.getUrlParam("type") ? "&type=" + $.getUrlParam("type") :"&type=1"
            };
            var opts = $.extend(options, opt);
            location.href = "/way/?start=" + opts.start + "&day=" + opts.day + "&ordertype=" + opts.ordertype + opts.tag_id + opts.poi_id + opts.type;
        }
        //分页计算渲染
        function page_view(count) {
            var nowpage = $.getUrlParam("start");
            var limit = 10;
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
            var limit = 10;
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
    var index = new Index();
    index.init();
});