$(function() {
    $._IMGURL_ = function(str, pic) {
        if (!pic) {
            pic = "";
        }
        return str ? str.indexOf("http") >= 0 ? str :"http://static.logomap.com/upload/" + str :pic;
    };
    $._PANO_ = function(str) {
        return str ? str.indexOf("http") >= 0 ? str :"/Panorama/" + str :"";
    };
    $._DELHTML_ = function(str) {
        return str ? str.replace(/<[^>].*?>/g, "") :str;
    };
    function _main() {
        this.init = function() {
            addback();
            back();
            back_top();
            addmark();
        };
        function back() {
            $(window).scroll(function() {
                addback();
            });
        }
        function addback() {
            if ($(window).scrollTop() > 0) {
                if (!$(".back-top").length) {
                    $("body").append('<div class="back-top"></div>');
                }
            } else {
                $(".back-top").remove();
            }
        }
        function back_top() {
            $("body").on("click", ".back-top", function() {
                var nowtop = $(window).scrollTop();
                var i = 0;
                var j = setInterval(function() {
                    $(window).scrollTop(nowtop - i);
                    i = i + 30;
                    if ($(window).scrollTop() == 0) {
                        clearInterval(j);
                    }
                }, 1);
            });
        }
        function city() {
            $(".city").on("click", function() {
                var html = '<ul class="city-select clearfix"><li type="">杭州</li><li type="">南京</li><li type="">千岛湖</li><li type="">重庆</li></ul>';
                if (!$(".city-select").length) {
                    $(".top-item").append(html);
                    $(".city-select>li").on("click", function() {
                        $(".city-select").remove();
                    });
                } else {
                    $(".city-select").remove();
                }
            });
        }
        function addmark() {
            var htm = '<div class="logo-mark" ><div class="logomap-mark"></div><div class="marks-tips">扫描关注公众号</div></div>';
            $(".main").append(htm);
        }
    }
    var main = new _main();
    main.init();
});

window._IMGURL_ = "http://static.logomap.com/upload/";