/*
 *
 * write by fay
 * time:2015-02-10 11:00
 *
 * */

(function (plus) {
    var wx=wx||window

    if ("function" == typeof define) {
        if (define.amd) {
            define(['jquery', 'wx'], function ($, _wx) {

                return plus($, _wx)
            })
        }
        if (define.cmd) {
            define(function () {
                var $ = require('jquery'),
                    wx = require('/pages/public/js/wx')

                return plus($, wx)
            })
        }
    } else {
        $(function () {
            plus($, wx)
        })

    }


})(function ($, _wx) {
    $._getURLID=function(){

        return (location.pathname.match(/(\d+)\.html/) || [0,-1])[1]

    }


    $._IMGURL_=function(str,pic){
        return str ? (str.indexOf("http")>=0 ? str : ("http://static.logomap.com/upload/" + str)) : pic;
    }
    //全景自用页面
    $.PANO = function (url) {
        return '/page/types-pano-u_pano#pano=' + url + '&heading=243&pitch=20&zoom=1'
    }
    //添加
    $.PANOQQ = function (url) {
        return 'http://map.qq.com/#pano=' + url + '&heading=163&pitch=2&zoom=1'
    }
    $.QQDH = function (opt) {
        //var opts={
        //    lat:0,
        //    lng:0,
        //    name:''
        //}

        return 'http://apis.map.qq.com/uri/v1/routeplan?type=drive&from=四面山风景区&fromcoord=28.647457,106.412539&to=' + opt.name + '&tocoord=' + opt.lat + ',' + opt.lng + '&policy=1&referer=logomap'
    }

    $.REPLACE=function(rs){
        return rs.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#x27;/g,'\'').replace(/&#x60;/g,'`')
    }

    var browser = {
        versions: function () {
            var u = navigator.userAgent.toLowerCase();
            return {//移动终端浏览器版本信息
                trident: u.indexOf('trident') > -1, //IE内核
                presto: u.indexOf('presto') > -1, //opera内核
                webKit: u.indexOf('applewebkit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('android') > -1 || u.indexOf('linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iphone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('ipad') > -1, //是否iPad
                webApp: u.indexOf('safari') == -1 //是否web应该程序，没有头部与底部
            };
        }

    };
    REG = {
        phone: /^1(\d){10}$/
    }
    $.RMLOAD = function () {

        (!$('.new-loading').length) || $('.new-loading').remove();
        (!$('.news-loading').length) || $('.news-loading').remove();
    }
    $.ADDLOAD = function () {
        var html = '<div class="new-loading"><ul class="small-loading"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></div>'
        if (!$('.new-loading').length) {
            $('body').append(html);
        }
    }
    $.ADDLOADS = function (_html) {
        var html = '<div class="news-loading"><ul class="small-loading"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul><div class="loading-font">'+_html+'</div></div>'
        if (!$('.news-loading').length) {
            $('body').append(html);
        }
    }


    $.addNULL = function (a, b) {
        var b1 = b ? b : '无';
        return a ? a : b1;
    }


    /*单独上传图片，base64*/
    $.up_img = function (elem, elem1, elem2) {

        elem.off('change').on('change', function () {
            var $self = $(this);
            var f = $(this).get(0).files[0];
            if (f.size >= 2097151) {
                alert('您传的这张"' + f.name + '"图片，大小超过2M！');
            } else {

                var fr = new FileReader();
                //var w = elem.width();
                fr.readAsDataURL(f);
                fr.onload = function (e) {
                    src = e.target.result;

                    if ($.validateImg(src)) {
                        $.get(elem.attr('data-url'), {image: src}, function (a) {
                            if (a && a.result && a.result.file) {
                                $self.val('')
                                elem1.val(a.result.file);
                                elem2.attr('src', upload_root + a.result.file);



                            } else {

                                alert(a.msg);

                            }


                        }, 'json').fail(function () {
                            alert('上传失败！请重试！')

                        })


                    } else {
                        alert('我们只支持PNG,JPG,GIF上传')
                    }
                }
            }


        })

    }


    //验证图片格式
    $.validateImg = function (data) {
        var filters = {
            "jpg": "/9j/4",
            "gif": "R0lGOD",
            "png": "iVBORw"
        }
        var pos = data.indexOf(",") + 1
        for (var e in filters) {
            if (data.indexOf(filters[e]) === pos) {
                return e
            }
        }
        return null
    };

    $.del_img = function () {
        $('.up-del-img').off('click').on('click', function () {
            $(this).parent().remove()
        })
    }

    //浏览器版本

    $.isANDROID = function () {
        var u = navigator.userAgent.toLowerCase();
        if (u.indexOf('android')>-1) {
            return true
        } else {
            return false
        }
    };
    $.isIPHONE = function () {

        var u = navigator.userAgent.toLowerCase();
        if (u.indexOf('ios')>-1) {
            return true
        } else {
            return false
        }
    };

    function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    //获取URL上参数
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
    }

    //随机数据
    $.randnum = function (under, over) {
        under = under ? under : 0;
        return Math.floor(Math.random() * (over - under) + under)
    }

    //定位
    $.getDW = function (option) {
        var opts = {
            success: function (rs) {
            },
            error: function (rs) {
            }

        };
        var opt = $.extend(opts, option)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(opt.success, opt.error)
        } else {
            var errors = {code: 13}
            opt.error(errors)
//                switch(err.code){
//                    case 13:
//                        $.yalert('对不起，您未授权定位，我们无法获取您的当前位置，为您提供服务');
//                        break;
//                    case 1 :
//                        $.yalert("您选择了不允许定位");//用户选了不允许
//                        break;
//                    case 2:
//                        $.yalert("连不上GPS，或者无网络");
//                        //连不上GPS卫星，或者网络断了
//                        break;
//                    case 3:
//                        $.yalert("定位超时");//超时了
//                        break;
//                    default:
//                        $.yalert("未知错误");//未知错误，其实是err.code==0的时候
//                        break;
//                }

        }
    }

    /*
     * $.OPENWXMAP(
     *
     * */
    $.OPENWXMAP = function (option) {
        var opts = {
            lat: 0,
            lng: 0,
            name: '',
            address: '',
            scale: 14,
            infoUrl: ''
        };
        var opt = $.extend(opts, option)

        if (typeof jsApiConfig != 'undefined' && _wx) {

            _wx.ready(function () {
                //if(_wx.checkJsApi) {

                _wx.checkJsApi({
                    jsApiList: ['openLocation'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                    success: function (res) {

                        if (res.checkResult.openLocation) {
                            _wx.openLocation({
                                latitude: opt['lat'], // 纬度，浮点数，范围为90 ~ -90
                                longitude: opt['lng'], // 经度，浮点数，范围为180 ~ -180。
                                name: opt['name'], // 位置名
                                address: opt['address'], // 地址详情说明
                                scale: opt['scale'], // 地图缩放级别,整形值,范围从1~28。默认为最大
                                infoUrl: opt['infoUrl'] // 在查看位置界面底部显示的超链接,可点击跳转w
                            });
                        }
                        // 以键值对的形式返回，可用的api值true，不可用为false
                        // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                    },
                    fail: function (res) {
                        location.href = 'http://apis.map.qq.com/uri/v1/marker?marker=coord:' + opt['lat'] + ',' + opt['lng'] + ';title:' + opt['name'] + ';addr:' + opt['name']
                    }
                });

                //}else{
                //    location.href = 'http://apis.map.qq.com/uri/v1/marker?marker=coord:' + opt['lat'] + ',' + opt['lng'] + ';title:' + opt['name'] + ';addr:' + opt['name']
                //}
            })
            _wx.error(function (res) {

            })
        } else {

            location.href = 'http://apis.map.qq.com/uri/v1/marker?marker=coord:' + opt['lat'] + ',' + opt['lng'] + ';title:' + opt['name'] + ';addr:' + opt['name']
        }
    }

    //百度地图
    $.baiduMAP = function (option) {
        var opts = {
            lat: '',
            lng: '',
            name: '',
            address: ''
        };
        var opt = $.extend(opts, option)
        var mark = 'http://api.map.baidu.com/marker'
        var url = mark
        url += '?location=' + opt.lat + ',' + opt.lng + '&'
        url += 'title=' + encodeURIComponent(opt.name) + '&'
        url += 'name=' + encodeURIComponent(opt.name) + '&'
        url += 'content=' + encodeURIComponent(opt.address) + '&'
        url += 'output=html&src=etixing|etixing';
        return url
    }

    //添加黑色遮罩
    var _addBlank = (function () {
        var type = type;
        var w = $(window).width(), h = $(window).height();
        var htmls = '<div class="back-black" black-type="' + type + '" style="height:' + h + 'px"></div>'

        function add() {

            $('body').append(htmls)
            $(window).resize(function () {
                var w = $(window).width(), h = $(window).height()
                $('.back-black').width(w).height(h)
            })


        }

        function close() {
            $('.back-black[black-type=' + type + ']').remove()

        }

        return {
            add: add,
            close: close
        }
    })($)

    $.addBlack = function () {


        _addBlank.add()


        this.close = function () {
            _addBlank.close()
        }

        return this
    }

    //弹窗公用方法
    var _alert_box = function () {

        var a = $.addBlack()

        this.add = function (option, yconfirm) {
            var opts = {
                id: '',
                title: '提示',
                content: '',
                submit_text: '确定',
                cancel_text: '取消',
                submit: function (e) {
                },
                cancel: function (e) {
                }
            }
            var w = $(window).width(), h = $(window).height()

            var opt = $.extend(opts, option)
            var htmls = ''

            htmls += '<div class="yalert_box" '
            if (opt.id) {
                htmls += ' id="' + opt.id + '"'
            }
            htmls += '>';
            htmls += '<div class="yalert_box_top">' + opt.title + '</div>'
            htmls += '<div class="yalert_box_tip">' + opt.content + '</div>'
            htmls += '<div class="yalert_box_btn">';
            if (yconfirm) {
                htmls += '<a class="yalert_box_submit" id="yalert_box_quxiao">' + opt.cancel_text + '</a>'
                htmls += '<a class="yalert_box_submit" id="yalert_box_queding">' + opt.submit_text + '</a>'
            } else {
                htmls += '<a class="yalert_box_submit" id="yalert_box_queding" style="width: 100%;">' + opt.submit_text + '</a>'
            }


            htmls += '</div>'
            htmls += '</div>'

            $('input,textarea').focusout()
            $('.yalert_box').remove()


            $('body').append(htmls)


            $('#yalert_box_queding').off('click').on('click', function () {

                if (option.submit) {
                    opt.submit($(this))
                } else {
                    $('.yalert_box').remove()
                    a.close()
                }

            });
            if (yconfirm) {
                $('#yalert_box_quxiao').off('click').on('click', function () {
                    if (option.cancel) {
                        opt.cancel($(this))
                    } else {
                        $('.yalert_box').remove()
                        a.close()
                    }

                })
            }


        };


        this.close = function () {
            $('.yalert_box').remove()
            a.close()

        };

        return this;

    }
    //确认窗
    $.yalert = function (option, submit) {
        var yalert = new _alert_box()

        if (typeof(option) == 'object') {

            yalert.add(option, 0)
        } else {

            var datas = {
                content: option,
                submit: submit
            }
            yalert.add(datas, 0)

        }

    }
    $.yalert.close=function(){
        $('.yalert_box').remove()
        $('.back-black').remove()
    }
    //有取消的
    $.yconfirm = function (option) {
        var yalert = new _alert_box()
        yalert.add(option, 1)

    }

    //暂时显示
    $.floatbox = function (content) {

        var $str = $('<div>')
        $str.addClass('float-box')
        $str.html(content)
        $str.appendTo('body')

        setTimeout(function () {
            $str.addClass('show')
        }, 1)

        setTimeout(function () {
            $str.hide(800, function () {
                $str.remove()
            })
        }, 1500)


    }


    function _smallLoading() {
        var $str = $('<div class="small-loading"></div>')
        this.add = function () {

            $str.appendTo('body')
            return this
        }
        this.close = function () {

            $str.remove()
            return this
        }
    }

    $.sloading = function () {
        var smallLoading = new _smallLoading()
        var sl = smallLoading.add()

        this.close = function () {
            sl.close()
        }
        return this
    };


    $.audios = function (opt) {

        var options = {
            loop: true,
            preload: "auto",
            src: '',
            callback: function () {
            }
        };
        var opts = $.extend(options, opt)
        var _audio = new Audio()
        for (var key in opts) {
            if (opts.hasOwnProperty(key) && (key in _audio)) {
                _audio[key] = opts[key]
            }
        }
        _audio.load()
        opts.callback(_audio)

    }

    //字符串TOJSON
    $.STRTOJSON = JSON.parse

    //JSONTO字符串
    $.JSONTOSTR = JSON.stringify

    //输出
    $.cl = function (a) {
        //console.log(a)
    }

    //URI加密
    $.URI = function (rs) {
        return encodeURIComponent(encodeURIComponent(rs))
    }

    //分享数据灌入
    $.setSHARE = function (options) {
        var option = {
            title: '',
            desc: '',
            link: window.location.href,
            icon: ''
        }
        var opt = $.extend(option, options);
        $('body').attr({
            'sharetitle': opt.title,
            'sharedesc': opt.desc,
            'sharelink': opt.link,
            'shareicon': opt.icon
        })
    }
    /*
     格式化日期
     "yyyy-MM-dd hh:mm:ss.S"==> 2006-07-02 08:09:04.423
     "yyyy-MM-dd E HH:mm:ss" ==> 2009-03-10 二 20:09:04
     "yyyy-MM-dd EE hh:mm:ss" ==> 2009-03-10 周二 08:09:04
     "yyyy-MM-dd EEE hh:mm:ss" ==> 2009-03-10 星期二 08:09:04
     "yyyy-M-d h:m:s.S" ==> 2006-7-2 8:9:4.18
     */
    $.formatDate = function (date, fmt) {
        //date=new Date(dates);
        //fmt=fmts||'yyyy-MM-dd hh:mm';
        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
            'H+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            'S': date.getMilliseconds() //毫秒
        };
        var week = {
            '0': '日',
            '1': '一',
            '2': '二',
            '3': '三',
            '4': '四',
            '5': '五',
            '6': '六'
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[date.getDay() + ''])
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }

    Date.prototype.addDays = function (number) {
        var adjustDate = new Date(this.getTime() + 24 * 60 * 60 * 1000 * 30 * number)
        //alert("Date" + adjustDate.getFullYear()+"-"+adjustDate.getMonth()+"-"+adjustDate.getDate());
        return
    }

    $.fn.lazyLoad = function () {
        var here = this;
        var winHeight = $(window).height();

        function showImg() {
            $(here).each(function () {

                var _self = $(this);
                var img = new Image();
                img.src = _self.attr('original');

                var inter = setInterval(function () {
                    var pW = _self.parent().width();
                    var imgH = img.height;
                    var imgW = img.width;
                    var topVal = _self.get(0).getBoundingClientRect().top;
                    if (pW > 0) {
                        _self.css({'background-color': '#eee'});

                        var newH = pW * imgH / imgW;

                        _self.height(newH);
                        if ((topVal < (winHeight - (imgH / 3))) && !_self.hasClass('lazyed')) {

                            _self.hide().attr('src', _self.attr('original')).fadeIn().addClass('lazyed');
                        }
                        clearInterval(inter);
                    }

                }, 100);


            });
        }

        showImg();
        $(here).parents().scroll(function () {
            showImg();
        });
        $(window).scroll(function () {
            showImg();
        })
    };

})


//if ( typeof module != 'undefined' && module.exports ) {
//    module.exports = IScroll;
//} else {
//    window.IScroll = IScroll;
//}

