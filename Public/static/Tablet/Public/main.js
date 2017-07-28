$(function(){
    $._LOCAL_IMGURL_=function(str){
        return str ? (str.indexOf("http")>=0 ? str : ("/upload/" + str)) : '';
    }
})