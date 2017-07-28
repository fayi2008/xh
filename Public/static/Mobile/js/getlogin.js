$(function () {
    $.ajax({
        'url':'/WapCollection/collection/getStatus',
        'dataType':'json',
        'type':'get'
    }).done(function (rs) {
        if(rs.status != 1){
            window.location.href = window.location.origin + '/news/login.html';
        }
    });
});