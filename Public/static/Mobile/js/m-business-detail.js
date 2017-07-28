/**
 * Created by ting on 2015/11/16.
 */
(function(){
    var vm = xh.require('xh.vm'),
        evt = xh.require('xh.evt');

    var view = $('#tpl').html();

    function select(){

    }

    $(function(){
        data.goods = goods.data;

        data.sales = sales ? sales.data : [];

        $('.wrap').html( vm.template(view, data) );

        $('.wrap').on(evt.click , 'ul.tab li:not(.select)', function(e){
            var rel = $(this).attr('rel');
            $(this).addClass('select').siblings('li').removeClass('select');
            $(rel).addClass('select').siblings('section').removeClass('select');
            e.preventDefault();
        })
    });
}());