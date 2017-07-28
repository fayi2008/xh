/*************************
 * ui.js
 ************************/

(function(){
    var loading_handler;
    function loading(v){
        var el = '<div id="___loading" style="position:fixed;width:100%;height:100%;;top:0;left:0;z-index:999999;"><div class="loading circle"></div></div>';
        if(v === null){
            $("#___loading").remove();
            if(loading_handler){
                window.clearTimeout(loading_handler);
            }
        }else{
            loading_handler = setTimeout(function(){
                $('body').append(el);
            },500)
        }
    }


    var remove_alert_handler;
    function _alert(title , content , okfn , okstring,cancelfn,cancelstring){
        if(typeof(title) == "object"){
            opts = title || {};
            title = opts.title;
            content = opts.content;
            okfn = opts.onok;
            okstring = opts.okstr;
            cancelstring = opts.cancelstr;
            cancelfn = opts.oncancel;
        }
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
        },0)
    }

    var ui = {
        "loading":loading,
        "alert":_alert
    };

    window.ui = ui;
}());

/**
 * 图钉对象
 */
;(function(){

    var cross_label = (function(){

        /* label */
        var marker = function(pos){
            this._position = pos;
            this.setMap = function(map){
                if(map === null)
                    this._map.removeOverlay(this);
                else
                    map.addOverlay(this);
                return this;
            }

            this.setPosition = function(v){
                this._position = v;
                this.draw();
            }

            this.toggle = function(v){
                if(v) $(this._el).addClass('show');
                else $(this._el).removeClass('show');
            }
        }

        marker.prototype = new BMap.Overlay();

        marker.prototype.initialize = function(map){
            this._map = map;
            var el = this._el = mapx.dom.create("div" , 'mapx-cross');
            map.getPanes().labelPane.appendChild(el);
            return el;
        }

        marker.prototype.draw = function(){
            var pixel = this._map.pointToOverlayPixel(this._position);
            this._el.style.left = pixel.x +"px";
            this._el.style.top  = pixel.y +"px";
        }

        return new marker(mapx.latlng(0,0));
    }());

    function init(app){
        map = app.getMap();
        cross_label.setMap(map);
    }

    app && init(app);

    function format(v){
        if(v<1000) return Math.round(v)+"m";
        else if(v>=1000 && v< 10000){
            return Math.round(v*10/1000)/10 + "km";
        }
    }

    var cross_ready = false;
    window.cross = {
        "set" : function(v){
            if(v === null){
                cross_ready =  false;
            }else{
                var center = v || map.getCenter();
                //console.log(center);
                cross_ready =  true;
                cross_label.setPosition(center);
            }

        },
        "ready":function(){
            if( cross_ready ){
                return true;
            }else{
                //alert(cross.ready())
                return loc.ready();
            }
        },
        "get" : function(){
            return cross_ready ? cross_label._position : map.getCenter();
        },
        "distance":function(v){
            if($("body").hasClass("mode-contact")){
                var dist  = mapx.spherical.distance(cross_label._position , v);
                return format(dist);
            }else{
                return "";
            }
        }

    };
}());


/**
 * flipsnap 图片轮播
 *
 * reruin@gmail.com
 * MIT license , 2015-04-03
 *
 * =================================================
 * flipsnap(element:string|dom , opts:{
 *  photos:[],
 *  afterSlide:function(index){}
 * });
 *
 * this.next();
 * this.prev();
 * this.slide(index:int ,speed:number);
 * =================================================
 *
 */
(function( factory ) {
    //define.amd
    if ( typeof define === "function" ) {
        // AMD CMD
        define(factory);
    } else {
        // Browser globals
        var ui = window.ui || {};
        ui.flipsnap = factory();
        //console.log(ui)
    }

    //jQuery plugs
    if(window.jQuery) {
        jQuery.fn.flipsnap = function (opts) {
            this.each(function() {
                $(this).data('flipsnap', new factory($(this)[0], params));
                new factory($(this)[0], opts);
            });
        }

        jQuery.flipsnap = function (el, opts) {
            return new factory($(el)[0], opts);
        }
    }
}(function() {

    var stack = {};

    var $$ = function(id) {
        return document.querySelector(id);
    }

    var prefix = (function(){
        var styles = window.getComputedStyle ? window.getComputedStyle(document.documentElement, '') : document.documentElement.style;
        if(styles.transform){
            return {
                'transitionend': 'transitionend',
                'transitionDuration' : 'transitionDuration',
                'transform':'transform'
            }
        }
        var
            pre = (Array.prototype.slice
                .call(styles)
                .join('')
                .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
            )[1];

        return {
            'transitionend': pre + 'TransitionEnd',
            'transitionDuration' : pre + 'TransitionDuration',
            'transform':pre+'Transform'
        }
    }());

    var nextFrame = function(fn) { setTimeout(fn || function(){}, 0) }

    function flipsnap(container, options) {

        if (!container) {
            alert('container is null'); return;
        }

        if (typeof(container) == 'string' && /^#/.test(container)) {
            container = $$(container);
        }

        var tpl = '<li style="float:left;width:{width}px" data-id="{id}"><img src="{src}" style="width:100%;height:auto;display:block;overflow: hidden;" /></li>';

        var data = options.photos,
            el,
            index = 0,
            speed = options.speed || 400,
            delay = Math.max(options.delay || 3000 , 3000),
            uid = +new Date + '' + Math.ceil(Math.random() * 1000),
            width = container.getBoundingClientRect().width || container.offsetWidth;
        width = Math.round(width * 1.3333333);

        function init() {

            destroy();

            var html = '';

            for (var i in data) {
                html += tpl.replace('{src}', data[i]).replace('{width}', width)
                    .replace('{id}', i);
            }
            html = '<div style="overflow: hidden;"><ul id="flipsnap_' + uid + '"  class="flipsnap" style="-webkit-backface-visibility:hidden;list-style: none;overflow: hidden;width:' + (width * data.length) + 'px;padding:0;margin:0;">' + html + '</ul></div>';

            container.innerHTML = html;

            el = $$('#flipsnap_' + uid);

            container.setAttribute('data-flipsnap', uid);

            bind();

            auto();
        }

        var start, delta, isinter;
        var events = {

            handleEvent: function(event) {
                switch (event.type) {
                    case 'touchstart': this.start(event); break;
                    case 'touchmove': this.move(event); break;
                    case 'touchend': this.end(event); break;
                    case prefix.transitionend :
                        nextFrame(this.transitionEnd(event)); break;
                    case 'resize': offloadFn(setup.call()); break;
                }

                if (options.stopPropagation) event.stopPropagation();
            },
            start: function(event) {
                var touches = event.touches[0];
                start = {
                    x: touches.pageX,
                    y: touches.pageY,
                    time: +new Date
                };
                stop();
                delta = {};
                el.addEventListener('touchmove', this, false);
                el.addEventListener('touchend', this, false);

            },
            move: function(event) {

                if ( event.touches.length > 1 || event.scale && event.scale !== 1) return;
                if (options.disableScroll) event.preventDefault();

                var touches = event.touches[0];
                //变化量
                delta = {
                    x: touches.pageX - start.x,
                    y: touches.pageY - start.y
                }
                // 用户滚动页面
                var isScrolling = Math.abs(delta.x) < Math.abs(delta.y);

                // 如果用户没有试图垂直滚动
                if (!isScrolling) {
                    event.preventDefault();
                    // 第一张往右左拖动 和 最后一张往左拖动
                    if (!index && delta.x > 0 || index == data.length - 1 && delta.x < 0) {
                        delta.x /= Math.abs(delta.x) / width + 1;
                    }

                    translate(-index * width + delta.x, 0);
                }
            },

            end: function(event) {
                var dur = +new Date - start.time;
                // 1.滑动时间小于250ms 且幅度大于 20px
                // 2.滑动出半屏
                var isSlide = (Number(dur) < 250 && Math.abs(delta.x) > 20)
                    || Math.abs(delta.x) > width/2;

                // 方向 左+1 右-1
                // 方向 左+1 右-1
                move(isSlide ?
                index + (delta.x < 0 ? 1 : -1) :
                    index );

                el.removeEventListener('touchmove', events, false)
                el.removeEventListener('touchend', events, false)
            },

            transitionEnd: function(event) {
                options.afterSlide && options.afterSlide.call(event, index);
                auto();
            }
        }

        function auto() {
            if(delay) stack[uid] = window.setTimeout( next , delay);
        }

        function stop() {
            stack[uid] && window.clearTimeout(stack[uid]);
        }

        function bind(){
            el.addEventListener('touchstart', events, false);
            el.addEventListener(prefix.transitionend, events, false)
        }

        function slide(i , s){
            move(i , s);
        }

        function next(){
            move(index == data.length-1 ? 0 : index + 1);
        }

        function prev(){
            move(index == 0 ? data.length-1 : index-1);
        }

        function move(v , s){
            stop();
            if (v<0) v = 0;
            if (v>=data.length) v = data.length - 1;
            index = v;
            translate(-index * width , s);
        }

        function translate( dist, s) {

            var style = el.style;

            if (!style) return;

            if(s === undefined) s = speed;

            style[prefix.transitionDuration] = s + 'ms';

            style[prefix.transform] = 'translateX(' + parseInt(dist) + 'px) translateZ(0px)';

        }

        function destroy() {
            var instance = container.getAttribute('data-flipsnap');
            if (stack[instance]) {
                window.clearTimeout(stack[instance]);
                container.removeAttribute('data-flipsnap');
                var el = $$('#flipsnap_' + instance);
                el.removeEventListener('touchstart', events, false);
                el.removeEventListener(prefix.transitionend, events, false);
                container.innerHTML = '';
            }
        }

        init();

        return {
            'destroy': destroy,
            'next':next,
            'prev':prev,
            'slide':slide
        }

    }

    return flipsnap;
}));