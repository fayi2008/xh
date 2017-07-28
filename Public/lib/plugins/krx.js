/*
    krpanoJS javascript plugin example / template
*/

var krpanoplugin = function()
{
    var local = this,

        krpano = null,

        plugin = null;

    var cross;
    local.registerplugin = function(krpanointerface, pluginpath, pluginobject)
    {
        krpano = krpanointerface;
        plugin = pluginobject;
        //console.log(krpano.base64);

        //console.log(plugin.base64)
        krpano.krx = exec;
        plugin.registercontentsize(16,16);

        cross = pax.dom.create("div","",
            "position:absolute;width:16px;height:16px;background:#f00;",plugin.sprite);
        plugin.sprite.id = "plugins";
        cross.onselectstart = function() { return false; };

        exportApi();
    }


    local.unloadplugin = function()
    {
        plugin = null;
        krpano = null;
    }

    local.onresize = function(width,height)
    {
        return false;
    }


    function getPosition(){
        var p = krpano.screentosphere(krpano.mouse.x,krpano.mouse.y);
        cross.style.top = krpano.mouse.y+"px";
        cross.style.left = krpano.mouse.x+"px";
        //console.log(p);
    }

    function exec(v){
        if(eval(v)){
            eval(v).apply(this,Array.prototype.slice(1,arguments));
        }
    }


    function exportApi(){
        pax.setPov = function(obj){
            krpano.call("moveto("+obj.heading+","+obj.pitch+")");
            return this;
        }
        pax.setFov = function(fov){
            krpano.call("zoomto("+fov+")");
        }
        pax.addLabel = function(name , position){
            krpano.addhotspot(name);
            krpano.set("hotspot['"+name+"'].ath",position.lng);
            krpano.set("hotspot['"+name+"'].atv",position.lat);
            krpano.set("hotspot['"+name+"'].url",'http://pano.com/krpano-1.18.4/examples/plugin-examples/snow-rain-imagerain/smiley.png');
            //krpano.call("addhotspot('"+name+"')");
            /*krpano.call([
                "addhotspot('"+name+"')",
                "hotspot['"+name+"'].url='http://pano.com/krpano-1.18.4/examples/plugin-examples/snow-rain-imagerain/heart.png'",
                "hotspot['"+name+"'].ath="+position.lng,
                "hotspot['"+name+"'].atv="+position.lat,
                "hotspot['"+name+"'].width=16",
                "hotspot['"+name+"'].height=16"
            ].join(";"));*/
        }

        pax.setPano = function(id){
            //krpano.call('trace(loadpano)');
            //krpano.call('loadxml("data:text/xml;base64,PGtycGFubz48cHJldmlldyB1cmw9Ii9wYW5vL2ltYWdlL3AyL3ByZXZpZXcuanBnIiAvPjxpbWFnZT48Y3ViZSB1cmw9Ii9wYW5vL2ltYWdlL3AyL3Bhbm9fJXMuanBnIiAvPjwvaW1hZ2U+PC9rcnBhbm8+")');

            krpano.call("loadxml('<krpano><preview url=\"/pano/image/"+id+"/preview.jpg\" /><image><cube url=\"/pano/image/"+id+"/pano_%s.jpg\" /></image></krpano>')");
        }
    }

    function a(a) {
        if (wc(a, _[278] + a + ")") && (a = Ha.createItem(a)))null == a.sprite && (a._dyn = !0, a.create(), G.hotspotlayer.appendChild(a.sprite)), Ie = !0;
    }
};