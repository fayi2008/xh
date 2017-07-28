/*
 * Author:fay
 * Date:2016-03-30
 * desc:商务模块货品详情
 *
 * */
$(function() {
    function Goods() {
        this.init = function() {
            $(".web-bar-way[data-type=business]").addClass("now").siblings().removeClass("now");
            view();
            buy();
        };
        function view() {
            var rs = window.GOODS_DETAIL;
            if (rs.status) {
                var datas = rs.data;
                $(".goods-img").css("background-image", "url(" + $._LOCAL_IMGURL_(datas.small_img) + ")");
                $(".goods-name").html(datas.name);
                if(datas.is_promotion)
                {
                    $(".prize").html(datas.promotion_price);
                }else{
                    $(".prize").html(datas.price);
                }
                $(".goods-num>span").html(+datas.total_num - +datas.sold_num);
                $(".buy").attr("data-id", datas.id);
                $(".goods-desc").html(datas.description);
                if(datas.pano_key)
                {
                    $(".pano_btn").attr("href", '/Panorama#panoid='+datas.pano_key);
                }else{
                    $(".pano_btn").hide();
                }
                var relation_str='';
                for(i in datas.relation)
                {
                    var url='/culture/'+datas.relation[i].id+'.html';
                    relation_str+='<a href="'+url+'">'+datas.relation[i].title+'</a> ';
                }
                if(relation_str)
                {
                    relation_str='<h2>相关小知识</h2>'+relation_str;
                }
                $(".goods-relation").html(relation_str);
                add();
                minus();
            }
        }
        function add() {
            $(".add").on("click", function() {
                var num = $(".num").html();
                var now_num = $(".goods-num>span").html();
                if (+num + 1 > +now_num) {
                    $(".num").html(+num);
                } else {
                    $(".num").html(+num + 1);
                }
            });
        }
        function minus() {
            $(".minus").on("click", function() {
                var num = $(".num").html();
                var now_num = $(".goods-num>span").html();
                if (+num - 1 > 0) {
                    $(".num").html(+num - 1);
                } else {
                    $(".num").html(+num);
                }
            });
        }
        function buy() {
            $(".buy").on("click", function() {
                if (USER_CONFIG.id) {
                    $(".buy").off("click");
                    var id = window.GOODS_DETAIL.data.id, num = $(".num").html();
                    $.get("/business/orders.json", {
                        GOODS_ID:id,
                        NUM:num
                    }).done(function(rs) {
                        if (rs.status) {
                            var html = '<div class="_mask"></div>';
                            html += '<div class="pay-box"><div class="pay-close"></div><img src="' + $._LOCAL_IMGURL_(rs.image) + '"><div>请使用支付宝扫描</div><div>扫一扫二维码，进行支付</div></div>';
                            $("body").append(html);
                            $('.pay-close').on('click',function(){
                                $('._mask').remove();
                                $('.pay-box').remove();
                            })
                        }
                    }).complete(function() {
                        buy();
                    });
                } else {
                    $._singin_({
                        success:function() {
                            location.reload();
                        },
                        close:function() {
                            location.reload();
                        }
                    });
                }
            });
        }
    }
    var goods = new Goods();
    goods.init();
});