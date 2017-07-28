/*
 * Author:fay
 * Date:2016-03-30
 * desc:首页
 *
 * */
$(function () {
    function Index() {
        this.init = function () {
            $(".web-bar-way[data-type=index]").addClass("now").siblings().removeClass("now");
            $('.dong-list').clone().appendTo($('.dong-box'));
            $('.dong-list:first-child').clone().appendTo($('.dong-box'));
            swipes();
            view();
            small();
        };
        var show_i=0;
        ///*顶部导航滑动插件*/
        function swipes() {



            var showI=setInterval(function(){
                show_i=show_i+1;

                if(show_i== 10400){
                    //$('.dong-list:first-child').clone().appendTo($('.dong-box'))
                    //$('.dong-box').css('margin-left','-5200')
                    show_i=5200;
                }
                $('.dong-box').css({'margin-left':-show_i});

            },6);
            $('.item-a').off('mouseover').on('mouseover',function(){
                clearInterval(showI)
            }).off('mouseout').on('mouseout',function(){
                swipes()
            })

        }

        /*缩放*/
        function small(){
            $('.c-small').on('click',function(){
                $('.content-box').hide()
                if(!$('.c-big').length){
                    $('.content-box').after('<div class="c-big">+</div>')
                    $('.c-big').on('click',function(){
                        $('.content-box').show()
                        $('.c-big').remove()
                    })
                }
            })
        }



        /*页面初始化*/
        function view() {
            var rs = window.INDEX;


            /*新闻模块*/
            var news=rs.news,news_html='',news_html2='';
            for(var i in news.data){
                var datas=news.data[i];

                var day=datas.datatime.split(' ')[0].split('-')[2],
                    year=datas.datatime.split(' ')[0].split('-')[0],
                    month=datas.datatime.split(' ')[0].split('-')[1]


                var date=new Date();
                if(i<4) {
                    news_html += '<a href="/culture/news/'+datas.id+'.html">';
                    news_html += '<div class="new-time">';
                    news_html += '<div class="new-day">' + day + '</div>';
                    news_html += '<div class="new-year">' + year + '/' + month + '</div>';
                    news_html += '</div>';
                    news_html += '<div class="new-titile">' + datas.title + '</div>';
                    news_html += '</a>';
                }

                if(i<3){
                    news_html2+='<div class="new-pic-item" style="background-image: url('+ $._LOCAL_IMGURL_(datas.mainimg)+')">';
                    news_html2+='<a class="new-pic-title" href="/culture/news/'+datas.id+'.html">'+datas.title+'</a>';
                    news_html2+='</div>';
                }
            }
            $('.new-pic-list').html(news_html2);
            $('.new-box').html(news_html);
            var new_i=0;
            $('.new-pic-right').on('click',function(){
                new_i=new_i+1;

                if(new_i>2){
                    new_i=0;


                }

                $('.new-pic-list').animate({'marginLeft':-new_i*453});
                $('.new-pic-num').html(new_i+1+'/3');
            })

            $('.new-pic-left').on('click',function(){
                new_i=new_i-1;

                if(new_i<0){
                    new_i=0;
                }
                $('.new-pic-list').animate({'marginLeft':-new_i*453});
                $('.new-pic-num').html(new_i+1+'/3');
            })


            /*路线模块*/
            var way = rs.way;
            var way_html = "";
            for (var i in way) {
                var datas = way[i];
                if (i < 3) {
                    way_html += '<a href="/way/' + datas.id + '.html" class="way-item way-item'+i+'">';
                    way_html += '<div class="way-item-img" style="background-image: url(' + (datas.image_uri ? $._LOCAL_IMGURL_(datas.image_uri) : "/static/Desktop/Img/img.png") + ')"></div>';
                    way_html += '<div class="way-item-name">';
                    way_html += '<div class="way-item-title">' + datas.title;
                    way_html += '<span class="way-item-fire"></span>';
                    way_html += "</div>";
                    way_html+='<div class="way-item-intro">';
                    way_html+=datas.introduction;
                    way_html += '</div>';
                    way_html += '</div>';
                    way_html += '</a>';
                }
            }
            $(".way-list").html(way_html);

            /*印象*/
            var photo = rs.photo.data;
            var photo_html = "";

            for (var i in photo) {
                var datas = photo[i];
                if (i < 6) {
                    photo_html += '<a href="/photo/'+datas.id+'.html" class="photo-item photo-item'+(+i+2)+'" style="background-image: url('+$._LOCAL_IMGURL_(datas.file_url)+')">';
                    photo_html += '<div class="photo-titile">'+datas.description+'</div>';
                    photo_html += '</a>';
                }
            }
            $(".photo-list").append(photo_html);
            /*游记*/
            var travels = rs.travels.data;
            var tra_html = "";
            for (var i in travels) {
                var datas = travels[i];
                if (i < 3) {
                    tra_html += '<a class="travels-item" href="/travels/' + datas.id + '.html">';
                    tra_html += '<div class="travels-item-img" style="background-image: url(' + (datas.thumb ? $._LOCAL_IMGURL_(datas.thumb) : "/static/Desktop/Img/img.png") + ')"></div>';
                    tra_html += '<div class="travels-item-content">';
                    tra_html += '<div class="travels-item-title">' + datas.title + "</div>";
                    tra_html += '<div class="travels-item-desc">' + ($._DELHTML_(datas.content).length > 20 ? $._DELHTML_(datas.content).substr(0, 20) + "..." : $._DELHTML_(datas.content)) + "</div>";
                    tra_html += '<div class="travels-item-tool"><div class="zan">' + datas.support_num + '</div><div class="pl">' + datas.comment_count + "</div></div>";
                    tra_html += "</div>";
                    tra_html += '<div class="travels-item-author">';
                    tra_html += '<div class="travels-item-avatar" style="background-image: url(' + (datas.head_img ? $._LOCAL_IMGURL_(datas.head_img) : "/static/Desktop/Img/user.png") + ')"></div>';
                    tra_html += '<div class="travels-item-author-name">' + datas.nickname + "</div>";
                    tra_html += '<div class="travels-item-day">' + $.formatDate(new Date(datas.create_time * 1e3), "yyyy-MM-dd") + "</div>";
                    tra_html += "</div>";
                    tra_html += "</a>";
                }
            }
            $(".travels-list").html(tra_html);
        }
    }

    var index = new Index();
    index.init();
});