$(function () {
    var ui = xh.require('xh.ui'),
        evt= xh.require('xh.evt');
    var h = $('body').height() - 77 - 62;
    $('.main').height(h);
    var type = window.location.hash.split('#')[1];
    pajax(type);

    $('body').on(evt.click,'#j_order li', function () {
        type = $(this).attr('type');
        pajax(type);
    });

    $('body').on(evt.click,'.list .pic',function () {
        var id = $(this).attr('data-id');
        //console.log(id);
        window.location.href = '/news/detail.html?id='+id;
    });

    function pajax(hash){
        $('#j_order').find('li[type='+hash+']').addClass('select').siblings().removeClass('select');
        if(hash == 2)
        {
            window.location.hash = '2';
            $.ajax({
                'url':'/WapCollection/collection/CollectionList?type=2',
                'dataType':'json',
                'type':'get'
            }).done(function (rs) {
                if(rs.status)
                {
                    var html = '';
                    html += '<section>';
                    for(var i in rs.data)
                    {
                        if(rs.data[i].many_image)
                        {
                            html += '<div class="thumb" style="background-image: url(/upload/'+rs.data[i].many_image[0]+')">';
                        }else{
                            html += '<div class="thumb" style="background-image: url(/upload/'+rs.data[i].thumb+')">';
                        }
                        html += '<a class="href" href="/news/detail.html?id='+rs.data[i].id+'"></a>';
                        html += '</div>';
                        html += '<h3>'+rs.data[i].title+'</h3>';
                        html += '<div class="cnt">'+rs.data[i].content.replace(/<img[^>]+>/g,'')+'</div>';
                        html += '<div class="footer">';
                        if(rs.data[i].status == 0){
                            html += '<a class="tit">未审核</a>';
                            html += '<a href="/news/build.html?type=2&id='+rs.data[i].id+'" class="modify">编辑</a>';
                        }else if(rs.data[i].status == 1){
                            html += '<a class="tit" style="color: #A9A9A9">已审核</a>';
                        }
                        html += '</div>';

                    }
                    html += '</section>';
                    $('.main').html(html);
                    $('footer a').html('发表民间文化').attr('href','/news/build.html?type=2');
                }
            })
        }else{
            window.location.hash = '1';
            $.ajax({
                'url':'/WapCollection/collection/CollectionList?type=1',
                'dataType':'json',
                'type':'get'
            }).done(function (rs) {
                if(rs.status)
                {
                    var html = '';
                    for(var i in rs.data)
                    {
                        html += '<section>';
                        html += '<div class="list" >';
                        if(rs.data[i].many_image)
                        {
                            html += '<div class="pic" data-id="'+rs.data[i].id+'" style="background-image: url(/upload/'+rs.data[i].many_image[0]+')"></div>';
                        }else{
                            html += '<div class="pic" data-id="'+rs.data[i].id+'" style="background-image: url(/upload/'+rs.data[i].thumb+')"></div>';
                        }
                        html += '<div class="text">';
                        html += '<h1>'+rs.data[i].title+'</h1>';
                        html += '<h5>'+rs.data[i].update_time+'</h5>';
                        html += '</div>';
                        html += '<div class="edit">';
                        if(rs.data[i].status == 0){
                            html += '<h1>未审核</h1>';
                            html += '<a href="/news/build.html?type=1&id='+rs.data[i].id+'">编辑</a>';
                        }else if(rs.data[i].status == 1){
                            html += '<h1 style="color: #a9a9a9;">已审核</h1>';
                        }
                        html += '</div>';
                        html += '</div>';
                        html += '</section>';
                    }
                    $('.main').html(html);
                    $('footer a').html('发表新闻').attr('href','/news/build.html?type=1');
                }
            })














        }
    }
});