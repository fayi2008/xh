
(function(){
    var culture_key = '';
    var origin_culture_data;
    var origin_culture = {};
    var callback;

    $('.modal').on('click','.js-close',function(){
        $('.modal').hide();
        callback && callback();
    });

    $('.modal').on('input' , '#j_culture_input' , function(){
        var value = $(this).val().replace(/\s/g,'');
        if(!culture_key && origin_culture_data){
            renderCulture(origin_culture_data);
        }
        if(culture_key != value){
            culture_key = value;
            searchCulture(culture_key);
        }
    });

    $('.modal').on('click' , '.footer button' , function(){
        var type = $('#j_action').val();
        if(type == 5){
            $('#j_culture_id').val( $('#j_culture_input').attr('data-id') );
        }else{
            var v = $('#j_type_'+type+' .j-cnt').val();
            $('#j_type_value').val(v);
        }
        $('.modal').hide();
        callback && callback();
    });

    $('.modal').on('click' ,'#j_item ul li' ,function(){
        $('#j_culture_input').val( $(this).attr('data-title') )
            .attr('data-id' , $(this).attr('data-id') );
        $('#j_item').empty();
    })

    function renderCulture(data){
        var html = '';
        for(var i in data){
            html += '<li data-title="'+data[i].title+'" data-id="'+data[i].id+'">'+data[i].id+' . '+data[i].title+'</li>';
        }
        $('#j_item').html( '<ul>'+html+'</ul>' );
    }

    function searchCulture(fn){
        if(culture_key.length == 0 && origin_culture_data){
            renderCulture(origin_culture_data);

            fn && fn();
        }else{
            $.getJSON('/Culture/culture/suggest_culture',{'title':culture_key} , function(resp){
                if(!culture_key && !origin_culture_data){
                    origin_culture_data = resp.data;
                    for(var i in origin_culture_data){
                        origin_culture[origin_culture_data[i].id] = origin_culture_data[i];
                    }
                    //console.log(origin_culture)
                }
                renderCulture(resp.data);
                fn && fn();
            });
        }
    }

    window.setValue = function(callback){
        var type = $('#j_action').val();
        $('.modal').show();
        $('#j_type_'+type).show().siblings('.section').hide();
        if(type == 5){
            var v = $('#j_culture_id').val();
            searchCulture(function(){
                if(origin_culture[v]){
                    $('#j_culture_input').val( origin_culture[v].title).attr('data-id' , origin_culture[v].id);
                }
            });
        }else if(type == 3){
            var v = $('#j_type_value').val();
            //console.log( origin_culture[v] )
            if(v) $('#j_type_3 .j-cnt').val(v);
        }else if(type==4){
            var v = $('#j_type_value').val();
            //console.log( origin_culture[v] )
            if(v) $('#j_type_4 .j-cnt').val(v);
        }
    }
}());

;(function(){
    var creater = {
        "hot":function(d){
            var html = '<form><input type="hidden" name="ID" value="'+ d.id+'"/><input type="hidden" name="PANO_ID" value="'+ d.pano_id +'"/><input type="hidden" name="PANO_KEY" value="'+ d.pano_key +'"/><ul><li><span>名称</span><input type="text" name="TITLE" value="'+ d.title+'"/></li><li><span>经度</span><input type="text" name="LON" id="p_lng" value="'+ d.lon+'"/></li><li><span>纬度</span><input id="p_lat" type="text" name="LAT" value="'+ d.lat+'"/></li><li><span>高度</span><input type="text" name="HEIGHT" value="'+ d.height+'"/></li><li><span>描述</span><textarea type="text" name="CONTENT">'+ d.content +'</textarea></li><li><span>显示</span><label for="c1"><input type="checkbox" id="c1" value="1"/>1级</label><label for="c2"><input id="c2" type="checkbox" value="2"/>2级</label><label for="c3"><input id="c3" type="checkbox" value="3"/>3级</label><input type="hidden" id="j_zindex" value="'+ d.z_index+'" name="Z_INDEX"/></li><li><span>响应</span><select name="TYPE" id="j_action"><option value="3">切换场景</option><option value="4">弹出介绍框</option><option value="5">关联文化知识</option></select></li><li><span>值</span><button id="j_value" >编辑</button><input type="hidden" id="j_type_value" name="TYPE_VALUE" id="j_type_value" value="'+ d.type_value+'"/><input type="hidden" id="j_culture_id" name="CULTURE_ID" value="'+ d.culture_id+'"/></li></ul><button class="save" type="button">保存</button><button class="pub" type="button" data-id="'+d.id+'" data-status="'+ (d.status==1?1:0)+'">'+ (d.status == 1 ? '取消发布':'发布')+'</button><button type="button" class="delete">删除</button></form><div class="close" type="button">×</div>';
            return html;
        },

        'list':function(d){
            var html = '';
            // status 0 已删除, 1 已发布, 2 未发布
            for(var i in d){
                var status = '发布',code = 0;
                if(d[i].status == 1) {
                    status = '取消发布';code = 1;
                }
                html += '<li data-id="'+d[i].id+'"><i>'+d[i].title+'</i><span><a data-id="'+d[i].id+'" data-status="'+code+'" class="pub pub-'+d[i].status+'">'+status+'</a></span></li>';
            }
            return '<ul>'+html+'</ul>'
        }
    }

    function serializeObject(o){
        var obj = {};
        for(var i=0;i< o.length;i++){
            obj[o[i].name.toLowerCase()] = o[i].value;
        }
        return obj;
    }
    var api = {
        "pano":"/",
        "hot":"/Panorama/admin/hot",
        'pub':'/Panorama/admin/hot_release'
    }

    /*var editerControl = (function(){

    })*/
    function editerControl(pano){
        this.pano = pano;
        this.ctor();
        this.overlays = [];
        this.target = null;
        this.hot_active = false;
        // 0 get, 1 update , 2 add ,3 delete
        this.action = null;
        this.setValueActive = false;
    }

    editerControl.prototype = {
        ctor : function(){
            this.el   = P.dom.create('div',null,'p-ctrl-editer',null);

            this.menu = P.dom.create('div',null,'p-ctrl-editer-menu',null,this.el);
            this.area = P.dom.create('div',null,'p-ctrl-editer-area',null,this.el);
            this.wrap = P.dom.create('div',null,'p-ctrl-editer-wrap',null,this.area);

            this.menu.innerHTML = "<button>热点列表</button>";

            this.list = P.dom.create('div',null,'p-ctrl-editer-list section',null,this.wrap);
            this.detail = P.dom.create('div',null,'p-ctrl-editer-detail section',null,this.wrap);
            this.preview = P.dom.create('div',null,'p-ctrl-editer-preview',null/*,this.el*/);
            this.preview.innerHTML = '预览';
            this.pano.addEventListener("pano_changed" , this.onChanged , this);
            this.preview_mode = false;
            this._initEvents();
        },

        _initEvents:function(){
            var el = $(this.el), local = this;

            this.pano.addEventListener("overlay_click",function(e){
                if(local.preview_mode || window.event.ctrlKey)
                    this._onAction(e.target);
                else
                    this._active(e.target);
            },this);

            this.pano.addEventListener("overlay_drag",function(e){
               this._onHotDrag(e.position);
            },this);

            el.on('change' , 'input' , function(){
                local.changed = true;
            });

            el.on('click' , '.save:not(.disable)' ,function(){
                local._onSave($(this));
            });

            /*el.on('click' , '.pub:not(.disable)' ,function(){
                local._onSave($(this));
            });*/

            el.on('click','.close',function(){
                local._onClose();
            });

            el.on('click','.delete',function(){
                local._onRemove($(this));
            });

            el.on('click','.p-ctrl-editer-list li' , function(){
                var id = $(this).attr('data-id');
                var obj = local.getById(id);
                var p = {heading:obj.data.lon,pitch:obj.data.lat};
                //console.log(p)
                local.pano.setPov(p);
                //local._active( local.getById(id) );
            });

            el.on('click','.pub:not(.dis)',function(e){

                var status = $(this).attr('data-status'),
                    id = $(this).attr('data-id');
                var obj = local.getById(id);
                var el = $(this).addClass('dis').html($(this).html() + "...");
                $.getJSON(api.pub , {id:id , unrel:status},function(resp){
                    if(resp.status){
                        el.attr('data-status',status == 0 ? 1 :0).html(status == 0 ? '取消发布' :'发布')
                            .removeClass('dis');
                        $('.pub[data-id="'+id+'"]').attr('data-status',status == 0 ? 1 :0).html(status == 0 ? '取消发布' :'发布');
                        obj.data.status = status == 0 ? 1 :0;
                    }
                });
                e.stopPropagation();
            });

            el.on('click' , '.p-ctrl-editer-preview',function(){
               local.preview_mode = !local.preview_mode;
                el.toggleClass("preview");
            });

            /*el.on('change','#j_action' , function(){
                var value = $(this).val();


            });*/

            el.on('click','#j_value',function(e){
                local.setValueActive = true;
                setValue(function(){
                    local.setValueActive = false;
                });
                e.preventDefault();
            })

            el.on('change','#p_lng' , function(){
                var v = $(this).val();
                if(v>360 || v<0)
                {
                    v = (v+3.6e5)%360;
                }
                $(this).val(v);
            });
            el.on('change','#p_lat' , function(){
                var v = $(this).val();
                if(v>90)
                {
                    v = 90
                }else if(v<-90){
                    v = -90
                }
                $(this).val(v);
            });

            this.pano.addEventListener('click' , function(e){
                if(window.event.ctrlKey && !local.hot_active){
                    local._onHotAdd();
                }
            })

            $(document).keyup(function(event){
                switch(event.keyCode) {
                    case 27:
                        !local.setValueActive && local._onClose();
                }
            });
        },

        updateCulture:function(key){

        },

        onChanged : function(fn){
            this.clear();
            this.pano_key = this.pano.panoid;
            this.pano_id =  this.pano.panoData._raw.id;
            var local = this;
            this.fetch(function(resp){
                local.render();
            });
        },

        clear : function(){
            for(var i in this.overlays){
                this.overlays[i].setPano(null)
            }
        },

        render : function(){
            var data = this.data, pano = this.pano;
            for(var i in data)
            {
                var o = P.marker({'position':{x:data[i].lon , y:data[i].lat}}).setPano(pano);
                o.data = data[i];
                this.overlays.push( o );
            }
            $(this.list).html( creater.list(data) );
        },

        getById:function(id){
            var overlays = this.overlays;
            for(var i in overlays){
                if(overlays[i].data.id == id){
                    return overlays[i];
                }
            }
        },
        remove:function(obj){
            obj.setPano(null);
            delete this.data[obj.data.id]
        }
    }

    // handlers
    P.extend(editerControl.prototype , {
        _onAction:function(obj){
            //console.log(obj.data.type)
            var type = obj.data.type, value = obj.data.type_value;
            switch(type){
                case '1':
                    window.open(value);break;
                case '2':
                    //playSound
                    ;break;
                case '3':
                    this.pano.setPano(value);break;
                case '4':
                    this.pano.trigger('show_text',{data:value});break;
            }

        },
        _onSave : function(btn){
            btn.addClass('dis');

            var adIds = [];
            $("input:checkbox:checked").each(function(i){
                adIds.push($(this).val())
            });

            $('#j_zindex').val(adIds.join(','));

            var data = $(this.el).find('form').serializeArray();
            var local = this;
            //console.log(this);

            this.save(data , this.action || 'PUT' , function(resp){
                if(resp.status){
                    //更新信息
                    local.target.data = serializeObject(data);
                    if(local.action == 'POST'){
                        //如果是 添加 需要 更新 ID
                        local.update(function(){
                            local.target.setPano(null);
                            local.hot_active = false;
                            local._active(local.overlays[local.overlays.length-1]);
                        });
                    }else{
                        var id, title;
                        for(var i in data){
                            if(data[i].name == 'ID') id = data[i].value;
                            if(data[i].name == 'TITLE') title = data[i].value;
                        }
                        $('.p-ctrl-editer-list li[data-id="'+id+'"] i').html(title);
                        //local.update();
                    }

                    local.action = 'PUT';

                    alert('保存成功');
                }else{
                    alert('操作失败');
                }
                btn.removeClass('dis');
            });

        },
        _onRemove:function(btn){
            btn.addClass('dis');
            var id  = this.target.data.id,
                local = this,
                el = $(this.el);
            this.save({"id":id} , 'DELETE' , function(resp){
                if(resp.status){
                    btn.removeClass('dis');
                    el.removeClass('hot_active');
                    local.hot_active = false;
                    local.remove(local.target);
                    local._renderList();
                }else{
                    alert('删除失败');
                }
            })
        },

        _onHotAdd:function(){
            var p = this.pano.getMousePosition(true);
            var data = {
                'lat': p.y.toFixed(6), 'lon': p.x.toFixed(6),
                'title':"",'content':'',
                'type':1,
                'pano_key':this.pano_key,
                'pano_id':this.pano_id,
                'id':0,'height':0,
                'type_value':"",
                'status':2
            }
            this.target = P.marker({position:p, draggable : true}).setPano(this.pano);
            this.target.data = data;
            this._active(this.target);
            this.action = 'POST';
        },
        _onHotDrag:function(p){
            if(this.hot_active && this.el) {
                //console.log($(this.el).find('#p_lat'))
                $(this.el).find('#p_lat').val(p.y.toFixed(6));
                $(this.el).find('#p_lng').val(p.x.toFixed(6));
            }
        },
        _onClose:function(){
            this.hot_active = false;
            $(this.el).removeClass('hot_active');

            if(this.target){
                this.target.setIcon("icons/marker.png");
                this.target.setDraggable(false);
                /*if(this.changed){
                    if(confirm("改动还未保存，是否退出?")){
                        this.target.setPosition(this.target.data.position);
                    }
                }*/
                this.target.setPosition({x:this.target.data.lon , y:this.target.data.lat});
                if(this.action == 'POST'){
                    this.target.setPano(null);
                    this.target = null;
                }
                this.action = null;
            }

            //清除 扩展字段的内容
            // fix #794: http://redmine.hqkeji.cn/issues/794
            $('.modal .section .j-cnt').val('')
        },
        _active:function(obj){
            //console.log(obj,this.el);
            if(!this.hot_active){
                $(this.el).addClass('hot_active');
                this._renderDetail(obj);
                this.target = obj;
                obj.setIcon('icons/marker-editer.png');
                obj.setDraggable(true);
                this.hot_active = true;
                this.action = 'PUT';
            }
            //console.log(this);
        }


    });

    // model 操作
    P.extend(editerControl.prototype, {
        'equal':function(obj){
            var n = obj.getPosition(), o = obj.data.position;
            return n.x == o.x && n.y == o.y;
        },

        'fetch':function(fn){
            var local = this;
            $.getJSON(api.hot + '.json' , {id : this.pano_id} ,function(resp){
                var data = resp.rows,all = {};
                for(var i in data){
                    all[data[i].id] = data[i];
                }
                local.data = all;
                fn && fn(all);
            })
        },
        'save':function(data, type , fn){
            $.ajax({
                type:type,
                url:api.hot,
                data:data,
                dataType:'json',
                success:function(resp) {
                    fn && fn(resp);
                }
            })
        },
        'push':function(){

        },
        'update':function(fn){
            var local = this;
            this.fetch(function(){
                local.clear();
                local.render();
                fn && fn();
                //local._lastItem = resp[resp.length-1];
            });
        }
    });

    // dom 操作
    P.extend(editerControl.prototype , {
        _renderList : function(){
            $(this.list).html( creater.list(this.data) );
        },
        _renderDetail:function(obj){
            var data = obj.data;
            var type = data.type;

            $(this.detail).html( creater.hot(data) ).find("select option[value='"+type+"']").attr("selected",true);
            //
            // .split(',');
            if($('#j_zindex').val()){
                var zindex = $('#j_zindex').val().split(',');
                for(var i in zindex){
                    $('input:checkbox[value='+zindex[i]+']').attr("checked","checked");
                }
            }
        }
    })
    window.editer = function(opts){
        return new editerControl(opts);
    }

}());