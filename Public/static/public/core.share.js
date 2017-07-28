define("wiki-mobile-common:widget/component/share/share.js", function(e, i, n) {
    var a = e("wiki-mobile-common:widget/lib/zepto/zepto.js"),
        r = e("wiki-mobile-common:widget/util/nslog.js"),
        t = { isIphone: navigator.userAgent.indexOf("iPhone") > -1 };
    a("#J-vars").length > 0 && a("#J-vars").data("newlemmaid") && "" !== a("#J-vars").data("newlemmaid") && (t.newLemmaId = a("#J-vars").data("newlemmaid")), a("#J-theme-vars").length > 0 && a("#J-theme-vars").attr("data-linkId") && "" !== a("#J-theme-vars").attr("data-linkId") && (t.themeId = a("#J-theme-vars").attr("data-linkId")), t.initBaikeShare = function(e, i, n, a, t, s) {
        var l, o = this;
        a = encodeURIComponent(a), n = encodeURIComponent(n), t = encodeURIComponent(t), i.indexOf("【") <= -1 && i.indexOf("】") <= -1 && (i = "【" + i + "】");
        var h = "",
            m = "",
            d = i + n;
        switch ("" !== t && (h = "&pic=" + t, m = "&pics=" + t), e) {
            case "weibo":
                l = "/share/share.php?url=" + a + "&title=" + d + h + "&appkey=936491597", l = "/urlforjump?urlparam=" + encodeURIComponent(l) + "&urlid=3", o.newLemmaId ? r.qAll(s.sina, ["newLemmaId=" + o.newLemmaId]) : o.themeId ? r.qAll(s.sina, ["themeId=" + o.themeId]) : r.qAll(s.sina);
                break;
            case "Qzone":
                l = "/cgi-bin/qzshare/cgi_qzshare_onekey?url=" + a + "&title=" + i + m + "&summary=" + n, l = "/urlforjump?urlparam=" + encodeURIComponent(l) + "&urlid=6", o.newLemmaId ? r.qAll(s.qq, ["newLemmaId=" + o.newLemmaId]) : o.themeId ? r.qAll(s.qq, ["themeId=" + o.themeId]) : r.qAll(s.qq) }
        window.location.href = l }, t.initShoubaiShare = function(e, i, n, a, r, t) {
        var s = window.Box;
        if (s.isBox) {
            var l = r.split(",#")[0];
            return a = this.shareUrl(a, "shoubai", t), a = encodeURI(a), s.share({ title: e, content: i, iconUrl: n, linkUrl: a, id: l }) } }, t.initBaiduShare = function(e, i, n, a, r) {
        if (a = this.shareUrl(a, "bdbrowser", r), this.isIphone) window.location.href = "bdbrowser://share";
        else {
            var t = { title: e, content: i, imageurl: n, landurl: a, shareSource: "(@百度百科)" };
            window._flyflowNative.exec("bd_utils", "shareWebPage", JSON.stringify(t), "") } }, t.initUCShare = function(e, i, n, a, r) {
        if (a = this.shareUrl(a, "ucbrowser", r), this.isIphone) {
            var t = '{"title":"' + e + '","content":"' + i + '","sourceUrl":"' + a;
            t += '","target":"","disableTarget":"","source":"(@百度百科)","htmlNode":"",', t += '"imageUrl":"' + n + '"}', ucbrowser.web_shareEX(t) } else ucweb.startRequest("shell.page_share", [e, i, a, "", "", " (@百度百科)", ""]) }, t.initQQShare = function(e, i, n, a, r) { a = this.shareUrl(a, "qqbrowser", r), window.browser.app.share({ title: e, description: i, img_url: n, url: a }) }, t.initWechatShare = function(e, i, n, r, t) { r = this.shareUrl(r, "wechat", t);
        var s = this.shareUrl(r, "wechatquan", t),
            l = null;
        a.ajax({ type: "get", url: "/operation/api/getwxsign", dataType: "json", success: function(e) { l = e, wx.config({ debug: !1, appId: "wxffabe5cc5b36c2d6", timestamp: l.timestamp, nonceStr: l.nonceStr, signature: l.signature, jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ"] }) } }), wx.ready(function() { wx.onMenuShareTimeline({ title: e, link: s, imgUrl: n }), wx.onMenuShareAppMessage({ title: e, desc: i, link: r, imgUrl: n, type: "link" }), wx.onMenuShareQQ({ title: e, desc: i, link: r, imgUrl: n }) }) }, t.onChangeHashWechatShare = function(e, i, n, a, r) { a = this.shareUrl(a, "wechat", r);
        var t = this.shareUrl(a, "wechatquan", r);
        wx.ready(function() { wx.onMenuShareTimeline({ title: e, link: t, imgUrl: n }), wx.onMenuShareAppMessage({ title: e, desc: i, link: a, imgUrl: n, type: "link" }), wx.onMenuShareQQ({ title: e, desc: i, link: a, imgUrl: n }) }) }, t.shareUrl = function(e, i, n) { n = n || "wapbaike";
        var a = "";
        if (e.indexOf("#") > -1) {
            var r = e.split("#");
            a = "#" + r[1], e = r[0] }
        return e.indexOf("bk_share") > -1 && (e = e.split("bk_share")[0]), e = e.indexOf("?") > -1 ? e + "&bk_share=" + i + "&bk_sharefr=" + n : e + "?bk_share=" + i + "&bk_sharefr=" + n, e += a }, n.exports = t });
