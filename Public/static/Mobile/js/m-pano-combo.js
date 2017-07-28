/**
 * 全景组合插件
 */

/*! iScroll lite v5.1.3 ~ (c) 2008-2014 Matteo Spinelli ~ http://cubiq.org/license */
(function(d,a,c){var f=d.requestAnimationFrame||d.webkitRequestAnimationFrame||d.mozRequestAnimationFrame||d.oRequestAnimationFrame||d.msRequestAnimationFrame||function(g){d.setTimeout(g,1000/60)};var b=(function(){var k={};var l=a.createElement("div").style;var i=(function(){var p=["t","webkitT","MozT","msT","OT"],n,o=0,m=p.length;for(;o<m;o++){n=p[o]+"ransform";if(n in l){return p[o].substr(0,p[o].length-1)}}return false})();function j(m){if(i===false){return false}if(i===""){return m}return i+m.charAt(0).toUpperCase()+m.substr(1)}k.getTime=Date.now||function g(){return new Date().getTime()};k.extend=function(o,n){for(var m in n){o[m]=n[m]}};k.addEvent=function(p,o,n,m){p.addEventListener(o,n,!!m)};k.removeEvent=function(p,o,n,m){p.removeEventListener(o,n,!!m)};k.prefixPointerEvent=function(m){return d.MSPointerEvent?"MSPointer"+m.charAt(9).toUpperCase()+m.substr(10):m};k.momentum=function(s,o,p,m,t,u){var n=s-o,q=c.abs(n)/p,v,r;u=u===undefined?0.0006:u;v=s+(q*q)/(2*u)*(n<0?-1:1);r=q/u;if(v<m){v=t?m-(t/2.5*(q/8)):m;n=c.abs(v-s);r=n/q}else{if(v>0){v=t?t/2.5*(q/8):0;n=c.abs(s)+v;r=n/q}}return{destination:c.round(v),duration:r}};var h=j("transform");k.extend(k,{hasTransform:h!==false,hasPerspective:j("perspective") in l,hasTouch:"ontouchstart" in d,hasPointer:d.PointerEvent||d.MSPointerEvent,hasTransition:j("transition") in l});k.isBadAndroid=/Android /.test(d.navigator.appVersion)&&!(/Chrome\/\d/.test(d.navigator.appVersion));k.extend(k.style={},{transform:h,transitionTimingFunction:j("transitionTimingFunction"),transitionDuration:j("transitionDuration"),transitionDelay:j("transitionDelay"),transformOrigin:j("transformOrigin")});k.hasClass=function(n,o){var m=new RegExp("(^|\\s)"+o+"(\\s|$)");return m.test(n.className)};k.addClass=function(n,o){if(k.hasClass(n,o)){return}var m=n.className.split(" ");m.push(o);n.className=m.join(" ")};k.removeClass=function(n,o){if(!k.hasClass(n,o)){return}var m=new RegExp("(^|\\s)"+o+"(\\s|$)","g");n.className=n.className.replace(m," ")};k.offset=function(m){var o=-m.offsetLeft,n=-m.offsetTop;while(m=m.offsetParent){o-=m.offsetLeft;n-=m.offsetTop}return{left:o,top:n}};k.preventDefaultException=function(o,n){for(var m in n){if(n[m].test(o[m])){return true}}return false};k.extend(k.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,pointerdown:3,pointermove:3,pointerup:3,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3});k.extend(k.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(m){return m*(2-m)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(m){return c.sqrt(1-(--m*m))}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(n){var m=4;return(n=n-1)*n*((m+1)*n+m)+1}},bounce:{style:"",fn:function(m){if((m/=1)<(1/2.75)){return 7.5625*m*m}else{if(m<(2/2.75)){return 7.5625*(m-=(1.5/2.75))*m+0.75}else{if(m<(2.5/2.75)){return 7.5625*(m-=(2.25/2.75))*m+0.9375}else{return 7.5625*(m-=(2.625/2.75))*m+0.984375}}}}},elastic:{style:"",fn:function(m){var n=0.22,o=0.4;if(m===0){return 0}if(m==1){return 1}return(o*c.pow(2,-10*m)*c.sin((m-n/4)*(2*c.PI)/n)+1)}}});k.tap=function(o,m){var n=a.createEvent("Event");n.initEvent(m,true,true);n.pageX=o.pageX;n.pageY=o.pageY;o.target.dispatchEvent(n)};k.click=function(o){var n=o.target,m;if(!(/(SELECT|INPUT|TEXTAREA)/i).test(n.tagName)){m=a.createEvent("MouseEvents");m.initMouseEvent("click",true,true,o.view,1,n.screenX,n.screenY,n.clientX,n.clientY,o.ctrlKey,o.altKey,o.shiftKey,o.metaKey,0,null);m._constructed=true;n.dispatchEvent(m)}};return k})();function e(j,g){this.wrapper=typeof j=="string"?a.querySelector(j):j;this.scroller=this.wrapper.children[0];this.scrollerStyle=this.scroller.style;this.options={startX:0,startY:0,scrollY:true,directionLockThreshold:5,momentum:true,bounce:true,bounceTime:600,bounceEasing:"",preventDefault:true,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/},HWCompositing:true,useTransition:true,useTransform:true};for(var h in g){this.options[h]=g[h]}this.translateZ=this.options.HWCompositing&&b.hasPerspective?" translateZ(0)":"";this.options.useTransition=b.hasTransition&&this.options.useTransition;this.options.useTransform=b.hasTransform&&this.options.useTransform;this.options.eventPassthrough=this.options.eventPassthrough===true?"vertical":this.options.eventPassthrough;this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault;this.options.scrollY=this.options.eventPassthrough=="vertical"?false:this.options.scrollY;this.options.scrollX=this.options.eventPassthrough=="horizontal"?false:this.options.scrollX;this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough;this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold;this.options.bounceEasing=typeof this.options.bounceEasing=="string"?b.ease[this.options.bounceEasing]||b.ease.circular:this.options.bounceEasing;
    this.options.resizePolling=this.options.resizePolling===undefined?60:this.options.resizePolling;if(this.options.tap===true){this.options.tap="tap"}this.x=0;this.y=0;this.directionX=0;this.directionY=0;this._events={};this._init();this.refresh();this.scrollTo(this.options.startX,this.options.startY);this.enable()}e.prototype={version:"5.1.3",_init:function(){this._initEvents()},destroy:function(){this._initEvents(true);this._execEvent("destroy")},_transitionEnd:function(g){if(g.target!=this.scroller||!this.isInTransition){return}this._transitionTime();if(!this.resetPosition(this.options.bounceTime)){this.isInTransition=false;this._execEvent("scrollEnd")}},_start:function(h){if(b.eventType[h.type]!=1){if(h.button!==0){return}}if(!this.enabled||(this.initiated&&b.eventType[h.type]!==this.initiated)){return}if(this.options.preventDefault&&!b.isBadAndroid&&!b.preventDefaultException(h.target,this.options.preventDefaultException)){h.preventDefault()}var g=h.touches?h.touches[0]:h,i;this.initiated=b.eventType[h.type];this.moved=false;this.distX=0;this.distY=0;this.directionX=0;this.directionY=0;this.directionLocked=0;this._transitionTime();this.startTime=b.getTime();if(this.options.useTransition&&this.isInTransition){this.isInTransition=false;i=this.getComputedPosition();this._translate(c.round(i.x),c.round(i.y));this._execEvent("scrollEnd")}else{if(!this.options.useTransition&&this.isAnimating){this.isAnimating=false;this._execEvent("scrollEnd")}}this.startX=this.x;this.startY=this.y;this.absStartX=this.x;this.absStartY=this.y;this.pointX=g.pageX;this.pointY=g.pageY;this._execEvent("beforeScrollStart")},_move:function(l){if(!this.enabled||b.eventType[l.type]!==this.initiated){return}if(this.options.preventDefault){l.preventDefault()}var n=l.touches?l.touches[0]:l,i=n.pageX-this.pointX,h=n.pageY-this.pointY,m=b.getTime(),g,o,k,j;this.pointX=n.pageX;this.pointY=n.pageY;this.distX+=i;this.distY+=h;k=c.abs(this.distX);j=c.abs(this.distY);if(m-this.endTime>300&&(k<10&&j<10)){return}if(!this.directionLocked&&!this.options.freeScroll){if(k>j+this.options.directionLockThreshold){this.directionLocked="h"}else{if(j>=k+this.options.directionLockThreshold){this.directionLocked="v"}else{this.directionLocked="n"}}}if(this.directionLocked=="h"){if(this.options.eventPassthrough=="vertical"){l.preventDefault()}else{if(this.options.eventPassthrough=="horizontal"){this.initiated=false;return}}h=0}else{if(this.directionLocked=="v"){if(this.options.eventPassthrough=="horizontal"){l.preventDefault()}else{if(this.options.eventPassthrough=="vertical"){this.initiated=false;return}}i=0}}i=this.hasHorizontalScroll?i:0;h=this.hasVerticalScroll?h:0;g=this.x+i;o=this.y+h;if(g>0||g<this.maxScrollX){g=this.options.bounce?this.x+i/3:g>0?0:this.maxScrollX}if(o>0||o<this.maxScrollY){o=this.options.bounce?this.y+h/3:o>0?0:this.maxScrollY}this.directionX=i>0?-1:i<0?1:0;this.directionY=h>0?-1:h<0?1:0;if(!this.moved){this._execEvent("scrollStart")}this.moved=true;this._translate(g,o);if(m-this.startTime>300){this.startTime=m;this.startX=this.x;this.startY=this.y}},_end:function(l){if(!this.enabled||b.eventType[l.type]!==this.initiated){return}if(this.options.preventDefault&&!b.preventDefaultException(l.target,this.options.preventDefaultException)){l.preventDefault()}var n=l.changedTouches?l.changedTouches[0]:l,i,h,k=b.getTime()-this.startTime,g=c.round(this.x),q=c.round(this.y),p=c.abs(g-this.startX),o=c.abs(q-this.startY),j=0,m="";this.isInTransition=0;this.initiated=0;this.endTime=b.getTime();if(this.resetPosition(this.options.bounceTime)){return}this.scrollTo(g,q);if(!this.moved){if(this.options.tap){b.tap(l,this.options.tap)}if(this.options.click){b.click(l)}this._execEvent("scrollCancel");return}if(this._events.flick&&k<200&&p<100&&o<100){this._execEvent("flick");return}if(this.options.momentum&&k<300){i=this.hasHorizontalScroll?b.momentum(this.x,this.startX,k,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:g,duration:0};h=this.hasVerticalScroll?b.momentum(this.y,this.startY,k,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:q,duration:0};g=i.destination;q=h.destination;j=c.max(i.duration,h.duration);this.isInTransition=1}if(g!=this.x||q!=this.y){if(g>0||g<this.maxScrollX||q>0||q<this.maxScrollY){m=b.ease.quadratic}this.scrollTo(g,q,j,m);return}this._execEvent("scrollEnd")},_resize:function(){var g=this;clearTimeout(this.resizeTimeout);this.resizeTimeout=setTimeout(function(){g.refresh()},this.options.resizePolling)},resetPosition:function(h){var g=this.x,i=this.y;h=h||0;if(!this.hasHorizontalScroll||this.x>0){g=0}else{if(this.x<this.maxScrollX){g=this.maxScrollX}}if(!this.hasVerticalScroll||this.y>0){i=0}else{if(this.y<this.maxScrollY){i=this.maxScrollY}}if(g==this.x&&i==this.y){return false}this.scrollTo(g,i,h,this.options.bounceEasing);return true},disable:function(){this.enabled=false},enable:function(){this.enabled=true},refresh:function(){var g=this.wrapper.offsetHeight;
    this.wrapperWidth=this.wrapper.clientWidth;this.wrapperHeight=this.wrapper.clientHeight;this.scrollerWidth=this.scroller.offsetWidth;this.scrollerHeight=this.scroller.offsetHeight;this.maxScrollX=this.wrapperWidth-this.scrollerWidth;this.maxScrollY=this.wrapperHeight-this.scrollerHeight;this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0;this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0;if(!this.hasHorizontalScroll){this.maxScrollX=0;this.scrollerWidth=this.wrapperWidth}if(!this.hasVerticalScroll){this.maxScrollY=0;this.scrollerHeight=this.wrapperHeight}this.endTime=0;this.directionX=0;this.directionY=0;this.wrapperOffset=b.offset(this.wrapper);this._execEvent("refresh");this.resetPosition()},on:function(h,g){if(!this._events[h]){this._events[h]=[]}this._events[h].push(g)},off:function(i,h){if(!this._events[i]){return}var g=this._events[i].indexOf(h);if(g>-1){this._events[i].splice(g,1)}},_execEvent:function(j){if(!this._events[j]){return}var h=0,g=this._events[j].length;if(!g){return}for(;h<g;h++){this._events[j][h].apply(this,[].slice.call(arguments,1))}},scrollBy:function(g,j,h,i){g=this.x+g;j=this.y+j;h=h||0;this.scrollTo(g,j,h,i)},scrollTo:function(g,j,h,i){i=i||b.ease.circular;this.isInTransition=this.options.useTransition&&h>0;if(!h||(this.options.useTransition&&i.style)){this._transitionTimingFunction(i.style);this._transitionTime(h);this._translate(g,j)}else{this._animate(g,j,h,i.fn)}},scrollToElement:function(h,i,g,l,k){h=h.nodeType?h:this.scroller.querySelector(h);if(!h){return}var j=b.offset(h);j.left-=this.wrapperOffset.left;j.top-=this.wrapperOffset.top;if(g===true){g=c.round(h.offsetWidth/2-this.wrapper.offsetWidth/2)}if(l===true){l=c.round(h.offsetHeight/2-this.wrapper.offsetHeight/2)}j.left-=g||0;j.top-=l||0;j.left=j.left>0?0:j.left<this.maxScrollX?this.maxScrollX:j.left;j.top=j.top>0?0:j.top<this.maxScrollY?this.maxScrollY:j.top;i=i===undefined||i===null||i==="auto"?c.max(c.abs(this.x-j.left),c.abs(this.y-j.top)):i;this.scrollTo(j.left,j.top,i,k)},_transitionTime:function(g){g=g||0;this.scrollerStyle[b.style.transitionDuration]=g+"ms";if(!g&&b.isBadAndroid){this.scrollerStyle[b.style.transitionDuration]="0.001s"}},_transitionTimingFunction:function(g){this.scrollerStyle[b.style.transitionTimingFunction]=g},_translate:function(g,h){if(this.options.useTransform){this.scrollerStyle[b.style.transform]="translate("+g+"px,"+h+"px)"+this.translateZ}else{g=c.round(g);h=c.round(h);this.scrollerStyle.left=g+"px";this.scrollerStyle.top=h+"px"}this.x=g;this.y=h},_initEvents:function(g){var h=g?b.removeEvent:b.addEvent,i=this.options.bindToWrapper?this.wrapper:d;h(d,"orientationchange",this);h(d,"resize",this);if(this.options.click){h(this.wrapper,"click",this,true)}if(!this.options.disableMouse){h(this.wrapper,"mousedown",this);h(i,"mousemove",this);h(i,"mousecancel",this);h(i,"mouseup",this)}if(b.hasPointer&&!this.options.disablePointer){h(this.wrapper,b.prefixPointerEvent("pointerdown"),this);h(i,b.prefixPointerEvent("pointermove"),this);h(i,b.prefixPointerEvent("pointercancel"),this);h(i,b.prefixPointerEvent("pointerup"),this)}if(b.hasTouch&&!this.options.disableTouch){h(this.wrapper,"touchstart",this);h(i,"touchmove",this);h(i,"touchcancel",this);h(i,"touchend",this)}h(this.scroller,"transitionend",this);h(this.scroller,"webkitTransitionEnd",this);h(this.scroller,"oTransitionEnd",this);h(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var h=d.getComputedStyle(this.scroller,null),g,i;if(this.options.useTransform){h=h[b.style.transform].split(")")[0].split(", ");g=+(h[12]||h[4]);i=+(h[13]||h[5])}else{g=+h.left.replace(/[^-\d.]/g,"");i=+h.top.replace(/[^-\d.]/g,"")}return{x:g,y:i}},_animate:function(p,o,j,g){var m=this,l=this.x,k=this.y,h=b.getTime(),n=h+j;function i(){var q=b.getTime(),s,r,t;if(q>=n){m.isAnimating=false;m._translate(p,o);if(!m.resetPosition(m.options.bounceTime)){m._execEvent("scrollEnd")}return}q=(q-h)/j;t=g(q);s=(p-l)*t+l;r=(o-k)*t+k;m._translate(s,r);if(m.isAnimating){f(i)}}this.isAnimating=true;i()},handleEvent:function(g){switch(g.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(g);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(g);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(g);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(g);break;case"wheel":case"DOMMouseScroll":case"mousewheel":this._wheel(g);break;case"keydown":this._key(g);break;case"click":if(!g._constructed){g.preventDefault();g.stopPropagation()}break}}};e.utils=b;if(typeof module!="undefined"&&module.exports){module.exports=e}else{d.IScroll=e}})(window,document,Math);

var loc = (function(){
    var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAA51BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFhYVFRUVFRUmJiaFhYWLi4u8vLy+vr6/v7/CwsLQ0NDV1dXc3Nze3t7m5ubo6Ojo6Ojy8vLz8/P29vb39/f39/f6+vr8/Pz9/f39/f3+/v7+/v4Akf8Ckv8Ek/8Fk/8HlP8Nl/8QmP8hn/8nov8zp/9IsP9RtP9pvv9swP9vwf9ywv+c1P+f1v+94//M6f/////hEagwAAAAOHRSTlMAAQIDBAUGBwgJCgsMDQ8QERITFxgZHR4fICEjIyQlKEtNbnF0doyToKK3ubzU1uDi5enz9fj6/RQpAtoAAAE6SURBVCjPhZLXdoJgEIT5EURQWkRUsMUuiahJVKIpYlfm/Z8ngCViPGZuv7N7dmeGog4ihGZYXwxNCBURicUFUVIUSRTiMRIFSSWtG6Zp6GkleQFJLCFpxaplj8e2VS1qUuLECMOreqWLo7oVXeUZcpjh1XxzCG/jTibuxsOwmVf5cI7m5Gwb2E2dUNMd0M7KHB2sS2XqwMI5awHUMyl/JeHU8gtWzoVW6JdVjlC0oDWwdyLao6EJNMWIuoVlFC1h6SJDsbLRwyyKvjEwZJZiFfMVX1H0gZGp3EafeAvRjYUz9IKFd864c3zwcv/65UH48tGo+S+Zn4wK7M11gO3R3vct0MmF9oahFFojeGvXcdy1h1Gr8HAI5U+Uj+coA+YXoFR7sgH7uVbyC8CQ/2tzKpusKPJ12W5X9AdvFVc/U61zmwAAAABJRU5ErkJggg==';
    if(typeof(BMap) == 'undefined') return;
    /* label */
    function label(pos , data){
        this._position = pos;
        this.data = data;
        this.size = [26,26];
        this.setMap = function(map){
            if(map === null)
                this._map.removeOverlay(this);
            else
                map.addOverlay(this);
            return this;
        }

    }

    label.prototype = new BMap.Overlay();

    label.prototype.initialize = function(map){
        this._map = map;
        var el = this._el = P.dom.create("div" , null,'','position:absolute;background:url('+icon+') no-repeat;width:26px;height:26px;');
        map.getPanes().labelPane.appendChild(el);
        return el;
    }

    label.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._position);
        if(pixel){
            this._el.style.left = (pixel.x - 13) +"px";
            this._el.style.top  = (pixel.y - 13) +"px";
        }
    }

    label.prototype.setPosition = function(position){
        this._position = position ;
        this.draw();
    }
    return label;
}());

;(function(){

    var server = window.PANO_CFG_PATH || "/Panorama/";
    var img = window.PANO_IMG_PATH || "/pano/";
    function Combo(pano , season){
        //this.options = P.extend(this.options,opts);
        this.pano = pano;
        this.season = season;
        this.season_data = {};
        this.origin = pano.panoid;
        this.ctor();
    }

    Combo.prototype = {
        options : {
            api: server+"{id}/group.json"
        },

        ctor:function(){
            this._stamp = new Date().getTime() + "_" +Math.round(Math.random()*300);
            this.el   = P.dom.create('div',null,'p-combo-m',null);
            this.album = P.dom.create('div',null,'p-ctrl-album','',this.el);
            this.wrap = P.dom.create('div',null,'album-cnt','position:absolute;left:0;bottom:0;height:110px;width:100%;',this.album);
            this.wrap_body = P.dom.create('ul',null,null,'  position: absolute; overflow: visible;white-space: nowrap;',this.wrap);
            this.group = P.dom.create('div',null,null,'position:absolute;left:0;width:100%;top:0;height:24px;line-height:24px;color:#fff;',this.album);
            this.expand = P.dom.create("div",null,'p-expand',"position:absolute;top:-32px;right:0;height:32px;width:32px;background-color:rgba(0,0,0,0.5);",this.album);

            this.nav_top = P.dom.create('div',null,'p-nav_top','',this.el);
            this.nav_bottom = P.dom.create('div',null,'p-nav_bottom','',this.album);
            this.travel = P.dom.create('div',null,'p-nav-travel','',this.nav_top);
            this.culture = P.dom.create('div',null,'p-nav-culture','',this.nav_top);
            this.culture_list = P.dom.create('div',null,'p-nav-culture-list','',this.nav_top);
            this.toggle_map = P.dom.create('div',null,'p-nav-menu_map','',this.nav_top);
            this.toggle_gyro = P.dom.create('div',null,'p-nav-menu_gyro','',this.nav_top);

            this.tm = P.dom.create('div',null,'p-nav-tm','',this.nav_bottom);
            this.tm.innerHTML = '<span></span><ul style="display:none"><li data-id="1">春季</li><li data-id="2">夏季</li><li data-id="3">秋季</li><li data-id="4">冬季</li></ul>';
            var map_id = 'map_container'+ "_" + new Date().getTime() + "_" +Math.round(Math.random()*300);
            this.map_container = P.dom.create('div',map_id,'p-nav-map','',this.el);

            this.loc = new loc();
            this.pano.addEventListener("pano_changed" , this.onChanged , this);
            this.pano.whenReady(function(){
                this.setSeason(this.season);
                if(window.BMap){
                    var center = '30.2436200,120.1380500';
                    this.map = new BMap.Map(map_id,{enableMapClick:false,maxZoom:18});
                    this.map.centerAndZoom( new BMap.Point(120.1380500,30.2436200), 15);
                    this.map.enableScrollWheelZoom(true);
                    //TODO 此处执行有问题
                    this.loc.setMap(this.map);
                    this.loc.setPosition( this.map.getCenter() );
                }
            } , this);

            this._bind();
        },

        setSeason:function(season){
            this.season = season;
            var el = $('.p-nav-tm li[data-id='+this.season+']');
            el.addClass('select').siblings('li').removeClass('select');
            this._fetch(true);
        },

        setNav : function(){
            var position = this.pano.panoData.location.latLng;
            var p = xh.maps.latlng(position);
            this.map.panTo( p );
            this.loc.setPosition( p );
        },

        onChanged : function(){
            
            if(window.BMap) this.setNav();
            //window.panoData = this.pano.panoData;
            var season_data = this.season_data,
                panoData = this.pano.panoData;
            season_data[ panoData._raw.season ] = panoData._raw.pano_key;
            var el = $('.p-nav-tm li[data-id='+panoData._raw.season+']');
            //console.log(el);console.log(panoData);
            el.addClass('select').siblings('li').removeClass('select');

            if(this.origin != this.pano.panoid){
                this.origin = this.pano.panoid;
                this._fetch();
            }
        },

        _fetch : function(force){
            var id = this.pano.panoid, local = this;
            var group = {};
            //相同分组
            if(!force && this.data && this.data.panos && this.data.panos[id]) {
                this.tabIndex = this.data.panos[id].group_id;
                local.drawGroup();
                return;
            };
            //console.log(P.parse(this.options.api,{id:id}))
            var season = $('.p-nav-tm li.select').attr('data-id') || '0';
            $.getJSON(P.parse(this.options.api,{id:id}),{'season':season},function(resp){
                var data = resp.data;
                var panos = {};
                var cur_tab_id = data.length ? data[0].id : local.tabIndex;
                for(var i in data){
                    group[data[i].id] = data[i];
                    for(var j in data[i].group_list){
                        panos[data[i].group_list[j].pano_key] = data[i].group_list[j];
                        //如果等于当前全景,保存当前tab
                        if(data[i].group_list[j].pano_key == id){
                            cur_tab_id = data[i].id;
                        }
                    }
                }
                local.tabIndex = cur_tab_id;
                local.data = {
                    "raw" : data,
                    "group":group,
                    "panos":panos
                };
                local.drawGroup();
            })
        },

        getThumbById:function(id){
            return img + id + "/thumb.jpg";
        },

        drawGroup : function(id){
            if(this.tabIndex === undefined) return;

            if(id){
                //切换分组
                if(this.tabIndex != id){
                    this.tabIndex = id;
                    $(this.wrap).css({'left':0});
                    $(this.group).children("[data-id="+id+"]").addClass('select').siblings('a.select').removeClass("select");

                    if(this.data.group[id].group_list){
                        var id = this.data.group[id].group_list[0]. pano_key;
                        this.pano.setPano(id);
                    }

                }

            }else{
                var data = this.data.raw;
                var html = "", tabIndex = this.tabIndex;
                for(var i in data){
                    html += '<a class="'+(data[i].id == tabIndex ? "select" : "")+'" style="display:inline-block;height:24px;padding:0 10px;margin-right:5px;" data-id="'+data[i].id+'">'+data[i].name+'</a>';
                }
                this.group.innerHTML = '<div style="position: absolute; overflow: visible;white-space: nowrap;">' + html + '</div>';
                var local = this;
                setTimeout(function(){
                    new IScroll(local.group,{
                        click:true,
                        scrollX:true,
                        scrollY:false
                    });
                },0)
            }
            this.draw();
        },

        draw : function(){
            var data = this.data.group[this.tabIndex].group_list || [],
                id = this.pano.panoid,
                html = "";
            var misspano = true;

            for(var i in data){
                html += '<li style="width:200px;background:url('+this.getThumbById(data[i].pano_key)+') center center" class="'+(data[i].pano_key == id ? "select" : "")+'" data-id="'+data[i].pano_key+'"><span>'+data[i].title+'</span></li>';
                if(data[i].pano_key == id) misspano = false;
            }
            //console.log( data , id)
            
            if(misspano && data.length) this.pano.setPano(data[0].pano_key);

            this.wrap_body.innerHTML = html;
            //this.wrap_body.style.width = (200 + 5) * data.length + "px";
            this.scroll_body.refresh();
        },

        _bind : function(){
            var pano = this.pano, local = this;
            setTimeout(function(){
                //$('#wrap_'+local._stamp).css({'width':'500px'})
                local.scroll_body = new IScroll(local.wrap,{
                    click:true,
                    scrollX:true,
                    scrollY:false
                });
            },0);

            $(this.toggle_map).on('click' , function(){
                $('.p-nav-map').toggleClass('show');
                $(this).toggleClass('active');
            });
            $(this.toggle_gyro).on('click' , function(){
                local.pano.toggleGyro();
                $(this).toggleClass('active');
            });

            $(this.back).on('click',function(){
                history.back();
            });

            $(this.tm).on('click' , 'span' , function(){
                $(this).next().fadeToggle(150);
            });
            $(this.expand).on("click",function(){
                $(local.album).toggleClass("hide");
            });
            $(this.group).on('click','a',function(){
                var id = $(this).attr('data-id');
                local.drawGroup(id);
            });

            $(this.wrap).on("click",'li' , function(){
                var id = $(this).attr('data-id');
                pano.setPano(id);
            });

            $(this.tm).on('click',function(){
                $(this).children('ul').show();
            });

            /*$(this.tm).on('click','li',function(){
                $(this).children('ul').show();
            })*/
        },
        setDate : function(d){
            this.data = d;
            draw();
        }
    }

    window.Combo = Combo;
}());