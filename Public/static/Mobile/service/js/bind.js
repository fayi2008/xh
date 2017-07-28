$(function(){
    function _bind(){
        this.init=function(){

            ajax()
        }
        function ajax(){
            $('.submit').on('click',function(){

                var key= $.trim($('#key').val()),tel=$('#tel').val()
                $.ajax({
                    url: "/Service/Oauth/bindPoi",
                    dataType: "json",
                    type: "post",
                    data:{key:key,phone:tel}
                }).done(function(rs){

                    if(rs.status){
                        //alert(rs.info)
                        location.href='/Service/Oauth/getRequests'
                    }else{
                        alert(rs.info)
                    }
                })
            })
        }



    }

    var bind=new _bind()
    bind.init()
})