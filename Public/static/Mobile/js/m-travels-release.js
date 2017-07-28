///ueditor/php/controller.php?action=uploadimage&encode=utf-8
$(function(){
    var ui = xh.require('xh.ui'),
        upload = xh.require('xh.io.upload');

    var file = $('#j_file_field');

    file.on("change" , function(){
        (function(){
            var id = 'img_' + new Date().getTime();
            $('<li id="'+id+'" class="upload"></li>').insertAfter($('#j_add'));

            upload({
                el:file[0].files[0],
                success:function(resp){
                    if(resp.status){
                        $('#'+id).css({'backgroundImage':'url(/upload/'+resp.file+')'}).attr('data-url',resp.file).removeClass('upload');
                    }else{
                        $('#'+id).remove();
                    }
                    //console.log(resp);
                }
            });
        }());

        /*
        xh.localPreview(file[0].files[0] , function(img){
            var id = 'img_' + new Date().getTime();
            $('<li id="'+id+'" style="background: url('+img+') center center / cover no-repeat"></li>').insertAfter($('#j_add'));
            xh.ajaxUpload(file[0].files[0], function(resp){
                if(resp.status){
                    $(id).css({'backgroundImage':resp.file});
                }else{
                    $(id).remove();
                }
                $('#j_add').remove('upload');
                //console.log(resp);
            });
        });*/
    });

    function getContent(){
        var html = '';
        var imgs =  $('.thumb li:not(".btn-add")');

        for(var i = 0; i<imgs.length; i++){
            html += '<p><img src="/upload/'+$(imgs[i]).attr('data-url')+'" /></p>'
        }
        if($('#j_content').val())
            html += '<p>'+$('#j_content').val().replace(/[\r\n]/g,'</p><p>')+'</p>';
        return html;
    }

    function getThumb(){
        var imgs =  $('.thumb li:not(".btn-add")');
            return imgs.length ?
                $(imgs[0]).attr('data-url'):
                "";

    }
    function reset(){
        $('#j_title,#j_content,#j_file_field').val('');
        $('.thumb li:not(".btn-add")').remove();
    }

    function init(){
        $('footer button').on('click' , function(){
            var title = $('#j_title').val();
            var content = getContent();
            var thumb = getThumb();
            if(!title){
                ui.alert({'content':'标题不能为空'});
                $('#j_title').focus();
                return;
            }
            if(!content){
                ui.alert({'content':'内容不能为空'});
                return;
            }

            if(!thumb){
                ui.alert({'content':'至少添加一张照片'});
                return;
            }

            $.post('/travels',{
                'title':title,'thumb':thumb,
                'content':content
            },function(resp){
                if(resp.status){
                    if( confirm('添加成功,是否继续添加') ){
                        reset();
                    }else{
                        location.href = '/travels/';
                    }

                }
            })
        });

        $('.thumb').on('click','li:not(".btn-add")' , function(){
            var local = this;
            ui.alert({content:'移除此照片吗?',cancelstr:'取消',onok:function(){
                    $(local).remove();
                }
            });
        });
    }

    ui.signin(function(status){
        if(status){
            init();
        }else{
            history.back();
        }
    })
})