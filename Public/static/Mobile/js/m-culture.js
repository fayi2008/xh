(function(){
    var vm = xh.require('xh.vm'),
        app = xh.require('app'),
        view = $('#tpl').html();

    app.index = function(){
        $('section ul').html(vm.template(view,data));
    }
}());

(function(){
    var vm = xh.require('xh.vm'),
        ui = xh.require('xh.ui'),
        app = xh.require('app');


    var api = '/culture/culture_search.json',

        paras = {'cate_id':0, 'start':0, 'limit':8, 'page':0},

        view = $('#tpl').html(),

        count = 0, complete = false,

        wrap = $('section ul');

    function render(){
        paras.start = paras.page * paras.limit;

        ui.loading();

        $.getJSON(api , paras , function(resp){
            ui.loading(null);
            count += resp.data.data.length;
            if(count>= resp.data.results){
                complete = true;
                $('footer').hide();
            }
            if(paras.page){
                wrap.append(vm.template(view, resp));
            }else{
                wrap.html(vm.template(view, resp));
            }
        });
    }

    function init(){
        var onScroll = xh.throttle(function(){
            var top = $(window).scrollTop();
            var h = $(window).height();
            var sh = $(document).height();
            if(!complete){
                if(sh - h - top <= 10 ){
                    paras.page++;
                    render();
                }
            }

        },200);

        $(window).on('scroll' , onScroll);

        paras.cate_id = xh.paras('type') || '0';
        render();
    }
    app.list = function(){
        init();
    }
}());


(function(){
    var vm = xh.require('xh.vm'),
        app = xh.require('app'),
        evt = xh.require('xh.evt'),
        view = $('#tpl').html();

    // 转换数据
    function parse(data)
    {
        var head = [];
        var stamp = 0;
        var attr_cnt = '';
        var attrs = data.data.attrs ? (typeof(data.data.attrs) == 'string' ? JSON.parse(data.data.attrs) : data.data.attrs) : [];

        for(var i= 0; i<attrs.length; i++){
            if(attrs[i].value){
                attr_cnt += '<h1>'+attrs[i].name+'</h1><p>'+attrs[i].value+'</p>';
            }
        }

        var relation = vm.template('<iif this.length><div class="relation"><h2 >推荐文化标签</h2><each this><a href="/culture/{{id}}.html">{{title}}</a></each></div></iif>' , data.data.relation);

        var content =
            (
                '<h1>简介</h1>' + data.data.excerpt  +
                '<audio controls="controls" autoplay="autoplay" src="http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text='+data.data.excerpt.replace(/<[^>]+>/g,"").replace(/['"&\[\]\(\)\{\}]/g,'')+'"></audio>' +
                attr_cnt +
                data.data.content +
                relation
            ).replace(/<h1>([\w\W]*?)<\/h1>/gi,function(a, title){
            var id = 'r_'+(++stamp);
            head.push({'id':id , 'title':title});
            return '<h1 id="'+id+'">' + title + '</h1>';
        });

        return {'content':content , 'head':head , 'thumb':data.data.thumb , 'title':data.data.title};
    }

    app.detail = function(){

        $('.wrap')
            .on(evt.click , 'aside button' , function(){
                $('aside').removeClass('active');
            })

            .on(evt.click , 'footer .contents' , function(){
                $('aside').addClass('active');
            })

            .on(evt.click, 'aside' , function(e){
                if(this === e.currentTarget){
                    $('aside').removeClass('active');
                }
            })

            .on(evt.click , 'aside a' , function(e){
                var rel = $(this).attr('href');
                if($(rel).offset()){
                    var top = $(rel).offset().top;
                    $('body').animate({scrollTop: top + 'px'});
                }
                e.preventDefault();
                e.stopPropagation();
                //$('aside').removeClass('active');
            })

            .on(evt.click , 'footer .top' , function(){
                $('body').animate({scrollTop: '0px'});
            })

            .html(vm.template(view,parse(data)));
    }
}());


$(function(){

    var mod = $('body').attr('page'),
        app = xh.require('app');

    if(mod in app){
        app[mod].call();
    }
});