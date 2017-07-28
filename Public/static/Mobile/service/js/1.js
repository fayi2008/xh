$(function(){

    $('.gh-tab').on('click',function(e){
        var $this=$(this)


        if($this.index==0){
            $('.announcement').show().addClass('bounceIn')
        }

        $('.ripple').remove()
        $('.gh-tab.active').removeClass('.active')
        $this.addClass('active')
        $this.prepend('<span class="ripple"></span>')


//接你的代码
            var x= e.targetTouches[0].pageX
        alert(x)


    })



})