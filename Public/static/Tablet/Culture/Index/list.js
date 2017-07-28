$(function () {
    function List() {
        var limit = 3
        this.init = function () {
            ajax()
            cate_view()
        }

        function ajax(opt) {

            var page = {
                start: 0,
                cate_id: location.hash ? location.hash.split('#')[1] : 0,
                limit: limit
            }

            var pages = $.extend(page, opt)
            $.getJSON('/culture/culture_search.json', pages).done(function (rs) {
                if (rs.status) {
                    view(rs.data)
                }
            })
        }

        function view(rs) {

            var html = ''

            for (var i in rs.data) {
                var datas = rs.data[i]
                html += '<a href="/culture/' + datas.id + '.html" class="culture-item" style="background-image: url(' + $._LOCAL_IMGURL_(datas.thumb) + ')"><div class="culture-zz" ></div><div class="culture-name">' + datas.title + '</div></a>'
            }

            $('.culture-box').html(html)
            page(rs.results)

        }

        function cate_view() {
            var rs = window.LIST_CATE
            if (rs.status == 1) {
                var html = '<div data-type="0">全部</div>'
                for (var i in rs.data) {
                    var datas = rs.data[i]
                    html += '<div data-type="' + datas.id + '">' + datas.name + '</div>'
                }
                $('.tag').html(html)
                $('.tag').css('width', 150 * (rs.data.length + 1))
                var tags = location.hash ? location.hash.split('#')[1] : 0
                $('.tag>div[data-type=' + tags + ']').addClass('check').siblings().removeClass('check')
                tag()
            }
        }

        function tag() {
            $('.tag>div').on('click', function () {
                var tag = $(this).attr('data-type')
                location.hash = tag
                $('.tag>div[data-type=' + tag + ']').addClass('check').siblings().removeClass('check')

                ajax({
                    start: 0,
                    cate_id: tag
                })
            })
        }

        function page(count) {
            $('.last').off('click').on('click', function () {
                var $this = $(this)
                var page = $(this).attr('data-page')
                var pages = 0
                if (page > 0) {
                    var pages = +page - limit
                    $('.next').attr('data-page', pages)
                    $this.attr('data-page', pages)
                    ajax({
                        start: pages
                    })
                }

            })
            $('.next').off('click').on('click', function () {
                var $this = $(this)

                var page = $(this).attr('data-page')

                if ((+page + limit) < count) {


                    var pages = +page + limit


                    $('.last').attr('data-page', pages)
                    $this.attr('data-page', pages)


                    ajax({
                        start: pages
                    })
                }

            })
        }
    }

    var list = new List()
    list.init()

})