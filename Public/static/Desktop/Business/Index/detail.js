/*
 * Author:fay
 * Date:2016-03-30
 * desc:商务模块商家详情页
 *
 * */
$(function() {
    function Detail() {
        this.init = function() {
            $(".web-bar-way[data-type=business]").addClass("now").siblings().removeClass("now");
            view();
        };
        function view() {
            var rs = window.SHOP_DETAIL;

            var datas = rs.data;
            if(datas.pano_key){
                $(".shop-image").css('height','600px')
                $(".shop-image").html('<iframe style="width:100%;height:100%;border:0px;" src="/panorama#panoid=' + datas.pano_key + '"></iframe>');
            }else{
                $(".shop-image").html('<img src="' + $._LOCAL_IMGURL_(datas.image) + '"/>');
            }


            var pano = datas.pano_key ? '<a href="/panorama#panoid=' + datas.pano_key + '" class="d3tips"></a>' :"";
            $(".shop-name").html(datas.name + pano);
            $(".shop-addr").html("地址：" + datas.address);
            $(".shop-tel").html("电话：" + datas.phone);
            $(".shop-desc").html(datas.description);
            $('#contact .addr').html('地址：'+datas.address);
            $('#contact .tel').html('电话：'+datas.phone);

            if(datas.lat&&datas.lon){
                $('.map img').attr('src','http://apis.map.qq.com/ws/staticmap/v2/?center=' + datas.lat + ',' + datas.lon + '&zoom=15&scale=1&size=720*420&maptype=roadmap&markers=size:large|color:blue|label:k|' + datas.lat + ',' + datas.lon + '&key=ARHBZ-B2LAS-QAWOZ-6O2L5-AAZEK-ALBZM')
            }else{
                $('.map').css('background-image','url(/static/Desktop/Img/no_map.jpg)')
            }
            //(datas.id)
            var goods = window.GOODS_DETAIL;

            var good_list = {};
            for (var i in goods.data) {
                var datas = goods.data[i];
                if (!good_list[datas.class_id]) {
                    good_list[datas.class_id] = {};
                    good_list[datas.class_id]["name"] = datas.class_name;
                    if (!good_list[datas.class_id]["list"]) {
                        good_list[datas.class_id]["list"] = [];
                        good_list[datas.class_id]["list"].push(datas);
                    } else {
                        good_list[datas.class_id]["list"].push(datas);
                    }
                } else {
                    //good_list[datas.class_id]['name'] = datas.class_name
                    good_list[datas.class_id]["list"].push(datas);
                }
            }

            var html = "";
            for (var i in good_list) {
                var cate_datas = good_list[i];
                html += '<div class="shop-cate-name">' + cate_datas["name"] + "</div>";
                html += '<div class="shop-cate-goods">';
                for (var j in cate_datas.list) {
                    var goods_list = cate_datas.list[j];
                    if(goods_list.link)
                    {
                        var url=goods_list.link;
                    }else{
                        var url='/business/goods/' + goods_list.id + '.html';
                    }
                    html += '<a href="'+url+'" class="shop-goods ' + (j % 4 == 0 ? "no-left" :"") + '" >';
                    html += '<div class="goods-img" style="background-image: url(' + $._LOCAL_IMGURL_(goods_list.small_img) + ')"></div>';
                    html += '<div class="goods-name">' + goods_list.name + "</div>";
                    html += '<div class="goods-price">' + 
                                (goods_list.is_promotion=='1'?("<span>促销价："+goods_list.promotion_price+"</span><span style='margin-left:15px;font-size:12px;text-decoration: line-through;color:#666;'>"+goods_list.price+"</span>"):goods_list.price)
                           +"</div>";
                    html += "</a>";
                }
                html += "</div>";
            }
            $(".shop-cate").html(html);

            var imagelist=JSON.parse(rs.data.many_image);

            if(imagelist&&imagelist.length){
                var html='';
                for (var i=0;i<imagelist.length;i+=5){

                    html+='<ul class="pic-item">';

                    for(var j=0;j<5;j++){

                        if(imagelist[i+j]){
                            html+='<li data-src="'+$._LOCAL_IMGURL_(imagelist[i+j])+'" style="background-image:url('+ $._LOCAL_IMGURL_(imagelist[i+j],'/static/img/no_pic.png')+');"></li>';
                        }

                    }
                    html+='</ul>';

                }
                $('.pic-lists').html(html).width(imagelist.length/5*900);

            }else {
                $('#pic').remove();
                $('.hotel-bar-box>li[type=pic]').remove();
            }

            pic()

        }

        function pic() {
            $('.pic-lists').width($('.pic-item').length * 900);
            var i = 0;
            $('.pic-left').on('click', function () {

                if (i > 0) {
                    i--;
                    $('.pic-lists').css('left', -900 * i);
                }


            })
            $('.pic-right').on('click', function () {
                if (i < $('.pic-item').length - 1) {
                    i++;
                    $('.pic-lists').css('left', -900 * i);
                }
            })
            $('.pic-item>li').on('click', function () {
                var img = $(this).attr('data-src');
                var image = new Image();
                image.src = img;

                var html = '<div class="_mask"></div><div class="pic-alert"><div style="background-image: url('+img+')" class="pa-img-show"></div><div class="pa-img-list" id="pa_img_list"><ul>';
                var datas=window.SHOP_DETAIL.data,
                    imglist=JSON.parse(datas.many_image);

                for(var i in imglist){
                    html+='<li class="'+($._LOCAL_IMGURL_(imglist[i])==img?'choose':'')+'" data-src="'+$._LOCAL_IMGURL_(imglist[i])+'" style="background-image:url('+(imglist[i]?$._LOCAL_IMGURL_(imglist[i]):'/static/img/no_pic.png')+');"></li>';
                }

                html+='</ul></div><div class="close"></div></div>'

                if (!$('.pic-alert').length) {
                    $('body').append(html)
                    new IScroll('#pa_img_list',{
                        click:true,
                        scrollX:false,
                        scrollY:true,
                        scrollbars: true,
                        interactiveScrollbars:true,
                        invertWheelDirection:false,
                        mouseWheel:true
                    })
                    $('.close').on('click', function () {
                        $('._mask').remove();
                        $('.pic-alert').remove();
                    })

                    $('.pa-img-list>ul>li').on('click',function(){
                        var imgs=$(this).attr('data-src');
                        $(this).addClass('choose').siblings().removeClass('choose');
                        $('.pa-img-show').css('background-image','url('+imgs+')');
                    })
                }

            })
        }
    }
    var detail = new Detail();
    detail.init();
});