(function(){
    var ui = xh.require('xh.ui'),
        share = xh.require('xh.share');
    $(function(){
        ui.render({'model':data , 'view':$('#tpl').html() , 'wrap':'.wrap'});


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
        });

        $('.wrap').on('click' , '.share',function(){
            var desc = '';
            if(data.content){
                desc = data.content.replace(/<[\w\W]+?>/g,'');
            }
            share({
                title:data.title,
                thumb:location.origin +'/'+ data.thumb,
                desc: desc
            });   
        })
    })
}());