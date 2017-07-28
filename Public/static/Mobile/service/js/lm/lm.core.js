/**
 * 基础函数
 * mapx.extend, mapx.is, mapx.select
 *
 * 地图类
 * mapx.spherical:球面运算函数
 * mapx.proj:投影转换
 * mapx.location:定位
 *
 * 其他
 * mapx.io.socket:轮询模拟
 * mapx.vm:简易模板
 * mapx.utils:辅助工具
 *
 * 工厂
 * mapx.latlng
 * mapx.label
 */

var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback, element) {
        window.setTimeout(callback, 15);
    };

// base
(function(){
    var mapx = {};
    //采集的是 gcj02
    mapx.Latlng = function(lat , lng){
        var p = mapx.proj.gcj2bd(lat , lng);
        return new BMap.Point(p[1] , p[0]);
    }
    mapx.Map = BMap.Map;

    mapx.dom = {
        create:function(tag , cls , style , parent)
        {
            var el = document.createElement(tag);
            if (cls) el.className = cls;
            if (style) el.setAttribute("style", style);
            if (parent) parent.appendChild(el);
            return el;
        }
    }

    mapx.latlng = function(lat , lng){
        if(mapx.is(lat , "Object")){
            return new mapx.Latlng(lat.lat , lat.lng || lat.lon);
        }else if(mapx.is(lat , "Array")){
            return new mapx.Latlng(lat[0] , lat[1]);
        }else if(mapx.is(lat , "Number") && mapx.is(lng , "Number")){
            return new mapx.Latlng(lat , lng);
        }else if(mapx.is(lat , "String")){
            var l = lat.split(",");
            return new mapx.Latlng(l[0] , l[1]);
        }
    }

    mapx.extend = function(dist , src){
        for(var i in src){
            dist[i] = src[i];
        }
        return dist;
    };

    mapx.select = function(obj , key){
        var a = [];
        for(var i in obj){
            if(obj[i] && obj[i][key]) a.push(obj[i][key])
        }
        return a;
    }

    mapx.template = function(str, data) {
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


    mapx.is = function (obj,type) {
        return (type === "Null" && obj === null) ||
            (type === "Undefined" && obj === void 0 ) ||
            (type === "Number" && isFinite(obj)) ||
            Object.prototype.toString.call(obj).slice(8,-1) === type;
    };

    window.mapx = mapx;

}());


/**
 * label
 */
(function(){

    /* label */
    var label = function(pos , data){
        this._position = pos;
        this.data = data;
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
        var el = this._el = mapx.dom.create("div" , 'mapx-label');
        el.setAttribute("data-id", this.data.id);
        this._icon = mapx.dom.create('i' , null , 'background-image:url('+(this.data.icon || '')+')',el);
        this._title = mapx.dom.create('span' , null , null, el);
        this._dist = mapx.dom.create('span' , "dist" , null, el);

        if(this.data.short_name) this._title.innerHTML = this.data.short_name;
        if(this.data.dist) this._dist.innerHTML = this.data.dist;

        map.getPanes().labelPane.appendChild(el);
        return el;
    }

    label.prototype.draw = function(){
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._position);
        this._el.style.left = (pixel.x - 16) +"px";
        this._el.style.top  = (pixel.y - 37) +"px";
    }

    mapx.Label = label;

    // factory
    mapx.label = function(p , d){
        return new mapx.Label(p , d);
    }
}());


/**
 * 投影转换
 */
(function(){
    var proj = (function(){
        var pi = 3.14159265358979324;
        var a = 6378245.0;
        var ee = 0.00669342162296594323;
        var x_pi = 3.14159265358979324 * 3000.0 / 180.0;

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

        var EvilTransform = {
            //World Geodetic System ==> Mars Geodetic System
            WGS84ToGCJ02 : function(wgLat, wgLon)
            {
                var mgLat, mgLon;
                if (EvilTransform.outOfChina(wgLat, wgLon))
                {
                    mgLat = wgLat;
                    mgLon = wgLon;
                    return {lat : mgLat , lng : mgLon};
                }

                var dLat = EvilTransform.transformLat(wgLon - 105.0, wgLat - 35.0)
                    , dLon = EvilTransform.transformLon(wgLon - 105.0, wgLat - 35.0)
                    , radLat = wgLat / 180.0 * pi
                    , magic = Math.sin(radLat);

                magic = 1 - ee * magic * magic;
                var sqrtMagic = Math.sqrt(magic);
                dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
                dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
                mgLat = wgLat + dLat;
                mgLon = wgLon + dLon;
                return {lat : mgLat , lng : mgLon};
            }
            ,
            GCJ02ToWGS84 : function(lat,lng){

            }
            ,
            outOfChina:function(lat, lon)
            {
                if (lon < 72.004 || lon > 137.8347)
                    return true;
                if (lat < 0.8293 || lat > 55.8271)
                    return true;
                return false;
            }

            ,
            transformLat:function(x, y)
            {
                var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
                ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
                return ret;
            }
            ,
            transformLon:function(x, y)
            {
                var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
                ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
                ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
                ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
                return ret;
            }
        }

        /**
         * wgs转国标
         * @param lat
         * @param lng
         * @returns {*}
         */
        function wgs2gcj(lat , lng)
        {
            return EvilTransform.WGS84ToGCJ02(lat , lng);
        }
        return{
            'gcj2bd':gcj2bd,
            'bd2gcj':bd2gcj,
            'wgs2gcj':wgs2gcj
        }

    }());

    mapx.proj = proj;
}());


/**
 * mapx.location 定位
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
        var browserLoc = function( fn ){
            navigator.geolocation.getCurrentPosition(function(resp){
                //console.log(resp)
                fn (  {'status':0 , detail : resp.coords} );
            }, function(resp){
                fn (  {'status':1 , detail : getError(resp)} );
            }, {
                enableHighAccuracy : false //高精度定位
                //timeout : 120000
                ,maximumAge : 20000
            });
        }

        var wxLoc = function(fn) {
            wx.getLocation({
                success: function (resp) {

                    fn({'status':0 , detail : resp })
                }

            })
        }

        return  typeof(wx) != 'undefined' ? wxLoc : browserLoc;
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
                    'ak':'1159a04bd74d50a16251757a2661ab88',
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

    mapx.location = {
        "getPosition" : getPosition ,
        "getIPLocation" : getIPLocation,
        "geoCoding" : geoCoding
    };
}());


/* mapx.utils */
(function(){

    mapx.utils = {};

    var router = (function(){
        var _routeToRegExp = function(route) {
            var optionalParam = /\((.*?)\)/g;
            var namedParam    = /(\(\?)?:\w+/g;
            var numParam      = /(\(\?)?:@\w+/g;
            var splatParam    = /\*\w+/g;
            var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
            route = route.replace(escapeRegExp, '\\$&')
                .replace(optionalParam, '(?:$1)?')
                .replace(numParam, function(match, optional) {
                    // \d会被转义
                    return optional ? match : '([\\d]+)';
                })
                .replace(namedParam, function(match, optional) {
                    return optional ? match : '([^/?]+)';
                })
                .replace(splatParam, '([^?]*?)');

            return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
        };

        var check = function(){
            var seg = location.hash.substr(2);
            for(var i = routes.length; i--;){
                if(routes[i].route.test( seg )){
                    routes[i].callback(seg);
                    if(routes[i].once){
                        routes.splice(i,1);
                    }
                }

            }
            //console.log("check hash");
        };

        window.addEventListener('hashchange' , check);

        var routes = [];

        var fn = function(expr , callback , once){

            var e = _routeToRegExp(expr);
            if(once === undefined) once = false;
            routes.push({
                'route' : e,
                'callback' : function(frag){
                    var args = e.exec(frag).slice(1);
                    args.pop();
                    callback.apply(callback,args);
                },
                'once' : once
            });
            //check();
        }

        fn.check = check;
        return fn;
    }());

    mapx.utils.router = router;

    //计算圆形区域 内接矩形的 地理范围
    var bound = function(p , r){
        //西南角(225方位角) 经纬度
        var sw = mapx.spherical.offset(p , r , 225);
        //东北角(45方位角) 经纬度
        var ne = mapx.spherical.offset(p , r ,  45);
        return new BMap.Bounds( mapx.latlng(sw) , mapx.latlng(ne));
    };

    mapx.utils.getBoundFromRadius = bound;


    var template = (function(){
        function tmpl(str, data){
            var helper = {
                photos : function(images){
                    return images && images.length ? mapx.select(images, 'pic_url').join(",") :'';
                }
            }

            var source = str
                .replace(/[\r\n]/g, "")
                .replace(/<%\s?=\s?([\s\S]*?)%>/g,function(a,b){
                    //管道风格过滤器
                    var filter = b.split('|').reverse();
                    return "',"+
                        filter.join("|").replace(/([\w\W]+?)\|/g,'helper.$1(') + Array(filter.length).join(')') +
                        ",'";
                })
                .replace(/<%\s?([\s\S]*?)%>/g,"');$1;p.push('");

            source =
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "p.push('" + source + "');return p.join('');";
            try {
                var fn =  new Function("el",'helper',source);
            } catch (e) {
                e.source = source;
                throw e;
            }
            // 修改this,默认为this = data
            var _tpl = function(data,el,filter) {
                //扩展过滤器
                mapx.extend(helper , filter || {});
                return fn.call(data, el , helper);
            };
            _tpl.source = 'function(args){\n' + source + '}';
            return data ? _tpl( data ) : _tpl;
        };

        return tmpl;
    }());

    mapx.vm = template;
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

    mapx.spherical = {
        "offset":offset,
        "distance":distance,
        "boundExtend":boundExtend
    }
}());

(function(){
    /**
     * socket模拟
     * @param url: 请求地址
     * @param opts
     */
        function socket(url , opts){
            this.ctor(url , opts);
        }
        socket.prototype = {
            options : {"tick":5000}, flag : false,

            ctor : function(url , opts){
                this.url = url;
                this.options = mapx.extend(this.options , opts || {});
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

    mapx.io = {
        "socket":socket
    }

    // factory
    mapx.socket = function(v){
        return new socket(v);
    }
}());

/*
function EPSG4326To3785($lat , $lng){
    $lng = $lng*111319.49077777778;
    $lat = log(tan((90+$lat)*0.008726646259971648))/0.017453292519943295;
    $lat = $lat * 111319.49077777778;
    return array("lat"=>$lat , "lng"=>$lng);
}
function EPSG3785To4326($lat , $lng){
    $lng = $lng / 111319.49077777778;
    $lat = $lat / 111319.49077777778;
    $lat = atan(exp($lat*0.017453292519943295))*114.59155902616465-90;
    return array("lat"=>$lat , "lng"=>$lng);
}

function getRadius($lat , $lng , $radius){
    $p = EPSG4326To3785($lat , $lng);
    $ne = EPSG3785To4326($p["lat"] + $radius , $p["lng"] + $radius);
    $sw = EPSG3785To4326($p["lat"] - $radius , $p["lng"] - $radius);
    return array("ne"=>$ne, "sw"=>$sw);
}
    */