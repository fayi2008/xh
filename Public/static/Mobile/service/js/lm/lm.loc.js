/**
 * 定位
 */

(function(){
    var marker;
    var bound;
    var map;
    var locHander;
    var boundary;
    var ready = false;
    var locMarker = (function(){

        /* label */
        var locmaker = function(pos){
            this._position = pos;
            this.setMap = function(map){
                if(map === null)
                    this._map.removeOverlay(this);
                else
                    map.addOverlay(this);
                return this;
            }

            this.setPosition = function(v){
                this._position = v;
                this.draw();
            }

            this.setHeading = function(v){
               this._el.style['transform'] = 'rotate('+v+'deg)';
               this._el.style['webkitTransform'] = 'rotate('+v+'deg)';
            }

            this.toggle = function(v){
                if(v) $(this._el).addClass('show');
                else $(this._el).removeClass('show');
            }
        }

        locmaker.prototype = new BMap.Overlay();

        locmaker.prototype.initialize = function(map){
            this._map = map;
            var el = this._el = mapx.dom.create("div" , 'mapx-loction' , 'transform:rotate(0deg);-webkit-transform:rotate(0deg);');
            map.getPanes().labelPane.appendChild(el);
            return el;
        }

        locmaker.prototype.draw = function(){
            var pixel = this._map.pointToOverlayPixel(this._position);
            this._el.style.left = pixel.x +"px";
            this._el.style.top  = pixel.y +"px";
        }

        return new locmaker(mapx.latlng(0,0));
    }());

    function init(app){
        map = app.getMap();
        locMarker.setMap(map);
        bind();
    }

    var disableLoc = true, position;
    function bind(){
        $('#j_loc').on('click' , function(){
            setLocation();
        });

        if(!app.getOptions('forceCenter')){
            setLocation();
        }
    }

    function setLocation(){
        $("#j_loc").toggleClass('select');
        disableLoc = !disableLoc;
        if(disableLoc){
            close()
        }else{
            //render({'latitude':30.239881,'longitude':120.176928,'heading':30});
            //return;
            mapx.location.getPosition(function(d){

                if(d.status == 0){
                    ready = true;
                    render(d.detail);
                }else{
                    ready = false;
                    ui.alert("提示",d.detail);
                    $("#j_loc").removeClass('select');
                }
            })
        }
    }
    function render(data){

/*        var coords = {
            'latitude': res.latitude, // 纬度，浮点数，范围为90 ~ -90
            'longitude': res.longitude, // 经度，浮点数，范围为180 ~ -180。
            'speed': res.speed, // 速度，以米/每秒计
            'accuracy': res.accuracy // 位置精度
        };*/
        //console.log('location:' + data)
        var trans = mapx.proj.wgs2gcj(data.latitude , data.longitude);
        var pos = mapx.latlng(trans.lat , trans.lng);
        position = trans;
        locMarker.setPosition(pos);
        locMarker.setHeading(data.heading);
        locMarker.toggle(true);

        map.panTo(pos);
    }




    function close(){
        locMarker.toggle(false);
    }

    window.loc = {
        "get" : function(fn){
            return position
        },
        "ready":function(){
            return ready;
        }
    }
    app && init(app);
}());