/**
 * Created by ting on 2015/11/16.
 */
(function(){
    var ui = xh.require('xh.ui'),
        vm = xh.require('xh.vm'),
        evt= xh.require('xh.evt'),
        hash = xh.require('xh.hash');

    var app = (function(){

        var api = '/business/merchantlist.json',

            paras = {'tag':1 , 'start':0 , 'limit':10, 'page':0},

            view = $('#tpl').html(), count = 0, complete = false,

            wrap = $('.wrap section');

        function render(fn){
            paras.start = paras.page * paras.limit;

            ui.loading();

            $('footer').show();

            $.getJSON(api , paras , function(resp){
                ui.loading(null);

                count += resp.data.rows.length;
                if(count>= resp.data.results){
                    complete = true;
                    $('footer').hide();
                }
                if(paras.page){
                    wrap.append(vm.template(view, resp));
                }else{
                    wrap.html(vm.template(view, resp));
                }
                fn && fn();
            });
        }

        function refresh(){
            paras.page = 0; paras.start = 0;
            render();
        }

        function init(){
            $('.wrap').on(evt.click ,'nav li:not(.select)' , function(){
                var el = $(this);
                el.addClass('select').siblings('li').removeClass('select');
                paras.tag = el.attr('data-tag');
                paras.page = 0;
                count = 0;
                complete = false;
                render();
            });

            var onScroll = xh.throttle(function(){
                var top = $(window).scrollTop();
                var h = $(window).height();
                var sh = $(document).height();
                if(!complete){
                    if(sh - h - top <= 10 ){
                        paras.page++;
                        render(null , true);
                    }
                }

            },200);

            $(window).on('scroll' , onScroll);

            paras.tag = hash('tag') || 1;

            $('nav li[data-tag='+paras.tag+']').addClass('select');
            render();
        }

        return {
            'render':render,
            'init':init,
            'refresh':refresh
        }
    }());

    $(function(){
        app.init();
    });
}());