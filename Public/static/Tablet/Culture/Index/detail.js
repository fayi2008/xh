$(function () {
    function Detail() {
        this.init = function () {
            $('.web-bar-way[data-type=culture]').addClass('now').siblings().removeClass('now')
            view()
        }
        function view() {
            var rs = window.CULTURE
            if (rs.status == 1) {
                if (rs.data) {
                    var datas = rs.data
                    $('.item-cate').html(datas.bname)
                    $('.item-desc-font').html(datas.excerpt)
                    $('.item-wh-list').append('<h1>简介</h1>')
                    var imgs=[],imgss=[];
                    imgs.push(datas.thumb)
                    imgss.push(datas.thumb)

                    if(datas.many_image) {
                        var imgl = JSON.parse(datas.many_image)

                        imgss=imgs.concat(imgl)
                    }

                    //console.log(imgs,imgss)
                    var img_i=0
                    $('.datas-pic-list').css('background-image','url('+ $._LOCAL_IMGURL_(imgss[img_i])+')')

                    $('.datas-pic-left').on('click',function(){
                        if(img_i>0){
                            img_i--
                            $('.datas-pic-list').css('background-image','url('+ $._LOCAL_IMGURL_(imgss[img_i])+')')
                        }


                    })
                    $('.datas-pic-right').on('click',function(){
                        if(img_i< +imgss.length-1) {
                            img_i++
                            $('.datas-pic-list').css('background-image','url('+ $._LOCAL_IMGURL_(imgss[img_i])+')')
                        }
                    })


                    var wh_list = []
                    if (datas.attrs) {
                        wh_list = (JSON.parse(datas.attrs))
                        if (wh_list.length) {
                            var html = '', html1 = ''
                            for (var i in wh_list) {
                                if (wh_list[i].value) {
                                    html += '<div class="item-list-wh"><h1>' + wh_list[i].name + '</h1><div class="item-list-wh-desc">' + wh_list[i].value + '</div></div>'
                                    html1 += '<h1>' + wh_list[i].name + '</h1>'
                                }


                            }
                            $('.item-list').html(html)
                            $('.item-wh-list').append(html1)
                        }
                    }


                    $('.item-content').html(datas.content)
                    var wh_content = []

                    $('.item-content').find('h1').each(function (i) {
                        var $this = $(this)
                        var tal = {}
                        tal['id'] = 'h1' + i

                        tal['name'] = $this.html()

                        var html1 = '<h1 data-id="' + ('h1' + i) + '">' + $this.html() + '</h1>'
                        $('.item-wh-list').append(html1)


                    })


                    $('h1').each(function () {
                        var text = $(this).text()
                        $(this).attr('data-name', text)
                    })
                    new IScroll('.culture-detail-right',{
                        mouseWheel: true,
                        scrollbars: true,
                        scrollX:false,
                        scrollY:true,
                        click:true
                    })

                }
            }
        }
    }

    var detail = new Detail()
    detail.init()
})