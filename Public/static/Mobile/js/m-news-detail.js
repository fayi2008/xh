$(function () {
    //获取URL上参数
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
        var r = window.location.search.substr(1).match(reg)
        if (r != null) return unescape(r[2])
        return null
    };

    var id = $.getUrlParam('id');
    if(id){
        $.ajax({
            'url':'/WapCollection/collection/CollectionDetail/id/'+id,
            'dataType':'json',
            'type':'get'
        }).done(function (rs) {
            if(rs.status){
                var html = '';
                html += '<header>';
                html += '<h3>'+rs.data.title+'</h3>';
                html += '<p>'+rs.data.update_time+'</p>';
                html += '</header>';
                html += '<section>';
                html += '<div class="imagebox">';
                for(var i in rs.data.many_image)
                {
                    html += '<img src="/upload/'+rs.data.many_image[i]+'" alt="">';
                }
                html += '</div>';
                html += '<div class="detailbox">';
                html += rs.data.content;
                html += '</div>';
                html += '</section>';
                $('.wrap').html(html);
            }
        })
    }
});