/**
 * Created by Administrator on 2015/12/16.
 */

// 接口配置
var api = {
    // 取范围内的pois
    "pois":"/Service/User/radius",
    // 取poi 详情
    "poi":'/Service/User/poi',

    //切换服务
    "next":{
        "1":"/Service/User/nextHotel",
        "0":"/Service/User/nextFood"
        //,"2":"/Guide/Index/nextGuide"
    },

    // 选定服务 过滤商家
    "filter":{
        "1":"/Service/User/tenFood",
        "0":"/Service/User/tenHotel"
        //,"2":"/Guide/Index/searchGuide"
    },

    "detail":{
        "1":"",
        "0":""
        //,"guide":"/Guide/Index/guide"
    },

    // 用户轮询
    "socket":'/Service/User/response',

    //用户强意向
    "contact":'/Service/User/callMe',

    // 用户取消 服务
    "cancel":'/Service/User/cancel',

    //检测上次会话
    "check":'/Service/User/goBack',

    //用户接受服务
    "agree":{
        '0':'/Service/User/receive',
        '1':'/Service/User/receive'
        //,'2':"/Service/User/receiveGuide"
    },

    //用户评价
    "review":
    {
        '0':'/Evaluation/Index/showPoi',
        '1':'/Evaluation/Index/showPoi',
        "2":'/Evaluation/Index/showGuide'
    }
};


var config = {
    'center' : '28.6021,119.2813',
    'path':'/upload/'
}
