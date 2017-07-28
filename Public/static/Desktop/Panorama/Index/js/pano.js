/**
 * Created by Administrator on 2015/12/4.
 */
(function(){
    var pano, panoData, season_data = {}, combo;

    var nofity = xh.ui.tips,
        evt = xh.evt,
        vm = xh.vm,
        hover = maps.label(maps.latlng(0,0),{'id':'_hover_','type':'99','cls':'hover'});

    var poi = (function(){
            //缓存数据
        var store = {}, map, raw = [];
            // 保存label实例
            storeLabel = {};

        function init(v){
            map = v;
            $.getJSON('/Gis/poi/getPoiByClass?type=0' , function(resp){
                if(resp.status){
                    var tmp = resp.data;
                    for(var i=0; i< tmp.length; i++){
                        if(tmp[i].have_pano=='1'){
                            var type = tmp[i].type;
                            if(!store[type]) store[type] = [];
                            store[type].push( tmp[i] );
                            raw.push( tmp[i]);
                        }
                    }
                    load();
                }
            });
            hover.setMap(map);
        }

        function add(data){
            for(var i in data){
                storeLabel[data[i].id] = maps.label(maps.latlng(data[i]) , data[i]).setMap(map);
            }
            var poi_id = pano.panoData.poi_data.id;

            setTimeout(function(){
                pan(poi_id);
                //$('.maps-label[data-id='+poi_id+']').addClass('select');
            },1)
        }

        function clear(){
            for(var i in storeLabel){
                storeLabel[i].setMap(null);
                delete storeLabel[i];
            }
        }

        function load(type){
            clear();
            if(!type){
                add( raw );
            }else{
                add( store[type] );
            }
        }

        function set_pano(id){
            var cur = pano.panoData.poi_data.id;
            if(cur == id) return;
            //console.log(id)
            $.getJSON('/panorama/poi?poi_id=' + id , function(resp){
                if(resp.status){
                    pano.setPano(resp.data.pano_key);
                    //$('.maps-label.select').removeClass('select').siblings('.maps-label[data-id='+id+']').addClass('select');
                }
            })
        }

        function pan(id){

            for(var i in raw){
                if(raw[i].id == id){
                    hover.setPosition(maps.latlng(raw[i]));
                    return;
                }
            }

            /*if($('.maps-label[data-id='+id+']').hasClass('select') == false){
                $('.maps-label.select').removeClass('select').siblings('.maps-label[data-id='+id+']').addClass('select');
            }*/
        }
        return {
            init : init , load : load , setPano : set_pano , pan : pan
        }
    }());

    function initPano(id , season){
        var pov = {'heading':0, pitch:0}, noui = false;
        if(xh.paras('pov')){
            var t = xh.paras('pov').split(',');
            pov.heading = parseInt(t[0]);
            pov.ptich   = parseInt(t[1]);
        }
        if(xh.paras('noui')){
            noui = true
        }

        pano = P.pano("pano",{
            "pano":id,pov:pov
            ,"hashControl":false
            ,'albumControl':false
            ,'addressControl':false
            //,"disableDefaultUI":noui
        });

        if(!noui){
            combo = new Combo(pano,{season:season , mapReady : function(map){
                poi.init(map);
            }});

            pano._addControl( combo.el );
        }

        pano.addEventListener("pano_changed",function(){
            panoData = pano.panoData;
            poi.pan(panoData.poi_data.id);
        });

        pano.addEventListener('overlay_click',function(e){
            var data = e.target.options.data, pano = this.pano;
            if(data) {
                var type = data.type,
                    value = data.type_value;
                if (type == '5'){
                    value = data.culture_id;
                    $('body').addClass('mask-culture');
                    $('.box-culture .modal-wrap').html('<p>正在加载...</p>')
                    $.getJSON('culture/'+value+'.json',function(resp){
                        showCulture(resp);
                    });
                }else if( type == '4'){
                    //console.log(data);
                    $('body').addClass('mask-content');
                    $('.box-content h3').html(data.title);
                    $('.box-content div').html(data.type_value || data.content);
                }else if(type=='3'){

                };
            }
        });
    }

    function init(){
        if(P.hash.get('poi')){
            $.getJSON('/panorama/poi?poi_id=' + P.hash.get('poi') , function(resp){
                if(resp.status){
                    var id = resp.data.pano_key,
                        season = resp.data.current_season;
                    initPano(id,season);
                }
            });
        }else if(P.hash.get('panoid')){
            var id = P.hash.get('panoid');
            $.getJSON('/Panorama/'+id+'/season.json'  , function(resp){
                if(resp.status){
                    initPano(id,resp.season);
                }
            });
            /*var season = 1 + Math.floor((new Date().getMonth() + 10) % 12 / 3) ;
            initPano(P.hash.get('panoid'),season);*/
        }

        bind();
    }

    var view_culture = $('#tpl_culture').html();
    function showCulture(resp){
        /*var attrs = JSON.parse(data.attrs);
         for(var i = 0;i<attrs.length;i++){
         if(!attrs[i].value)
         attrs.splice(i,1);
         }*/
        //console.log(resp)
        if(resp.status){
            resp.data.attrs = JSON.parse(xh.unescape(resp.data.attrs));

        }else{
            resp.data = [];
        }
        resp.id = resp.data.id;
        $('.box-culture').html(
            vm.template(view_culture , resp)
        );

    }

    var view_culture_list = $('#tpl_culture_list').html();
    function showCultureList(resp){
        //console.log(data);
        $('.box-culture-list').html( vm.template(view_culture_list , resp));
    }

    function bind(){
        $('#pano').on('click','.p-nav-travel', function(){
            location.href = '/travels/release.html';
        });

        $('#pano').on('click' ,'.p-tips-toggle' , function(){
            $('.p-tips').toggleClass('hide');
        });

        $('#pano').on('click' , '.p-map-toggle' , function(){
            var c = combo.map.getCenter();
            $('body').toggleClass('mode-map-full');
            setTimeout(function(){
                combo.map.panTo( c );
            },100)
        });

        $('.modal').on(evt.click,'.j-close',function(){
            var box = $(this).parents('.modal');
            var type = box.attr('data-type');
            $('body').removeClass('mask-'+type);
        });

        $('#pano').on(evt.click,'.p-nav-culture' , function(){
            if(panoData){
                var pano_id = panoData._raw.pano_key;
                $('body').addClass('mask-culture');
                $('.box-culture .modal-wrap').html('<p>正在加载...</p>')
                $.getJSON('/panorama/'+pano_id+'/culture.json',function(resp){
                    showCulture( resp );
                })
            }else{
                nofity('全景还未加载完全');
            }
        });

        $('body').on(evt.click,'.p-nav-culture-list' , function(){
            $('body').addClass('mask-culture-list');
            var poi_id = panoData.poi_data.id;
            $.getJSON('/gis/poi/'+poi_id+'/culture.json' , function(resp){
                showCultureList( resp );
            })
        });


        $('#pano').on(evt.click,'.p-nav-tm li:not(.select)',function(){
            var poi_id = panoData.poi_data.id;

            var el = $(this), season = el.attr('data-id');

            if(combo.season_data[season]){
                //pano.setPano( combo.season_data[season] );
                combo.setSeason(season)
            }else{
                $.getJSON('/panorama/poi',{'poi_id':poi_id , 'season':season} , function(resp){
                    if(resp.status){
                        combo.season_data[season] = resp.data.pano_key;
                        combo.setSeason(season)
                        //pano.setPano(resp.data.pano_key);
                    }else{
                        nofity('没有找到对应季节全景');
                    }
                });
            }

        });

        $('body').on('click','.cat h3',function(){
            $(this).parent().toggleClass('active');
            $(this).siblings('ul').slideToggle(200);
        }).on('click','.cat li',function(){
            var self = $(this);
            if(!self.hasClass('select')){
                var id   = self.attr('data-id'),
                    name = self.html();
                self.addClass('select').siblings('li').removeClass('select').parent().slideUp(200).siblings('h3').html(name).parents().removeClass('active');

                poi.load(id);
            }
        });

        $('body').on('click' , '.maps-label' , function(){
            poi.setPano($(this).attr('data-id'));
        });
    }

    init();

}());