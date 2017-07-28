/**
 * zoom >= 12 显示 poi点
 */

// 配色风格 citymap
var cityMap_style = [
    {
        "featureType": "background",
        "elementType": "all",
        "stylers": {
            "color": "#e3eef4"
        }
    },
    {
        "featureType": "highway",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": {
            "color": "#8cd0e3"
        }
    },
    {
        "featureType": "green",
        "elementType": "all",
        "stylers": {
            "color": "#a9dfa1",
            "visibility": "off"
        }
    },
    {
        "featureType": "arterial",
        "elementType": "geometry",
        "stylers": {
            "color": "#ffffff",
            "visibility": "on"
        }
    },
    {
        "featureType": "local",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    },
    {
        "featureType": "railway",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    },
    {
        "featureType": "arterial",
        "elementType": "labels.text.fill",
        "stylers": {
            "lightness": 62,
            "saturation": -100
        }
    },
    {
        "featureType": "arterial",
        "elementType": "labels.text.stroke",
        "stylers": {
            "lightness": 100
        }
    },
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": {
            "lightness": 34,
            "saturation": -100
        }
    }
];
var google_style = [
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": {
            "lightness": 20
        }
    },
    {
        "featureType": "building",
        "elementType": "geometry",
        "stylers": {
            "color": "#f49935",
            "visibility": "off"
        }
    },
    {
        "featureType": "railway",
        "elementType": "all",
        "stylers": {
            "visibility": "off"
        }
    },
    {
        "featureType": "local",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": {
            "color": "#d1e5ff"
        }
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": {
            "visibility": "off"
        }
    }
];

var app = (function(){
    var map, options = {'history' : false , 'sync':false};

    var click = ('ontouchstart' in  document.documentElement) ? "touchend" : 'click';

    function init(opts){
        //var args = location.search.substring(1);
        var center = config.center || '28.6021,119.2813';//'30.239881,120.176928';

        if(location.search.substring(1)){
            options.forceCenter = true;
            center = location.search.substring(1);
        }
        //http://www.hq.cn/pages/logomap_1/tour.html?28.6021,119.2813
        options = mapx.extend(options, opts);
        //alert(options.forceCenter);
        map = new mapx.Map("map_container",{enableMapClick:false,maxZoom:18});
        map.centerAndZoom(mapx.latlng(center), 15);
        map.enableScrollWheelZoom(true);
        /*map.setMapStyle({
            styleJson:google_style//cityMap_style//
        });*/
        bind();
    }


    function bind(){
        var hd = function(){
            map.removeEventListener('tilesloaded',hd);
            mapx.utils.router.check();
        }

        map.addEventListener('tilesloaded' , hd);

        $('body').on(click , 'ul.tab>li' , function(){
            var id= $(this).addClass('select').index();
            $(this).siblings('.select').removeClass('select');
            var p = $(this).parents('ul.tab').siblings('ul.content');
            p.children('li:eq('+id+')').addClass('select').siblings('.select').removeClass('select');
        });
    }

    function getOptions(v){
        return options[v];
    }

    return {
        'init' : init,
        'getMap' : function(){
            return map;
        },
        'getOptions' : getOptions
    }
}());

app.init({'history':true});