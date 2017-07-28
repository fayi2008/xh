/*
 * Author:fay
 * Date:2016-03-30
 * desc:一些PC端共有函数
 *
 * */
$(function() {
    //替换图片
    $._IMGURL_ = function(str, pic) {
        if (!pic) {
            pic = "";
        }
        return str ? str.indexOf("http") >= 0 ? str :"http://static.logomap.com/upload/" + str :pic;
    };
    $._LOCAL_IMGURL_ = function(str) {
        return str ? str.indexOf("http") >= 0 ? str :"/upload/" + str :"";
    };
    //替换全景
    $._PANO_ = function(pano_key, ele_id) {
        //需要页面先引入QQ和百度地图API
        /*
         * <script src="http://map.qq.com/api/js?v=2.exp&key=K76BZ-W3O2Q-RFL5S-GXOPR-3ARIT-6KFE5"></script>
         *<script src="http://api.map.baidu.com/api?v=2.0&ak=bVgV4S5cRHhI1yp8Qmnxdfb6"></script>
         */
        if (pano_key.indexOf("qq.com") > -1) {
            var canshu = pano_key.split("#")[1];
            var id = pano("pano", canshu), head = pano("heading", canshu), pitch = pano("pitch", canshu);
            new qq.maps.Panorama(document.getElementById(ele_id), {
                pano:id,
                pov:{
                    heading:+head,
                    pitch:+pitch
                }
            });
        } else if (pano_key.indexOf("baidu.com") > -1) {
            var canshu = pano_key.split("#")[1];
            var id = pano("panoid", canshu), head = pano("heading", canshu), pitch = pano("pitch", canshu);
            var panorama = new new BMap.Panorama(ele_id)();
            panorama.setId(id);
            panorama.setPov({
                heading:+head,
                pitch:+pitch
            });
        } else {
            $("." + ele_id).html('<iframe src="/Panorama#panoid=' + pano_key + '" class="" style="width:100%;height:100%;"></iframe>');
        }
    };
    //替换
    $._DELHTML_ = function(str) {
        return str ? str.replace(/<[^>]*?>/g, "") :str;
    };
    //
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };
    //
    $.clearJS = function(str) {
        return str ? val.replace(/<script.*?>[\s\S]*?<\/script>|\s+on[a-zA-Z]{3,16}\s?=\s?"[\s\S]*?"|\s+on[a-zA-Z]{3,16}\s?=\s?'[\s\S]*?'|\s+on[a-zA-Z]{3,16}\s?=[^ >]+/gi, "") :str;
    };
    //
    $.randnum = function(under, over) {
        under = under ? under :0;
        return Math.floor(Math.random() * (over - under) + under);
    };
    //
    $.getDW = function(option) {
        var opts = {
            success:function(rs) {},
            error:function(rs) {}
        };
        var opt = $.extend(opts, option);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(opt.success, opt.error);
        } else {
            var errors = {
                code:13
            };
            opt.error(errors);
        }
    };
    $.formatDate = function(date, fmt) {
        //date=new Date(dates);
        //fmt=fmts||'yyyy-MM-dd hh:mm';
        var o = {
            "M+":date.getMonth() + 1,
            //月份
            "d+":date.getDate(),
            //日
            "h+":date.getHours() % 12 == 0 ? 12 :date.getHours() % 12,
            //小时
            "H+":date.getHours(),
            //小时
            "m+":date.getMinutes(),
            //分
            "s+":date.getSeconds(),
            //秒
            "q+":Math.floor((date.getMonth() + 3) / 3),
            //季度
            S:date.getMilliseconds()
        };
        var week = {
            "0":"日",
            "1":"一",
            "2":"二",
            "3":"三",
            "4":"四",
            "5":"五",
            "6":"六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期" :"周" :"") + week[date.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    };
    Date.prototype.addDays = function(number) {
        var adjustDate = new Date(this.getTime() + 24 * 60 * 60 * 1e3 * 30 * number);
        //alert("Date" + adjustDate.getFullYear()+"-"+adjustDate.getMonth()+"-"+adjustDate.getDate());
        return;
    };
    $.fn.lazyLoad = function() {
        var here = this;
        var winHeight = $(window).height();
        function showImg() {
            $(here).each(function() {
                var _self = $(this);
                var img = new Image();
                img.src = _self.attr("original");
                var inter = setInterval(function() {
                    var pW = _self.parent().width();
                    var imgH = img.height;
                    var imgW = img.width;
                    var topVal = _self.get(0).getBoundingClientRect().top;
                    if (pW > 0) {
                        _self.css({
                            "background-color":"#eee"
                        });
                        var newH = pW * imgH / imgW;
                        _self.height(newH);
                        if (topVal < winHeight - imgH / 3 && !_self.hasClass("lazyed")) {
                            _self.hide().attr("src", _self.attr("original")).fadeIn().addClass("lazyed");
                        }
                        clearInterval(inter);
                    }
                }, 100);
            });
        }
        showImg();
        $(here).parents().scroll(function() {
            showImg();
        });
        $(window).scroll(function() {
            showImg();
        });
    };
    //$.XHalert = function(option) {
    //    var opts = {
    //        id:"",
    //        title:"提示",
    //        content:"",
    //        submit_text:"确定",
    //        cancel_text:"取消",
    //        yconfirm:0,
    //        submit:function() {},
    //        cancel:function() {},
    //        close:function() {}
    //    };
    //    var _this = this;
    //    var opt = $.extend(opts, option);
    //    this.html = $('<div class="yalert-box"></div>');
    //    this.htmls = '<div class="___mask"></div>';
    //    this.htmls += '<div class="yalert_box" >';
    //    this.htmls += '<div class="yalert_box_top">' + opt.title + "</div>";
    //    this.htmls += '<div class="yalert_box_tip">' + opt.content + "</div>";
    //    this.htmls += '<div class="yalert_box_btn">';
    //    if (opt.yconfirm) {
    //
    //        this.htmls += '<a class="yalert_box_submit" id="yalert_box_queding">' + opt.submit_text + "</a>";
    //        this.htmls += '<a class="yalert_box_submit" id="yalert_box_quxiao">' + opt.cancel_text + "</a>";
    //    } else {
    //        this.htmls += '<a class="yalert_box_submit" id="yalert_box_queding" style="width: 100%;">' + opt.submit_text + "</a>";
    //    }
    //    this.htmls += "</div>";
    //    this.htmls += "</div>";
    //    $("input,textarea").focusout();
    //    $(".___mask").remove();
    //    $(".yalert-box").remove();
    //    this.html.html(this.htmls);
    //    $("body").append(this.html);
    //    opt.close = function() {
    //        _this.html.remove();
    //        _this.html = "";
    //        _this.htmls = "";
    //    };
    //    $("#yalert_box_queding").off("click").on("click", function() {
    //        if (option.submit) {
    //            opt.submit(_this);
    //        } else {
    //            opt.close();
    //        }
    //    });
    //    if (opt.yconfirm) {
    //        $("#yalert_box_quxiao").off("click").on("click", function() {
    //            if (option.cancel) {
    //                opt.cancel(_this);
    //            } else {
    //                opt.close();
    //            }
    //        });
    //    }
    //};
    window._black = function () {
        var _this = this
        _this.newhtml = document.createElement('div')
        _this.newhtml.className = 'back-black'
        document.body.appendChild(_this.newhtml)

        _this.close = function () {
            document.body.removeChild(_this.newhtml)
        }
        return _this

    }

    function _Alert(option) {
        var a = new _black()
        var _this = this
        var opts = {
            id:"",
                    title:"提示",
                    content:"",
                    submit_text:"确定",
                    cancel_text:"取消",
                    yconfirm:0,
                    submit:function() {},
                    cancel:function() {},
                    close:function() {}
        }

        _this.createHTML = function (tags, cn, html, to) {
            var newhtml = document.createElement(tags)
            newhtml.className = cn
            newhtml.innerHTML = html
            to.appendChild(newhtml)
            return newhtml
        }

        var opt = $.extend(opts, option)
        _this.htmls = document.createElement('div')
        _this.htmls.className = 'yalert-box'


        _this.createHTML('div', 'yalert-box-top', opt.title, _this.htmls)

        _this.createHTML('div', 'yalert-box-tip', opt.content, _this.htmls)


        var btn = document.createElement('div')
        btn.className = 'yalert-box-btn'
        var y_quxiao = '', y_queding = ''
        if (opts.yconfirm) {
            y_quxiao = _this.createHTML('a', 'yalert-box-submit', opt.cancel_text, btn)
            y_queding = _this.createHTML('a', 'yalert-box-submit', opt.submit_text, btn)

        } else {
            y_queding = _this.createHTML('a', 'yalert-box-submit', opt.submit_text, btn)
            y_queding.style.width = '100%'
        }

        _this.htmls.appendChild(btn)

        if (document.getElementsByTagName('input').length) {
            for (var i= 0;i< document.getElementsByTagName('input').length;i++) {
                document.getElementsByTagName('input')[i].blur()

            }
        }

        if (document.getElementsByTagName('textarea').length) {
            for (var i=0;i<document.getElementsByTagName('textarea').length;i++) {
                document.getElementsByTagName('textarea')[i].blur()

            }
        }

        document.body.appendChild(_this.htmls)

        y_queding.addEventListener('click', function () {

            if (option.submit) {
                opt.submit(_this)
            } else {
                document.body.removeChild(_this.htmls)

                a.close()
            }
        })

        if (opts.yconfirm) {
            y_quxiao.addEventListener('click', function () {
                if (option.cancel) {
                    opt.cancel(_this)
                } else {
                    document.body.removeChild(_this.htmls)
                    a.close()
                }

            })
        }


        _this.close = function () {
            document.body.removeChild(_this.htmls)
            a.close()

        };

    }

    $.XHalert = function(option) {
        new _Alert(option)
    }
    /**
     *
     *  Secure Hash Algorithm (SHA256)
     *  http://www.webtoolkit.info/
     *
     *  Original code by Angel Marin, Paul Johnston.
     *
     **/

     $.SHA256=function(s){

        var chrsz   = 8;
        var hexcase = 0;

        function safe_add (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
        function R (X, n) { return ( X >>> n ); }
        function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
        function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
        function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
        function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
        function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
        function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }

        function core_sha256 (m, l) {
            var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
            var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
            var W = new Array(64);
            var a, b, c, d, e, f, g, h, i, j;
            var T1, T2;

            m[l >> 5] |= 0x80 << (24 - l % 32);
            m[((l + 64 >> 9) << 4) + 15] = l;

            for ( var i = 0; i<m.length; i+=16 ) {
                a = HASH[0];
                b = HASH[1];
                c = HASH[2];
                d = HASH[3];
                e = HASH[4];
                f = HASH[5];
                g = HASH[6];
                h = HASH[7];

                for ( var j = 0; j<64; j++) {
                    if (j < 16) W[j] = m[j + i];
                    else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

                    T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                    T2 = safe_add(Sigma0256(a), Maj(a, b, c));

                    h = g;
                    g = f;
                    f = e;
                    e = safe_add(d, T1);
                    d = c;
                    c = b;
                    b = a;
                    a = safe_add(T1, T2);
                }

                HASH[0] = safe_add(a, HASH[0]);
                HASH[1] = safe_add(b, HASH[1]);
                HASH[2] = safe_add(c, HASH[2]);
                HASH[3] = safe_add(d, HASH[3]);
                HASH[4] = safe_add(e, HASH[4]);
                HASH[5] = safe_add(f, HASH[5]);
                HASH[6] = safe_add(g, HASH[6]);
                HASH[7] = safe_add(h, HASH[7]);
            }
            return HASH;
        }

        function str2binb (str) {
            var bin = Array();
            var mask = (1 << chrsz) - 1;
            for(var i = 0; i < str.length * chrsz; i += chrsz) {
                bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
            }
            return bin;
        }

        function Utf8Encode(string) {
            string = string.replace(/\r\n/g,"\n");
            var utftext = "";

            for (var n = 0; n < string.length; n++) {

                var c = string.charCodeAt(n);

                if (c < 128) {
                    utftext += String.fromCharCode(c);
                }
                else if((c > 127) && (c < 2048)) {
                    utftext += String.fromCharCode((c >> 6) | 192);
                    utftext += String.fromCharCode((c & 63) | 128);
                }
                else {
                    utftext += String.fromCharCode((c >> 12) | 224);
                    utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                    utftext += String.fromCharCode((c & 63) | 128);
                }

            }

            return utftext;
        }

        function binb2hex (binarray) {
            var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
            var str = "";
            for(var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                    hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8  )) & 0xF);
            }
            return str;
        }

        s = Utf8Encode(s);
        return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

    };
    if (!("placeholder" in document.createElement("input"))) {
        $("input[placeholder],textarea[placeholder]").each(function() {
            var that = $(this), text = that.attr("placeholder");
            if (that.val() === "") {
                that.val(text).addClass("placeholder");
            }
            that.focus(function() {
                if (that.val() === text) {
                    that.val("").removeClass("placeholder");
                }
            }).blur(function() {
                if (that.val() === "") {
                    that.val(text).addClass("placeholder");
                }
            }).closest("form").submit(function() {
                if (that.val() === text) {
                    that.val("");
                }
            });
        });
    }
});