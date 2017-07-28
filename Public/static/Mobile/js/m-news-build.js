///ueditor/php/controller.php?action=uploadimage&encode=utf-8
$(function(){
    var upload = xh.require('xh.ajaxUpload');
    //获取URL上参数
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
    };
    var type = $.getUrlParam('type'),id = $.getUrlParam('id');
    if(type)
    {
        if(type == 1)
        {
        	$('title').html('发表新闻');
            list(type);
            if(id){
                detail(type,id);
                var url = '/WapCollection/collection/collection_put?type=';
                $('footer button').on('click' , function(){
                    getContent(url,type,id);
                });
            }else{
                var url = '/WapCollection/collection/collection_post?type=';
                $('footer button').on('click' , function(){
                    getContent(url,type);
                });
            }

        }
        else if(type == 2){
        	$('title').html('发表民间文化');
            $('#j_select').remove();
            $('footer button').html('发表民间文化');
            if(id){
                var url = '/WapCollection/collection/collection_put?type=';
                detail(type,id);
                $('footer button').on('click' , function(){
                    getContent(url,type,id);
                });
            }else{
                var url = '/WapCollection/collection/collection_post?type=';
                $('footer button').on('click' , function(){
                    getContent(url,type);
                });
            }
        }
    }

    //图片
    var file = $('#j_file_field'),u = '/wapCollection/Collection/upload_post';

    file.on("change" , function(){
        (function(){
            var id = 'img_' + new Date().getTime();
            $('<li id="'+id+'" class="upload"></li>').insertAfter($('#j_add'));

            upload(file[0].files[0], function(resp){
                if(resp.status){
                    $('#'+id).css({'backgroundImage':'url(/upload/'+resp.file+')'}).removeClass('upload');
                }else{
                    $('#'+id).remove();
                    if(resp.msg)
                    {
                        alert(resp.msg);
                    }
                }
            },u);
        }());
    });
    //获取上传的值并上传
    function getContent(url,type,id){
        var imgs =  $('.thumb li:not(".btn-add")');
        var images = [];
        var content = '';
        var data
        var title = $('#j_title').val();
        var href = window.location.origin+'/upload';
        for(var i = 0; i<imgs.length; i++){
        	var c = $(imgs[i]).css('backgroundImage').replace(/url\(([\w\W]+)\)/,'$1').replace(new RegExp(href),'').replace(/\"/g,'');
            images.push(c);
        }
        if($('#j_content').val())
        {
            content += '<p>'+$('#j_content').val().replace(/[\r\n]/g,'</p><p>')+'</p>';
        }
        if(type == 1){
            var select = $('#j_select').find("option:selected").attr('data-id');
            data = {
                TITLE:title,
                CONTENT:content,
                TYPE:1,
                CATE_ID:select,
                MANY_IMAGE:images
            };
            if(id){
                data = {
                    ID:id,
                    TITLE:title,
                    CONTENT:content,
                    TYPE:1,
                    CATE_ID:select,
                    MANY_IMAGE:images
                }
            }
        }else{
            data = {
                TITLE:title,
                CONTENT:content,
                TYPE:2,
                CATE_ID:35,
                MANY_IMAGE:images
            };
            if(id){
                data = {
                    ID:id,
                    TITLE:title,
                    CONTENT:content,
                    TYPE:2,
                    CATE_ID:35,
                    MANY_IMAGE:images
                }
            }
        }

        submit(url,type,data);
    }
    //清空所有值
    function reset(){
        $('#j_title,#j_content').val('');
        $('#j_select').find('option').eq(0).attr('selected','selected');
        $('.thumb li:not(".btn-add")').remove();
    }
    //编辑的时候默认页面内容
    function detail(type,id){
        $.ajax({
            'url':'/WapCollection/collection/CollectionDetail/id/'+id,
            'dataType':'json',
            'type':'get'
        }).done(function (rs) {
            if(rs.status){
                var html = '';
                $('#j_title').val(rs.data.title);
                $('#j_content').val(rs.data.content.replace(/(<\/p>|<br\/>|<br>)/g,'\r\n').replace(/<[\w\W]+?>/g,''));
                for(var i in rs.data.many_image)
                {
                    html +='<li id="uploadimg'+i+'" class="" style="background-image: url(/upload/'+rs.data.many_image[i]+');"></li>';
                }
                $(html).insertAfter($('#j_add'));
                if(type == 1)
                {
                    $('#j_select option[data-id="'+rs.data.cate_id+'"]').attr('selected','selected').siblings().removeAttr('selected');
                }
            }
        })
    }
    //新闻分类
    function list(type){
        if(type)
        {
            $.ajax({
                'url':'/WapCollection/collection/NewsCate',
                'dataType':'json',
                'type':'get'
            }).done(function (rs) {
                if(rs.status){
                    var html = '';
                    html+= '<option selected="selected">选择新闻频道</option>';
                    for (var i in rs.data){
                        html+= '<option data-id="'+rs.data[i].id+'">'+rs.data[i].name+'</option>';
                    }
                    $('#j_select').html(html);
                }
            });
        }
    }
    //提交
    function submit(url,type,data){
        $.post(url+type,data,function(resp){
            if(resp.status){
                    alert('已提交');
                    location.href = '/news';
            }else{
                if(resp.msg)
                {
                    alert(resp.msg);
                }
            }
        })
    }


});