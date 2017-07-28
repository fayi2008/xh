
// var instance = app.getMap();

$(function(){
    function _search(){
        var search_url='/service/user/search'//参数  keyword
        this.init=function(){
            init()
            go()
            clear()
        }

        function init(){
            $('#search').on('input',function(){
                var keyword=$('#search').val()
                if(!keyword){
                    //alert(1)
                    //$('#search').attr('')
                    return
                }
                if(keyword.length>1){


                    $.getJSON(search_url,{keyword:keyword}).done(function(rs){
                        if(rs){
                            view(rs.data)
                        }
                    })
                }
                //$('.search-btn').off('click')

            })
        }

        function view(rs){
            if(rs.length){
                var html=''
                if(rs.length>5){
                    rs=rs.slice(0,5)
                }
                for(var i in rs){
                    var datas=rs[i]
                    html+='<div class="search-item" pid="'+datas.id+'" lat="'+datas.lat+'" lng="'+datas.lon+'" alt="'+datas.id+'"><div class="search-list-name">'+datas.name+'</div><div class="search-list-addr">'+datas.address+'</div><div class="search-list-to"></div></div>'
                }
                $('.search-list').html(html)
                $('.search').append('<div class="search-close"></div>')
            }
        }

        function go(){
            $('.search-list').on('click','.search-item',function(){
                $('.search-list').html('')
                var lat=$(this).attr('lat'),lng=$(this).attr('lng'),id=$(this).attr('pid')
                app.getMap().centerAndZoom(mapx.latlng((+lat+0.002)+','+lng), 15);

                location.hash='!iw/'+id
                //poi.iw(id)

            })
        }

        function clear(){
            $('.search').on('click','.search-close',function(){
                $('#search').val('')
                $('.search-list').html('')
                $('.search-close').remove()
            })
        }


    }


    var search_hotel=new _search
    search_hotel.init()


})