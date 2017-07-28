$(function(){
    function _bind(){
        this.init=function(){

            ajax()
        }
        function ajax(){
            $('.submit').on('click',function(){


                var key= $.trim($('#key').val())

                $.ajax({
                    url: "/Oauth/User/bindGuide",
                    dataType: "json",
                    type: "post",
                    data:{key:key}
                }).done(function(rs){
                    //alert(JSON.stringify(rs))
                    if(rs.status){
                        alert(rs.info)
                        location.href='/Oauth/User/forGuide'
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