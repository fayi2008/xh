/**
 * Created by ting on 2015/11/16.
 */
(function(){
    var vm = xh.require('xh.vm'),
        ui = xh.require('xh.ui'),
        evt = xh.require('xh.evt');

    var view = $('#tpl').html();

    var order = { 'quantity' : 1 , 'price' : data.data.price , 'amount':data.data.price , 'id':data.data.id};
    var limit = data.data.limit;
    var remain = data.data.total_num - data.data.sold_num;
    function refresh(){
        /*if(order.quantity > limit){
            ui.alert({'title':'提示',content:'限购'+limit+'件'})
            order.quantity = limit;
            return;
        }*/
        if(order.quantity > remain){
            ui.alert({'title':'提示',content:'最多购买'+remain+'件'})
            order.quantity = remain;
            return;
        }

        order.amount = order.quantity * order.price;
        $('#j_num').html(order.quantity);
        $('#j_amount').html(order.amount);
    }

    function pay(){
        location.href = '/business/orders.json?GOODS_ID='+order.id+'&NUM=' + order.quantity;
    }

    $(function(){
        $(window).on('hashchange',function(){
            if(location.hash.substr(1) == 'pay'){
                $('section.pay').addClass('active');
            }else{
                $('section.pay').removeClass('active');
            }
        });

        $('.wrap')

            .html( vm.template(view, data) )

            .on(evt.click , '#j_num_inc' , function(e){
                order.quantity++;
                refresh();
                e.preventDefault();
            })

            .on(evt.click , '#j_num_dec' , function(e){
                if(order.quantity > 1)
                    order.quantity--;
                refresh();
                e.preventDefault();
            })

            .on(evt.click , '#j_buy' , function(e){
                e.preventDefault();
            })

            .on(evt.click , '#j_pay' , function(e){
                pay();
                e.preventDefault();
            });

        if(location.hash.substr(1) == 'pay'){
            $('section.pay').addClass('active');
        }
    });
}());