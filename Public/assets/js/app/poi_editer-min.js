define(function(){
    var el, pano, id, select, editer, lat, lng;
    var hot;
    function init(){

        initScene();

        lat = $("#p_lat").val() || 0;
        lng = $("#p_lng").val() || 0;
        hot = $('#p_id').val()  || 0;
        pano = P.pano('pano_editer' , {pano:id , disableDefaultUI:true , pov:{heading:lng , pitch:lat}
            ,poiControl:true
            ,albumControl:false
            ,hashControl:false
            ,addressControl:false
        });

        pano.addEventListener('poi_ready' , function(e){
            var data = e.data;
            for(var i in data){
                if(data[i].id == hot){
                    delete data[i];
                }

            }
        });
        editer = P.marker({keep:true,draggable:true , position:{x:lng , y:lat},icon:"icons/marker-editer.png"}).setPano(pano);

        editer.addEventListener("mouseup" , function(){
            var p = this.getPosition();
            lat = p.y.toFixed(6) ; lng = p.x.toFixed(6);
            setValue();
        });

        bind();
    }

    function initScene(){
        select = $('#pano_select');

        id = select.find("option:selected").attr("data-id");
        $('#p_pano_key').val(id);
        el = $("<div class='row'><div id='pano_editer' style='width:550px;height:300px;  margin: 0 0 20px 50px;'/></div>").insertAfter($('form .row:first'));

    }

    function update()
    {
        lat = $('#p_lat').val();
        lng = $('#p_lng').val();
        editer.setPosition({x:lng , y:lat});

    }

    function setValue(){
        $("#p_lat").val(lat);
        $("#p_lng").val(lng);
    }

    function bind()
    {
        select.on("change" , function(){
            var id = $(this).find("option:selected").attr("data-id");
            $('#p_pano_key').val( id );
            pano.setPano(id);
        })

        $('#p_lat,#p_lng').on("change" , function(){
            update();
        });
    }
    init();
});