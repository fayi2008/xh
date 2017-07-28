$(function(){
    var style = [
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": {
                "lightness": 20
            }
        },
        {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "color": "#f49935"
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

    var maps = xh.require('xh.maps');

    var center = '30.2436200,120.1380500';
    map = maps.Map("j_map_container",{enableMapClick:false,maxZoom:18});
    map.centerAndZoom(maps.latlng(center), 15);
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));

    /*map.setMapStyle({
        styleJson:style
    });*/

    var routeService = new BMap.WalkingRoute(map, {renderOptions: {map: map, autoViewport: true}});

    var here = maps.here(maps.latlng('0,0')).setMap(map);

    var route = (function(){
        var routes = {}, labels = {};
        var format = function(v){
            return ('零一二三四五六七八九十').charAt(parseInt(v));
        };

        function setLabels(day){
            if(routes[+day]){
                for(var i in labels){
                    labels[i].setMap(null);
                }

                var rts = routes[+day].route;
                if(rts.length>2){
                    for(var i=1; i<rts.length-1;i++){
                        labels[rts[i].id] = maps.label(maps.latlng(rts[i]),rts[i]).setMap(map);
                    }
                    //console.log(labels);
                }

            }
        }

        function init(){
            var html = "";
            
            maps.location.link(here);

            for(var i in data.data.poi){
                var day = data.data.poi[i].day;
                if(!routes[day]) {
                    routes[day] = {title:'第'+format(day)+'天','route':[]};
                }
                routes[day].route.push(data.data.poi[i]);
            }
            for(var i in routes){
                html += ('<li data-id="'+i+'">'+routes[i].title+'</li>');
            }


            $('.cat ul').html(html);
        }

        function show(day){
            var r = routes[+day];
            if(r && r.route && r.route.length>1){
                var w = r.route.slice(1,r.route.length-1),
                    waypoints = [];
                for(var i in w){
                    waypoints.push(maps.latlng(w[i]) );
                }
                routeService.search(maps.latlng(r.route[0]), maps.latlng(r.route[r.route.length-1] ) , waypoints);
            }
            $('.cat h3').html(r.title);
            setLabels(day);
        }
        return {
            init : init,
            show : show
        }
    }());

    function check(){
        var day = (location.hash.match(/day=(\d+)[&$]?/) || [0,0])[1];
        if(day)
            route.show(day);
    }
    
    $(window).on('hashchange' , function(){
        check();
    });

    $('.cat').on('click','h3',function(){
        $(this).parent().toggleClass('active');
        $(this).siblings('ul').slideToggle(200);
    }).on('click','li',function(){
        var self = $(this);
        if(!self.hasClass('select')){
            var id   = self.attr('data-id');
            self.addClass('select').siblings('li').removeClass('select').parent().slideUp(200).parents().removeClass('active');

            location.hash = 'day=' + id;
        }
    });

    route.init();

    check();
});