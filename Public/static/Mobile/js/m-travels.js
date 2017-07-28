(function(){
    var ui = xh.require('xh.ui');
    // 滚动条
    var scroller = (function(){
        var down_el = $(".pullDown");
        var up_el = $(".pullUp");
        var scroll = new IScroll('#j_cnt',{
            probeType: 3,
            click:true,
            touch:true
        });

        var handlers = {};

        scroll.on('scroll',function(){

            var y = this.y,
                maxY = this.maxScrollY - y;
            if (this.y >= 40 && !down_el.hasClass('reverse')) {
                down_el.addClass('reverse').html('松手更新...');
                this.minScrollY = 40;
            } else if (this.y < 40 && this.y>0 && down_el.hasClass('reverse')) {
                down_el.removeClass('reverse').html('下拉刷新...');
                this.minScrollY = 40;
            } if(maxY >= 40 && !up_el.hasClass('reverse')){
                up_el.addClass('reverse').html('松手更新...');
            }else if(maxY < 40 && maxY >=0 && up_el.hasClass('reverse')){
                up_el.removeClass('reverse').html('上拉加载...');
            }
        });

        scroll.on('slideDown' , function(){
            if (down_el.hasClass('reverse')) {
                down_el.removeClass('reverse');
                $('.scroll').addClass('loading');
                if(handlers['slideDown']){
                    handlers['slideDown'].call();
                }

            }
        });

        scroll.on("slideUp",function(){
            if(this.maxScrollY - this.y > 40){
                up_el.removeClass('reverse');
                $('.scroll').addClass('loading');
                if(handlers['slideUp']){
                    handlers['slideUp'].call();
                }
            }
        });

        scroll.on('scrollEnd' , function(){
            if($('.scroll').hasClass('loading')){
                $('.scroll').removeClass('loading')
            }
        });

        function refresh(){
            scroll.refresh();
            return this;
        }

        return {
            'refresh':refresh,
            'on':function(evt , fn){
                handlers[evt] = fn;
                return this;
            }
        }
    }());

    var page = (function(){

        var api = '/travels.json';
        var paras = {};
        var wrap = '.cnt';
        var tpl = $('#tpl').html();


        var page = 0, pageCount = 10;
        // all height - header - footer

        xh.vm.helper({
            'content' : function(v){
                v = v.replace(/(<[^>]+>|\s|&nbsp;)/g,'');
                if(v.length>100) v = v.substring(0,97) + '...';
                return v;
            }
        });

        function render(fn,replace){
            var order = $('#j_order li.select').attr('data-type');
            paras = {'ordertype':order , 'start':page * pageCount};
            ui.loading();

            $.getJSON(api , paras , function(resp){
                ui.loading(null);
                if(resp.data.data.length){
                    if(replace) {
                        $(wrap).html(xh.vm.template(tpl, resp));
                    }else{
                        $(wrap).append( xh.vm.template(tpl, resp) );
                    }
                }else{
                    if(replace) {
                        $(wrap).html('');
                    }
                }
                fn && fn();
            });
        }

        function refresh(){
            page = 0;
            render(function(){
                scroller.refresh()
            } , true);
        }

        function init(){
            var h = $('body').height() - 77 - 62;
            $('#j_cnt').height(h);
            $('#tpl').html('');
            scroller.on('slideDown',function(){
                refresh();
            }).on('slideUp',function(){
                page++;
                render(function(){
                    scroller.refresh()
                });
            });

            render(function(){
                scroller.refresh();
                $('.scroll').removeClass('loading')
            });
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

        $('.wrap').on('click' , '.fav:not(.disabled)',function(){
            var el = $(this),
                num = parseInt(el.html()),
                id = el.attr('data-id');
            ui.signin(function(status){
                if(status){
                    el.addClass('disabled');
                    $.post('/comment/support',{'module':1,'id':id} , function(resp){

                        if(resp.status){
                            el.addClass('active').html(num+1);
                        }else{
                            if(resp.msg)
                            {
                                alert(resp.msg);
                            }
                        }
                    });
                }
            })

        })
        page.init();
    })
}());
