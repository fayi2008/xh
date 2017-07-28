/**
 * 全景组合插件
 */



;(function(){

    var loc = (function(){
        var icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAA51BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFhYVFRUVFRUmJiaFhYWLi4u8vLy+vr6/v7/CwsLQ0NDV1dXc3Nze3t7m5ubo6Ojo6Ojy8vLz8/P29vb39/f39/f6+vr8/Pz9/f39/f3+/v7+/v4Akf8Ckv8Ek/8Fk/8HlP8Nl/8QmP8hn/8nov8zp/9IsP9RtP9pvv9swP9vwf9ywv+c1P+f1v+94//M6f/////hEagwAAAAOHRSTlMAAQIDBAUGBwgJCgsMDQ8QERITFxgZHR4fICEjIyQlKEtNbnF0doyToKK3ubzU1uDi5enz9fj6/RQpAtoAAAE6SURBVCjPhZLXdoJgEIT5EURQWkRUsMUuiahJVKIpYlfm/Z8ngCViPGZuv7N7dmeGog4ihGZYXwxNCBURicUFUVIUSRTiMRIFSSWtG6Zp6GkleQFJLCFpxaplj8e2VS1qUuLECMOreqWLo7oVXeUZcpjh1XxzCG/jTibuxsOwmVf5cI7m5Gwb2E2dUNMd0M7KHB2sS2XqwMI5awHUMyl/JeHU8gtWzoVW6JdVjlC0oDWwdyLao6EJNMWIuoVlFC1h6SJDsbLRwyyKvjEwZJZiFfMVX1H0gZGp3EafeAvRjYUz9IKFd864c3zwcv/65UH48tGo+S+Zn4wK7M11gO3R3vct0MmF9oahFFojeGvXcdy1h1Gr8HAI5U+Uj+coA+YXoFR7sgH7uVbyC8CQ/2tzKpusKPJ12W5X9AdvFVc/U61zmwAAAABJRU5ErkJggg==';
        if(typeof(BMap) == 'undefined') return;
        /* label */
        function label(pos){
            this._position = pos;
            this.size = [26,26];
            this.setMap = function(map){
                if(map === null)
                    this._map.removeOverlay(this);
                else{
                    map.addOverlay(this);
                    this.draw();
                }
                return this;
            }

        }

        label.prototype = new BMap.Overlay();

        label.prototype.initialize = function(map){
            this._map = map;
            var el = this._el = P.dom.create("div" , null,'maps-loc','position:absolute;background:url('+icon+') no-repeat;width:26px;height:26px;');
            map.getPanes().labelPane.appendChild(el);
            return el;
        }

        label.prototype.draw = function(){
            if(this._position && this._map){

                var pixel = this._map.pointToOverlayPixel(this._position);
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

    var evt = P.evt;
    var isTouch = P.feature.isTouch;
    var server = window.PANO_CFG_PATH || "/Panorama/";
    var img = window.PANO_IMG_PATH || "/pano/";
    function Combo(pano , season){
        //this.options = P.extend(this.options,opts);
        this.pano = pano;
        this.season = season;
        this.season_data = {};
        this.ctor();
    }

    Combo.prototype = {
        options : {
            api: server+"{id}/group.json"
        },

        ctor:function(){
            this.el   = P.dom.create('div',null,'p-combo',null);
            this.album = P.dom.create('div',null,'p-ctrl-album','',this.el);
            this.cont = P.dom.create('div',null,'album-cnt','position: relative;height: 100%;overflow:hidden;margin-left: 250px;',this.album);
            this.wrap = P.dom.create('div',null,null,'position:absolute;left:0;bottom:0;height:110px;width:100%;',this.cont);
            this.group = P.dom.create('div',null,null,'position:absolute;left:0;width:100%;top:0;height:24px;line-height:24px;color:#fff;',this.cont);
            this.expand = P.dom.create("div",null,'p-expand',"position:absolute;top:-32px;right:0;height:32px;width:32px;background-color:rgba(0,0,0,0.5);",this.album);

            this.nav = P.dom.create('div',null,'p-nav','',this.el);
            this.back = P.dom.create('div',null,'p-nav-back','',this.nav);
            this.title = P.dom.create('div',null,'p-nav-title','',this.nav);
            this.tm = P.dom.create('div',null,'p-nav-tm','',this.nav);
            this.tm.innerHTML = '<span>时光机</span><ul style="display:none"><li data-id="1">春季</li><li data-id="2">夏季</li><li data-id="3">秋季</li><li data-id="4">冬季</li></ul>';

            this.culture = P.dom.create('div',null,'p-nav-culture','',this.nav);
            this.culture_list = P.dom.create('div',null,'p-nav-culture-list','',this.nav);

            var map_id = 'map_container'+ "_" + new Date().getTime() + "_" +Math.round(Math.random()*300);
            this.map_container = P.dom.create('div',map_id,'p-nav-map','',this.album);

            var center = [30.2436200,120.1380500];

            this.loc = new loc();
            this.pano.addEventListener("pano_changed" , this.onChanged , this);
            this.pano.whenReady(function(){
                if(window.BMap){
                    this.map = new BMap.Map(map_id,{enableMapClick:false,maxZoom:18});
                    this.map.centerAndZoom( xh.maps.latlng(center), 15);
                    this.map.enableScrollWheelZoom(true);
                    this.loc.setMap(this.map);
                    //this.loc.setPosition( this.map.getCenter() );
                }
                this.setSeason(this.season);
            } , this);


            //if(this.data) this.draw();
            this.kinetic = P.kinetic();

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
            this.setNav();
            var panoData = this.pano.panoData;
            var title = panoData.location.shortDesc;
            this.title.innerHTML = title;

            this._fetch();
        },

        /**
         * @param force 强制刷新
         * @private
         */
        _fetch : function(force){
            var id = this.pano.panoid, local = this;
            var group = {};
            //相同分组
            if(!force && this.data && this.data.panos && this.data.panos[id]) {
                this.tabIndex = this.data.panos[id].group_id;
                local.drawGroup();
                return;
            };

            $.getJSON(P.parse(this.options.api,{id:id}),{'season':this.season},function(resp){
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
            /*if(this.tabIndex === undefined) {

            }*/
            if(id){
                //切换分组
                if(this.tabIndex != id){
                    this.tabIndex = id;
                    $(this.wrap).css({'left':0});
                    $(this.group).children("[data-id="+id+"]").addClass('select').siblings('a.select').removeClass("select");

                    if(this.data.group[id].group_list){
                        var id = this.data.group[id].group_list[0].pano_key;
                        this.pano.setPano(id);
                    }

                }

            }else{
                var data = this.data.raw;
                var html = "", tabIndex = this.tabIndex;
                for(var i in data){
                    html += '<a class="'+(data[i].id == tabIndex ? "select" : "")+'" style="display:inline-block;height:24px;padding:0 10px;margin-right:5px;" data-id="'+data[i].id+'">'+data[i].name+'</a>';
                }
                this.group.innerHTML = html;
            }
            this.draw();
        },

        draw : function(){
            var data = this.data.group[this.tabIndex].group_list || [],
                id = this.pano.panoid,
                html = "";
            var misspano = true;
            //console.log(data);console.log(id);console.log('====>')
            for(var i in data){
                html += '<li style="background:url('+this.getThumbById(data[i].pano_key)+') center center" class="'+(data[i].pano_key == id ? "select" : "")+'" data-id="'+data[i].pano_key+'"><span>'+data[i].title+'</span></li>';
                if(data[i].pano_key == id) misspano = false;
            }

            if(misspano) this.pano.setPano(data[i].pano_key);

            this.wrap.innerHTML = "<ul>" + html + '</ul>';
            this.wrap.style.width = (200 + 5) * data.length + "px";
        },

        _bind : function(){
            var pano = this.pano, active = false, local = this;
            var ori = 0, el = this.wrap,width = 1, left = 0, vw = $(this.album).width();
            var container = this.cont;
            var item_click_enable = false;
            var kinetic = this.kinetic;
            var outHandler = function(){
                left = parseInt(el.style.left);
                if(active){

                    if( left >= 0){
                        $(el).animate({"left":0},300);
                    }else if( left <= vw - width){
                        $(el).animate({"left":vw - width},300);
                    }else{
                        var m = kinetic.end();
                        if(m){
                            var distance = kinetic.getDistance(),
                                angle = kinetic.getAngle(),
                                dx = distance * Math.cos(angle);
                            if(dx>vw/4) dx = vw/4;
                            if(dx<-vw/4) dx = -vw/4
                            local.anim = P.anim.add({
                                time : 250,
                                value:dx,
                                onUpdate:function(dist , t){
                                    $(el).css({"left":left + dist});
                                },
                                onComplete:function(){
                                    left = parseInt(el.style.left);
                                    if( left >= 0){
                                        $(el).animate({"left":0},300);
                                    }else if( left <= vw - width){
                                        $(el).animate({"left":vw - width},300);
                                    }
                                }
                            });
                        }else{
                            item_click_enable = true;
                        }
                    }

                    active = false;
                }
            };

            $(this.back).on('click',function(){
                history.back();
            });


            $(this.expand).on("click",function(){
                $(local.album).toggleClass("hide");
            });
            $(this.group).on('click','a',function(){
                var id = $(this).attr('data-id');
                local.drawGroup(id);
            });

            $(this.wrap).on("click",'li' , function(){
                if(item_click_enable){
                    var id = $(this).attr('data-id');
                    pano.setPano(id);
                }

            }).on(evt.down , function(e){
                item_click_enable = true;
                ori = local._getPosX(e);
                left = parseInt(el.style.left) || 0;
                width = parseInt(el.style.width) || 1;
                vw = $(container).width();
                if(width > vw)
                    active = true;

                if(local.anim)
                    P.anim.remove(local.anim);

                kinetic.begin();
            });

            $(document).on(evt.move , function(e){
                if(active){
                    var dx = local._getPosX(e) - ori;
                    var nx = left + dx;
                    if( nx >= 0){
                        nx = nx / (Math.abs(nx) / vw + 1);
                    }
                    if(nx<=(vw - width)){
                        var dt = nx- vw + width;
                        nx = vw - width + dt / (Math.abs(dt) / vw + 1);
                    }
                    el.style.left = nx + "px";
                    item_click_enable = false;
                    kinetic.update(local._getPosX(e) , 0);
                    //$(el).animate({left:e.clientX - ori},20);
                    e.preventDefault();
                    e.stopPropagation();
                }

            }).on(evt.end , function(e){
                outHandler();
                e.stopPropagation();
            });
        },
        setDate : function(d){
            this.data = d;
            draw();
        },
        _onDown:function(){

        },
        _onEnd:function(){

        },
        _onMove:function()
        {

        },
        _getPosX:function(e){
            return isTouch ? e.originalEvent.changedTouches[0].pageX : e.pageX;
        }
    }

    window.Combo = Combo;

}());