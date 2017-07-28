
$(function(){
    var ui = xh.require('xh.ui'),
        evt = xh.require('xh.evt');

    function init(){
        var file = $('#j_file_field');

        file.on("change" , function(){
            $('#j_add').removeClass('empty').addClass('upload');
            (function(){
                xh.ajaxUpload(file[0].files[0], function(resp){
                    if(resp.status){
                        $('#j_add').css({'background':'url(/upload/'+resp.file+') center center / cover no-repeat'}).removeClass('upload').attr('data-img',resp.file).removeClass('empty upload');
                    }else{
                        $('#j_add').addClass('empty').removeClass('upload');
                    }
                    //console.log(resp);
                });
            }());

        });

        $('.wrap').on('input','textarea' , function(){
            if($(this).val().length>0){
                $(this).addClass('edit')
            }else{
                $(this).removeClass('edit')
            }
        });

        $('footer button').on(evt.click , function(){
            var image = $('#j_add').attr('data-img');
            var content = $('textarea').val();

            if(!content){
                ui.alert({content:'内容不能为空',onok:function(){
                    $('textarea').focus();
                }});
                return;
            }

            if(!image){
                ui.alert({content:'图片不能为空'});
                return;
            }
            $.post('/photo.json',{
                'file_url':image,
                'description':content
            },function(resp){
                if(resp.status){
                    if( confirm('添加成功,是否继续添加') ){
                        reset();
                    }else{
                        location.href = '/photo';
                    }
                }
            })
        });
    }


    function reset(){
        $('textarea').val('');
        $('#j_add').attr('data-img','').addClass('empty');
    }

    ui.signin(function(status){
        if(status){
            init();
        }else{
            history.back();
        }
    });
})