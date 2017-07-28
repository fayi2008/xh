$(function(){
    //添加黑色遮罩
    var _addBlank = (function () {
        var type = type;
        var w = $(window).width(), h = $(window).height();
        var htmls = '<div class="back-black" black-type="' + type + '" style="height:' + h + 'px"></div>'

        function add() {

            $('body').append(htmls)
            $(window).resize(function () {
                var w = $(window).width(), h = $(window).height()
                $('.back-black').width(w).height(h)
            })


        }

        function close() {
            $('.back-black[black-type=' + type + ']').remove()

        }

        return {
            add: add,
            close: close
        }
    })($)

    $.addBlack = function () {

        _addBlank.add()

        this.close = function () {
            _addBlank.close()
        }

        return this
    }

    //弹窗公用方法
    var _alert_box = function () {

        var a = $.addBlack()

        this.add = function (option, yconfirm) {
            var opts = {
                id: '',
                title: '提示',
                content: '',
                submit_text: '确定',
                cancel_text: '取消',
                onload:function(e){},
                submit: function (e) {
                },
                cancel: function (e) {
                }
            }
            var w = $(window).width(), h = $(window).height()

            var opt = $.extend(opts, option)
            var htmls = ''

            htmls += '<div class="yalert_box" '
            if (opt.id) {
                htmls += ' id="' + opt.id + '"'
            }
            htmls += '>';
            htmls += '<div class="yalert_box_top">' + opt.title + '</div>'
            htmls += '<div class="yalert_box_tip">' + opt.content + '</div>'
            htmls += '<div class="yalert_box_btn">';
            if (yconfirm) {
                htmls += '<a class="yalert_box_submit" id="yalert_box_quxiao">' + opt.cancel_text + '</a>'
                htmls += '<a class="yalert_box_submit" id="yalert_box_queding">' + opt.submit_text + '</a>'
            } else {
                htmls += '<a class="yalert_box_submit" id="yalert_box_queding" style="width: 100%;">' + opt.submit_text + '</a>'
            }


            htmls += '</div>'
            htmls += '</div>'

            $('input,textarea').focusout()
            $('.yalert_box').remove()


            $('body').append(htmls)

            opt.onload()
            $('#yalert_box_queding').off('click').on('click', function () {

                if (option.submit) {
                    opt.submit($(this))
                } else {
                    $('.yalert_box').remove()
                    a.close()
                }

            });
            if (yconfirm) {
                $('#yalert_box_quxiao').off('click').on('click', function () {
                    if (option.cancel) {
                        opt.cancel($(this))
                    } else {
                        $('.yalert_box').remove()
                        a.close()
                    }

                })
            }

        };


        this.close = function () {
            $('.yalert_box').remove()
            a.close()
        };

        return this;

    }
    //确认窗
    $.yalert = function (option, submit) {
        var yalert = new _alert_box()

        if (typeof(option) == 'object') {

            yalert.add(option, 0)
        } else {

            var datas = {
                content: option,
                submit: submit
            }
            yalert.add(datas, 0)

        }

    }
    $.yalert.close=function(){
        $('.yalert_box').remove()
        $('.back-black').remove()
    }
    //有取消的
    $.yconfirm = function (option) {
        var yalert = new _alert_box()
        yalert.add(option, 1)

    }

    /*
     格式化日期
     "yyyy-MM-dd hh:mm:ss.S"==> 2006-07-02 08:09:04.423
     "yyyy-MM-dd E HH:mm:ss" ==> 2009-03-10 二 20:09:04
     "yyyy-MM-dd EE hh:mm:ss" ==> 2009-03-10 周二 08:09:04
     "yyyy-MM-dd EEE hh:mm:ss" ==> 2009-03-10 星期二 08:09:04
     "yyyy-M-d h:m:s.S" ==> 2006-7-2 8:9:4.18
     */
    $.formatDate = function (date, fmt) {
        //date=new Date(dates);
        //fmt=fmts||'yyyy-MM-dd hh:mm';

        var o = {
            'M+': date.getMonth() + 1, //月份
            'd+': date.getDate(), //日
            'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
            'H+': date.getHours(), //小时
            'm+': date.getMinutes(), //分
            's+': date.getSeconds(), //秒
            'q+': Math.floor((date.getMonth() + 3) / 3), //季度
            'S': date.getMilliseconds() //毫秒
        };
        var week = {
            '0': '日',
            '1': '一',
            '2': '二',
            '3': '三',
            '4': '四',
            '5': '五',
            '6': '六'
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '星期' : '周') : '') + week[date.getDay() + ''])
        }
        for (var k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
            }
        }
        return fmt
    }

    Date.prototype.addDays = function (number) {
        var adjustDate = new Date(this.getTime() + 24 * 60 * 60 * 1000 * 30 * number)
        //alert("Date" + adjustDate.getFullYear()+"-"+adjustDate.getMonth()+"-"+adjustDate.getDate());
        return
    }
})