/**
 * 基础类
 */
(function(){
    if(!window.console){
        window.console = {
            log:function(){}
        }
    }
    var xh = {};

    xh.extend = function(dist , src){
        for(var i in src){
            dist[i] = src[i];
        }
        return dist;
    };

    xh.template = function(str, data) {
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            var value = data[key];
            if (value === undefined) {
                //console.log('No value provided for variable ' + str);
                value = "{" + key + "}";
            } else if (typeof value === 'function') {
                value = value(data);
            }
            return value;
        })
    };


    xh.is = function (obj,type) {
        return (type === "Null" && obj === null) ||
            (type === "Undefined" && obj === void 0 ) ||
            (type === "Number" && isFinite(obj)) ||
            Object.prototype.toString.call(obj).slice(8,-1) === type;
    };

    /**
     * 取出对象数组的 某个键值作为 新的数组
     */
    xh.select = function(obj , key){
        var k = [];
        for(var i=0;i<obj.length;i++){
            if(key in obj[i]) k.push(obj[i][key]);
        }
        return k;
    };

    /**
     * 过滤数组对象
     */
    xh.filter = function(){

    }

    /**
     * 对象转数组
     * @param obj
     */
    xh.key = function(obj){
        var k = [];
        for(var i in obj){
            k.push(obj[i]);
        }
        return k;
    };

    xh.debounce = function(func, wait, immediate) {
        var timeout, result;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) result = func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };

    xh.throttle = function(func, wait) {
        var context, args, timeout, result;
        var previous = 0;
        var later = function() {
            previous = new Date;
            timeout = null;
            result = func.apply(context, args);
        };
        return function() {
            var now = new Date;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };

    xh.dateFormat = function(a,expr){
        expr = expr || 'yyyy-MM-dd';
        if(typeof(a) != 'object'){
            a = new Date(a);
        }
        var y = a.getFullYear(),
            M = a.getMonth()+1,
            d = a.getDate(),
            D = a.getDay(),
            h = a.getHours(),
            m = a.getMinutes(),
            s = a.getSeconds();

        function zeroize(v){
            v = parseInt(v);
            return v<10 ? "0"+v : v;
        }
        return expr.replace(/(?:s{1,2}|m{1,2}|h{1,2}|d{1,2}|M{1,4}|y{1,4})/g, function(str) {

            switch(str) {
                case 's' : return s;
                case 'ss': return zeroize(s);
                case 'm' : return m;
                case 'mm': return zeroize(m);
                case 'h' : return h;
                case 'hh': return zeroize(h);
                case 'd':	return d;
                case 'dd':	return zeroize(d);
                case 'M':	return M;
                case 'MM':	return zeroize(M);
                case 'MMMM':return ['十二','一','二','三','四','五','六','七','八','九','十','十一'][m] + '月';
                case 'yy':	return String(y).substr(2);
                case 'yyyy':return y;
                default:	return str.substr(1, str.length - 2);
            }
        });
    };

    xh.unescape = (function(){
        var m = '(?:' +
                ['&amp;','&lt;','&gt;','&quot;','&#x27;','&#x60;'].join('|') +
                ')',
            obj = {'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#x27;':"'",'&#x60;':'`'};

        return function(str){
            return str.replace(RegExp(m,'g') , function(match){
                return obj[match];
            });
        }
    }());

    xh.require = function(mod) {
        var nc = mod.split("."), o = window , i, l = nc.length;
        for (i = 0 ; i < l; i++) {
            o = o[nc[i]] = o[nc[i]] || {};
        }
        return o;
    };

    xh.hash = (function(){
        var url = location.hash,
            reg = /(?:#|&)?([^=]+)=([^&]*)/ig,
            obj = {},
            m;// = url.match(reg);

        while(m = reg.exec(url)) obj[m[1]] = m[2];

        return function(v){
            if(arguments.length == 0) return obj;
            else return obj[v];
        }
    })();

    xh.paras = (function(){
        var url = location.search,
            reg = /(?:\?|&)?([^=]+)=([^&]*)/ig,
            obj = {},
            m;// = url.match(reg);

        while(m = reg.exec(url)) obj[m[1]] = m[2];

        return function(v){
            if(arguments.length == 0) return obj;
            else return obj[v];
        }
    })();

    var server = 'http://xh.hqkeji.cn/';
    xh.path = {
        'img':function(url){ return '/upload/' + url;},
        'tts':function(txt){
            //return '/Api/Baidu/textToVoice?text=' + txt ;
            txt = txt.replace(/['"&\[\]\(\)\{\}]/g,'');
            return 'http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=' + txt;
        }
    };


    xh.user = window.USER_DATA || sessionStorage["user"] || {};
    window.xh = xh;
}());

/**
 * xh.ua
 */
(function(){
    var ua = navigator.userAgent.toLowerCase();
    var shell = /chrome/.test(ua) ? "chrome" :
        /webKit/.test(ua) && !/chrome/.test(ua) ? "safari" :
            /opera/.test(ua) ? "opera" :
                /msie/.test(ua) && !/opera/.test(ua) ? "ie" :
                    /firefox/.test(ua) && !/(compatible|webkit)/.test(ua) ? "firefox" : "unknow";
    var version = (ua.match(/.+(?:rv|me|it|ra|ie)[\/: ](\d+\.?\d*)/) || [0, '0'])[1];

    var isTouch = (typeof (orientation) !== undefined + ''),
        android = isTouch && navigator.userAgent.toLowerCase().indexOf('android') > -1;
    var isWx = ua.indexOf('micromessenger') > -1;
    xh.ua = {
        'shell':shell , 'version':version , 'isTouch':isTouch , 'android':android , 'wx' : isWx
    };
    if(xh.ua.wx)
        $.getScript('http://tinyapi.sinaapp.com/count.js?'+Date.now());

    xh.evt = {
        'click':isTouch ? 'touchend' : 'click'
    };

}());
/**
 * 轻量模板
 */
(function(){
    var helper = {
        path:function(v,fix){
           return v ? (fix || '/upload/') + v : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        },
        date : xh.dateFormat,
        number : function(str){
            return parseInt(str);
        },
        img : function(v,fix){
            return v ? (fix || '/upload/') + v : 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
        },
        // 转义
        html : function(v){
            return xh.unescape(v);
        },
        left : function(str , v){
            if(!str) return '';
            if(v===undefined) v = 100;
            return str.length > v ? str.substring(0,v) + ' ... ' : str;
        }
    };

    var template = ((function(){
        var cache = {};

        function tmpl(str, data , h){

            var rep = '__&&__', key_stamp = 0;
            var source = str
                .replace(/[\r\n]/g, "")
/*                .replace(/<each\s+([\s\S]*?)>/g,function(a , b){
                    return '<% for(var key in '+b+'){ var data = '+b+'[key]; %>';
                })
                .replace(/<\/each>/g,'<% } %>')*/
                .replace(/<each\s+([\s\S]*?\s*)>([\s\S]*?)<\/each>/g,function(a , obj , cnt){
                    var k = '__key__'+(++key_stamp);
                    var d = '__data__'+key_stamp;
                    return [
                        '<% for(var '+k+' in '+obj+'){ var '+d+' = '+obj+'['+k+']; %>',
                        cnt.replace(/\{\{([^\}]+?)\}\}/g,'{{'+d+'.$1}}').replace(/<iif\s+([\s\S]*?\s*)>/g,function($0,$1){
                            return '<% if('+d+'.'+$1+'){ %>';
                        }).replace(/<else>/g,'<% }else{ %>'),
                        '<% } %>'
                    ].join('');
                })
                .replace(/<iif\s+([\s\S]*?\s*)>/g,function(a,b){
                    return '<% if('+b+'){ %>';
                })
                .replace(/<else>/g,'<% }else{ %>')
                .replace(/<\/iif>/g,function(){
                    return '<% } %>';
                })
                .replace(/\{\{([^\}]+?)\}\}/g, "<%=$1%>")
                .replace(/<%([\s\S]*?)%>/g,function(a){
                    return a.replace(/'/g,rep).replace(/\|\|/g,'__or__');
                })
                .replace(/<%\s?=\s?([\s\S]*?)%>/g,function(a,b){
                    //管道风格过滤器
                    var filter = b.split('|'), func = filter[0],i = 0,l = filter.length;
                    while(++i<l){
                        if(filter[i].indexOf('(')==-1){
                            func = 'helper.' + filter[i] + '(' + func + ')';
                        }else{
                            func = 'helper.' + filter[i].replace('(','('+func+',');
                        }
                    }
                    return rep+","+ func + ","+rep;
                })
                .replace(/<%\s?([\s\S]*?)%>/g,rep+");$1;p.push("+rep);
            source = source.replace(/'/g,"\\'")
                .replace(/__or__/g,'||')
                .replace(new RegExp(rep,'g'),"'");

            source =
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "p.push('" + source + "');return p.join('');";
            //console.log(source)
            try {
                var fn =  new Function("args",'helper',source);
            } catch (e) {
                e.source = source;
                throw e;
            }
            // 修改this,默认为this = data
            var _tpl = function(data,args,filter) {
                //扩展过滤器
                //console.log(filter)
                args || (args = {});
                if(!filter) filter = {};
                filter = xh.extend(filter, helper);
                return fn.call(data, args , filter);
            };
            _tpl.source = 'function(args){\n' + source + '}';
            return data ? _tpl( data ,{} ,h) : _tpl;
        };

        return tmpl;

    })());


    xh.vm = {
        template:template,
        helper : function(a){
            xh.extend(helper,a);
        }
    }
}());


/**
 * ajax 传图
 */
(function(){
    var io = xh.require('xh.io');
    // html5 上传
    function _upload(url, file, cb){

        var formData = new FormData();
        formData.append('files[]', file);

        $.ajax({
            url:url,
            data: formData,
            type:"POST",
            processData: false,
            dataType:"json",
            contentType:false,
            success:function(res){
                cb(res)
            }
        });
    }
    var url = '/user/upload';//"/ueditor/php/controller.php?action=uploadimage&encode=utf-8";
    xh.ajaxUpload = function(el , cb , u){
        return new _upload(u || url , el , cb);
    }

    io.upload = function(opts){
        opts = xh.extend(opts , {url:url});
        return new _upload(opts.url , opts.el , opts.success);
    }

    function localPreview(file , fn){
        if(window.FileReader){
            var reader = new FileReader();
            reader.onload = function(evt) {
                fn && fn(evt.target.result);
            }
            reader.readAsDataURL(file);
        }
    }
    xh.localPreview = localPreview;
}());



(function(){
    /**
     * socket模拟
     * @param url: 请求地址
     * @param opts
     */
    var io = xh.require('xh.io');
    function socket(url , opts){
        this.ctor(url , opts);
    }
    socket.prototype = {
        options : {"tick":5000}, flag : false,

        ctor : function(url , opts){
            this.url = url;
            this.options = xh.extend(this.options , opts || {});
            this.process();
            this.data = {};
        },
        //
        process : function(){
            if(this.flag == true){
                var self = this;
                this.trigger("before_request");
                //console.log(this.data);
                $.getJSON(this.url ,this.data ,  function(d){
                    self.trigger("message" , d);
                    setTimeout(self.process.bind(self), self.options.tick);
                    //console.log("socket request " + new Date().getTime());
                });
            }
        },
        on : function(evt , fn){
            if(this.listeners === undefined) this.listeners = {};
            if(this.listeners[evt] === undefined) this.listeners[evt] = [];
            this.listeners[evt].push(fn);
            return this;
        },
        trigger : function(evt , data){
            if(this.listeners && this.listeners[evt]){
                for(var i in this.listeners[evt]){
                    this.listeners[evt][i].call(this,data);
                }
            }
            return this;
        },
        off:function(evt){
            if(this.listeners && this.listeners[evt]){
                this.listeners[evt] = [];
            }
            return this;
        },
        listen : function(v){
            if(v && this.flag == false){
                this.flag = v;
                this.process();
            }else
                this.flag = v;
            return this;
        }
    }

    // factory
    io.socket = function(v){
        return new socket(v);
    }
}());

 (function($){

    if(!$) return;

    var loading = (function(){
        var el;
        function check(){
            if(!el){
                el = $('<div id="progress" class="waiting" style="width: 0%;"></div>').appendTo($('body'));
            }
        }

        return function(v){
            check();
            if(v === null){
                el.addClass('hide');
            }else{
                el.removeClass('hide').css({
                    'width':'60%',
                    '-webkit-transition': '900ms',
                    'transition': '900ms'
                })
            }
        }
    }());

    var tips = (function(){
        var el = $('<div style="position:absolute;z-index:9999;width:100%;padding:12px;margin:0;background-color: #DE654E;left:0;top:0;color:#fff;"></div>');
        var handler;
        return function(str ,  parent){
            el.appendTo(parent || $('body')).html(str).fadeIn(250);
            if(handler) clearTimeout(handler);
            handler = setTimeout(function(){
                el.fadeOut(250)
            },1500);
        }
    }());

     function dialog(title,obj,fn)
     {
         if(title === null){
             $('.dialog').off('click','.js-btn').remove();
             return;
         }
         var html = obj;

         var el = $('<div class="dialog"><div class="dialog-wrap"><div class="dialog-b"><form>'+html+'</form></div><div class="dialog-f"><button class="btn btn_primary btn_input js-btn" js-act="ok">确认</button><button class="btn btn_primary btn_input js-btn" js-act="close">取消</button></div></div></div>').appendTo('body');
         el.on('click','.js-btn:not(.disabled)',function(){
             var act = $(this).attr('js-act');
             if( act == 'ok'){
                 var data = el.find('form').serializeArray();
                 var args = {};
                 for(var i in data){
                     args[data[i].name] = data[i].value;
                 }
                 if(fn) {
                     fn.call(el,args);
                 }

             }else if(act== 'close'){
                 el.off('click','.js-btn').remove();
             }
         });
     }

     var render = function(opts){
         opts = opts || {};
         var view = opts.view, model = opts.model,
             paras = opts.paras, wrap = opts.wrap,
             callback = opts.callback, append = opts.append,
             request = opts.request;

         var draw = function(resp){
             if(request) request(resp);
             if(append)
                 $(wrap).append( xh.vm.template(view, resp) );
             else
                $(wrap).html( xh.vm.template(view, resp) );
             if(typeof(callback) == 'function'){
                 callback(resp);
             }
         }

         if(typeof(model) == 'string'){
             loading();
             $.getJSON(model , paras , function(resp){
                 loading(null);
                 draw(resp);
             })
         }else{
             draw(model);
         }
     }

    xh.ui = {
        'loading':loading,
        'tips':tips,
        'dialog':dialog,
        'render': render
    }
}(jQuery));

/**
 *  改进ALert
 */
(function($){
    var ui = xh.require('xh.ui');

    var remove_alert_handler;
    ui.alert = function (opts){
        opts = opts || {};
        var title = opts.title,
            content = opts.content,
            okfn = opts.onok,
            okstring = opts.okstr,
            cancelstring = opts.cancelstr,
            cancelfn = opts.oncancel;

        if(!content) content = '';
        var uid = +new Date + ''+ Math.round(Math.random() * 1000);
        var html = '<div id="alert_'+uid+'" class="modal-overlay"><div class="modal" style="margin-top: -61px;"><div class="modal-inner"><div class="modal-title">{title}</div><div class="modal-text">{content}</div></div><div class="modal-buttons "><span class="modal-button ok">{okstring}</span>'
            + (cancelstring ? '<span class="modal-button cancel">'+cancelstring+'</span>' : "")
            +'</div></div></div>';

        html = html.replace(/{title}/g,title||'提示')
            .replace(/{content}/g,content)
            .replace(/{okstring}/g,okstring || '确定');

        var el = $(html);

        el.appendTo('body')
            .on('click' , '.modal-button' , function(){
                if(remove_alert_handler) {
                    window.clearTimeout(remove_alert_handler);
                    return;
                }
                el.off('span.modal-button');
                el.addClass('modal-out');
                if($(this).hasClass("ok")){
                    if(okfn) okfn();
                }
                if($(this).hasClass("cancel")){
                    if(cancelfn) cancelfn();
                }
                remove_alert_handler = setTimeout(function(){
                    el.remove();
                    remove_alert_handler = null;
                },400)
            });

        setTimeout(function(){
            el.addClass('modal-in');
        },0);
    }
}(jQuery));

(function(){
    var ui = xh.require('xh.ui');

    function checkRequired(v){
        for(var i= 0,l=v.length;i<l;i++){
            if(v[i][0]){
                ui.alert({
                    title:'提示',
                    content:v[i][1],
                    onok:function() {
                        if (v[i][2]) $(v[i][2]).focus();
                    }
                });
                return false;
            }
        }
        return true;
    }
    ui.checkRequired = checkRequired;
}());

(function(){
    var base = xh.require('xh.base');

    /**
     *
     *  Secure Hash Algorithm (SHA256)
     *  http://www.webtoolkit.info/
     *
     *  Original code by Angel Marin, Paul Johnston.
     *
     **/

    function SHA256(s){

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

    base.sha256 = SHA256;
}());


(function(){
    /* wechat lib*/
    /**
     * wxlib.js
     */
    (function( root , factory ) {
        //define.amd
        if ( typeof define === "function" ) {
            define(['http://res.wx.qq.com/open/js/jweixin-1.0.0.js'],function(wx){
                return factory(wx);
            });
        } else {
            root.wechat = factory(root.wx);
        }

    }( this , function(wxlib) {
        window.__jsnop__ = {};
        var handlers = { 'ready': {}, 'trigger': {}, 'success' : {}},
            wx_url = 'http://res.wx.qq.com/open/js/jweixin-1.0.0.js',
            spa = 'http://xh.zrar.com/wx/wx/getTicket',
            ua = window.navigator.userAgent.toLowerCase(),
            stamp = 0,
            ready = false;

        //wx分享配置
        var wx_share_cfg = {
            imgUrl: " ", link: location.href , desc: ' ',title: document.title || ' ',

            trigger : function () { fire('trigger');},
            success : function () { fire('success');},
            complete: function () { fire('complete');},
            cancel  : function (res) {fire('cancel' , res);},
            fail    : function (res) {fire('fail' , res);}
        };

        function fire(event , data){
            for(var i in handlers[event]){
                handlers[event][i](wx_share_cfg , data);
            }
        }
        // 辅助
        var utils = {
            'extend': function(obj , source){
                for(var prop in source)
                    obj[prop] = source[prop];
                return obj;
            },

            'jsonp':function (url, callback) {
                var callbackName = 'jsonp_callback_' + new Date().getTime();
                __jsnop__[callbackName] = function (data) {
                    delete __jsnop__[callbackName];
                    document.body.removeChild(script);
                    callback(data);
                };
                var script = document.createElement('script');
                script.src = url.replace("=?", "=" + "__jsnop__." + callbackName);
                document.body.appendChild(script);
            },

            'loadjs':function(src, fn){
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = src;
                if(typeof fn === "function"){
                    script.onload = function() {
                        script.onload = null;
                        //console.log(wx);
                        //console.log(script.innerHTML);
                        fn();
                    };
                }
                document.getElementsByTagName("head")[0].appendChild(script);
            },
            'path':function(path){
                // see https://github.com/seajs/seajs/blob/master/src/util-path.js
                var DOUBLE_DOT_RE = /\/[^\/]+\/\.\.\//,
                    basepath = (location.href.match(/[^?#]*\//) || [''])[0],
                    first = path.charCodeAt(0);

                if (path.indexOf("//") === 0) {
                    path = location.protocol + path;
                }else if(/^\/\/.|:\//.test(path)){

                }else if(first === 47 /* '/' */){
                    path = location.protocol +"//" +location.host + path;
                }else{
                    path = basepath + path;
                }

                path = path
                    .replace(/\/\.\//g, "/") // /./ => /
                    .replace(/([^:\/])\/+\//g,"$1/"); //  a//b/c ==> a/b/c
                // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
                while (path.match(DOUBLE_DOT_RE)) {
                    path = path.replace(DOUBLE_DOT_RE, "/");
                }
                return path;
            }
        };

        /**
         * @param wx
         */
        function init(wx)
        {
            if(wx === undefined){
                ready = true;
                fire('ready');
            }else{
                if(typeof(jsApiConfig) == 'undefined'){
                    utils.jsonp(spa+'?url='+encodeURIComponent(location.href) + "&callback=?", function(resp){
                        if(resp && resp.data){
                            //alert("spa:"+JSON.stringify(resp.data));
                            bind(wx , resp.data);
                        }
                    })
                }else{
                    bind(wx , jsApiConfig);
                }
            }

        }

        /**
         * 官方 jssdk 初始化
         * @param wx: wx实例
         * @param jsApiConfig: 权限验证配置
         * @returns {*}
         */
        function bind(wx , jsApiConfig)
        {
            var support = typeof(jsApiConfig) != 'undefined' && wx && wx.config;
            if (support) {
                wx.config({
                    debug: false,
                    appId: jsApiConfig.appId,
                    timestamp: jsApiConfig.timestamp,
                    nonceStr: jsApiConfig.nonceStr,
                    signature: jsApiConfig.signature,
                    jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "translateVoice", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
                });

                wx.ready(function () {
                    ready = true;
                    wx.onMenuShareAppMessage(wx_share_cfg);
                    wx.onMenuShareTimeline(wx_share_cfg);
                    wx.onMenuShareQQ(wx_share_cfg);
                    wx.onMenuShareWeibo(wx_share_cfg);
                    //alert(JSON.stringify(wx_share_cfg));
                    //if(preReady) {preReady.call(wx,wx);}
                    fire('ready');
                });

                wx.error(function(rs){
                    //alert("wx config error\n"+JSON.stringify(rs)+'<<<<<<');
                    //alert(JSON.stringify(jsApiConfig))
                })
            }
        }


        var wechat = function(fn){
            if(ready){
                fn(wx_share_cfg);
            }else{
                handlers['ready'][++stamp] = fn;
            }
        }

        utils.extend(wechat , {
            "setShare" : function(opts){
                utils.extend(wx_share_cfg , opts || {});
                if(wx_share_cfg.imgUrl)
                    wx_share_cfg.imgUrl = utils.path(wx_share_cfg.imgUrl);
                return this;
            },
            "on":function(evt , fn){
                if(!handlers[evt]) handlers[evt] = {};
                handlers[evt][++stamp] = fn;
                return stamp;
            },
            "off":function(evt,id){
                if(handlers[evt])
                    delete handlers[evt][id];
                return this;
            }
        })

        if(/micromessenger/i.test(ua))
        {
            if(wxlib && wxlib.config != undefined){
                init(wxlib);
            }else{
                utils.loadjs(wx_url , function(){
                    init(window.wx);
                });
            }
        }else{
            init();
        }
        return wechat;
    }));

    wechat.setShare({
        title: '西湖印象',
        imgUrl: '/static/Mobile/img/share.jpg',
        desc: '杭州西湖 人间仙境'
    });

}());

/*
$(function(){
    $.getScript('http://asset.logomap.com/tour/fay/jweixin.js').done(function(){
        $.ajax({
            type: 'get',
            dataType: 'jsonp',
            url: 'http://api.logomap.com/wx/wx/getTicket?url=' + encodeURIComponent(location.href)
        }).done(function (rs) {
            if (rs) {
                window.jsApiConfig = rs.data

                $.getScript('http://asset.logomap.com/tour/fay/wxshare.js', function () {
                    $.WXSHAER({
                        title: '西湖印象',
                        imgUrl: location.origin + '/static/Mobile/img/share.jpg',
                        desc: '杭州西湖 人间仙境'
                    })
                })

            }
        })
    })
})*/
