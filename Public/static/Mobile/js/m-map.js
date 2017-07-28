/**
 * Created by Administrator on 2015/11/26.
 */
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

var cell = (function(){
    var loc;
    var vm  = xh.require('xh.vm'),
        evt = xh.require('xh.evt'),
        ui = xh.require('xh.ui'),
        io = xh.require('xh.io'),
        maps = xh.require('xh.maps');
    function initLocation(){
        maps.location.getPosition(function(d){
            if (d.status == 0) {
                var data = d.detail;
                window.loc = maps.proj.wgs2gcj(data.latitude, data.longitude);
            }
        });
    }

    function init(el , url , phone){
        //长按 弹出拨号
        var flag = true, down_time,handler;
        var process = function(){
            //console.log(+new Date() - down_time)
            if(!flag){
                $('.contact_box').addClass('active');
                flag = true;
            }
            if(handler) clearTimeout(handler);
        }
        el.addEventListener('touchstart',function(){
            flag = false;
            if(handler) clearTimeout(handler);
            handler=setTimeout(process ,1000);
        },true);
        /*el.addEventListener('touchstart',function(){
            flag = false;
            down_time = +new Date();
            if(window.useapp=='2')
            {
                alert(down_time);
            }
            //console.log(down_time)
        },true);*/
        //$('.map').touchstart(function(){
            //flag = false;
            //if(handler) clearTimeout(handler);
            //alert('23');
            /*handler=setTimeout(function(){
                //console.log(+new Date() - down_time)
                if(!flag){
                    $('.contact_box').addClass('active');
                    flag = true;
                }
                if(handler) clearTimeout(handler);
            } ,1000);*/
        //});

        el.addEventListener('touchmove',function(){
            /*flag = true;
            if(handler) clearTimeout(handler);*/
        },true);
        el.addEventListener('touchend',function(e){
            flag = true;
            if(handler) clearTimeout(handler);
         },true);
        /*el.addEventListener('touchend',function(e){
            var dt = +new Date() - down_time
            //console.log(+new Date() - down_time)
            if(!flag && dt > 1000){
                $('.contact_box').addClass('active');

                //postLocation();
                flag = true;
            }
            /!*if(dt > 1000){
             e.stopPropagation();
             e.preventDefault();
             }*!/
        },true);*/
        /*$('.map').touchmove(function(){
            flag = true;
            if(handler) clearTimeout(handler);
        });
        $('.map').touchend(function(){
            flag = true;
            if(handler) clearTimeout(handler);
        });*/

        $('.contact_box').on(evt.click,'a.close',function(){
            $('.contact_box').removeClass('active');
        });
        $('.contact_box').on(evt.click,'.contact_audio',function(){
            postLocation(phone);
        });

        if(window.useapp=='1'&&window.USER_DATA && USER_DATA.mobile)
        {
            $('.contact_vedio').show();
            $('.contact_box').on(evt.click,'.contact_vedio',function(){
                initLocation();
                loc=window.loc;
                if(loc)
                {
                    //alert('tapClick('+USER_DATA.mobile+','+loc.lng+','+loc.lat+')');
                    tapClick(USER_DATA.mobile,loc.lng,loc.lat);
                }else{
                    alert('定位信息不存在');
                    //tapClick(USER_DATA.mobile,30.2436200,120.1380500);
                }
            });
        }else if(window.useapp=='2'&&window.USER_DATA && USER_DATA.mobile){
            $('.contact_vedio').show();
            $('.contact_box').on(evt.click,'.contact_vedio',function(){
                initLocation();
                loc=window.loc;
                if(loc)
                {
                    //alert('window.android.tapClick('+USER_DATA.mobile+','+loc.lng+','+loc.lat+')');
                    window.android.tapClick(USER_DATA.mobile,loc.lng,loc.lat);
                }else{
                    alert('定位信息不存在');
                    //window.android.tapClick(USER_DATA.mobile,30.2436200,120.1380500);
                }
            });
        }else{
            $('.contact_vedio').hide();
        }

        function postLocation(phone){
            initLocation();
            loc=window.loc;
            if(window.USER_DATA && USER_DATA.mobile && loc){
                var data = {"lat":loc.lat , "lng":loc.lng , "mobile":USER_DATA.mobile};
                //alert('post:'+JSON.stringify(data));
                $.ajax({
                    url:url,
                    type:'post' ,
                    data:data
                }).complete(function(resp){
                    if(window.useapp=='2')
                    {
                        window.android.Call(phone);
                    }else{
                        location.href = 'tel:' + phone;
                    }

                });
            }else{
                if(window.useapp=='2')
                {
                    window.android.Call(phone);
                }else{
                    location.href = 'tel:' + phone;
                }
            }
        }
    }

    initLocation();
    return init;
}());

var suggest = (function(){

    var key = '', api='/gis/poi/getByKeyword.json', view;

    var vm  = xh.require('xh.vm'),
        evt = xh.require('xh.evt');
        tts = xh.require('xh.path.tts');
    function update(key){
        if(key.length){
            $.getJSON(api,{keyword:key} , function(resp){
                if(resp.status) render(resp);
            })
        }
    }

    function render(data){
        $('#j_sug_result').html( vm.template(view, data) );
    }


    function init(){
        view = $('#tpl_suggest').html();

        var update_process = xh.debounce(update , 300);
        $('.search input').on('input' , function(){
            var value = $('#j_sug_key').val().replace(/\s/g,'');
            if(key != value){
                key = value;
                update_process(key);
            }
            if(key.length>0){
                $('.search').addClass('input');
            }else{
                $('.search').removeClass('input');
            }
        });

        $('.search .close').on('click' , function(){
            $('.search').removeClass('input');
        });

        $('.search').on('click','li' , function(){
           var id = $(this).attr('data-id');
            $('.map .maps-label[data-id='+id+']').trigger(evt.click);
            $('.search').removeClass('input');
            $('#j_sug_key').val('');
        });
    }

    return {'init':init}
}());

(function(){
    var vm = xh.require('xh.vm'),
        evt = xh.require('xh.evt'),
        ui = xh.require('xh.ui'),
        io = xh.require('xh.io'),
        maps = xh.require('xh.maps');

    var center = '30.2436200,120.1380500',

        map, popup,labelManager, locManager, cultrueManager;

    var view_popup = $('#popup').html();
    var view_culture = $('#popup-culture').html();



    function init(){
        map = maps.Map("j_map_container",{enableMapClick:false,maxZoom:18});
        map.centerAndZoom(maps.latlng(center), 15);
        map.enableScrollWheelZoom(true);
        map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT}));

        /*map.setMapStyle({
            styleJson:style
        });*/

        map.addEventListener('zoomend' , function(){
            if(map.getZoom() >= 18)
            {
                $('body').addClass('mode-full');
            }
            else{
                $('body').removeClass('mode-full');
            }
        });

        labelManager = LabelManager(map , maps);

        locManager = maps.locMarker(map);

        cultrueManager = new CultrueManager({
            tick:60 * 1000
        })

        cell($('.map')[0] , '/' ,window.contact_phone);

        bind();


        maps.location.getPosition(function(d){
            if (d.status == 0) {
                var data = d.detail;
                var loc = maps.proj.wgs2gcj(data.latitude, data.longitude);
                map.panTo( maps.latlng(loc) );
            }
        });
    }

    function CultrueManager(opts){
        this.ctor = function(opts){
            this.opts = opts;
            this.url = '/location';
            this.tick = opts.tick || 60 * 1000;
            this.handler = null;
            this.flag = false;
            this.last_id = undefined;
            this.confirm_num=0;
        }

        this.toggle = function(v){
            if(v === undefined){
                this.flag = !this.flag;
            }else{
                this.flag = !!v;
            }
            if(this.flag){
                $('.control a.culture').addClass('active');
                this.process();
            }else{
                if(this.handler){
                    clearTimeout(this.handler);
                    this.handler = null;
                    $('#j_audio').attr('src', '');
                }
                $('.box-culture,.control a.culture').removeClass('active');
            }
        }

        this.start = function(){

        }

        this.pause = function(){

        }

        this.play = function(txt) {
            if (txt === null) {
                $('#j_audio').attr('src', '');
            } else {
                txt = txt.replace(/<[\w\W]+?>/g,'');
                var url = tts(txt);
                $('#j_audio').attr('src', url);
                var userAgent = navigator.userAgent;
                if(this.confirm_num<1)
                {
                    if (userAgent.indexOf("Safari") > -1) {
                        $('.audio_confirm_box').addClass('active');
                    }
                    this.confirm_num++;
                }
            }
        }

        this.play_voice = function(voice_url) {
            if (voice_url) {
                $('#j_audio').attr('src', voice_url);
            } else {
                $('#j_audio').attr('src', '');
            }
        }

        this.process = function(){
            var local = this;
            var getData = function(p){
                $.getJSON(local.url , {'lat': p.lat,'lon': p.lng} , function(resp){
                    if(local.flag){
                        local.show(resp);
                        local.handler = setTimeout(function(){
                            local.process();
                        } , local.tick);
                    }
                })
            }

            maps.location.getPosition(function (d) {
                //getData({lat:30.2319500,lng:120.1415300});return;
                if (d.status == 0) {
                    var data = d.detail;
                    var trans = maps.proj.wgs2gcj(data.latitude, data.longitude);
                    if(local.flag) {
                        getData(trans);
                        //getData({lat:30.2319500,lng:120.1415300});

                    }
                }else{
                    ui.alert({'title':'提示','content': d.detail});
                    //$('.box-culture').removeClass('active');
                    local.toggle(false);
                    //getData({lat:30.2319500,lng:120.1415300});

                }
            })
        }

        this.show = function(data){
            //console.log(data);
            if(this.last_id != data.data.pano.id){
                data.data.pano.attrs = JSON.parse(xh.unescape(data.data.pano.attrs));
                $('.box-culture').html( vm.template(view_culture , data.data)).addClass('active');
                var summary = xh.unescape( data.data.pano.excerpt );
                if(summary) this.play(summary);
                this.last_id = data.data.pano.id;
            }

        }

        this.ctor(opts);
    }


    function setPopup(data){
        map.panTo( maps.latlng(data) );
        if(data === null){
            $('.infowindow').removeClass('active have_pano');
            $('#j_audio').attr('src', '');
            var el = $('.maps-label.active');
            setTimeout(function(){
                el.removeClass('active');
            },3000);
        }else{
            $('.infowindow').html( vm.template( view_popup , data)).addClass('active');
            if(data.have_pano == 1)
                $('.infowindow').addClass('have_pano');
            else
                $('.infowindow').removeClass('have_pano');
            var id = data.id;
            $('.maps-label[data-id="'+id+'"]').addClass('active').siblings('.maps-label.active').removeClass('active');
            //console.log(data)
            if(data.voice_path)
            {
                var url = '/upload/'+data.voice_path;
                $('#j_audio').attr('src', url);
            }else{
                var txt = data.content.replace(/<[\w\W]+?>/g,'');
                var url = tts(txt);
                $('#j_audio').attr('src', url);
            }

            var camera = data.vedio_url || data.video_url;
            if(camera){
                $('#j_camera').attr('href',camera).show(0);
            }
        }
    }
    function bind(){

        //点击空白区域 隐藏信息窗
        $('.map').on(evt.click , function(e){
            //没有点击在label
            if(
                !(   $(e.target).parent().hasClass('maps-label')  ||
                    $(e.target).hasClass('maps-label')
                )
            ){
                if($('.infowindow').hasClass('active')){
                    $('#j_audio')[0].pause();
                    setPopup(null);
                }
            }
            /*if($('.contact_box').hasClass('active'))
            {
                $('.contact_box').removeClass('active');
            }*/
        });

        $('nav').on(evt.click , 'a' , function(){
            var el = $(this), id = el.attr('data-id');
            el.addClass('select').siblings('a').removeClass('select');
            setPopup(null);
            labelManager.load(id);
        });

        $('.map').on(evt.click , '.maps-label' , function(){
            setPopup(labelManager.get($(this).attr('data-id')).data);
            popup_on = true;
        });


        var loc_toggle = false;
        var loc_follow = false;

        function start_loc(){
            var el = $('.control .loc');
            locManager.watch(5000,function(resp){
                if(resp.status == 0){
                }else{
                    ui.alert({'title':'提示','content':resp.detail});
                    locManager.watch(null);
                }
            });
        }
        var toggle_loc = function(){
            var el = $('.control .loc');
            loc_toggle = !loc_toggle;
            if(loc_toggle){
                locManager.setFollow(true);
                el.addClass('active');
                
            }else{
                locManager.setFollow(false);
                el.removeClass('active');
            }
        }
        $('.control .loc').on(evt.click , function(e){
            toggle_loc();
            e.preventDefault();
        });

        $('#j_center').on(evt.click , function(){
           map.panTo( maps.latlng(center) );
        });

        $('.control .culture').on(evt.click , function(){
            cultrueManager.toggle();
        });

        $('.box-culture').on(evt.click ,'.close' , function(){
            $('.box-culture').removeClass('active');
            cultrueManager.play(null);
        }).on(evt.click, '#culture_vol' , function(){
            if($('#j_audio')[0].paused){
                $('#j_audio')[0].play();
                $('#culture_vol').removeClass('mute');
            }else{
                $('#j_audio')[0].pause();
                $('#culture_vol').addClass('mute');
            }
        });

        $('.audio_confirm_box').on(evt.click ,'.close' , function(){
            $('.audio_confirm_box').removeClass('active');
        }).on(evt.click, '.yes_btn' , function(){
            $('#j_audio')[0].play();
            $('.audio_confirm_box').removeClass('active');
        }).on(evt.click, '.no_btn' , function(){
            $('.audio_confirm_box').removeClass('active');
        });

        $('.infowindow').on(evt.click, '#j_nav' , function(){
            var id = $(this).attr('data-id');
            var label = labelManager.get(id);
            if(label.data){
                var data = label.data;
                //var url = 'http://api.map.baidu.com/marker?location='+data.lat+','+data.lon+'&title='+data.name+'&content='+data.name+'&output=html';
                var url = "http://apis.map.qq.com/uri/v1/marker?marker=coord:"+data.lat+","+data.lon+";title:"+data.name+";addr:"+data.address+"&referer=myapp";
                //var url = 'http://map.qq.com/nav/drive?start=120.149564,30.272964&dest=120.1430890,30.2668070&ref=mobilemap&nohighway=0&noround=0&notoll=0&traffic=1&cond=0&mt=0';
                location.href = url;
            }
        }).on(evt.click, '#j_vol' , function(){
            if($('#j_audio')[0].paused){
                $('#j_audio')[0].play();
                $('#j_vol').removeClass('mute');
            }else{
                $('#j_audio')[0].pause();
                $('#j_vol').addClass('mute');
            }
        });
        $('#j_audio').on('canplay' , function(){
            $('#j_vol').addClass('show');
        })


        labelManager.load('2');

        suggest.init();

        cultrueManager.toggle();

        start_loc();

        $('.search input').on('focus' , function(){
            locManager.watch(null);
        });
        $('.search input').on('blur' , function(){
            locManager.watch(5000,function(resp){
                if(resp.status == 0){
                }else{
                    ui.alert({'title':'提示','content':resp.detail});
                    locManager.watch(null);
                }
            });
        });
    }



    function LabelManager(map,maps){

        //缓存所有覆盖物
        var store = {},
        // 缓存可见覆盖物
            storeLabel = {};
        function format(d , type){
            d.image = xh.path.img(d.image);
            d.type  = type;
            d.content = d.description;
            if(d.cname) d.name = d.cname;
            return d;
        }

        function save(data , type , key){
            if(key === undefined) key = 'id';
            for(var i=0;i<data.length;i++){
                if(store[type] === undefined) store[type] = {};
                store[type][data[i][key]] = format(data[i] , type);
            }
            return store[type];
        }

        function add(data){

            for(var i in data){
                storeLabel[data[i].id] = maps.label(maps.latlng(data[i]) , data[i]).setMap(map);
            }
            //console.log(storeLabel)
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
    };

    init();
}());