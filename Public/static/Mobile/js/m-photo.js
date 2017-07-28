(function(){
    var ui = xh.require('xh.ui'),
        evt= xh.require('xh.evt'),
        vm = xh.require('xh.vm'),
        share = xh.require('xh.share');

    var api  = '/photo.json',

        paras = {'ordertype':'', 'start':0, 'limit':10, 'page':0},

        view = $('#tpl').html(),

        count = 0, complete = false,

        wrap = $('#j_cnt');


    var page = (function(){

        vm.helper({
            'image' : function(v){
                var c = v.content;
                return (c.match(/src\s*=\s*[\'\"]+([^\'\"]+)/) || [0,''])[1];
            },
            'content' : function(v){
                return v.replace(/<img[^>]+>/g,'');
            }
        });

        function parse(v){
/*            var all = v.data.data,
                count = v.data.count;
            var group = [];
            for(var i = count;i>=0;i-=2){
                group = all.splice(i,1).concat(group);
            }
            return [all , group];*/
            var all = v.data.data,
                count = all.length
            var group = [[],[]];
            for(var i =0; i<count ; i+=2){
                group[0].push(all[i]);
                if(all[i+1]) group[1].push(all[i+1]);
            }
            //console.log(group)
            return group;

        }

        function render(fn){
            paras.ordertype = $('#j_order li.select').attr('data-type');
            paras.start = paras.page * paras.limit;

            ui.loading();

            $('footer').show();

            $.getJSON(api , paras , function(resp){
                ui.loading(null);

                count += resp.data.data.length;
                if(count>= resp.data.count){
                    complete = true;
                    $('footer').hide();
                }
                if(paras.page){
                    wrap.append(vm.template(view, parse(resp)));
                }else{
                    wrap.html(vm.template(view, parse(resp)));
                }
                fn && fn();
            });
        }

        function refresh(){
            paras.page = 0;
            render();
        }

        function init(){

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

            render();
        }
        return {
            'render':render,
            'init':init,
            'refresh':refresh
        }
    }());

    $(function(){
        $('#j_order').on('click' ,' li:not(.select) ' , function(){
            $(this).addClass('select').siblings('li').removeClass('select');
            page.refresh();
        });

        $('aside').on(evt.click,'.top',function(){
            $('body').animate({scrollTop: '0'});
        }).on(evt.click ,'.create',function(){
            location.href = '/photo/release.html';
        }).on(evt.click,'.reload' , function(){
            $('body').scrollTop(0);
            page.refresh();
        });

        $('.wrap').on('click' , '.fav:not(.disabled)',function(){
            var el = $(this),
                num = parseInt(el.html()),
                id = el.addClass('disabled').attr('data-id');
            ui.signin(function(){
                $.post('/comment/support',{'module':2,'id':id} , function(resp){

                    if(resp.status){
                        el.addClass('active').html(num+1);
                    }else{
                        if(resp.msg)
                        {
                            alert(resp.msg);
                        }
                    }
                });
            })
        })

        $('.wrap').on('click' , '.share',function(){
            var el = $(this),
                par = el.parents('.item'),
                img = par.find('img').attr('src'),
                desc = par.find('p').html();
            share({
                title:'西湖印象',
                thumb:location.origin + img,
                desc: desc
            });   
            
        })
        page.init();
    });

}());