$(function(){
    var ui = xh.require('xh.ui');
    var maps = xh.require('xh.maps');

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

    var center = '30.2436200,120.1380500';
    if(app_info && app_info.lat && app_info.lon)
    {
        center = app_info.lat+','+app_info.lon;
    }

    map = maps.Map("j_map_container",{enableMapClick:false,maxZoom:18});
    map.centerAndZoom(maps.latlng(center), 15);
    map.enableScrollWheelZoom(true);
    map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT}));

    /*map.setMapStyle({
        styleJson:style
    });*/

    var popup = maps.popup().setMap(map);

    function init(){
        labelManager.load('0');
        popup.on('close',function(){
            labelManager.closeSpan();
        })

        maps.here(maps.latlng('0,0')).setMap(map).setPosition(maps.latlng(center));
    }

    function openSpan(){

    }

    var labelManager = (function(map){

        //缓存所有覆盖物
        var store = {},
        // 缓存可见覆盖物
            storeLabel = {},
            //响应热门标签点击的label
            spanLabel ;
        function format(d , type){
            d.image = xh.path.img(d.image);
            //d.type  = type;
            d.content = d.description;
            if(d.cname) d.name = d.cname;
            return d;
        }

        function save(data , cate , key){
            if(key === undefined) key = 'id';
            for(var i=0;i<data.length;i++){
                if(store[cate] === undefined) store[cate] = {};
                store[cate][data[i][key]] = format(data[i]);
            }
            return store[cate];
        }

        function add(data){
            for(var i in data){
                storeLabel[data[i].id] = maps.label(maps.latlng(data[i]) , data[i]).setMap(map);
            }
        }

        return {
            // 按类别id加载 poi
            'load' : function(id , fn){
                this.clear();
                $.getJSON('/Gis/poi/getPoiByClass',{'type':id},function(resp){
                    if(resp.status){
                        add(save(resp.data , id));
                        fn && fn();
                    }
                });
            },
            // 加载标签类 poi，类别id为 'hotspot'
            'loadSpan':function(data){
                for(var i in data.data){
                    save(data.data[i].data,'hotspan','cid');
                }
            },
            'openSpan':function(data){
                spanLabel = maps.label(maps.latlng(data) , data).setMap(map);
                if(data.cid) data.id = data.cid;
                popup.open(data);
            },
            'closeSpan':function(){
                if(spanLabel) spanLabel.setMap(null);
            },
            //清除所有可见覆盖物
            'clear':function(){
                for(var i in storeLabel){
                    storeLabel[i].setMap(null);
                    delete storeLabel[i];
                }
            },
            //获取poi=id的覆盖物，只能获取可见的
            'get':function(id){
                return storeLabel[id];
            },
            'getSpan':function(id){
                return store['hotspan'][id];
            }
        }
    }(map));

    function bind(){
        $('.aside').on('click','h3',function(){
            $(this).parent().toggleClass('select');
            $(this).siblings('ul').slideToggle(function(){
                hotScroll.refresh();
            });
        }).on('click','li' , function(){
            var id = $(this).attr('data-id');
            labelManager.openSpan( labelManager.getSpan(id) );
        });

        $('.cat').on('click','h3',function(){
            $(this).parent().toggleClass('active');
            $(this).siblings('ul').slideToggle(200);
        }).on('click','li',function(){
            var self = $(this);
            if(!self.hasClass('select')){
                var id   = self.attr('data-id'),
                    name = self.html();
                self.addClass('select').siblings('li').removeClass('select').parent().slideUp(200).siblings('h3').html(name).parents().removeClass('active');

                popup.close();
                labelManager.load(id);
            }
        });

        $('.map').on('click' , '.maps-label' , function(){
           popup.openLabel(labelManager.get($(this).attr('data-id')));
        });

        $('.expand').on('click' , function(){
            $('body').toggleClass('full');
        });
    }


    init();
    bind();
});