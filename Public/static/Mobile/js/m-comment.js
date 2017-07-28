(function(){
    var vm = xh.require('xh.vm'),
        ui = xh.require('xh.ui');
    var api = '/comment.json',
        view = $('#tpl').html(),
        wrap = $('.cnt');


    function init(){
        var id = $('body').attr('data-id');
        var type = $('body').attr('data-type');

        ui.render({'model':api ,'view':view ,  'paras':{'module':type,'id':id},'wrap':wrap});

        window.data = {id : id};

        $('.wrap').on('click' , '.fav:not(.disabled)',function(){
            var el = $(this),
                num = parseInt(el.html()),
                id = el.addClass('disabled').attr('data-id'),
                module = el.attr('data-module');

            $.post('/comment/support',{'module':3,'id':id } , function(resp){

                if(resp.status){
                    el.addClass('active').html(num+1);
                }else{
                    if(resp.msg)
                    {
                        alert(resp.msg);
                    }
                }
            });
        });
        $('.wrap').on('click' , '.comment_add_btn',function(){
            setTimeout(function(){
                location.reload();
            },1);
        });

    }

    ui.signin(function(status){
        if(status)
            init();
        else
            history.back();
    });
}())