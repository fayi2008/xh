/**
 * Created by Administrator on 2015/12/4.
 */


var cell = (function(){
    var loc, pano, phone = window.contact_phone;
    function initLocation(){
        maps.location.getPosition(function(d){
            if (d.status == 0) {
                var data = d.detail;
                loc = maps.proj.wgs2gcj(data.latitude, data.longitude);
            }
        });
    }

    function init(el , v){
        //长按 弹出拨号
        var flag = true, down_time, tick = 1001;
        pano = v;

        var handler;

        var process = function(){
            //console.log(+new Date() - down_time)
            if(!flag){
                $('.context_menu').addClass('active');
                flag = true;
            }
            if(handler) window.clearTimeout(handler);
        }

        var hide = function (){
            $('.context_menu').removeClass('active');
            if(handler) window.clearTimeout(handler);
            flag = true;
        }

        var postCell = function(paras , callback){
            $.ajax({
                url:'/panorama/index/coming_call',
                type:'get' ,
                data:paras
            }).always(function(rs){
                location.href = 'tel:' + phone;
                $('.context_menu').removeClass('process');
                hide();
            });
        }
        el.addEventListener('touchstart',function(){
            flag = false;
            down_time = +new Date();
            if(handler) clearTimeout(handler);
            //console.log(down_time)
            handler = setTimeout(process , tick);

        },true);

        el.addEventListener('touchmove',function(){
            flag = true;
            if(handler) clearTimeout(handler);
        },true);
        el.addEventListener('touchend',function(){
            flag = true;
            if(handler) clearTimeout(handler);
        },true);

        $('.context_menu').on('click','#j_coming_call',function(){
            //var /*USER_DATA = {'mobile':'13800000000'},*/ loc={'lat':30 , lng:120};
            if(window.USER_DATA && USER_DATA.mobile){
                var paras = {'yhzh':USER_DATA.mobile , 'dhhm':USER_DATA.mobile, 'x':0 , 'y':0 , 'qjid':pano.panoid,'jd':Math.round(pano.getPov().x)+','+Math.round(pano.getPov().y),'address':''};
                if(loc.lat && loc.lng){
                    paras.x = loc.lng;
                    paras.y = loc.lat;
                    $('.context_menu').addClass('process');
                    maps.location.geoCoding(loc.lat , loc.lng , function(rs){
                        if(rs.sematic_description){
                            paras.address = rs.sematic_description;
                            postCell(paras);
                        }else{
                            postCell(paras);
                        }
                    });
                }else{
                    postCell(paras);
                }
            }else{
                location.href = 'tel:' + phone;
                hide();
            }
        }).on('click','#j_subscribe_call li',function(){
            var id = $(this).attr('data-id');

            if(window.USER_DATA && USER_DATA.mobile){
                $('.context_menu').addClass('process');
                $.getJSON('/panorama/index/subscribe_call',{'yylb':id,'dhhm':USER_DATA.mobile} , function(resp){
                    $('.context_menu').removeClass('process');

                    if(resp.infocode=='00'){
                        xh.ui.alert({'title':'预约成功'});
                    }else{
                        xh.ui.alert({'title':'预约失败','content':resp.infomsg});
                    }
                });
            }else{
                xh.ui.alert({'title':'请先登录'});
            }


        }).on('click' , '#j_processing_message' , function(){
            if(window.USER_DATA && USER_DATA.mobile) {
                $('.context_menu').addClass('process');

                $.getJSON('/panorama/index/processing_message',{'yhzh':USER_DATA.mobile,'ptlx':''},function(resp){
                    $('.context_menu').removeClass('process');

                    if(resp.infocode == '00'){
                        //console.log(resp)
                    }else{
                        xh.ui.alert({'title':'错误','content':resp.infomsg});
                    }
                })
            }else{
                xh.ui.alert({'title':'请先登录'});
            }

        }).on('click' , '.mask' , function(){
            hide();
        }).on('click' , '#j_cancel' , function(){
            hide();
        })
    }

    initLocation();
    return init;
}());

(function(){
    var pano, panoData, combo;

    var nofity = xh.ui.tips,
        vm = xh.vm;

    var ext_opts = {pov:{heading:0,pitch:0},zoom:1};
    if(P.hash.get('x')){
        ext_opts.pov.heading = P.hash.get('x');
    };
    if(P.hash.get('y')){
        ext_opts.pov.pitch = P.hash.get('y');
    };
    if(P.hash.get('z')){
        var iz = P.hash.get('z').split(',');
        if(iz.length && parseInt(iz[0])){
            ext_opts.zoom = parseInt(iz[0]);
        }
    };

    function initPano(id , season){
        pano = P.pano("pano",{
            "pano":id
            ,"hashControl":false
            ,'albumControl':false
            ,'addressControl':false
            ,'pov':ext_opts.pov
            //,"disableDefaultUI":true
        });
        combo = new Combo(pano , season);

        pano._addControl( combo.el );


        pano.addEventListener('overlay_click',function(e){
            var data = e.target.options.data, pano = this.pano;
            if(data) {
                var type = data.type,
                    value = data.type_value;
                if (type == '5'){
                    value = data.culture_id;
                    $('body').addClass('mask-culture');
                    $.getJSON('culture/'+value+'.json',function(resp){
                        //if(resp.status){
                            showCulture(resp);
                        //}
                    });
                }else if( type == '4'){
                    $('body').addClass('mask-content');
                    $('.box-content h3').html(data.title);
                    var cnt = data.type_value || data.content;
                    $('.box-content div').html(cnt);
                    $('#j_voice').attr('src',xh.path.tts(cnt));
                }
            }
        });

        pano.addEventListener('ready',function(){
            var el = $('#pano>div>div:first-child')[0];
            cell(el , pano);
            $('body').removeClass('mode-loading');
            //定位到特定缩放级别
            if(ext_opts.zoom){
                var fov = pano.getFov();
                pano.setFov(fov / ext_opts.zoom);
            }
        });

        window.pano = pano
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
        }

        else if(P.hash.get('panoid')){
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
        /*
        var attrs = JSON.parse(data.attrs);
        for(var i = 0;i<attrs.length;i++){
            if(!attrs[i].value)
                attrs.splice(i,1);
        }
        */

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

        $('.box').on('click','.j-close',function(){
            var box = $(this).parents('.box');
            var type = box.attr('data-type');
            //console.log(box)
            $('body').removeClass('mask-'+type);
            if(type == 'content'){
                $('#j_voice').attr('src','');
            }
        });

        $('#pano').on('click','.p-nav-culture' , function(){
            if(pano.panoData){
                var pano_id = pano.panoData._raw.pano_key;
                $('body').addClass('mask-culture');
                $.getJSON('/panorama/'+pano_id+'/culture.json',function(resp){
                    showCulture( resp );
                    /*if(resp.status){
                        showCulture( resp.data);
                    }else{
                        //$('body').removeClass('mask-culture');
                        nofity('当前景点暂无文化要素');
                    }*/
                })
            }else{
                nofity('全景还未加载完全');
            }
        });

        $('body').on('click','.p-nav-culture-list' , function(){
            $('body').addClass('mask-culture_list');
            var poi_id = pano.panoData.poi_data.id;
            $.getJSON('/gis/poi/'+poi_id+'/culture.json' , function(resp){
                showCultureList( resp);
            })
        });

        $('body').on('click','.p-nav-culture-list' , function(){
            $('body').addClass('mask-culture-list');
            var poi_id = pano.panoData.poi_data.id;
            $.getJSON('/gis/poi/'+poi_id+'/culture.json' , function(resp){
                showCultureList(resp);
            })
        });

        $('#pano').on('click','.p-nav-tm li:not(.select)',function(){
            var poi_id = pano.panoData.poi_data.id;

            var el = $(this), season = el.attr('data-id');

            if(combo.season_data[season]){
                combo.setSeason(season)
            }else{
                $.getJSON('/panorama/poi',{'poi_id':poi_id , 'season':season} , function(resp){
                    //console.log(resp);
                    if(resp.status){
                        combo.season_data[season] = resp.data.pano_key;
                        combo.setSeason(season);
                    }else{
                        nofity('没有找到对应季节全景');
                    }
                });
            }

        })
    }

    init();
}());