$(function(){
    function Index(){
        this.init=function(){

        }
        var iWidth=450; //弹出窗口的宽度;
        var iHeight=260; //弹出窗口的高度;
        var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
        var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
        var hjzywin;		//呼叫转移窗口
        var childldtx;		//来电提醒窗口
        var xxwin;          //休息窗口
        var xxtimewin;		//休息计时器窗口
        var smwin;			//示忙窗口
        var smtimeWin;		//示忙计时窗口
        var hcwin;			//呼出窗口
        var fsxxwin;		//发送消息窗口
        var qzwin;			//求助窗口
        var qiangzwin;		//强转窗口
        var ddwin;    //代答窗口
        var flag;			//定义标志为，方便判断
        var workno;			//坐席工号
        var telnum;			//和坐席绑定的电话号码

        function zrar_closeAll(){
            if(hjzywin != null && typeof(hjzywin) != "undefined" && !hjzywin.closed){
                hjzywin.close();
            }
            if(childldtx != null && typeof(childldtx) != "undefined" && !childldtx.closed){
                childldtx.close();
            }
            if(xxwin != null && typeof(xxwin) != "undefined" && !xxwin.closed){
                xxwin.close();
            }
            if(xxtimewin != null && typeof(xxtimewin) != "undefined" && !xxtimewin.closed){
                xxtimewin.close();
            }
            if(smtimeWin != null && typeof(smtimeWin) != "undefined" && !smtimeWin.closed){
                smtimeWin.close();
            }
            if(smwin != null && typeof(smwin) != "undefined" && !smwin.closed){
                smwin.close();
            }
            if(hcwin != null && typeof(hcwin) != "undefined" && !hcwin.closed){
                hcwin.close();
            }
            if(fsxxwin != null && typeof(fsxxwin) != "undefined" && !fsxxwin.closed){
                fsxxwin.close();
            }
            if(qzwin != null && typeof(qzwin) != "undefined" && !qzwin.closed){
                qzwin.close();
            }
            if(qiangzwin != null && typeof(qiangzwin) != "undefined" && !qiangzwin.closed){
                qiangzwin.close();
            }
            if(ddwin != null && typeof(ddwin) != "undefined" && !ddwin.closed){
                ddwin.close();
            }
        }

        function login(){
            $('#login').on('click',function(){
                var gh = $('#cshgh').value()
                var dh = $('cshdh').value()
                var ip = $('cship').value()
                var bip = $('bcship').value()
                var sfqrsm = $('sfqrsm').prop('checked')
                var sfzdgz = $('sfzdgz').prop('checked')
                var sfzdyd = $('sfzdyd').prop('checked')

                if(gh == "" || dh == "" || ip == "" ){
                    alert("初始化失败");
                    return;
                }else {
                    alert("初始化成功");
                    document.getElementById("cshdiv").style.display = "none";
                    workno = gh;
                    telnum = dh;
                    if (bip != "") {
                        msgctrl.SetBackCcsIP(bip);
                    }
                    msgctrl.SetMainCcsIP(ip);
                    msgctrl.SetWorkNo(workno);
                    msgctrl.SetTelNum(telnum);
                    msgctrl.SetSayBusyAfterSignIn(sfqrsm);    //签入后立刻示忙
                    msgctrl.SetAgentAutoEnterIdle(sfzdgz);   //通话后自动进入工作态 false--自动进工作态 true--自动进空闲态
                    msgctrl.SetAutoAnswer(sfzdyd);//是否自动应答  true来电自动应答  false手动应答
                }
            })
        }
    }

    var index=new Index()
    index.init()
})