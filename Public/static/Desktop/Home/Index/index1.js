$(function() {
    function Index() {
        this.init = function() {
            $(".web-bar-way[data-type=index]").addClass("now").siblings().removeClass("now");

            swipes();
            view();
        };
        ///*顶部导航滑动插件*/
        function swipes() {

        }
        /*页面初始化*/
        function view() {
            var rs = window.INDEX;
            /*路线模块*/
            var way = rs.way;
            var way_html = "";
            for (var i in way) {
                var datas = way[i];
                if (i < 6) {
                    way_html += '<a href="/way/' + datas.id + '.html" class="way-item ' + (i % 3 == 0 ? "no-left" :"") + '">';
                    way_html += '<div class="way-item-img" style="background-image: url(' + (datas.image_uri ? $._LOCAL_IMGURL_(datas.image_uri) :"/static/Desktop/Img/img.png") + ')"></div>';
                    way_html += '<div class="way-item-name">';
                    way_html += '<div class="way-item-title">' + datas.title;
                    way_html += "</div>";
                    way_html += '<div class="way-item-tip-list">';
                    for (var j in datas.tag) {
                        if (j < 3) {
                            way_html += '<span class="way-item-tip">' + datas.tag[j] + "</span>";
                        }
                        if (j > 2) {
                            way_html += '<span class="way-item-tip">...</span>';
                        }
                    }
                    way_html += "</div>";
                    way_html += '<div class="way-item-fire">' + datas.hitsum + "</div>";
                    way_html += "</div>";
                    way_html += "</a>";
                }
            }
            $(".way-list").html(way_html);
            /*文化分类*/
            var cate = rs.cate;
            var cate_html = "";
            for (var i in cate) {
                var datas = cate[i];
                if (i < 6) {
                    cate_html += '<a data-id="' + datas.id + '" data-img="' + datas.thumbnails + '" data-name="' + datas.name + '" data-remark="' + datas.remark + '" class="culture-type-item item' + (+i + 1) + " " + (i % 2 == 0 ? "" :"item-r") + '"><div class="culture-type-item-title">' + datas.name + "</div></a>";
                }
            }
            cate_html += '<a href="/culture/list.html" class="culture-type-item item7 item-more"><div class="culture-type-item-title">了解更多</div></a>';
            $(".culture-type-list").html(cate_html);
            $(".culture-type-img").css({
                "background-image":"url(" + $._LOCAL_IMGURL_(cate[0].thumbnails) + ")"
            });
            $(".culture-type-name").attr("href", "/culture/list.html/?start=0&type=" + cate[0].id);
            $(".culture-type-title").html(cate[0].name);
            $(".culture-type-desc").html(cate[0].remark);
            $(".culture-type-item").on("click", function() {
                var $this = $(this), thumbnails = $this.attr("data-img"), name = $this.attr("data-name"), remark = $this.attr("data-remark"), id = $this.attr("data-id");
                $(".culture-type-name").attr("href", "/culture/list.html/?start=0&type=" + id);
                $(".culture-type-img").css({
                    "background-image":"url(" + $._LOCAL_IMGURL_(thumbnails) + ")"
                });
                $(".culture-type-title").html(name);
                $(".culture-type-desc").html(remark);
            });
            /*文化推荐*/
            var culture = rs.culture;
            var culture_html = "";
            for (var i in culture) {
                var datas = culture[i];
                culture_html += '<a href="/culture/' + datas.id + '.html"  style="background-image: url(' + (datas.thumb ? $._LOCAL_IMGURL_(datas.thumb) :"/static/Desktop/Img/img.png") + ')"><div class="culture-show"><div class="culture-show-name">' + datas.title + "</div></div></a>";
            }
            $(".culture-show-list").html(culture_html);
            /*印象*/
            var photo = rs.photo.data;
            var photo_html = "";
            var ww = $(window).width();
            for (var i in photo) {
                var datas = photo[i];
                if (i < 10) {
                    photo_html += '<a  href="/photo/' + datas.id + '.html" style="height:' + ww * .2 + "px;background-image: url(" + $._LOCAL_IMGURL_(datas.file_url) + ')"><div class="photo-item"><div class="photo-item-name">' + (datas.description.length > 20 ? datas.description.substr(0, 20) + "..." :datas.description) + "</div></div></a>";
                }
            }
            $(".photo-list").html(photo_html);
            /*游记*/
            var travels = rs.travels.data;
            var tra_html = "";
            for (var i in travels) {
                var datas = travels[i];
                if (i < 3) {
                    tra_html += '<a class="travels-item" href="/travels/' + datas.id + '.html">';
                    tra_html += '<div class="travels-item-img" style="background-image: url(' + (datas.thumb ? $._LOCAL_IMGURL_(datas.thumb) :"/static/Desktop/Img/img.png") + ')"></div>';
                    tra_html += '<div class="travels-item-content">';
                    tra_html += '<div class="travels-item-title">' + datas.title + "</div>";
                    tra_html += '<div class="travels-item-desc">' + ($._DELHTML_(datas.content).length > 20 ? $._DELHTML_(datas.content).substr(0, 20) + "..." :$._DELHTML_(datas.content)) + "</div>";
                    tra_html += '<div class="travels-item-tool"><div class="zan">' + datas.support_num + '</div><div class="pl">' + datas.comment_count + "</div></div>";
                    tra_html += "</div>";
                    tra_html += '<div class="travels-item-author">';
                    tra_html += '<div class="travels-item-avatar" style="background-image: url(' + (datas.head_img ? $._LOCAL_IMGURL_(datas.head_img) :"/static/Desktop/Img/user.png") + ')"></div>';
                    tra_html += '<div class="travels-item-author-name">' + datas.nickname + "</div>";
                    tra_html += '<div class="travels-item-day">' + $.formatDate(new Date(datas.create_time * 1e3), "yyyy-MM-dd") + "</div>";
                    tra_html += "</div>";
                    tra_html += "</a>";
                }
            }
            $(".travels-list").html(tra_html);
        }
    }
    var index = new Index();
    index.init();
});