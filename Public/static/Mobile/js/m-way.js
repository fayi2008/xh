var store = window.sessionStorage;
var ui = xh.require('xh.ui'),
    vm = xh.require('xh.vm'),
    evt= xh.require('xh.evt'),
    app= xh.require('xh.app');


/* reco */
(function(){
    var vm = xh.require('xh.vm');

    var api  = '/way/list.json',

        paras = {'day':'', 'ordertype':'', 'start':0, 'limit':8, 'page':0, 'tag_id':'', 'poi_id':''},

        view = $('#tpl').html(),

        count = 0, complete = false,

        wrap = $('#j_cnt');


    function init(){
        paras.order = xh.paras('ordertype');
        paras.day   = xh.paras('day');
        paras.poi_id= xh.paras('poi_id');
        paras.tag_id= xh.paras('tag_id');

        if(paras.order){
            $('#j_swtich_type').addClass(paras.order);
        }

        if(paras.day){
            $('#j_days li[data-num='+paras.day+']').addClass('select').siblings('li').removeClass('select');
        }

        //wrap.html(vm.template(view, data));
        render();

        var onScroll = xh.throttle(function(){
            var top = $(window).scrollTop();
            var h = $(window).height();
            var sh = $(document).height();
            if(!complete){
                if(sh - h - top <= 10 ){
                    paras.page++;
                    render();
                }
            }

        },200);

        $(window).on('scroll' , onScroll);
    }

    function render(){
        paras.day  = $('#j_days li.select').attr('data-num'),
        paras.ordertype= $('#j_swtich_type').hasClass('hot') ? 'hot' : 'time';
        paras.start = paras.page * paras.limit;

        ui.loading();
        $('footer').show();
        $.getJSON(api, paras , function(resp){
            ui.loading(null);
            count += resp.data.rows.length;
            //console.log(resp.data.rows.length);
            if(count>= resp.data.results){
                complete = true;
                $('footer').hide();
            }
            if(paras.page){
                wrap.append(vm.template(view, resp));
            }else{
                wrap.html(vm.template(view, resp));
            }
        });
    }

    $('.wrap').on(evt.click,'#j_swtich_type',function(){
        $(this).toggleClass('hot');
        paras.page = 0;
        paras.start = 0;
        count = 0;
        complete = false;
        render();
    });

    $('.wrap').on(evt.click , 'nav li' , function(){
        $(this).addClass('select').siblings('li').removeClass('select');
        paras.page = 0;
        paras.start = 0;
        count = 0;
        complete = false;
        render();
    });

    app.reco = function(){
        init();
    }
}());


/* detail */
(function(){
    var ui = xh.require('xh.ui');
    function render(data){
        app.render($('#tpl').html(),parse(data) , '.box');
        $('footer button').html( data.flag=='1' ? '取消收藏' : '收藏行程' );
    }

    xh.vm.helper({
        "day":function(v){
            return ('零一二三四五六七八九十').charAt(parseInt(v));
        },
        "time":function(v){
            v = parseInt(v);
            return v>60 ?
                parseInt(v/60)+"小时"+v%60+"分钟" :
                v+"分钟";
        }
    });

    function parse(d){
        var data = d.data, way = {};
        for(var i in data.poi){
            var nd = data.poi[i],
                td = nd.day;
            if(!way[td]) way[td] = {"day":td , "routes":[]};
            way[td].routes.push(nd);
        }

        //按游览日期 排序
        way = xh.key(way).sort(function(a,b){
            return parseInt(a.day) > parseInt(b.day) ? 1 : -1;
        });

        for(var i in way){
            way[i]["track"] = xh.select(way[i].routes,'name');
        }

        return { id: data.way.id , way:way };
    }

    app.detail = function(){
        $('footer').on(evt.click , 'button' , function(){
            ui.signin(function(status){
                if(status){
                    var id = data.data.way.id;
                    $.post('/user/collect.json',{"way":id},function(resp){
                        if(resp.status){
                            $('footer button').html(resp.data ? '取消收藏':'收藏行程');

                        }else{
                            ui.alert({'content':resp.msg});
                        }
                    })
                }

            })

        });
        render(data);
    }
}());

/**
 * custom
 */
(function(){

    function init(){
        $('.custom .wrap').on(evt.click,'.item' , function(){
            $(this).toggleClass('select');
        });

        $('.custom .wrap').on(evt.click,'#j_choice' , function(){
            var el = $('.item.select'), args = [];
            /*if(el.length == 0){
                ui.tips('请选择一种路线偏好');
                return;
            }*/
            for(var i=0;i<el.length;i++){
                args.push({
                    id:$(el[i]).attr('data-id'),
                    name:$(el[i]).html()
                })
            }
            store['tags'] = JSON.stringify(args);
            location.href = './choice.html'
        });

        $('.custom .wrap').on(evt.click , '#j_create' , function(){
            var els = $('.item.select'), tags = [];
            for(var i =0 ;i<els.length ; i++){
                tags.push($(els[i]).attr('data-id'));
            }
            location.href = '/way/reco.html?tag_id='+tags.join(',');
        })
    }


    app.custom = function(){
        var tags = JSON.parse( store['tags'] || '[]' );
        for(var i in tags){
            $('.item[data-id="'+tags[i].id+'"]').addClass('select');
        }
        store.removeItem('tags');

        init();
    }
}());


/**
 * choice
 */
(function(){
    var view,
        width = $('body.choice .suggest').width(),
        icon_size = width / 4;

    function update(key){
        if(key.length){
            $.getJSON('/way/index/getGoodsPoi',{name:key} , function(resp){
                if(resp.status) render(resp);
            })
        }else{
            render(data);
        }
    }

    function render(data){
        if(!view) view = $('#tpl').html();
        app.render(view,data,'#j_cnt');
        $('body.choice .suggest li').css({height:icon_size});
    }

    var key = '';

    function init(){
        $('.choice .wrap .search input').on('input' , function(){
            var value = $('#j_sch_key').val().replace(/\s/g,'');
            if(key != value){
                key = value;
                update(key);
            }
            if(key.length>0){
                $('.search').addClass('input');
                $('.suggest h3').html('搜索景点');
            }else{
                $('.search').removeClass('input');
                $('.suggest h3').html('推荐景点');
            }
        })

        $('.choice .wrap').on(evt.click , '#j_sch_clear' , function(){
            $('.search').removeClass('input');
            $('.suggest h3').html('推荐景点');
            $('#j_sch_key').val('');
            update([]);
        })

        $('.choice .wrap').on(evt.click , '.way em' , function(){
            $(this).toggleClass('select');
        })

        $('.choice .wrap').on('click' , '#j_cnt li' , function(){
            var el = $(this),id = el.attr('data-id');
            if( $('#j_select li[data-id="'+id+'"]').length == 0){
                $('#j_select').append($(this).addClass('select').clone());
            }

        });

        $('.choice .wrap').on(evt.click , '#j_select li' , function(){
            var id = $(this).attr('data-id');
            $(this).remove();
            $('.suggest li[data-id='+id+']').removeClass('select');
        });

        $('.choice .wrap').on(evt.click , '#j_create' , function(){
            var pois = [], tags = [];
            var el = $('#j_select li.select');
            for(var i=0;i<el.length;i++){
                pois[i] = $(el[i]).attr('data-id');
            }

            el = $("#j_tag em.select");
            for(var i=0;i<el.length;i++){
                tags[i] = $(el[i]).attr('data-id');
            }
            location.href = '/way/reco.html?poi_id=' + pois.join(',')
            + "&tag_id="+ tags.join(',');
            //tag_id=1,2&poi_id=26,27
        });
    }


    app.choice = function(){
        render(data);
        init();
        var tags = JSON.parse( store['tags'] || '[]');
        var html = '';
        for(var i in tags){
            html += ('<em data-id="'+tags[i].id+'" class="select">'+tags[i].name+'</em>');
        }
        $('#j_tag p').html(html);
    }
}());

/**
 * home
 */
(function(){

    function loadNearby(p){
        // alert('/way/nearby.json?lat='+p.lat+"&lon="+p.lng)
        $.getJSON('/way/nearby.json?lat='+p.lat+"&lon="+p.lng , function(resp){
            if(resp.status){
                var id = resp.data.way.id;
                $('.nearby-loading').fadeOut();
                location.href = '/way/map/'+id+'.html#day=1';   
            }else{
                $('.nearby-loading').fadeOut();
                ui.alert({'content':resp.msg});
            }

        })
    }

    app.home = function(){
        $('.wrap').on(evt.click ,'.nearby', function(){
            //$.getJSON();
            $('.nearby-loading').fadeIn();
            maps.location.getPosition(function (d) {
                if (d.status == 0) {
                    var data = d.detail;
                    var trans = maps.proj.wgs2gcj(data.latitude, data.longitude);

                    //var pos = maps.latlng(trans.lat, trans.lng);
                    loadNearby(trans);
                }else{
                    ui.alert({'content':'无法获取您当前位置'});
                    $('.nearby-loading').fadeOut();
                }
            });

        });
    }
}());


/**
* 初始执行
*/
$(function(){
    var mod = $('body').attr('data-page');
    app.render = function(tpl , model , wrap){
        $(wrap || '.wrap').html( vm.template(tpl, model) )
    }

    if(app[mod]){
        app[mod]();
    }
})