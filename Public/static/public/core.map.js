/**
 *
 * maps.spherical:球面运算函数
 * maps.proj:投影转换
 * maps.location:定位
 *
 * 工厂
 * maps.latlng
 * maps.label
 */


(function(){
    window.maps = window.mapx = {};
}());

// base
(function(){
    var maps = window.maps;
    //采集的是 gcj02
    maps.Latlng = function(lat , lng){
        var p = maps.proj.gcj2bd(lat , lng);
        return new BMap.Point(p[1] , p[0]);
    }

    maps.Map = function(a , b){
        return new BMap.Map(a , b);
    }

    maps.dom = {
        create:function(tag , cls , style , parent)
        {
            var el = document.createElement(tag);
            if (cls) el.className = cls;
            if (style) el.setAttribute("style", style);
            if (parent) parent.appendChild(el);
            return el;
        }
    }

    maps.latlng = function(lat , lng){
        if(maps.is(lat , "Object")){
            return new maps.Latlng(lat.lat , lat.lng || lat.lon);
        }else if(maps.is(lat , "Array")){
            return new maps.Latlng(lat[0] , lat[1]);
        }else if(maps.is(lat , "Number") && maps.is(lng , "Number")){
            return new maps.Latlng(lat , lng);
        }else if(maps.is(lat , "String")){
            var l = lat.split(",");
            return new maps.Latlng(l[0] , l[1]);
        }
    }

    maps.extend = function(dist , src){
        for(var i in src){
            dist[i] = src[i];
        }
        return dist;
    };


    maps.is = function (obj,type) {
        return (type === "Null" && obj === null) ||
            (type === "Undefined" && obj === void 0 ) ||
            (type === "Number" && isFinite(obj)) ||
            Object.prototype.toString.call(obj).slice(8,-1) === type;
    };

    /**
     * 对象转数组
     * @param obj
     */
    maps.key = function(obj){
        var k = [];
        for(var i in obj){
            k.push(obj[i]);
        }
        return k;
    }
}());


/**
 * 投影转换
 */
(function(){
    var maps = window.maps;

    var proj = (function(){
        var pi = 3.14159265358979324;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

        function delta(lat,lon){
            var dLat = transformLat(lon - 105.0, lat - 35.0)
                , dLon = transformLon(lon - 105.0, lat - 35.0)
                , radLat = lat / 180.0 * pi
                , magic = Math.sin(radLat);

            magic = 1 - ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
            dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
            return {lat:dLat , lng:dLon};
        }

        function outOfChina(lat, lon)
        {
            if (lon < 72.004 || lon > 137.8347)
                return true;
            if (lat < 0.8293 || lat > 55.8271)
                return true;
            return false;
        }

        function transformLat(x, y)
        {
            var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
            return ret;
        }

        function transformLon(x, y)
        {
            var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
            return ret;
        }

        /**
         * 国标转百度
         * @param y
         * @param x
         * @returns {*[]}
         */
        function gcj2bd(y,x){
            var z = Math.sqrt(x*x + y*y) + 0.00002 * Math.sin(y * x_pi);

            var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
            var bd_lon = z * Math.cos(theta) + 0.0065;
            var bd_lat = z * Math.sin(theta) + 0.006;
            return [bd_lat , bd_lon];
        }

        /**
         * 百度转国标
         * @param y
         * @param x
         * @returns {*[]}
         */
        function bd2gcj(y,x){
            x = x - 0.0065, y = y - 0.006;

            var z = Math.sqrt(x*x + y*y) - 0.00002 * Math.sin(y * x_pi);

            var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
            var x = z * Math.cos(theta)
            var y = z * Math.sin(theta)
            return [y , x];
        }

        /**
         * wgs转国标
         * @param lat
         * @param lng
         * @returns {*}
         */
        function wgs2gcj(lat , lng)
        {
            if (outOfChina(lat, lng))
            {
                return {lat : lat , lng : lng};
            }
            var d = delta(lat , lng);
            return {lat: lat - d.lat, lng: lng - d.lng};
        }

        /**
         * 国标转wgs
         * @param  lat
         * @param  lng
         * @return {*} 
         */
        function gcj2wgs(lat , lng){
            if (outOfChina(lat, lng))
            {
                return {lat : lat , lng : lng};
            }
            var d = delta(lat , lng);
            return {lat: lat + d.lat, lng: lng + d.lng};
        }

        function bd2wgs(lat, lng){
            var t = bd2gcj(lat , lng);
            return gcj2wgs(t[0] , t[1]);
        }

        return{
            'gcj2bd':gcj2bd,
            'bd2gcj':bd2gcj,
            'wgs2gcj':wgs2gcj,
            'gcj2wgs':gcj2wgs,
            'bd2wgs':bd2wgs
        }

    }());

    maps.proj = proj;
}());

/**
 * label
 */
(function(){
    var maps = window.maps;

    if(typeof(BMap) == 'undefined') return;
    /* label */
    function label(pos , data){
        this._position = pos;
        this.data = data;
        this.size = [26,32];
        this.setMap = function(map){
            if(map === null)
                this._map.removeOverlay(this);
            else
                map.addOverlay(this);
            return this;
        }

        this.id = data.id;

    }

    label.prototype = new BMap.Overlay();

    label.prototype.initialize = function(map){
        this._map = map;
        var cls = 'maps-label ' + (this.data.cls || '');
        var el = this._el = maps.dom.create("div" , cls);
        var type = this.data.type || '1';
        el.setAttribute("data-id", this.data.id);
        el.setAttribute("title", this.data.name);
        this._icon = maps.dom.create('i' , 'label-' + type , '',el);
        var title = maps.dom.create('span' , '' , '',el);
        map.getPanes().labelPane.appendChild(el);
        title.innerHTML = this.data.name;
        return el;
    }

    label.prototype.setPosition = function(p){
        this._position = p;
        this.draw();
    }

    label.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._position);

        this._el.style.left = (pixel.x - 13) +"px";
        this._el.style.top  = (pixel.y - 36) +"px";
    }

    maps.Label = label;

    // factory
    maps.label = function(p , d){
        return new maps.Label(p , d);
    }

}());

/**
 * popup, 信息窗
 */
(function(){
    var maps = window.maps;

    if(typeof(BMap) == 'undefined') return;

    var popup = function(pos , data){
        this._position = pos || maps.latlng(0,0);
        this.size = [280,350];
        this.offset = [20,-10];
        this.data = data;
        this.els = {};
        this.handlers = {};
        this.setMap = function(map){
            if(map === null)
                this._map.removeOverlay(this);
            else
                map.addOverlay(this);
            return this;
        }

    }

    popup.prototype = new BMap.Overlay();

    popup.prototype.initialize = function(map){
        this._map = map;
        //this._el = maps.dom.create("div" , null ,'position:absolute;');
        var el = this._el = maps.dom.create("div" , 'maps-popup','',this._el);
        this.els = {
            'title': maps.dom.create("h3" , null , null,el),
            'img': maps.dom.create("div" , 'maps-popup-thumb' , null,el),
            'content': maps.dom.create("div" , 'maps-popup-cnt' , null,el),
            'pano' : maps.dom.create("a" , 'button' , null,el),
            'arrow':maps.dom.create("i" , 'maps-popup-arrow' , null,el),
            'close':maps.dom.create("i" , 'maps-popup-close' , null,el)
        };
        this.els.pano.innerHTML = '查看全景';
        this.els.close.innerHTML = '×';
        var self = this;
        this.els.close.onclick = function(){
            self.close();
        }
        map.getPanes().labelPane.appendChild(this._el);
        return el;
    }

    popup.prototype.draw = function(){
        var map = this._map;var size = this.size;
        //console.log(size)
        var pixel = map.pointToOverlayPixel(this._position);
        this._el.style.left = (pixel.x + this.offset[0]) +"px";
        this._el.style.top  = (pixel.y - size[1] /2 + this.offset[1]) +"px";
    }

    popup.prototype.setContent = function(data) {
        if(data === null){
            this._el.style.display = "none";//removeClass('active');
        }else{
            this._el.style.display = "block";

            this.els.title.innerHTML = data.name;
            this.els.img.style.backgroundImage = 'url('+data.image+')';
            this.els.content.innerHTML = data.content;
            this.size = [280,this._el.offsetHeight];
            this.els.pano.setAttribute('href','/panorama#poi='+data.id);
            //console.log(data.have_pano)
            this.els.pano.style.display = data.have_pano == 1 ? 'block' : 'none';
        }
    }
    popup.prototype.on = function(evt , fn){
        this.handlers[evt] = fn;
    }

    popup.prototype.open = function(position , data){
        this._position = position ;
        this.setContent(data);
        this.draw();
    }

    popup.prototype.close = function(){
        this.setContent(null);
        if(this.handlers['close']) this.handlers['close']();
    }

    popup.prototype.open = function(data){
        if(data){
            this._position = maps.latlng(data) ;
            this._map.panTo(this._position);
            this.setContent(data);
            this.offset = [20,-10];
            this.draw();
        }
    }

    popup.prototype.openLabel = function(label){
        //console.log(label.data)
        if(label){
            this._position = label._position ;
            this._map.panTo(this._position);
            this.setContent(label.data);
            this.offset = [20,-10];
            this.draw();
        }
    }

    maps.Popup = popup;

    // factory
    maps.popup = function(p , d){
        return new maps.Popup(p , d);
    }
}());

/**
 * here 当前位置
 */
(function(){
    var maps = window.maps;

    if(typeof(BMap) == 'undefined') return;
    /* label */
    function here(pos,data){
        this._position = pos;
        this.data = data;
        this.size = [24,24];
        this.setMap = function(map){
            if(map === null)
                this._map.removeOverlay(this);
            else
                map.addOverlay(this);
            return this;
        }
        this.ready = false;

    }

    here.prototype = new BMap.Overlay();

    here.prototype.initialize = function(map){
        this._map = map;
        var el = this._el = mapx.dom.create("div", 'maps-here','display:none;');
        map.getPanes().labelPane.appendChild(el);
        return el;
    }

    here.prototype.setPosition = function(p){
        if(!this.ready){
            this.ready = true;
            this._el.style.display = 'block';
        }
        this._position = p;
        this.draw();
    }

    here.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._position);

        this._el.style.left = (pixel.x - 12) +"px";
        this._el.style.top  = (pixel.y - 12) +"px";
    }

    maps.Here = here;

    // factory
    maps.here = function(p , d){
        return new maps.Here(p , d);
    }

}());

/**
 * overlay.location 定位用 marker
 */
(function() {
    var maps = window.maps;
    if(typeof(BMap) == 'undefined') return;

    var marker;
    var bound;
    var map;
    var locHander;
    var boundary;


    /* label */
    function locmaker(pos) {
        this._position = pos;
        this.setMap = function (map) {
            if (map === null)
                this._map.removeOverlay(this);
            else
                map.addOverlay(this);
            return this;
        }

        this.setPosition = function (v) {
            this._position = v;
            this.draw();
        }

        this.setHeading = function (v) {
            this._el.style['transform'] = 'rotate(' + v + 'deg)';
            this._el.style['webkitTransform'] = 'rotate(' + v + 'deg)';
        }

        this.toggle = function (v) {
            if (v) $(this._el).addClass('show');
            else $(this._el).removeClass('show');
        }

        this.watching = false;

        this.setFollow = function(v){
            this.follow = v;
        }
        this.watch = function(tick , fn){
            var self = this;
            if(tick === null){
                this.watching = false;
                if(self._watch_handler){
                    clearTimeout(self._watch_handler);
                }
                self.toggle(false);
                return;
            }
            this.watching = true;

            var process = function(){
                maps.location.getPosition(function (d) {
                    if(!self.watching) return;

                    if (d.status == 0) {
                        var data = d.detail;
                        var trans = maps.proj.wgs2gcj(data.latitude, data.longitude);
                        var pos = maps.latlng(trans.lat, trans.lng);
                        self.setPosition(pos);
                        self.setHeading(data.heading);
                        self.toggle(true);

                        if(self._map && self.follow) self._map.panTo(pos);
                    }

                    fn && fn(d);
                    self._watch_handler = setTimeout(process , tick)
                });
            }

            process();
        }

        this.locate = function( fn ){
            var self = this;
            var process = function(){
                maps.location.getPosition(function (d) {
                    if (d.status == 0) {
                        var data = d.detail;
                        var trans = maps.proj.wgs2gcj(data.latitude, data.longitude);
                        var pos = maps.latlng(trans.lat, trans.lng);
                        self.setPosition(pos);
                        self.setHeading(data.heading);
                        self.toggle(true);

                        //console.log('location:' + data)

                        if(self._map) self._map.panTo(pos);
                    }

                    fn && fn(d);
                });
            }

            process();

        }

        this.close = function(){
            this.toggle(false);
        }
    }

    locmaker.prototype = new BMap.Overlay();

    locmaker.prototype.initialize = function (map) {
        this._map = map;
        var el = this._el = mapx.dom.create("div", 'maps-loction', 'transform:rotate(0deg);-webkit-transform:rotate(0deg);');
        map.getPanes().labelPane.appendChild(el);
        return el;
    }

    locmaker.prototype.draw = function () {
        var pixel = this._map.pointToOverlayPixel(this._position);
        this._el.style.left = pixel.x + "px";
        this._el.style.top = pixel.y + "px";
    }


    maps.locMarker = function (map) {
        var loc = new locmaker( mapx.latlng(0, 0) );
        loc.setMap(map);
        return loc;
    }
}());

/**
 * maps.location 定位
 */
(function(){
    function getError(error)
    {
        var info = '';
        switch(error.code)
        {
            case error.TIMEOUT:
                info = ("定位超时，请重试");
                break;
            case error.PERMISSION_DENIED:
                info = ("您拒绝了使用位置共享服务，定位已取消");
                break;
            case error.POSITION_UNAVAILABLE:
                info = ("暂时无法为您所在地区提供位置服务");
                break;
            case error.UNKNOWN_ERROR:
                info = ("未知错误");
                break;
        }
        return info;
    }

    var getPosition = (function(){
        var baiduLoc = function( fn ){
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(resp){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    //alert('您的位置：'+resp.point.lng+','+resp.point.lat);
                    var conv = maps.proj.bd2wgs(resp.point.lat , resp.point.lng);
                    var coords={ latitude:conv.lat, longitude:conv.lng };
                    fn (  {'status':0 , detail : coords} );
                }
                else {
                    fn (  {'status':1 , detail : this.getStatus()} );
                    //alert('failed '+this.getStatus());
                }
            },{enableHighAccuracy: true/*,maximumAge : 20000*/});
        }

        var browserLoc = function( fn ){
            
            navigator.geolocation.getCurrentPosition(function(resp){
                fn (  {'status':0 , detail : resp.coords} );
            }, function(resp){
                fn (  {'status':1 , detail : getError(resp)} );
            }, {
                enableHighAccuracy : false //高精度定位
                //timeout : 120000

            });
        }

        var wxLoc = function(fn) {
            wx.getLocation({
                success: function (resp) {
                    fn({'status':0 , detail : resp })
                }

            })
        }
        //browserLoc;
        var rLoc = (typeof(wx) != 'undefined') ? wxLoc : 
            BMap ? baiduLoc : browserLoc;
        // alert(rLoc)
        return  rLoc;
    }());

    var getIPLocation = function(cb)
    {
        $.getJSON("http://apis.map.qq.com/ws/location/v1/ip?key=ARHBZ-B2LAS-QAWOZ-6O2L5-AAZEK-ALBZM&output=jsonp&callback=?" , function(d){
            cb(d.result);
        });
    };


    var geoCoding = (function(){
        var stack = {};
        return function(lat , lng , fn){
            var id = (lat + ',' + lng);
            if(stack[id]){
                fn(stack[id]);
            }else{
                // TODO
                $.getJSON("http://api.map.baidu.com/geocoder/v2/?callback=?&output=json" ,{
                    'ak':'1159a04bd74d50a16251757a2661ab88','coordtype':'wgs84ll',
                    'location':id
                }, function(resp){
                    if(resp.status == 0){
                        //console.log(resp)
                        stack[id] = resp.result;
                        stack[id].addr = resp.result.sematic_description || resp.result.formatted_address;
                        fn(stack[id]);
                    }
                })
            }
        }
    }());

    window.maps.location = {
        "getPosition" : getPosition ,
        "getIPLocation" : getIPLocation,
        "geoCoding" : geoCoding
    };
}());

(function(){
    var maps = window.maps;
    var listeners = [];

    var on = function(handler) {
        listeners.push(handler);
        if(!running) process();
    }

    var off = function(handler) {
        if (listeners.length) {
            for (var i = 0, l = listeners.length; i < l; i++) {
                if (listeners[i] == handler) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
        if(running) {
            running = false;
        }
    }

    var fire = function(data) {
        if (listeners.length) {
            for (var i = 0, l = listeners.length; i < l; i++) {
                var callback = listeners[i];
                if(callback && callback.setPosition){
                    callback.setPosition(data)
                }else
                    callback(data);
            }
        }
    }

    var watch_handler , tick = 2000 , running = false;
    var process = function(){
        running = true;
        maps.location.getPosition(function (d) {
            if (d.status == 0 && running) {
                var data = d.detail;
                var trans = maps.proj.wgs2gcj(data.latitude, data.longitude);
                var pos = maps.latlng(trans.lat, trans.lng);
                fire(pos);
            }

            if(listeners.length && running)
                watch_handler = setTimeout(process , tick);
            else{
                running = false;
                watch_handler = null;
            }
        });
    }

    maps.location.on = on;
    maps.location.off = off;
    maps.location.link = on;

}());


/* maps.utils */
(function(){

    window.maps.utils = {};

    var extend = function(dest) {
        var sources = arguments  , src, i, j, l;
        dest = dest || {};
        for (i = 1 , l = sources.length; i < l; i++) {
            src = sources[i] || {};
            if (typeof src == 'object') {
                for (j in src) {
                    dest[j] = src[j];
                }
            }
        }
        return dest;
    }

    //计算圆形区域 内接矩形的 地理范围
    var bound = function(p , r){
        //西南角(225方位角) 经纬度
        var sw = maps.spherical.offset(p , r , 225);
        //东北角(45方位角) 经纬度
        var ne = maps.spherical.offset(p , r ,  45);
        return new BMap.Bounds( maps.latlng(sw) , maps.latlng(ne));
    };

    maps.utils.getBoundFromRadius = bound;

    maps.extend = extend;

}());

//球面相关
(function(){
    var toRad = Math.PI / 180 , toDeg = 180 / Math.PI;
    var EARTH_RADIUS = 6378137.0 , PI = Math.PI;

    /**
     * 根据当前位置、距离和方位角 计算另一个点
     * @param from 开始位置
     * @param dist 距离
     * @param azimuth 方位角
     * @param radius 球半径，默认为地球半径
     * @returns {{lat: number, lng: number}}
     */
    function offset(from, dist, azimuth,radius) {
        var heading = azimuth * toRad;
        var lat1 = from.lat * toRad;
        var lng1 = from.lng * toRad;
        var dByR = dist / (radius || EARTH_RADIUS);
        var lat = Math.asin(
            Math.sin(lat1) * Math.cos(dByR) +
            Math.cos(lat1) * Math.sin(dByR) * Math.cos(heading));
        var lng = lng1 + Math.atan2(
                Math.sin(heading) * Math.sin(dByR) * Math.cos(lat1),
                Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
        return {lat:lat * toDeg , lng : lng * toDeg};
    }

    /**
     * 求两点间距离
     * @param p1
     * @param p2
     * @returns {number}
     */
    function distance(p1 , p2){

        var lat1 = p1.lat , lng1 = p1.lng , lat2 = p2.lat , lng2 = p2.lng;
        lat1 = lat1 * toRad;
        lat2 = lat2 * toRad;$

        var a = lat1 - lat2;
        var b = lng1 * toRad - lng2 * toRad;

        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000.0;
        return s;
    }

    /**
     * 计算 点集合 的地理中心
     * @param v
     * @returns {*}
     */
    function boundExtend(v){
        if(v.length >= 1){
            var b = new BMap.Bounds(v[0] , v[0]);
            for(var i in v){
                b.extend(v[i]);
            }
            return b.getCenter();
        }else{
            return v;
        }
    }

    window.maps.spherical = {
        "offset":offset,
        "distance":distance,
        "boundExtend":boundExtend
    }
}());

(function(){
    var xh = window.xh || {};
    xh.maps = window.maps;
}());
