$(function () {
    function _pingjia() {
        this.init = function () {
            $.LOGIN(function () {
                choose()
                submit()
                kaiguan()
                ajax()
            })
        }

        //获取URL上参数
        $.getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
            var r = window.location.search.substr(1).match(reg)
            if (r != null) return unescape(r[2])
            return null
        }


        function ajax() {
            var type = $.getUrlParam('type'), rid = $.getUrlParam('rid')

            var url='/User/Index/requestTitle'
            if(type==2){
                url='/User/Index/requestGuide'
            }

            $.getJSON(url, {one: '1', id: rid},function (rs) {
                if (rs.status) {
                    if(type==2){
                        views(rs.data[0])
                    }else{
                        view(rs.data[0])
                    }


                }
            })
        }

        function view(rs) {
            var html = ''

            for (var i in rs.lists) {
                var datas = rs.lists[i]
                if (datas.user_status ==2) {
                    html += '<div class="list-item" sid="' + datas.id + '" pid="' + datas.poi_id + '">'
                    html += '<div class="title">' + datas.name + '</div>'
                    html += '<ul class="pingjia-x">'
                    html += '<li></li>'
                    html += '<li></li>'
                    html += '<li></li>'
                    html += '<li></li>'
                    html += '<li></li>'
                    html += '</ul>'
                    html += '<textarea id="pingjia" placeholder="输入您的评价"></textarea>'

                    html += '<div class="noorder-box">是否匿名评价<span class="isorder"></span></div>'
                    html += '</div>'
                }
            }
            //console.log(html)
            $('.list-box').html(html)
        }

        function views(rs){
            var html = ''

            for (var i in rs.lists) {
                var datas = rs.lists[i]
                if (datas.user_status ==2) {
                    html += '<div class="list-item" sid="' + datas.id + '" guide_id="' + datas.guide_id + '">'
                    html += '<div class="title">' + datas.name + '</div>'
                    html += '<ul class="pingjia-x">'
                    html += '<li></li>'
                    html += '<li></li>'
                    html += '<li></li>'
                    html += '<li></li>'
                    html += '<li></li>'
                    html += '</ul>'
                    html += '<textarea id="pingjia" placeholder="输入您的评价"></textarea>'

                    html += '<div class="noorder-box">是否匿名评价<span class="isorder"></span></div>'
                    html += '</div>'
                }
            }
            //console.log(html)
            $('.list-box').html(html)
        }

        function submit() {
            $('.submit').on('click', function () {

                var id = $.getUrlParam('id'),
                    type = $.getUrlParam('type')

                var list=[]
                $('.list-item').each(function () {
                    var $this = $(this)
                    var item={}
                    item['guide_id']=$this.attr('guide_id')
                    item['poi_id'] = $this.attr('pid')
                    item['receive_id'] = $this.attr('sid')
                    if(!$this.find('.choose').length){
                        alert('请赏一个星吧！')
                        return false
                    }
                    item['score'] = $this.find('.choose').length
                    item['evaluation'] = $this.find('#pingjia').val()
                    item['open']=0
                    if ($this.find('.noorder').length) {
                        item['open'] = 1
                    }

                    list.push(item)
                })



                $.ajax({
                    url: '/Evaluation/Index/addMultiple',
                    dataType: "json",
                    type: "get",
                    data: {type: type,lists:list}
                }).done(function (rs) {
                    if (rs.status) {
                        alert(rs.msg)
                        location.href='/pages/waiter/order.html'
                    } else {
                        alert(rs.msg)
                    }
                })
            })

        }

        function choose() {
            $('.main').on('click', '.pingjia-x>li', function () {
                var $this = $(this)
                var index = $this.index()
                for (var i = 0; i < index * 1 + 1; i++) {
                    $('.pingjia-x>li:eq(' + i + ')').addClass('choose')
                }

                for (var i = index + 1; i < 5; i++) {
                    $('.pingjia-x>li:eq(' + i + ')').removeClass('choose')
                }
            })
        }

        function kaiguan() {

            $('.main').on('click', '.isorder',function () {
                var $this = $(this)
                $this.toggleClass('noorder')

            })
        }


    }

    var pingjia = new _pingjia()
    pingjia.init()
})