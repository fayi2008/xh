(function(){
    var ui = xh.require('xh.ui');
    var type = $('body').attr('data-type');
    var comment = (function(){
        var el, html = '<div class="comment-box"><div class="box"><textarea placeholder="写评论" name="" id="" cols="30" rows="10"></textarea></div><button>发表评论</button></div>';
        var successHandler;
        function create(){
            var url = '/comment',
                paras = {'module':type , 'content':$('textarea').val(),'to_id':data.author,'id':data.id};
            if(!paras.content){
                ui.alert({content:'请写些什么'});
                $('textarea').focus();
                return;
            }
            $('.comment-box button').html('正在提交...').addClass('disabled');
            $.post(url , paras , function(resp){
                if(resp.status){
                    $('.comment-box button').html('发表评论').removeClass('disabled');
                    location.hash='';
                    if(typeof(successHandler) == 'function'){
                        successHandler();
                    }
                }else{

                }
            })
        }

        function check(){
            if(!el){
                el = $(html).appendTo($('body'));
                //console.log(el)
                el.on('click','button:not(.disabled)',function(){
                    create();
                }).on('input','textarea' , function(){
                    if($(this).val().length>0){
                        $(this).addClass('edit')
                    }else{
                        $(this).removeClass('edit')
                    }
                });
            }
        }
        return {
            create:function(fn){
                check();
                successHandler = fn;
                el.addClass('show');
                $('textarea').focus();
            },
            'hide':function(){
                check();
                el.removeClass('show');
            }
        }
    }());
    function onHash(){
        if(/create/.test(location.hash)){
            ui.signin(function(status){
                if(status){
                    comment.create(function(){
                        setTimeout(function(){
                            location.reload();
                        },1);
                    });
                }else{
                    history.back();
                }
            })
        }else{
            comment.hide();
        }
    }
    $(function(){
        $(window).on('hashchange',function(){
            //onHash();
        })
        onHash();
    })
    window.mod = {
        comment:comment
    }
}())