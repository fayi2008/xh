$(function () {
    var ww = $(window).width();
    $('.logo').width(ww/640*329).height(ww/640*229);

    $('.J_ajax_submit_btn').on('click', function () {
        var username = $('#J_name').val();
        var password = $('#J_password').val();
        if(!username){
            alert('账号不能为空');
            $('#J_name').focus();
            return;
        }
        if(!password){
            alert('密码不能为空');
            $('#J_password').focus();
            return;
        }
        $.post('/WapCollection/pub/dologin',{
            'username':username,
            'password':password
        },function(resp){
            if(resp.status){
                window.location.href = '/news';
            }else{
                alert(resp.info);
                $('#J_password').val('');
                $('#J_name').val('').focus();
            }
        })
    })
    $(document).keydown(function(event){
           if(event.keyCode==13){
               var username = $('#J_name').val();
               var password = $('#J_password').val();
               if(!username){
                   alert('账号不能为空');
                   $('#J_name').focus();
                   return;
               }
               if(!password){
                   alert('密码不能为空');
                   $('#J_password').focus();
                   return;
               }
               $.post('/WapCollection/pub/dologin',{
                   'username':username,
                   'password':password
               },function(resp){
                   if(resp.status){
                       window.location.href = '/news';
                   }else{
                       alert(resp.info);
                       $('#J_password').val('');
                       $('#J_name').val('').focus();
                   }
               })
           }
    });
});