(function(){
    var signin = xh.require('xh.ui.signin');
    $(function(){
        var w_height=$(window).height();
        $('.bg').height(w_height);
        $('.bg-m').height(w_height);
        $('.bg-b').height(w_height);
        if(xh.user.id || sessionStorage['user.id']){
            $('footer').addClass('signin');
        }

        $('footer button').on(xh.evt.click , function(){
            if($('footer').hasClass('signin')){
                location.href = '/user'
            }else{
                signin(function(status){
                    if(status){
                        $('footer').addClass('signin');
                    }
                });
            }
        })
    });
}());