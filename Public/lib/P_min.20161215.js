function createPanoViewer(t) {
    function e(t) {
        return ("" + t).toLowerCase()
    }

    function i(t, e) {
        return t[g](e) >= 0
    }

    function o() {
        var i, o, n, s, r, a, l, c = h.location;
        if (c = c.search || c.hash)for (i = c[Z](1)[O]("&"), o = 0; o < i[X]; o++)n = i[o], s = n[g]("="), -1 == s && (s = n[X]), r = n[Z](0, s), a = e(r), l = n[Z](s + 1), a == V ? t[V] = l : "flash" == a ? t.flash = l : a == _ ? t[_] = l : a == b ? t[b] = l : a == J ? t[J] = l : "initvars." == a[L](0, 9) ? (t[K] || (t[K] = {}), t[K][r[L](9)] = l) : t.addVariable(r, l)
    }

    function n(t) {
        return t[R] = o, t
    }

    function s() {
        function i() {
            var t, e, i, o, n, s, r;
            if (l[de] && (t = l[de]["Shockwave Flash"], "object" == typeof t && (e = t.description, e && (i = E, l[U] && (o = l[U]["application/x-shockwave-flash"], o && (o.enabledPlugin || (i = D))), i))))for (n = e[O](" "), s = 0; s < n[X]; ++s)if (r = parseFloat(n[s]), !isNaN(r))return r;
            if (c[ae])try {
                if (t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), t && (e = t.GetVariable("$version")))return parseFloat(e[O](" ")[1][O](",").join("."))
            } catch (a) {
            }
            return 0
        }

        function o() {
            var t, e, i = D, o = h[M]("div");
            for (t = 0; 5 > t; t++)if (typeof o.style[["p", "msP", "MozP", "WebkitP", "OP"][t] + "erspective"] != z) {
                i = E, 3 == t && c.matchMedia && (e = c.matchMedia("(-webkit-transform-3d)"), e && (i = e.matches == E));
                break
            }
            return i
        }

        function n() {
            var t, e, i = {failIfMajorPerformanceCaveat: E};
            try {
                for (t = h[M]("canvas"), e = 0; 4 > e; e++)if (t.getContext(["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"][e], i))return E
            } catch (o) {
            }
            return D
        }

        var s, r, a, B, v, m, G, _, P, F;
        s = D, r = D, a = D, t.isDevice("iphone|ipad|ipod") && p[g]("opera mini") < 0 ? C = f = E : ($ = i(), $ >= 10.1 && (u = E), s = o(), r = n(), B = e(l.platform), v = 0, m = 0, G = 0, _ = p[g]("firefox/"), 0 > _ && (_ = p[g]("gecko/")), _ >= 0 && (v = parseInt(p[L](1 + p[g]("/", _)), 10)), a = !!c[le], _ = p[g](le), _ > 0 && (G = parseInt(p[L](_ + 7), 10), a = E), _ = p[g](ce), _ > 0 && (m = parseInt(p[L](_ + 8), 10), v >= 18 && (m = 4)), s && (m > 0 && 4 > m && (s = D), v > 3 && 18 > v && m > 1 && (r = s = D), r || (B[g](he) < 0 && v > 3 && 1 > m && (s = D), G > 9 && 20 > G && (s = D))), (s || r) && (C = E, P = p[g]("blackberry") >= 0 || p[g]("rim tablet") >= 0 || p[g]("bb10") >= 0, F = (0 | l.msMaxTouchPoints) > 1, (m >= 4 || P || F) && (f = E))), d = 1 | s << 1 | r << 2 | a << 3
    }

    function r(t) {
        function i(t) {
            function i() {
                c[G] ? (c[G]("DOMMouseScroll", s, D), c[G]("mousewheel", s, D), h[G]("mousedown", o, D), h[G]("mouseup", n, D)) : (c.opera ? c.attachEvent(q, s) : c[q] = h[q] = s, h.onmousedown = o, h.onmouseup = n)
            }

            function o(t) {
                t || (t = c.event, t[F] = t[oe]), d = t ? t[F] : w
            }

            function n(t) {
                var e, i, o, n, s, r, a, l;
                for (t || (t = c.event, t[F] = t[oe]), e = 0, i = p[X], e = 0; i > e; e++)if (o = p[e], o && (n = h[o.id], n && o.needfix && (s = n.getBoundingClientRect(), r = n == t[F], a = n == d, l = t.clientX >= s.left && t.clientX < s.right && t.clientY >= s.top && t.clientY < s.bottom, (r || a) && l == D)))try {
                    n[Q] && n[Q](0, "mouseUp")
                } catch (u) {
                }
                return E
            }

            function s(e) {
                var i, o, n, s, r, l;
                if (e || (e = c.event, e[F] = e[oe]), i = 0, o = D, e.wheelDelta ? (i = e.wheelDelta / 120, c.opera && a && (i /= 4 / 3)) : e.detail && (i = -e.detail, a == D && (i /= 3)), i)for (n = 0, s = p[X], n = 0; s > n; n++)if (r = p[n], r && (l = h[r.id], l && l == e[F])) {
                    try {
                        l.jswheel ? l.jswheel(i) : l[P] ? l[P](i) : l[S] && (l[S](), l[P] && l[P](i))
                    } catch (d) {
                    }
                    o = E;
                    break
                }
                return t[ne] == D && (o = D), o ? (e[pe] && e[pe](), e[ue] && e[ue](), e.cancelBubble = E, e.cancel = E, h[G] || (e.returnValue = D), D) : void 0
            }

            var r, a = e(l.appVersion)[g](he) >= 0, p = c._krpMW, d = w;
            p || (p = c._krpMW = new Array, i()), r = t[_], p.push({
                id: t.id,
                needfix: a || !!c[le] || "opaque" == r || "transparent" == r
            })
        }

        for (var o, n, s, r, a, p = encodeURIComponent, d = "", u = t[se], $ = t[Y], C = t.id; n = h[A](C), n;)C += String.fromCharCode(48 + Math.floor(9 * Math.random())), t.id = C;
        t[_] && ($[_] = t[_]), t[k] && ($[k] = t[k]), void 0 !== t[W] && (u[W] = t[W]), t[_] = e($[_]), $.allowfullscreen = "true", $.allowscriptaccess = j, o = "browser.", d = o + "useragent=" + p(l.userAgent) + "&" + o + "location=" + p(c.location.href);
        for (o in u)d += "&" + p(o) + "=" + p(u[o]);
        if (o = K, u = t[o]) {
            d += "&" + o + "=";
            for (o in u)d += "%26" + p(escape(o)) + "=" + p(escape(u[o]))
        }
        if ($.flashvars = d, t[x] && ($.base = t[x]), s = "", r = ' id="' + C + '" width="' + t.width + '" height="' + t.height + '" style="outline:none;" ', a = "_krpcb_" + C, !t[N] || (c[a] = function () {
                try {
                    delete c[a]
                } catch (e) {
                    c[a] = w
                }
                t[N](h[A](C))
            }), l[de] && l[U] && !c[ae]) {
            s = '<embed name="' + C + '"' + r + 'type="application/x-shockwave-flash" src="' + t.swf + '" ';
            for (o in $)s += o + '="' + $[o] + '" ';
            s += " />"
        } else {
            s = "<object" + r + 'classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"><param name="movie" value="' + t.swf + '" />';
            for (o in $)s += '<param name="' + o + '" value="' + $[o] + '" />';
            s += "</object>"
        }
        t[H].innerHTML = s, i(t)
    }

    function a(e) {
        function i(t, e, i) {
            var o, n = h.getElementsByTagName("head");
            n && (n = n[0]), n || (n = h.body), n ? (o = h[M]("script"), o.type = "text/javascript", o.async = E, o.onload = e, o[I] = i, o.src = t, n.appendChild(o)) : i()
        }

        function o() {
            return typeof embedpanoJS !== z
        }

        function n() {
            o() ? (t[se][W] = t[W], t[Y] = t, t.htmltarget = t[F], embedpanoJS(e)) : s()
        }

        function s() {
            e[I]("HTML5 Version not available!")
        }

        var r = e.js;
        r || (r = e.swf, r = r[L](0, r.toLowerCase().lastIndexOf(".swf") + 1) + "js"), o() ? n() : i(r, n, s)
    }

    var l, h, c, p, d, u, $, C, f, B, v, m, D = !1, g = "indexOf", E = !0, G = "addEventListener", _ = "wmode", P = "externalMouseEvent", F = "target", H = "targetelement", b = "mobilescale", w = null, J = "fakedevice", I = "onerror", A = "getElementById", k = "bgcolor", M = "createElement", x = "flashbasepath", S = "enable_mousewheel_js_bugfix", V = "html5", T = "never", K = "initvars", L = "slice", Y = "params", X = "length", q = "onmousewheel", R = "passQueryParameters", j = "always", O = "split", N = "onready", U = "mimeTypes", Z = "substring", Q = "externalMouseEvent2", W = "xml", y = "only", z = "undefined", te = "prefer", ee = "basepath", ie = "useHTML5", oe = "srcElement", ne = "mwheel", se = "vars", re = "consolelog", ae = "ActiveXObject", le = "chrome", he = "mac", ce = "android", pe = "stopPropagation", de = "plugins", ue = "preventDefault", $e = "fallback";
    return l = navigator, h = document, c = window, p = e(l.userAgent), d = 0, u = D, $ = 0, C = D, f = D, t || (t = {}), B = t[R] === E, t.swf || (t.swf = "krpano.swf"), t.js || (t.js = w), void 0 === t[W] && (t[W] = t.swf[O](".swf").join(".xml")), t.id || (t.id = "krpanoSWFObject"), t.width || (t.width = "100%"), t.height || (t.height = "100%"), t[k] || (t[k] = "#000000"), t[_] || (t[_] = w), t[F] || (t[F] = w), t[V] || (t[V] = "auto"), void 0 === t[ne] && (t[ne] = E), t[se] || (t[se] = {}), t[Y] || (t[Y] = {}), t[N] || (t[N] = w), t[b] || (t[b] = .5), t[J] || (t[J] = w), t[ee] ? t[x] = t[ee] : (v = "./", m = t.swf.lastIndexOf("/"), m >= 0 && (v = t.swf[L](0, m + 1)), t[ee] = v), t.isDevice = function (t) {
        var i, o, n, s = "all", r = ["ipad", "iphone", "ipod", ce];
        for (i = 0; 4 > i; i++)p[g](r[i]) >= 0 && (s += "|" + r[i]);
        if (t = e(t)[O]("|"), t == w)return E;
        for (o = t[X], i = 0; o > i; i++)if (n = t[i], s[g](n) >= 0)return E;
        return D
    }, t.addVariable = function (i, o) {
        i = e(i), "pano" == i || i == W ? t[W] = o : t[se][i] = o
    }, t.addParam = function (i, o) {
        t[Y][e(i)] = o
    }, void 0 !== t[ie] && (t[V] = t[ie]), t[ie] = function (e) {
        t[V] = e
    }, t.isHTML5possible = function () {
        return 0 == d && s(), C
    }, t.isFlashpossible = function () {
        return 0 == d && s(), u
    }, t[I] || (t[I] = function (e) {
        var i = t[H];
        i ? i.innerHTML = '<table width="100%" height="100%"><tr style="vertical-align:middle;"><td><center>ERROR:<br/><br/>' + e + "<br/><br/></center></td></tr></table>" : alert("ERROR: " + e)
    }), t.embed = function (n) {
        var c, v, m, G, P, b, J, k, M, x;
        n && (t[F] = n), t[H] = h[A](t[F]), t[H] ? (B && o(), t[ne] == D && (t[se]["control.disablewheel"] = E), t[re] && (t[se][re] = t[re]), 0 == d && s(), c = e(t[V]), v = t.flash, v && (v = e(v), v == te ? c = $e : v == $e ? c = te : v == y ? c = T : v == T && (c = y)), m = u, G = C, P = C, P && u && 8 & d && ("" == h.domain || 0 == (4 & d)) && (P = D), c == T ? G = D : i(c, y) && (m = D), i(c, j) ? (u = m = D, C = G = E) : G && ("whenpossible" == c || i(c, te) && P || i(c, "auto") && f) && (m = D), m && u ? ($ >= 11.4 && (b = E, e(l.platform)[g](he) >= 0 && e(l.vendor)[g]("apple") >= 0 && (J = p[g]("webkit/"), J > 0 && (J = parseFloat(p[L](J + 7)), !isNaN(J) && J > 0 && 534 > J && (b = D))), b && t[_] == w && !t[Y][_] && (t[_] = 8 & d ? "window" : "direct")), r(t)) : G && C ? a(t) : (k = "", M = c != T, x = u == D && (c == T || !i(c, j) && !i(c, y)), x && (k += "Adobe Flashplayer"), x && M && (k += " or<br/>"), M && (k += "HTML5 Browser with CSS3D or WebGL support"), k += " required!", t[I](k))) : t[I]("No Embedding Target")
    }, n(t)
}
function removepano(t) {
    var e, i, o, n, s = document.getElementById(t);
    if (s) {
        if (e = window._krpMW)for (i = 0; i < e.length; i++)if (o = e[i], o && o.id === t) {
            e.splice(i, 1);
            break
        }
        s.unload && s.unload(), n = s.parentNode, n && n.removeChild(s)
    }
}
function embedpano(t) {
    createPanoViewer(t).embed()
}
function embedpanoJS(e) {
    eval(function (t) {
        var e = String.fromCharCode, i = 1, o = t.length, n = null, s = null, r = 0, a = 0, l = 0, h = 0, c = 0, p = 0, d = 0;
        try {
            e.apply(null, new Uint8Array(4).subarray(2))
        } catch (u) {
            i = 0
        }
        for (s = i ? Uint8Array : Array, n = new s(4 * o / 5); o > r;)l = t.charCodeAt(r++) - 35, h = t.charCodeAt(r++) - 35, c = t.charCodeAt(r++) - 35, p = t.charCodeAt(r++) - 35, d = t.charCodeAt(r++) - 35, l > 56 && l--, h > 56 && h--, c > 56 && c--, p > 56 && p--, d > 56 && d--, d += 85 * (85 * (85 * (85 * l + h) + c) + p), n[a++] = d >> 24 & 255, n[a++] = d >> 16 & 255, n[a++] = d >> 8 & 255, n[a++] = 255 & d;
        for (s = new s(n[2] << 16 | n[1] << 8 | n[0]), o = 8 + (n[6] << 16 | n[5] << 8 | n[4]), r = 8, a = 0; o > r;) {
            for (l = n[r++], h = l >> 4, c = h + 240; 255 === c; h += c = n[r++]);
            for (p = r + h; p > r;)s[a++] = n[r++];
            if (r === o)break;
            for (d = a - (n[r++] | n[r++] << 8), h = 15 & l, c = h + 240; 255 === c; h += c = n[r++]);
            for (p = a + h + 4; p > a;)s[a++] = s[d++]
        }
        if (n.length = 0, o = s.length, t = "", i)for (r = 0; o > r; r += 32e3)t += e.apply(null, s.subarray(r, r + 32e3)); else for (r = 0; o > r; r += 32e3)t += e.apply(null, s.slice(r, r + 32e3));
        return t
    }("dp;)1[&k@4rdIIVFK^g(Fi/_1F09)hDSU,/4*5,L1:_lHJS+uFDQlO&#=/sq/w-SQGe2A:Gf,;N-wK*P1s+%,Fj.f78Ze'K/q2Sq#;/QZ/w-]=0?7fB/p>$L3)&u<-ETAVB>,M$6[UH#6[UH$1:gW]1r7,<D89i>EJJ/JG^[Sc2MYr2FGFL`0n.3G/x3wU1q:T)GaQeWCQ3FgD07Ci3/Tm<0<QhZ6*Y7NCM[J(CTTX$aO[XZ6$ug26*j.v6;.^-Cls*TI(O+,-@@uC6b.og/weB<I#W5xBQYmF'MS%$FErJR2h$['-w$Sw6bJ+j%SU<MK#g<f/R/9[%SY6h06/Cw6^#6-H+[u2GYA5v#9Y@D/w6_Y19sEb06K?f#>?LKXhj)YCNO$?FErJ_#BFerBifM:-@@rBAZ%>G5,h0PFKg?)<O+$THG4+7D01&-%?1@)D8mT_8PJYbAZ%DE3N50.C5Yk5F09)v/w-RfAZ%GK),)6tB3P@P2g8W=FMVf56^#5]#%9R2#')d:@o[abUfCsn#4kInFdqIfCTp4KN`C&%N`K%X19N1D0?7LWAZK@VCqf/r9tJgdCVF/e/wHo>0?O=2-^'x%/92x>*1oK[%V>aYI%:7a0?6OfuuAZr.&xPGC566*CpKS16*:2n$ASUx0)lpT1f_-d08F@I#vE6Xq/GRTJZr;RB67[=HGtk<Fh<.&08F(c6]la#/93/_#=AX.19E1GB>7soB=`akC5F*l0?L4u(QBcG(9Q(jn_wSTI'IS78wMw?Hbo0F#xHlY#>?UN7^h4896UBj;RLSlCUx*$-rtxO#BtXi3(x87CUoB1COmIt(RBu`#(6PF$b;f+B6o(3CTV^o9=SQRCUxV>3&r#_.(*q..#'Kh#<W'v@=U=w@um2ADp*^N6*M]e-VX2I/92sVCqG736`Ir>/9GEYBufN1H(/jmD7+8J>-H@Z*O(-#*Nqcp'wmucfq:dIG.;hLB6[l/D8D'44MN>t6rfvGC5Mwu;cw$k.#9'x1r%>?FEA_WElkcb04Y'%6u?:4D.EWS:.v>7%Sn/N$U+Z?/pE1lB8Sn24E<3<4*<'$10bgx5$Ixl&ljXL$B/M_2hHgT-[nns#$jn0##>8,b*h.d7;e._BWWJ4BT<(=C5*7&N,C/Y06]Un.+]HE9HO7>)mL;O*/MtF*/Nj`*2bQU)mXQU*K'`u%7hJ>A46KGFKcLD/$1v3#v)XO)R'dVlHHD#2Mur.0<Hbl3J&s.#+Rd74FB8.#$jgu##6wZs`-%vHF,<:BYPu01Ta*]Ch6vD/w-_c4FAT11:%ax(O$WvW.xvNBQ>H86F/oV#&H?:(/-Ev6F&h^#JhCJ%pEQE#$ka^#^k_r[o[-)$G@XO-w7V/6JigO6;`HS19a3[6$**P.<GPu,gu(1(S[:$-apP^#%0O<#,#fEH,)xO#,k2&06hsE#/4?N-w7Vb6v2qDBd$iUF]Fb.0o#*f/umf7#ZAHF%Hx()'ixF?3fTV_BQ>G]4d2D87<E@X/r5Fe0soN:4+LUi12Sbv5^&3m#wr/L##)k;$8MZw.&I7i6[_N,6[UH(6[UuRVd$EM6^#E?MG,xE1;ciN7Wpv1FY<bb-vM,(7)M6@IGc@]Cm'mw5^hIl#0`:F2h$[/7'>-L$[;Zq06i&qBR(xL##$[SAxsK$H,+H8#=&?FCNV(lCPe7kFGDQ9CN:d9+xu>B19t-a$'I?b05WOL8%L7e0A$OK2K`+&6d1F46#Imo)cjcQEJ]5f#(0n7ERFj(EHV=hk@rOZ-bOqx/A#DM$Vpfh0Rd3)%clNH6$6_m0p$gR$/K'G2h%37BR)1P#]er:#9wsv/r5hH6bJ5R6`Ps1#HgVk06i)^CgFm^CjiCi3IrI_D6]27.#C*?#+eB[0o:`G#+K.W6](f4&Qtgn7<Kg,]P*<>RS3fL#$mZD#&ZGcPY=dbB=MI9#)c?l7>(YE6A?p(SlMD(3JAXg%I,b0-^)HeJwHQY#;hiZ/wHk[19N3b06hpm=]KB.#v)cNC-s)L@AwI8$/#T5K#k$]$_1q6C?v(093)*[#^*r9TjNJ)D;G=x4&*>E6*<>e6*;`m0=np_lB/>92MkT<7COf$5`(Rx#0faT5`(cZ6c4tW(Ush?9>#DmDHn3WD$_4)19t'U0nuL9+xt)2&Q8_Z;6>eb)NoT:2QfUH^M+EPD2DE.@BEi#nRx1=Qr[at%osQw(N'nj<j0>XD0R4--?t'6$;(B+BR4=+HAvtiB>m9O6*aYqol:hS6*<=^pt6h&@BNnhD2Dp5B;nGt#%7aN#%1#h$#M60Rp(vU/93.L#x4-GgibQI6b1002Ln6AmV8Rf.%11.C5GsB+]Y1_06K=w#[JXb#Gb5?6^#@:#Am;M;,K'_B6plK#i^2a6;1:<06J`rE(h:Q#)wDQCPbZK8s%2KCJ=i5D,13B#>AW8I(DJU@=2@8@pc:lFK&rZ8Z-I86r7SjbxMfP###238['Y.CC1)HED/_H6c+cj#*1k(6FTmt8@L1/@wR@7B=xAZ6FT%h0n<f*2T.coCf_YN6ajM<EHt9oGlV2xIv/E8$XHw/%6knB/93/`6c?j[IX$-m2hBTf#2r.m19s?aIYj<H#L%IG08Fi>-[kaQ$g2/YIA`=wPYEC80FJ;;K#gBH-GD^h#2r`eCVr9gBSIqJ#0_Pi/t9[s1<$%x#v1V,&lj;1#$mOA#_hgG/9r4xp2Pf%#(8,AH*.3s/93UQ(;<OK(sF[((W.G#AqAKdBT%)s#jA4wCUll;08=]W&5Nk@#oeJH&P[f7/92sUB=VVP#>A00(6[0R-c_d#%8OE:7_.9l-sq=b-t$CP%87x7IO>J1AP=5kCQ][&(/+e*%8Hl+nE'R=Hxv4RFMMV3Hb/#R'25^8(Nghb#>58b7Bfk%&PY]v$hIo$gi;J1#$vMY#?-Xo.]hPC%W3VDXxU$e6X9]&'MfvE%Ss_,(NMQG)nE%F=,14NJ^U,^2R5K'-siOXCm8A/D2Dg2CpKEvrG08%08EvDD5T(t@v4k+2mV5Wl>S%q-FIa;B6>EHF41-CFE/`'/xNUGkA#ti#%1G^'2Q#>$T&#n[TanG#^V`S<Db%K#vJsS1l@3x$tlD&$;J9A$-s^_MGOB1#w`(o$>`MUC/7:>@=2@q#)le]1pj-2G'>.<-wK3Xf4l+?.&fDT-vM%K#hX#c4]QvQC8rc/<Ps_SGf7r0GffTVD0<'e2mC;uO%`LO6c/7a(q^3.#)sUwB5@Q`CYJsnCk@bjIL6.BIYi`%$(Q6k/9H+#$,U>0IWnN$D;,/-CFBO.D0m;1IWc-h*Of@B34E,.P>;73$(d?l/9H,T#(S%NIZbf<O]mlA1J]Y2,>T#heoF,c6+8xobxa+I/5-&J#&QH@@o[,U##Os$#%ewUBUB*0P=v0o#^Nu['M]ar#Ax@jP?@t*#%W0J(JdG`#_vcx7A1E&#D)ulBPepiBNY=D3(tx*j)1]EE<?89#CJYGK#ifcC9`6pD7OSwCaEXO'W3.H99*#G-wQs2<0C%)194W>4+qnp.$7E/<Lt`)q/3^.4gM`qB;nD/5]rWvC3We8El>uq%csi*B6#?>1rwag(IJ8JFiVqI/AGdA>.&4_Fis0O>$=fKGg>$6/ld80##'if<k,sWBtc9RDTR<^4+&a)(Lpp&(hUoG%87IA#C$<=98P?hWDaxJ#aNTAB<[7w(Px8g$jqggBYKI=Bp$6B22WSt$%uIjB2Sp%AZ%AD^2q)k*`ZQK4-TtZ1rwxRDops8JplUN#+R)p186C4#h@>2El#Q,CVD63R_$cE8[N3OC32169Q`fLD281;D281.*4%c2#F#@K6*a.(##2[DL50AtB=MZmFCulU&V=;RCkL<CC;=ML-x*f,.sIGb1qhj3D6xCx#<VwvElH(u6[CVTCkKn3CV2v;.`7f;#<aaVH,+_FCPQfaBWYeaD8's7FKf-SEl?@YAZ%;F@uxsXJ=Qhk6]PPE2M=/brG4>OI'o%5BXiW?-[kgS%-IV/D<CpQ2i*aq6*j2n-X[/V#(JL[-sqLH%B`>$CWLo91q(Z0Gf7](7<qYQ3/;/a#1I@A3fB#k6*nl#-*tn])ee)h#&H,R'MRx.CrFT19Wa0LEmC2S1rnP5EgblWEPQM8/92pj#66vw@=_;F5d]+K5'e6%#cPi]CPb6o34tKa6+S]iB>-BA.;h`P#+^5FGe(cx#+RK5@uxTU&PNX;4G>Mwn7k70Do9j$Gb)1*;H3c24G$knC3P&12KsSa1f]tR@81-o6+U:CC-;j[3.*NI#FpPRG.;]G#4[&_FM;>2DpQ@Q:/;,m'N&wV(9^d(qIxE)C9`jg2Q8=BEk^JxHB`30%]t,0uZ^w+B>d3Y4Eu=g25E<l7/.59D0gq:B<v0$#<W'G0?JX-CkL6HC9;TnG.VhIk%K`m#&?[i#vr4V#]cxR#vh].C;OP60?718).$p>(hM-#$ToQW?Ed',HFo-J08EB91s4(RCU5b4<l^v76(8Ei#/1/0/q07[5uiRd)-iBi#)waADofMD2nICj&llX(GeDI%#(C(&C39lg'MJPv$XR9h#ZKGm$ep2giH2.Q.3K%'8PB:S%8OjU)LTJ;q.n6S6[UH46[UH56[UH36[UH/npsW46[Uu]APtGkidPED06g1:G^G-S'T-qaCNhRvBM<*h6a44EDDs*,CPQMgD;PV4=]LTe06fqVAqdc.IW?dv';9GwFE^7-%pkZS(4@6-#;vR_EHaqgFCZ3FJ]tXe0nv.-$tI,T1;cQ+IvOoRGc>G4CPe9c#&=[&##$qa-@o2h&<D1d6bJ+M#HIj^0n?v.$e1Dl6^#k7Jr3s33/M4vI8`8J3kg>wnS%&WIYgfD3'@9#0#Tp108;9H+]XiR5_kYU(53B*#]tIf7D_R/5`Ux/#/)@6HwI</IFJ_H/p1Q(DF4D287VnY#>C7g#C$<5D2ER@'2DM;#o6rMJ]F:s@Bt1(IYj,<%V0?k#&IRn=^v&G#%/jr%qUia&wH2?IW?eVu>ux]#&Pq1gNg-/N`E9,6FpC5?VCTU%qWwb(l>/i/n]OgFE^HpGbJic12TNu/;[rh+'jHZ#(.lP5c%hl10O[(6+9Qm9u)R:I:NoJ-^)FB$@w#JI#]222,@W+6[:D@DG_C[Bp+KK/%x0R$:Fn66[Uv86Gci(0n>(k6b6j#4i)rrjD*IBFE^6xeoWg/FEpI&t]/fk#H^]G6cuw=ED-Er#>QhR2KX).C/ux+&m(jF/9EY'#+0(m/wn67(UPfvC47Ub14V2s#[iOi#^(q5s(Ie=8PO<?1:Sdd1;b5x7X/F0En>5$2cXb9#$)u$K=`7k(1A>oA3U)v**Nq$qfi,-$ClRoEJ?so#@;=$$@n>dFYt;]C565l#&A+B)ciTPBOi9`J5mciIp?>vIYkf:3143,Xx^J>_fwUZ2mRtY'>6mTFggcF3,p=A7KO'.(JIi]2iEKC&581NB;[Gn6akRR$VV.k&PS:E4/lB$6*4@L'2/ts$VV+l$VV+m$VV+o$VV+p$VV+q$VV.s2G=.(#$jt:#&Q)S$rtHW@v2ox(fd:)Cefo=@UAS519jCX1;lak1;5<h1:Sn^1:/UG0?95Z(qJQq-b#Pf#&Ru;McG;16.5h]FGI)(-bv2&#&Rr:QrS[N6/VajIYX4n.)J(q#&]IHVG&2`61+a#EfhGp.)@xG#&]+>q.Q:9K1wH$X%WP.SP0?+2WFeRD;uV4FQ3@;ET7%82WFeRCZ>D3IH(<EIdCEF2WFeS2WFee2MXFx$.Ap`SP0_9QXU$T#(Be6A(CXMC8WfrP=x<W@=DMI#**6%3N83G8?d<YA)[KYC8WrvT1iSd@=ifY#**6%4gP&W8?d<^A*t>gC8X)$X%X)=$rqe+#$c]H##D@)(9ewH$2kk=C/P%;^1aeM$rqe;#$c]H##l&.&+hZAa(V>/D$L&g1:+Jp-[9P?#&Pq1]4f'#C]o*Y1;h1t-[9o=#&Pq<X@temGkcW[1<#li-wTS$#&Yw<SP15_DVlGA19ZbB-wTUk#(.uo6]PPf1<,ok2mS@Oj(dUo:m/V7#X/?J@v3U,BQodUEHdDUHw829Ha@-@#*:=M0vc^X0ug']0qX<+Dc^f+8q4k$J9H-kGBS7d:k-?p#X&6]0Y/eb0Z5Kc0XsX/0Y'9:3):^`J>WKs6+p?d(5Hk4)1xD`'YFEl41lPu-%_)>#AZ9@##>lqFxaO4Fxb*<2SB)r_J,g5GYA-a5J@,%2171'##-c/2p#Dw-x*lt#&d5UHrY36HrY682,4[h#>?4wIS9gh3mD#',Cu)C%&3mUCU.#H(q-lE(q-lE(q-lE(q-lE(q-lE(q-lE(q-lE(q-lE(q-lE(q-lE)6HuF)6HuF)6HuF)6HuF)6HuF)6HuF(qI(H(qI(H(qI(H#T3][8g7]H=;`0V8/VJF:Dk4^GHK.r.'[51#^E)BflQn]flQo$flQnKflQo(flQkOflQce#a]sV#q;ThBQn=,EHb_%Hw8-P#q;ThCk/b0CNj'uG^v_L#q;ThD0Jk1I<Rv1It4HS#tJ?[0Y/e80Z5K20XsX-0Y)L7rFuuA0Wmr@B6J'E8ZbJi0rWlw7`N5aCi*N]CLeF+G^w*?#aNd80XDX#(;hxo42j`PM,$=ZB6J06#$dCp#+p_d=axYu#qF8@BQmesEHdMXHw8)s#qF8@Ck/3wCNkmRG^vZo#qF8@D0J<xI<TeeIt4Dv#qbJCFE_')IWpnfEe($i#^c4*oR`iB$xBwe2GO6`&53.e$sjnC/>ZnB##1(q#+YuC6*j`f0Vqk;,c/AeH#w]b%S[F:2SWuI'MR2s6[:)p1PIN80VqlF/le8(/lgEa0VqlH.81Vr.80hn%3-l51UfkT0XE=E0XE9?#<Vx%13nYhBQv,A0XE=C0X@'L7t8KvC2b0REHYvMC2b0)C3I_825Xr-$X==)cY]x6cY]x7cY]x9cY]x:cY]C-#t8R=6[_V>BQf0EHw91UCNbpUFEVo_D0_>YK1sVn0X<1T1W1dX0Ws5r-w06?#9>7HG_(WmCk'vUIWg@:#+pL]CO'^-#-TVx0Z#?g/50$U0Z#Ei+&#VG0X3.L'21+$0Z7X.$=t4>IWpwiCkmABEHvG6##u/=+0P9?-@0s4#&Gq@r+Qn+J;7ZlIYiNfP><meCk&'L2h8ogO&7XG1sU>9(kw9*(lEQ.#1F-11s_D:(l*?+(lNW//U^=/%;SGM#?VP&),(Rh##G?r%U40^#YYJ0'v_/c(R?Lo#6v/aB6=jUG_=GTTPbnH#/NHvB65l]126h[EP#]vCTijHBKHp;W,=s71qV.A)tr(RH*:YsDo9SLUfUs')+4e`B6G^91r[PNCUfDtHF7[F2k#]S06Jqd#%TdO##nw5*Nm]s$eBJm:LFbH6=Wt07Bxu_Ufa>H6(/nA6%I@$-w0)w&H4An0X*'a430+1D*//F2eHDx3)'dh(JGI$'3>9O#)bqq3L9`T$$mSd<`Nb[08;6M##?7C'q&E-.<R],#%'*D##?CG$]JFdH<1pv-=%G%rJ?7D/?Nn5EmC,SLiZBeH*MI]HGFR=BYfg*/pG:=Ekw<Jr-lJY1jaU8Ek^fx7;dxcFKn$Sr/6i#-rk[P)-xl+##2=>6$4W2:fWRR@=eKF#Cd`YMeHUJ##5Y3'oZKp(4Yqa$??,NOC0Jj?El8sJ?e@&g=Wa[A]N#oHG4+A19M*kBvY)5F*M;.#7P4[1:',x4*FK51:eaq2T9*Y+%w6q+&#MM6cG%_Wb>7)CV+6'B=rprBp=_'1U9&x1U8K_2hKXchU1qNG'[d<H*i/3CN_%h2L$t/MH_4W#>FQ)$$w3+I>Lw]H,=3@*:5j8K#g@g6b1LBMK&vG/M'Yw/vs3=4gKv[H,=3A='>v>#ECX)@tAZ+'lnYO07Gn)##&HD<eJa,H*ocw-Ad)b$;`LACUeslHAO=j#(r$>G$4oTC:/-*EjkVRE31b&#>kVh4Dm?ud:mNMI<]fKDS(#8G.Vms**neo(0gn(&ljO`$_i(=08k2F2hwM()pXXp3jOQoI@UA2CNV`R>#5muCJ?OMCPTm6)2D%-MhB<bB<Q$qJ'TEh1pkJY2h-U^MegPO2im=dO)xhBH+x(0FV6':H)_kY%UgHEfPIt;FL)X**N_Q+&hS?R1rRXK#/;`$0?Gd-0H2':k].VNFML+f8qGTII>&8MI&@R72j)`2#v>JX#MBYrK1vE;#YuY=#E^Ri:9H.c%oo[k6,dE>]Tpq=6+B(02iWm?t@drM1q(m:06%8KIv+iB(;_]gMor$p6[`C`0P1T@Isv0'FhsmdH[9wb##>5_%S]'L*5t%(#%.GuIswjpBQRe>H`;'V.:IcN6Guu00n>)B#)eN21?feF,C#c`20ah/#$3I4DWr.41kE_.#$jfS#$lp.#-C(UEJm6l%SZCuK#g@R6Ze*wH[9wk20<MgJ5v[H1;vDi20<VgCjw-iq/?*jIWn3W1sLvm1sLisBmupS0taF[*`[-p*`^M^1Vl^n*`]?11;_P:)o;8i(l1Is*Q8Up)0K@l34(<gBiU=x1sNBu7C4]s9iZC?5oO*E/98_5(UV.cA&0fI1UP,)(:;%b@)4JD1UP,)(:;%bA]gxJ1UP,),uq_3B=';>1;PUW#$a_>#d)-jJ;5i*%%xxv3/Dbr)GbO?(;d`i$jL03-;Pj#Ghmhw6;]m?FVGX<C5W@>3.P:wJPZN,#+T2LGf]2*)lLERB=`Vf##%$a(5+YR.uLvX##.as-FIZ$$;u#4#Hf2502,*%A'&<P%%g58@tE10,'4sT@8]D@C_`;FB6#?&'Q#JPP>VHY%p*L9#8w^(BS_91*bL@k-vaX`(/,vx3#sZ@Z<opxBW1vZ?*@I9:6@^CB>,YZ96u[$Gfc`tCe/oW99'-qD@8+XClm[[-@B^u9EmPAXC)[_8Rd(pD0:93BlfMxB1s;F17fJLM-'xN%8OEVl(vtI19jwlB6]Wf??h_S%=E&JHsC$,CNtn1%:+6k#2Nu4Fi;G$H?b7>#%)Of#%Vkj#*D3+DMa@A*3YW9(:fh$2QqQ0;J@2;O&H)A#;/E08s59U/r#7a217pQ(JSlv6]-rV2MeB(q/d$uJ9b;l5^i==3.*<l13lU54,S?7/9H3)&PN>(-e6Rt2L%j]2M^.x$`xo^CGwZS19t'_0nuHREgWB$Bn<Lw,<Q*g4+'697=?fL5_Y,P6cw5tHafDu#(6K?:5M<Pb'1gxCPPIA%u&Vf:2ha4._1x/hKGaEB6OMq:7s)48YQ;n$rqiO+In#T6b_Dv'j3bq(SAHQ._je(%G,X8FKg?#CVGU_W-D7-BR4n;BX;Mb.6x$E6]xam/8fr=HF+mC6`AcW<Dl#r@-/9.EJS4mEI7ih8;TeCERuE@89-&/@#75a,e(kt/vCf=>>I#/=apb13d.$f.pZM*##R*b#]k?Em>Q/rJW;@o9qg;0FHC(YHG4<M#$2F@H#uKj89wf'F`$3DCjiu0-[[Jr#%0a=$u;RF%:`bH%<3s+p2@E616)mS#eFA5&53IG%ZE^+6&lfc(6/s9$&UE?'MME?FiVA#(MO+T/w%BrA]jE,7r<:'aDdP8BuJN/H?(@%0?.RT89HJV##+lu$JQM>8Im&C89cDD4A6bF2cXN9#=AO-EmDc6D07ra6Zc&<7t-=Y#-2k`08E/>###TT2fM*>/93/_0p82LFK[+A14&xL16sPV.C_q_##<9FBYZdX2h@kL%9woh%Hq-k6_B4.6'#Hr%<FlJF^0EV05_d8J8P?o#,rj4-rl#n%;fGD(/w*+166h8(7^lX2NiL8F]Et5I8h3(It=Im#$dK%#JEWq6dL_l0D,>1B8LYd/t@gw073cx9W^fjB70cqI8q:90tjL36]Ing77Sv:9W^bp/7&=)IB>M5-wKpw#(A)L6084qC:/-.FiVu4C3=n1Hs=qE2MbMj0t@vi$e/bh.'7X;Fa)]:(;TNO<h,[v8?Er<#5ShjCNVkP#2M=v6&nS.DSLL2#&HGsu'2)[1h'gak%XND/9FCK9n4W`rG/W820<lr/wR'h06Jc90T@NH9iZ+c9iYZa,v$.@#l&kB,uosA3,_RW6^M7`#>clY16N/O#tTND16>r28?GNhLpY[CCTCtjH&DZ++]uxJ6`d<)-YskN#.-f16^t*n3G]e)#@'u^$`T)E1883@2+xpn2n?s0@oh@YB8J<t<E0(SFj87:IWw-N&ll.2G-vEs#)WDO?$fpMO]J*<23;6l2Igg>1faL5t@b`j7DjPg6[)Uh3-ww(5^-RZAZ%@9.qOKM#$sn/#&#HX#/#&xG&Abt9TT7b9RAOO8st$h304,D-rl8/-rp`T6'=Be4+&aI:/+TsC9`?n,v$.[>dfQ@(;*RtAxr*Q<-20M#aU7:B8L;02OHXdja+9V>djC208i6O6[UGjH=wlf,usjG>dh)H6]xRo-q7R80SrNF08EVd6[_JS0rAATr-#DeDo^fvFj8[Y4G[I&DoC);CVFm-Fi/pM1krQA#md?Y6[_YF/r#7>0GkwuAlWd$5>K%x0UOrq0Ssls<JbLb#+[$P6Z?LF###2H98I*/Jw,2I#Bc-T<fkM<?$8oq8UE4X<o/Eh#D4lB0r9`a1s+?j.(kfZ-t6OfIpvcf1KkdoJ6Dss05Miu:8^pN$x<ARDZ0^@[p*h#),)jA0#>M3.(CbI##'8[(7Zi37Xe5(0m?v,G@CPW85'Vl&llQQ@v3Zb##>2+L5nntGf8(0H@-KCF)1jV3.5(w<E&uq3N5/kBSSq1Do6so(U5;kqJ#ADFGiQA@=C)C6Z-%Y-wIt]cJ&7S16cx%4gLSm?=3cKIUE/W5H-fo?tjv71QF*3JKPx>78+H'0iaS:78+SS7SFT()c_knm:d`g2mSt60TKRQ#$asr#$kW.#)uLL6d046#;#sCB89ZvCTUn/:5gO?-w9sV$s#Ja#>G>[2hA0V/p3l12,tY0$sW<s.[)>w$tl_&#>FVo2N92mjGT6G$;Cl8$>2G.$>V`2$@39,h.W'RlY)PFeokxrBt2['B<PaP/]O<p)3g,o16sJT<0fud6%K/U6%K/X6%K0$0TxS]$@=7s,vAh3<g&Sc9n.rt.xgtv9Q`jB$W;4w8=M/ZB^qrG2Md@,<umjo:g@BQGBn#NFNAk*1RqSB0?XC-7?^3gI>/uQ2T%)=$VV`lB3,(:$ru&^1;H&./rO9807,I/<g&D[9RB0>#(/boAV)6&I`^R5CUep*/D_DBK,Y/$$VV,W$VV,3$VV,2$VV[mBMoiVIB<^W(6Sm*2h$[q%VA#OB68-*##M:)-[9YY+,u?R0#.mw#t8<*<ag?5_J?)0F(5?#1;.qR31DJB=CkhJBQxNS+%x=o#?UuB4b[?9&lj@2$>kww5>2^KN(frvB6>cq6cQpk$/@)$6_M;5/:Ke[$]9ql6UM,bAn#](/7&nIF&3R&G&s1u97JI_1pltL$XYA*$@F@o5a6.&3N4Nv18]9oBW4.b1Ck`+K80J9rd/;x/9F1EHAax8%=9Xrja64eq.v']##%_'*Q]M:(n#,I4dr;2_53N>Ncp?@,]'d*164T3sdAhEQvlawFiBlL#0^EUHGFI>6c#'Z-?bAT#(f%b8Q70E'ig$n08tDQ/xCqq.WnjH&R9.l#EL3_/srQ%$)7LEAZ%>F2Q83b#.6J#06K@JB3vLiieeCPOBMYn##Db>HD#3&Bt`HsMiM`5-<ClO4Bhq98Z+8O5e)VnG-,Dm?gaDl/srRk*bV^M#Cg%+=&8qv7t^-eC8`g<Ej1[Mr+MKmUNI-g/5?2_04-OJ#*CZx@t&ltAuEGFDp$LE#%KHS##]K+;o-%k3c8:vBi]iU##W'f7`b&fBr,ej8#K`%4c?uK$ApG)`/q76u=fAj/94X?=*S21BYJE4H*MCGBS[;G+xv%_HED55e>/U0$;M/%'MKX?6X^u@1R'V#8whf2BBqf2Hw7t/9REPaB6f0G2hek%6WO2W5_c>P6vZ4d2K`*qY@/$T^iCmH2i=+h&6rUG$I)G(Fi2G3Hc[I92h$[r,a)_W#V:(L0?7P6/to35B6Z_tU3-KM#(:-=H<C5Q;gk/+09H9.#-Vk]Bu#LCK8k;l8Te+dbE7Jv2L^)NB4;Tm60'lbB6ARH#$mF,02;Xb#<)Z,1;Z2tB>/H%:V(Xxa(V;+JoQKW-[e:T'q]m+##w.01:%w)$D`7SC55`0#%CLP#&Sf?(fbs$#(Sqj7t5ML,$lx=XxVk0Fj/*aX]DR(0?7Ta#'G?Ki+SWO'l.gFF)`@%#Z?Xg#i/s]BR14.#ZMCu,up)g_J?lK4gN@'28OCU#%%K&&nHlm'N8eN)LvR+#5Tu$CW(>8CUxXw#J3:6/w?_i(/4eL5x'i510FTv6plC07<CkT$?7VeITrMb15wq3Gdcm?*fQJ9@rv'r2L'Cc2N^PM4b^of96;Vn*PQ':K695,2Od((hIu]0@t'5TolCBkA'c9]E`nwG:;n9>u>#W+re_8X/7fvc#w&0P(S5>J(:XT[$vGvP$@4`'6(Ka;,*YE$)lDlL*L)A-%ii<KBxcew1l;sHb1cw'C:f>708i$#-t^/v5H0([$qFe4/pEugFis0I0t;wX0mD*MCK:G<AZ%AH@paSY2i29>IXb><@tB/SJsQG;B6oL=CUxZ4F#F<H3.+xbK69:41L)?;(jE'pB3.q/BYS-&a(q]Y$#Dd%-=Dr+Fi)J;HEhx`/56+W$?A.p#A49$#v*q##:9O^)GC7.&8ZaOTiu;fF,>7r16GwtAZ%PN@t'6P06JoiI7wUm8U,TpN+#T.5^&61#($?U7vTKU2L$e+QE=ZBCVE3KHE@d`G/&14HG3u*QAGqn3)V`mq0/ruJ[[&31qV8DEld,.CU%dFItP]SDopv05gG@ks*(]fH$'.-F*[i<6Yw<:%^Vk6Ij&Du3)UmR8PLqvFL#kY&<AB56^Yp*HaLA23IP1diGg&lEHEVPB8[vw#HpoG@t;eG$<eHA$#DGU(JI*,HbR]:7*RKK2mS6[/w?+_^nX1N-vLJg8TwuBE(h@Y#&Q2V,YS4g#$314QGP&&JXTxu/=KUb7sgsr/m`nd-Vbo^<*0K;;ja9L/m)cAD6]2QISa>JFL+@#2LJE;Bt7g#BSg,Y#>P%v$-k*@=,CI-&RAkp%^r21DM_aGM2^<,6asV?2hAccBSp]G%1vIL1Tj<g2K_R/2N$q1#b$$A6#w$1,)ox'21@W6##+&b=*I#wJ$&$tAwOYMB6dl%%=D^A8ZY3^c[E3@7Bg9kr,'MH6x%+t7)aSl3/^2w6`,gx1426R#%^lx),(k$;+uBHB6d=i8T,A`Hi.P[HZhEE00q+R(g1hkMGlhQC0_hCj(P3<mVJAC$;ho;'X^ZQ6wC/OGC;h%14M'5,*R;=F*b6^#)sXwD)Md<J40ZP[X8,21JYv/LW(nZHcX[EF8Gsa/92fr9nfu16^23QC:f>qDo:>I2MpLp0vxcu*:,A+6ZdJC/:BF/]PGg:6^sl,##U;>SB)o,14Lw)6c#I=)7Vxi(m(Cr(Uu,_QvmfoF0/s?.'SAt9#saIJm`s12T/'i#)wxgIXD/x8&wC4850+[#go_N2TRd,363m+50,G+4Fx]Zb2gtd2pnj,430,(92,D$JlmW1Jqj#j#%BB/###P2W.$GO2hvt8BR45L##_1Z$fcTK4+&@6##vLvR7o.U##5/:##1._(460f#ip?)3okX?-[ev=#9uFfCUfQ&HF77qJqgOj#B;V_KM2R7#$k)k#',*L)GCb+;+qvK#'2V^ND*B5Jr/612cXc@#$):pND'X'#>Qn[(s</78@1O;1A)(b6*Dp`FMDD,CTil:&5AFN4+_c'<`][+/?UV=DSC&0H;5EnF(8+(5D;+Msb&[GDo:)>-@w@nEmxsF2i#7B&+:Wr6,?EZ#+wiWX@u_v6[d%I5DtKI'mXBF#(SOg6t0LtEF0m@HWCV[T7J^*08D)g#'_TO2Q8qfA:bfu#$k:i)0J/r+%v_D4C0RU#$uBw'25'+2Lp(g;+rOgI9?Qt'2ILj#-7s40ia_V.3&G..(gOb.oha)W.Fxd#*LIY0Q^[E=FDg]5_dqE%.bI83.i37>A5@WC].nIA(Mg7MH1=K*)$a=%stcX03/tP/mjeN,>89B'2gva(;^<F)5Hrh.=k0W$^SaGHAt&1#lJXT6,E,R7_vZe@uF^L->l?R6?39B#%0/u##9S[)1JDm(n#>C42F(O&PaN1#'DY[X]9@dc=ixr'MeOv/U^MX##?.@%$(q;4D=f)aE=:SaE<kh'NYTUK8rb?6*L,q)N^cvDT+6GHEi=q,Tr)^:k>?p2L&)R7v;Q,,?wgC&mN[U#<+0&GHEEf$rr57,Zu]d/7omj%GkXB2MXii7v'W_4KNOiJ>YsI&57&=6cP+dB=tI4l&k:`9<^ikFKpp#B=rh4)@]7@1rwVEB>.gxFiWQ<Q>x=h/q/`G6_$fO#EB.K6]x[%4'ZAv$vBLfJ7flU,+M#S0n,O?%SXZI)LNj7(69cF(QTlG)Swf(#,ExZ-VPY7=`.SQBS$Q5H,4IBFiVun),Doi#(-E03IamC#$c>i#%2]N#,*HG6cP+7+blcdGG73qDnFdA-^8+I#6--)08i6u/t]'31xrm:1;/j`$(`.<2MkSu/91it)3AKp$31*2,(Td,#&GaRr+LsZ##-XP-Zk#.(MleXqf1aa3FQKB###u>$@)Yw6$wEl(4E/k$s$cZ/928*&PP)e)5^;r$1%evja-8s##HFH$0Dc>8PKJ'Vd3Yx&8t>5UJsCb2u[8Xif<b^Vd3jE'34=H9>2t84TZ%#ntZ].D$(2R#FZ1'<)=hlF%fsI6+L$C2j1+l#v<kR>DI)>'5Ti=+AD91HG3i$CPdm>6+L3IHG4O:.&h3i-FnA=/So`%qJ-=]1rx.VDn+7q##?@Q#-oE'3IY7w-<C3,$ZRxe'ifb[##R$W*JY,n#b>=iHGb=/F]4KZH&5uC4xpCtH*LouGb/8g5H-c96rm*:%a^)qK6701D3>'+X%X]]Bl0P7%oo1*A-N&c1qh^<CU&-0CVF]vEhx+bD(Ygr+]_>*CVY/9Gei+qBtDb(*DCFeCVkfwCPaR+$.B#cYZ2h2F<MkQI'I&(FiD(B#$cXh#@0W-##$+B-FIr(%p7kf&K;%-6+L*>*g4HM#%elHH+[i4FKmWd#?:c/),)3dC0_heB<VoM$-NN]k&d>$##1Yj#n_OTDogp(B>8,a#J=drF1YowEi<>:%omxA#$d99#w`Tb##,D-#@IO>ZrM7LYY5YRHs1#[#@gAx##-.BHb@;.HGOX:-;4`]#)lXU/xJpi7=e2&E1?qBBWk(qK68GC21@H4##-8gBQ*siDNu3I3,or&/>R^4#%i<v;cfHY.'4t,&watO2k#]PP@$#U1ScqnQ`ZeV186DCFIs,l#o[;E&tAvA6+hZoF*`9=Cce1rGe9EO1sExACUepjElk&D%U/r(A]MU#JP8[m<38p=##;h=#AP;a4A95'CW0g*C01JjDn4&nHF7V)3/fpw^icjB@=L:x@tCuc05:Jn?%F]f@tF``$[MiWs(wv]#>>EH'jn=w(8;IK)k24F(NgSV*Hdk921wvk##2,AB6oXHCrO3%DOUW6*`]8SB?@ik$+rNvAhR[dV.0R0#&AC$##77rFixcqg=?%DHF7f.H+7G4CUbw]:r1GWEFJq:-w[Oq`G;>tIP<3S-VP`wC1eOj-[f(U6c+je),+]9(RmbT#@ebn1s4-?##'#?#XT]>,>9pA6[T5E(W?`c#[@@5&lkwl/u8A>22*p&#>J-s1sLpfpMwjuK68cL-%@LM#x8+7#%)Y2#*_=GC2PP*#h='T<I/oFSlNXKC5GaBIq)ijIqjOehMO4=Gfca>0Wdl>0X/Av#.u+uDn=O*#[DHj#Yt2[Z+u;&G-lj)CPdxG##$4E#?:cPHFnh*+iSCk#K?f%B<Xl.$=7ck0k]It$>b7ghJ21SDn*aoGx[1g(JFrN$W%qK5-obN1fo*e2#SSU19NeHB8:QUDha7/6?*?K<gJQYBsxLO2iO0*WDubf/:I8f)2B,6*/,;707Gn(#')`f+]WW4a.os=Xxfx@),7VG#w71B<ag?PGd`EY+,9s5#H.[KHEpWMB8LK<8lgx'H,4*XB<bV?re:#])GFVfClldPF:TBrN`U/64%pc)85G8A-C]K&##;ed7a8a#>AbFH>B0kq#+ToQ08E_($;MOO$=b'B`,)lO?akp_#/V%R6_M5HE/tw*->2qmJZk4?Ge2/3CrOiR4FA_(A[6EB2iETR=ID4-195$2B=VTeHb77vG_huY1:`,AF00E(Do9SGEd2MDrFt6&DRF<]%oneC&1f$%7=YYM1/%em/lew;#Z_r/Y[`IhB=q9`13P$O3)&YTB>.q(B>.stDo0T-5uDSOBR4b3Cprar/92rs.#JL<$&p1x7=I[c5g,poFaV)^3.WvF5coWh:J>6ACVXZ*BB2Hc)cafa7>*@C#%/U'#&d`g*`[q&C4vYk7=n@R5cSF3K#hSo[Ymlu3.O&M2MF'@5>aTBBLs;?#ZCfRE32*P'+P4NJPe2J-;4xv=(;GL#'2s>l'I,0-sCFW&S<`9B3n8ve89s2#+@?23N6OrCqnd.9V+v63)%G6$alY>-wK,$#)%Ak2aVOV6rfuqB<rSq3.Lb-$t74K((he]._CKI%8@k[-ES`T-X/vB#GtYs6+h[S?;7cu#8go18[N'BED/s-A5DO3CUoB-Iv/NnB>fZ%F:A:Y5[tui-GD3r2L%'A0MM``1q(s5Do'Uu%qg6@pjk]K6x-iS=)K_EUKiJ`/;#R575G7&K#iG,$HN:K3eavL2^<$/PZA?_1fg.;J0$,M5_o-HH*8^(7`WgWGf=AvJR&7a'ihB?6(Xm^=.<Zb=KOdbX,/%&>)d%E.#1vJ#%(PU###PC=bXM?I^^^G5CGVt&PND-9MET5(;x?x-%1,M#>jNf)5=vS'wZlb&wDRT02)RTrG%8W,v(:A2T0IPo4Wkn#)l1]GesI2#[%.3L/B/9HDiQa),+VeBtDQk6d9_dC5Lxa2Qr8I;dt_`P>@7R12_UDGfYHj#YZ`NC%`OR>-H%Q(</CB##,2)=`x/5#&oo#fmj'-%`[2#1sEc>HOU:=2hR>s###YA-c)<_#0`/2CU%E:2hd$;LU:wDDpQ`:6WkDZHFnf23Lh(`##CCi#buq%3`TTL%SV+T%JKk2n9(LE7A_[/t/,w0=);?6VOeg-#aMw%@t$1'5^oN?),(US5+WD=0ikqaK6Ulw'QGwnCo#<h-w7)_6hu=r>MpTplGSI+8u8&Y7BfiV3DN&;(:T7%$.sL?CPdO51IMVc@Bk+)B67_;K<QvNDj$vs6*MvRHED(D6b^Kid:fBE##67D(3Ea')0jGk-AQ.*$#)R>$;j@_/9l`<9wI.63Jr@82MQ7R8T]CKB_J^$-a]v76Ehn$/%x2?$#bk=.oj6^6'Wl[6tbpW#('f,G>(8YB>feo$x*$9IQ:>hG.VtY>?jRn#v52Y$9]WC6+QYo$<nM'C9;Tj'ML9pC9U3;#?Lo2CgC^m#>FvU#Kq7REb`4o@t;AO@:_p.(2%(O;cjH_+DnL@$'7S^(kZ5&5aB'bJ%@k]*3Fbi$??-(A];JD#_.PF'j52*4A][S%Td`[6+IfJ$QpFS'MJvl##`Lv(W8Fp%Kd^9B9jTK>#9b-2n+eDdY*q8?$[*8g4H=e6NL&+0=(Xo0$-tq92Pb8-=_NV;fxP.-WUE=$=RCV#?Kuk%kipr.SLJ-[UTBY2,'?D%OuCmB4biAa`?SB&6muT$B$^w2x5nq-)&.Z4'G.;(&]/;(Ux^v'axJNa`6D==]pP/#>AR;%^9>KC8V)9-VOZc##F0W&**_xBi]ca##Bot8$4;lK8^f7K6wjJ=*p,,5ui;b.SKs/#*3YSJ^SR/$oF;APuV9v##,P14js,edrPObdrOdF,[l;[$=f&c%UCWj%#fs70nDVe#V?=>6bhL_;i&E%H3>IGF,AFV#%KJo1Jg4<FjuDf8%NET#],%&/v2ZlJv]mVp47s<&Ug&X-gPD[K#kmx07d7L(j:`;jF5+(6c$]Z#@0(])K9YO5(Lx66ZbaqBmYr]1O:q2'nTrn3`X_##13kJB?36A$b)l<C:IkK5@#]<)jfI@1q3?`#.4MnJs*<S#$bX#)GerJ(8Q]_4L&D8K2WV=dV+En(JS&F8Te,;1j--MFis/q/RjeH#$b7==f.e/<NRn>*bD1:#>SZ1#_68P,wMLDCDw@k19qr`Do9Z-DK,Z/08=RP3H?Ii3`U*i3`[YJ1:qxI-[eFs6)7th0qHb2F*3(W$PsfX:Ichu$s$dL%;f`M4E(?i-Z($+=&&d;#AfM(#x4<4(N1XN.80f`##Y/wL;x_t.)[<bJYQC^i,Ie/2T_Ax1k`m06VISpHrXSN&bV<`1<3uIHbw`3ms4$S-b.I0Cqeq%(//P%1;[J>HYH>lB1sD2l=e(SBBgJKC3Wd`,(*EqFjd)bK68bI#%Sh9XxV*+H1V)S$=O(,8?t]qeoPA2BShW=I'nW1*f>mSB:V4+1715PDo9K$I<]8psDVnZ:O$$/9t$(,5'xq,Bnqer%tVt*6[UGgB8K<<G-Q)'FiV`)FK^8+/6a+b1rIVQ7LKQ9.SOa306rEKK3fUa=E&;PB>A)21q_M/#_-2OK1mjZmXrHJBkjX-1qV/DF,u?W-wTUY,^$s'BUp/#DHq&I3*_a9#4,HY2hAK=6[_N3,>9<(BQbAmJC@;B1:7Bl(q09=.<pTB#%(Mc#&]Lr%SRP>*`[3F%87G7R%ti'#$v7W#%(8B#%(PC#$cpf#9Idt6]6xH?adJL3e>S`=GxgTBp0$6-@x$L,JQ'v5H.rC<.Ftq>-AtJ)8_T$#UT]#1:KfX-_S=h+m,<3Gfo9iCVXMF#@po%$sO^F)nHu_#v(o7@W)tp'if`A.:cfd*qv8<FiBd419aq4Z#Tm7'Q>V('ig=93D;^/1rRgC.8@ag(<F%L7^f=rBoTt,DM`o]/uMTt#M2097sgs77'r?n2j7sGr+Wvh09&-,19E_Q19Wk16,Ed/3juKkT6N?/6,Hj0=G^D1BR61R-^*2*#(AVI13Waf5c3=hB6vfU5utbN20^5:'jMrW>f)8q19Y#ub,aBl.(ODH12^i.JJVGR5Ce$p.%;Ej1E-c*4,RR6CD/^(BSfF/C5YHfC3e0r$YE7N2hIED>J+sK),V>V9RS@SBJawv.[qL+'QI?j8#IaIKH(87K2$&e,x7I4(M+2).V/Wh#$sGc(LA6q(LJ<i$^H4GCMX97c]VL<BX`_$-FIe:-=$kn-M@tc-;uOm-JB>R-<1^'-F@L$G-sIU+(QNn-PIW8EjjjkBX)U%Is%2g+)E<G,A`qS(j5OCB>5S0B<NHM-l%61Do[@=HED(wB=NUv?GC3pEGiei$p1R^cHrE($;]_3#'*@BY$M1#4&/Rf-d@Ig=b`pa0C2fL17ojgElH1SCp:qT1CO_umW+))+AN2G#;mgt3aH*mB:UZhH+v.n%SqfJ#Zhx5%Sn.?#+TcPF2;[J$Vi49$M=F*#>G?#&^8M.I'nLxF_c>Sic>pR6awl:#2B`n78k6'%=sWCG=DR9Jw>U+##Y-%)8<=_QGm#*BR4X;B>?B3-?t-p.olP`QF:7YHcX.98$c-Y2p.YMY)FNkF]-/+6A^=a33[VEFDaOr7p',u#%gpC#(:@#Bm*k;F0/rs##3TO(2fY,$,x2pY>cT6/ni<',$[s_*bDVI$3)Qw6[i.bBoq>g2rpKe<(n;X#bQZf1<(,6#/Mef@t'?G1J@g]@PTL16dON)9#vD'6*WSw,YS3D#^MGE>)<8'=^A4$2M*svM-hU/#)l9t4/pN3-@A$-(foo*&V9wen&)P,6bqd:)3f$T+1OU?-]G_3-Xg]g.[D6K163`c>(AMh@t)k>GB?I.Ju7;?9;s*N#Aol>F%ne05x(n>j/'l66[:EG7=68:19M_i?avW,*.&<p/?Swi#Ybrw?+N2J19li&2Jv<n>YcCeD;doX0p7^@8;V06>Z3%S->XoFD,?*r)msiD(4&/[(3bM1Di0kV0peg8#v*w3#TH^GX,(`B4F/^/6Ab*V]AglG-cOjX8pd9$j`8mHA[P=94KDv(FM`J2AZh0mq/W>lEX;cMQ@C698=0svO]vMG$veYMD-wF/##TM]#<bv74+&aJVG&]e4M25/3J0,K(/-L*C5FKF>-2>%GBjo%2MmC-92&?<D0A(k6A#jMo89/Z]4mxlDf)4*##R^l>Ba&Z06l9W#j[%6%Snkv*`Z^o#E(q'FNFPi(PeEC##8?C6G<M:3i-8)/92P12hw^H97h3a6]%.R-$_#a#?1_9#b?LO16*5WGBG*_14`QXPcSv5_fvYP0F`)w6#mt/6V]NA)chn)*Ln0>?X.S54a*@)/5B5o-?LGd,>CLa16*i.'nrQj6T-,o[S]3^098Mk?aup5qJVb=b]Dmj$rt&oQEsag1423NGHIZH4-*h&+]WH*qU1/.#>@(9$@a&52j(u(#/)M713uhFD5_q,1l@*H#(CtN@+56e:J;GM4dBE+10*UF7=R.T-;X^/3Ijs*#0xL+BRMR_06ND+$vvSXOxv)6.SLCx#-.t#2MbN2_j0;L$;`tN?%+fs@t;3a)p4eD4c5&7$'>;7$>F<($?%d1k]5al#'MG[VG%&A$X(]W#+cwi7?gt;gMMsa$`B/;@t'xY7osfcFc)9,@t'jZ####1?sA:S-]Pe.#AdGrs.5KOLJhIdCUx%g.pHk]%-@PY8%ag]`2U.v6_SRD2oj_da+gnYNMZ^`:fY&N'%R.h1TLU)$I2&kK#W2i=*<,$-%tmV&WfQ87<E$_$-aK[F`<u+89fij##(rI2ija^]YT;u'4*[6#CS%UJ;=82X@s]a##,J/%Z174.%:jQ#;vWvDGqYw-wIx16'akJ;,BZA3.5)r$WN3l<3[t?4K]h$eoBnJG>KErGsv78^iDwu3f_ko89Fv]2h#G'35&bdicJ+)K#iN80FIxj(lYRf#QmP^j(OIv0MaQk#:0Rl1'ff78LG@.->nn.+*a6C9=p/f28TQ%@8.Yvm:rQ=#%KMS#[K0j3,CO:NDjZ(/:KRGUfi-J#@12Z$B-<_3.)HE;JgTg/:@Y*-c;e#6d:HJD4P7)8ZbQo%9SEk#:`0,-Vtk?6<cF6#BMVRIo_Z7Io_&@6s/>c#[%.<1JKsl3Ij]d&9S#X=)pXI4=1&M0DcwC;lHXR[p4Ko6kEbN8TeTvBM<DL(6&<##Nd)b3.P:i0jB3T4QvvY02b*Z5Ooop:5Jua3f0)t0to#g%XS2U.'7O165Ku*2j)4^1r@]*B>g@c(7`r*#1F3-7w<qg4e,l_Ct)jr2kk]u7<F;k20Up@$rq[K#$X9#$+4H#6^NU[Y>&&FGfvLi?r`+O#YlrkB;v*U#E:']2hh0d-[e]##]5@*#%9kl#vsN_#/:.O%9<RR#Yg2@ArD`G19N70'5gt[A6U.6'jY@.4EW*-P=wX]K$+-x9QWUT5<p9R.$P9rVf-LW9Mcu;5Y]ts%ah8`6Yx7I#vd;B.EHp#$;NF2#/1(@GYom&#.QLM5,gvaolL(K%SwD'#Av5^6VRWM'Mf%##Zr(6f4^m7EDn4$)Mw3WAW&:-BoqE)##(l@%Xf>*.u&eW9#m@7H;?6;Cqf/q6c,9o,fR_(Dp=g^7F`pf5sfrk7;dubJ8RE5$ZqeI(JP5<22loM4bb8j#+,CZCVFm4$XGI5CPf@o-@[iY$tnG53D;>D#[we]5(bVS%4Np5Sni`C#(A=h4D+YpFj8@<B<s.S2cY-Q*)$tTdt$L.#ct89@v3?k##&3u#ZFER3/&;T#&Q2]:9sZ832ow?/92rq1khL76<4.a2H7i&#oTX;)GC2A#>`b@(49;'#$F056Z2t>;VE/7Bt_ULC:.LsAmK@G#>5,55V>$90:2b02j0^D.SN:GH$)2g+ANSb':BiF.'Y)BIwqtRl'[j#jHUNN3g6:T/8ZgIlCF8:JT)db@>nh9194Y,-VX#](lMvs<eo>a@?4<0#N@:?saV:r0?55O2JlUi<cN&k7q?SOr,x?Ar-$4REffeV'puN,6,AiH#kVJ*HcUr56=(D(&PSFFDSB]u6,cx5P&LH'#+^8KH&6%J'2>K>$k708I<piQd?j.6JuFKq0MXE0&>:S2-[[w];I(^]$XZ`E:/6@d-HLTW'jcpN3-?QveSE)Z=,E#G##-kV+1W%h-$WQs#2(>R/t]YZ06hj-#@wn=bi];r#)P$x=9AP]2j(?OCJrQu#Mh)03rjYj3Fb:;hfNT^A#W].@v#?16VJi13.3NB/5-+)#DFqs3H>+YCUx&+#$k3<#$k6=#)+km5&hR;BjGkaEl`U%3.k](#bl[A3J&Y`$2X_1U.d/V-rllL4Am/j/PH4O+%x(e-x4+&#%')n#$*-U$0iM;3J#(O.>9dj##?OK$(1gvZ]^h4AY*(2$VW+23d=x6Hg4t07SEj1#$t07#%rC_:g#,=.*-h6#D4bi7#D2;7;XdDcAI<(&PPZ%ItE/b0tjBqpm&jV:5<MLB6ob5GfZJ9/m`nXV-X9P#>X'q(5He3#1NdlDcDaqc$5%C%TJ3m-FH]@(L9:'%>ZbJ5]U4FB<VGR.C;7Z&q5Xh>YZgJ=iH>&Eh-R:6^#KE2ik.n#$:lO3//`m#8T7.>[J5'pj<As1IrLL::rek7Je(%5hKF66<54j4OOY<Edv]_EWdNFEe0n:3)^g^^j5/c(JwV9)RhJt22t1*#w]e/6&%%U6culC6#Jk,S]eeNCprKm#@0E@'23]%#hE[%7v;r'#hf';5%FXuC0;:k*`]o]4Fqf_6taE*#$kNGF&8?W3g.X;U2rZJ8)lPx6_0[F1rGGaC:HEsK#hL7#?g$%)6PjO-_6_%HrbE[#2'^+=^vWCC55pXD2fh.JlZ:C5BC8FDKvDP$;MIB2RwcUD0[5*+xs#B2,l*3#$`]G##?>d+]Vm`/w2Th(Oh_;-[nd`$%=Un3a?#aO&-CF-Y3l;LU.W0*G#8J'MPC0-Gt'W.#`Gx/weHW#O?#+),(_%),(%9%SlKi#%@RK3+;lm92lt-D+ueL+Fc/1(l3<)2i52CG[*Ua;lG8U#$b06#$k'X&70VJJPFZx'C7MYmrIe.3DZ/Oi6SWQ1;umjCV=m*H,(ir(9Pq.#LNTjHj6-3_5Rm`Ek9a$-E]wm+)v_a.81`GW)Jl6C5F.dB=Md*=MFrt.W&U]^v2%D/G46lU52'h6Z.;p@W+?@p6?uRHAQ0e.**Ub1/At-=r1OS5s_949T3uPFLt,t)Ibkr5an]@G_:31*QT($4KWM8+%wQ+3fe^E/R0lg**)[]#2:#WC5?Ke+&$C_)nK-g(O,])$6rHDF4M[U6UPqF6+OP/2R?W./?F`U2it2K6^#_T1JNnE)oNc)#'9jP`N5ST$W/]$H#Bps-G+>i)K@Qx28L^mJqxMU7*H$F?;)N%0LJasEHQX8##<C_#S@PM_MX6)'QIp@'ig'i##=Mw%/Bq3TiIa&-wKSC#?u]A03sx..T)+L#vqv*2q$K&Bpb9L;,I=.:I,x9<)sw6;UHIwBcuZ&E8`eRDg-S4:aqaqG#SHY@0[diG#SHFCJdeD171F41n2=T&5?]^(q.)k-AarL4-1YOB6sOY$n.dC5>287J5;3RJwH`RD2ThSGJXC:-X:+iMG-0<$t&%<06ip,#aE>J1C]xD(3m3s20Ctm###Ss?r`'C#$k90#(U1760BLwP^$q*MG:af#*D8[K?Ol;##>;w##5vb%<3Y&<+mv2d>Nl?@S[M<'Svk%JP6-Q##25M#fU:D(JG(K##a?B(9N=U'qAW%$gn#2C8jP1X]T&PJ60Eg#orVnYuP]/##Ys,##2J_(%iQ1#FYXSD6]4]8Q^;(#1o=)19NeJ-x`V+rf9Mw5,iiBCrknoPg4gV@O,cs%aSNwN,:/)H<UKm$1MPZ/92sF-vD,`<o%,>$;Wr>*O7WV<QQg)Bg7>D(8m4l.*$cMGYdqq#2TGg(/-KTJ%?:t8:<XgC1.*TWD4%QE-Vu;1//FqR8>Bc08BOQ=cdvc2mxOZ6@0GwTM-Va5av+s6ajn`%,jRCK23-$h.W'tPZ%[E-X_am<G5p_M0t$Q/nb0HEF+96EJxtKj,^[QkHUl%1@@c?P'7(wL14`aL6#ovCPb*G#JP)iB81dc19kT1Bu>LBEHm'q?t[Vb,aZGkCp8CZ4/lBX=A^.;#aL=L6bF1,'t[hF6^5jHE(h93Hrk3:9tH.&2o&dnLfJSvH:xnbPIUg^#%(u=#>[[<'ssae#5NRZ?I/n[784E/784?-K9-7n#@(]o#E14G6aqd%<fc%LCp=1>*N@`D$Gvkd8%/S.5#)3.##_vC('kuF#W)R-EU*U8$Rv0](gr+@#$m$n#Cx=hEU*U/SBV-W$%?KpETeF?1>W%LEKqQ/851DL0C/[G2d'Kn7:SJw#$Xv0%p6Mc$kH^W6*UH@)6e[V)nI=d#Z)x1Cp:hQ#Yp)e$R5XW*)$CI0itU_#_?Dg1HZ](EJI1m%R(/9B4Ze(SBLwA%p*eA/9skN4&->l#7u0uBZ7&W#$ljQ-YtsbtkU)71OV<B;cn^[K5Ead7tGZZ%B9^8%8RxW-Ad8ALJ3>+)n)`;$jis#G`heOCPt_k5Zx.q+A<B6:fw4u6Esc1I>2e0/5/BgK68c*H<l,BH@KD3D'p=r6bD-m1;6jC-$2]8#x@?^.?.m)I<`s%2R+hLc.T6YCt.jc6[VOQI>;U(FGD<[DUJ]pPY@n^#9%s'+]W)dBlIES-*fIo%QlmK6b8c>365ax6x?j)6Zdtl2i<ED6@bHt7#EbSDM^eT/:T+76@tU#19Ok)0n=bH7Y3ID6gV6R(JGwh03xWuChI*[DP%,PBd87+[_?0C#>Fh()RQr[2L[NFluN=b2Ue6f5(5Y^C3=n<6[_jW)n*JT5(w:-*`]lM/A#GY+5AT04b:J'Fh*>1DQwE-4/kQiApCP)3.tK3BQ$`b@=B^B#ed>&@tADd3e3<g:fruB:fs4M/?*2gRo`Fh2hwaABSU&N6[_`QKMaoT2t10WBbA[)CPdGVg;a;4/:BD,/q(O03-Pn:B8Sn3/:p[S#>>o:)LWB)(kw0'-[e[h#$t**##>r:)iPf-4+9&Ka(U:L#&IVXqhHwQCNk6Afl@3OBR_&OK>^CfSrqEwDKnqub,FES1qUs8G5k=L19pTv'N06he<YjXKO$=H#>mV49m`S<7$r#V5_P/303p)uOCg&V0po&O3jP_2$on09,[1GJ##)R?*3Gqj/#Z_Z'6#UP3L(/k>@V^vHGk[?G-.%W%q^0e6Z+AW$7%E:1/&$m##w9Z$$ob=/PH;36W>13/[TVp#'4J'85'+='2x#S)0+dx)j*?b%VPjk19b/v._M>r$=m<qO'QEp.Skg9@Xh;&6bD$'#=1uS6`PqDl?/IN8(.I?>>1lu#8s/L3fKIt#&Y)tCxet[7C)*--F56k/Q7os+Eog/,DYAb$Y4jpuuP;a6=4>J6;3GN7Y=w2DbOiGBV-8TZ:uU?6;/ub(4@^:'(5k3.oiwb4c6F5$1x=1/5.OP3,xxUDSSuM#xPjC##U.](t,HU^X0oTD0ILc-wn/)Ds3hs06/CY#(h9MDJ&w)06f@=#+,X/rFr$@#>Dn@(&W;[#(MSLCcThSEe3W,?AU)M6b=h^2LeNmhmWMs*)$q$X.hd)F$Bf6D8fd[0nugFJ6,$?-xtI,,$6F#2ME^;f6<KK;4.h>#4<ke@Adck<0&DZ>[//^E,T*7A#UZ'KM2B*3I#G%;/_-5aFK`#,urn-15%*AEb&NY5.>E634Z?1/94o*/:p`0Jp(mw-@[eW#w]].#*U6X6bXur$KVEfCm9_S/941l/w7db-x5H4$%FChCLeWRJp27:Y0%@(Mmn4B$[-39m.#qJ$tnMV$x)X;K,=d.C]b603`TUV4*<*;44^=(-rkdT4EW4&6]V^)2h@6BRGhN]06LfeNd?5U6wBg)/=;K%c=k%:4hvfF##I%j/96uY%<``ap1UHrBR0fsIDmDYCPQfw1fiPHDM_*5Cu`Wje=)3^&wQABEJ]1mc0'iF:Mj7P8n;uM'^/rB##2kh=J9HMHA&d&##d]'H,3v+&90+WSU1q;e[Xq,K=X4`7<om<2TGptKiP$@s`@?`3e,+m4*<X46F&]*EJ]Lr#O?Sg0n,(-4*Ybc##?>i*D?Q]8Rib+-(PjU$#DJ]7ER='1O0=28A-@#G?+_6IW?ea&55E^/94*h#;^5-/=fAJ17^r_5(P28$;BBt0ug#jIW[0306i'9C+9L,=4seG(JH?;4C%s.5$S(l'2/C6FDNA?Hg>_Z,Y_P=@=DNZ%IJPX@=;FI6A0b$(Ufx46]HuACSt(6#%'62##,KH-^'hq#C_0L2PL6+J[[fW@DbUL?d57L7#EhG#-<'9GBYh&9N7eJ6]wuS6+of8IWGKpep+&R6d1Fu6,PhU6$7&C##@Zl#Mc2s6^#G8Of,F:BnD+L#$v[d#(/Ow5%%atEH3eqED.+qBn4QN3fr4d#/G)a=*H1(K7o`i6X,8HEfxF]F,hF)BSh/LEt[`-3a-&^$te?<$?Kk3aoM<NP26Pd&W],a19S1C#8MirgUE'F)hm+]BtJ+M_g:s#030kC7<B8oB<WoQ?EYco-rmr'2LRTD*DA/G3.N5W#87jRBQm2?13*Ar/wQb`2fWS6D@?j/19N.p*Dx4g(UOKP(4M<V-w0%*&Y:`9JplZs&3)SwDK7Xq14iBB4cY&GJlRib3Z3v`$l#.)Z*cbCC?7Qn5d0@K0soNA2Q7)R*e*P4(Um;+8@'l`1COhvFAO^J8trAQ#6[.n>YG_JXCNQ74m`K*WDXDHu[.I<PYV7$#CiDDBEB5j08gt<LUx.gcxesuuC-IF-;99*/9lZ_Mhgm&JXmeH(<ddp%p,2jLoncB:;Cup=JQeBRH5R.2&%&MGeV(t;nhJW>/cHrW7MMw##'2W-F>D/N/V2ZJ%t0h$2udMRTTY9(JIc2#B0ZX=a=@IEb'*m_4K5-HcV,E,upH+G<Jgp>-W=u<FZ$s8</)K3..-+2LeE@uvLkb%p@V>#BKq9CPdPiu'j&(;l/;N35-iu=_t83Fi'P@2n+_B+/^n=DG3=$;k^ZCJU`6dCIfMBD&aR^tC)0&#>i*u-w9u$2-kp#>h4[E9q&D&19F^AB=';9CUx'u$W*U*34UKh78,JW0?Jt9#(K*i1;bC+(4UAQB#?-N9QYLT,&B#t17]gk&P[=S':gM:*)$L(&Pjq@0XPrI##b'F/%eta#[6G,#-IvA?qU/r4N(9.?VW;*/AhK%+d2od#xK?7P?7r%>v7V?@'2#>19nB_.<p<O#('q6#3d,PCNV23#.Gf/14;9ubPw<N*I_/<C@`I4UJF=F6d*>APAYg6P2-+I#[6/..<p?*(/1vG$t<UZCNsHV#x+<k1:J*7*l)v##9t@hDIO*5DMMof3,Dh9T$7=J$sx<N7^xuh0m$e40tOsx/$jO@$vBhJ(fcNs4A7HJ@BU#A(9aGH#nH#k85'W2l?Ln$6bSA%4xm*V#$XMx&H?1*EJJ(lDMM]gC+U$$K3AUD#&m-132Q^`)jvVm6*K0L)72Wj(9JG+9nCmKBUOTjDV>)*1/SRAGDU>+##)L234E,8QrS()&EtiB,$P%d#)u.P@Dawf(TFN?(;6JH(;6iR(;hJ`(;n7XI'>dW6*<Avo=)2c6*^.i#C^3U/s^qr#v/hs1m#XjUJ@WJ%whCF/97N3--7gD#YZc2&2Q]6BQ>H(:1#aU=_,KA#J4EWFiVtF5>22v2MD.9H+neTBEJvgCPcYsiFo,s#(JC[B?6?Aahe-l###m*'o63q#SnPI@E&<%##g;@&xC8D1FsTDD+l@SD12pI6dWd_Gf%o3pS$,,DL-?HJWN_?6*3;nn9i-T1h9sf_/>08#$d'f$s0Dv2N)$s'MMAh/xO3^+A<si@>Q1CC0CeGXd3FG%W-*O1fnhODKRxT/95<RDKRD[1:'3[5a6=_+xtcWDL.hV$2l6C>>lSm#/>2oH+Ro>CMvYBCUx#xJ'1hp6bAfh1q/atH]<5X$FPx3/o71N7ob:8;,v/E%:U9)K6?al-(o[b%TH>C/VwxvPIa<]6*WSiVW/B*VW0DH6bNSm#+Pw+iHN:%FLv(d%8dxx:PN;0D'`j=5)*Vk7;QRhBB<KTCO%MaoQvNR6amc[5)ClLU.cVE)jHlp0CStFB9F[Z@BNp*#+]N$F0R1D)3faxBSV*(#4]G,Cm;s6CpMhK2oUQQDeX<rrIK`rND?dg(ncJ2GaXK+6,m'F'YcvL:kfOG8b6U%=h;xcB=M[*CVD@#]Vj/n/uF87(:)4m(:kZQ#^3(9s)*Rw9MFa:)h0?JR#O7e6&ex&6&kDv#,mTi@>vet)o4O)7WKj'.D[Er-vD+d#'23='ifXd4a,=p1R+Yv@s4BT06MWg6kbQT/98x>(s8B6Vn/J$0mAUl0v5pA@w1MmEI)8@#1<KhDGsK0Gvd,@BR2nj$v#^W2(r+A06IP:$g2vKDPo]sCj3OF##wSQ#xX*L5>4>d6Zcwv%qalW*bV'>##6LK#qul+7;XaCEE3bikm.DC4WOWoHZCIL9:?$[##%Bh(TX=N=,D(NJp4`^7W(AUHk118/:^-P40)SD85(On5%blE4c4SV:lCQd3NW;(D/rOq/94C9#?uuI#Y_qr/q(T-93c,X(T`,&A]:C%%SQmvGxJM0RpGJQ<HMa;>DN8t8$vs]Hq1Y=rs8?MPY;*B$=4pg##1ug#jv%kZ.Kg72e?mO##,-J#Z?ek#,b+q6X9[v=nH4.'RO>U,YS2d6*JR=07Z3O#(q-o@w$o>GA$u^(8CJ+$4e5DaD.#h<OksW1rwh3)5+jt-?O%95@8Eg%r9PX&&qf]06^.*G@EIV6@7wV$U+Pq=xg_TNNOOk4kwm6/T)rh*`[<4V62.s-uE=-2i)ZJ'uFp[9QVxN2WQk%/?Ne35vk_cYjIO60#;Aq<hP>I@=o:4#L<a`%pma+6+pFvUJV+R?tnx8@%9WODPq%$NIkWO91pDX16=Yk3DU9BhZF6;6b%siJ;IdV#@K/v&R9XU#$9D_)6ZS8-H7RK2M#A)C+0L,JA)Fw$;Vrt6kar*.&fiH0q2[JMk5_?16<t:KBE;UHZ9%6.#0@I4eR`GsD*H%#>OPk3,U:Dlv`>F;2J;)Hq7[O;/RP.-_R>L7sgs.;-c8L$Vi>2I`nOe1;*[018l1_APGG5B8Ii]8lfYX<e8,@H^)mI*JX;r%b+mhC(W(5A`S^)8@<?LXiZE`6XKi>06j_d#]$#%/nxrE#@8l]U4POq;,(Gh6^al?E,.S_06h)n#5KBd0L,YTJk'3X69YEh6*qW/5x,%cH^.Q#$Nvp*%8JX./8gg<'ki$+&^lJp-Vg3,B6RkN;2](T&w4Qe-^ja,R-4`7-x4S8K%ZdY-^(8J)d%+?&7Y_14*<d>APOr6GHFt?#-XPS1j=h[##,'p#bueRJ9<DR#$bR(;fCJ$$>V?t$;F'A/A*BN#&d'=(K:wv>`bgZ:w'vMYvBSI3-@gECp9S.19u,R1+cGQ:m0(D##>:/$%-m_FEnlFC99+hLJ<f5-w0V<*,[=@r+aQ[Cp%2:6sPxdG/_%^EHG^F;0=FN#ZHPY&@2Xc1LU8mNE$<bO]Vdh13eI0W(e2r=Ktw)6*]I6#9u4iCT/l3Bb[I<N`TX5#>Epr/<VDx#%/nm-Y$Vo%Sacn$4fPF1:04h'Q#D7F%dTR7]FXcDMN-s/uQqHEMn`O#].bK#YtNq&fG+Lh4pu4#[VLH#v$+s#8e]M[C$hl2,=4C##iV<Ia<r_6+pG(uXxus%xS$4GDCL.'t;MaJ>l)I<DPd87'H6+@u6Lc6b)>w#(djh6b/)S08FqY/;]>?0N%iq&/uV=HcO<DqunhKK#mPI3lRVB)-]5=3Rf(:dV,4/5>2(M(/4LG,e6vd#&+*b-wt3])R%<b=M-/B14D0=9WMB^3u]T%-rm@Q1;*Eh#>TlSbxNM(bxPIAK?7T5$#<x]#v)ia/o4mccwC`E)dD5m.$J0P.VaHSXx[sv'fH;#D/M@OD5^OWBSh4w#@(kK927$T+E]jG$k$sUCBI:G4cOVUedqs>,>=q8(3naE-*d$1##^oc(Ukgh0=*0[#'=(cb^&<h5C7F`(Kr$7/w6cAdXpCoCPb0O'45<t)OMu(/?saW#:q6u3*Qd'+A;t$$#s1^BlAaO2gpwI<Fw)5An,:K##0iq1mEdq+`P5S*)Y*s%#];%2-L'p#@(6r$AV$lC-&J:BJ'Bk8BrI&$;=g3%U8wCM,k_&*EtRh##-R]0Qi%ILg>e+%YuU21GkYt/ldCw0n@5C$nTc'##?>Q.TZbZVc@Sw#Z%-u%j%mmEHEX5#K?bp19g2I(qeki-[x0d#&d>`HWqWG>?4n2#4aO59iZndBAjp$L//Z$@;x3L1:c-j#F,;3:V(&UHb%(O#(7sNF4%'nJR&=[##,Nv%Iu:606/DaRSF'4Gj/X2BmxdqB67xW#Z0L]#6o+WG_+%.$&laf02G-(D00gx$=%Fb+^K(X$:8N?b]2hX<`Nn)%5]')Ebg#R%owV^GC(e*Csn6=F*4VD(V-[,$-WmpA'?WjCp;;u#atDZ6c](d#jd/>G`oS6$heu@Do04c#/_GP7CO]]@DQw*20Ct*###2E#$b8,3i19+GfdZ8AXR+^G_-&i08FAq(Kilb#f:.GCJ6ILG`ZZ12jVXo4xv$_**dIQ)GL^F*-=lZ$a3sZ08EJ0#mcdHBq:'f6_ewb2d0tI#A.S$##+bM$)MECcAIQ1#Yaa`+L2ik#rQWmepmi^#@iBM#v/3N)SpHa#NoBZ,]'gk6EaJg?W:F)6cvwDA2vJ^5&nK.=^ZZ4pNVVH&T&s=ZAos*(/w+p'g$>43D:(;11j)[0A->0eTHS3#$jgV%;%eb&T&vIm'2x+mW6*<6cMfqF,)H88pd9u%:X;r%9v=?%8DU^&+'@(-rkYg#$^cc#%(wFDdCumMKEgj6,m.5B2B@r0#j<X#2U6w7Bo8lHcO<]J9W&?=,(/819dCS.E3mI4][SP#3KpP3.-lJ2hnZGpuE`VC31q;2e_DiY$Ea2F]EQS)PBT/4jD3W>%&j#5xL%4Dx2loH1<Lm%^'>I5vIg1B2SiB2QfKpT4]=4@9Wi>$@l4Q0(#ag6(gs:#&lAuG-`0Q/5-Di##Z+<':Sv0LfJ:u+]X`4%FQY;`I4U>CBYcabEo-i#Z7:,$u0->*DQuP#v*Nq(9he'&LI_-CF0?m%<;JY-;5#(#v(D:7=9@#Ekm$v6b3S019G'k*)Fcb2n5<T][b-#Gn4:RT&'Uf@=9W;0v#LNCTVZnDo9s7B<Wnj%TG#a7Cw^g1f]0j1O9&%/w-_b07Eo9@?cY_@v36M$d)hW:fV8./r#q8B7%Oj7Z1m837%YO5_<Z>3HQk.BM:tP2h$Sm##)Fn((hOWgQJ[%1lRK?4+p)r1OTU6+*H7?'pj9*#K?bQ92$(S92$4^O%_([##PI/%p5&e$I8v^n7^Bk6[o0$2KhL#bH05V1l@EC?VH$(B6f-B0t3T=##*7e21?w(##/6SD07@gN(eTmHai(s(/50Ii+]B;#$`+2#A7L9#&J;*G`mtI#$2;'#__U;7ot;(/matp217'708KUO1VEeFDo9qm'k5T^'oH?r'#+EZmrC3xDo9Ni##cb?Nb-$8#>FB7%ao^c6VId:-F2.]$&JXkI7wGOI`9Ta##PEh3H&Al7ofHUFj,Ve14:jw#v)7BI<eH&2LR'kND'l]##u]H_o+xiClb[,#(oCW1SXsY1OUt1BJKXhBtivqc=s7Mb0Q>85#)+b#w(rK'T2t()chC$##i$s&d2[0Firu/?rhm##H_+H21@0?4,Z%R4+^5K0cbc]5dn/-*`]B*0Q]7;#,;9Y2hR?$##%^s##cM,0MF-U4*Ub04bp#B1JAwV3I:b<.SL`A.oi.M3dc:0[SRAM#)$H?F&2n[1d,4B/r#=b141Xh06`:Z4BukvFCSq^K3Vno/nLm^%88h3*3O)d-E^RJB9>'5@un*W#9b:UmstL2##huQ/?W8k,AUj22da>$BQx$[%:Wx@%C9Q22g1_lU5'N$U5'>rrKa.:4,7I8Ce&PNBuqpVG%r4%4]a'j&.57PCOInA5Qio>pkAJhI00SA#'3es1[vjQ15>kl06hu+]nB#]XD)8G]lcbv#*hTW0K9MF6frsI#&Il*:nD,Ja`;'x#S0F/t]&`j),V8U(9kHF290C:_.g`t0%[%;DZCJTJbts#0JP&)7CRIB#[T$#2^u`D3JA]^#KjvX.80`d##%dr.>9L1#$lj^:fWn)/U1rUYAH:Z-#u/e6@VeW1O1Bd(qbt6-bZ%=_Vka=C3X6@0BteDCjr9:1JHf;3g.I&l[OTw_g+$=Fcrh(C3M3+1JARV6t^q9?@HF>DN#WHPZ8)k3`p$Q(U<=<*3`ri=0tE2-vipkE-,dI0nI6A#Hian1OrH>/I3Pb6va32DgeL^D05j-0nuQU(UGVr#%%C9=%n(^2KjVcDF64[6F&ii0m)oVn=?Iq1'.Nh08<v'1O[Q,G)Kkb-vhGr.oinO-wMOm(3M6522PnCGYAbd<)3M(&T)$ES7Mrm@ohT?#Texm,/P#9ND1OQ1?_s[6^jfW$$88G`TX191/V@h,[_ga$(N,b-F]$^>_opW5wOCr%.l7I(/+bSY$c_P##>rF.vAOt##<q`-^)Me/WF>hB=JR[%.$Ji,[UOdUf[bv&,-dFKj`9f6b&&Tm:j+MmrJ2.gNE1+@C0<sDn2Hd)pk4e(:5-F'+2-eEMEMRB>4wo3*6>g+R'$N#[CB'3b=8/WDA/]#uc2$dV=Ob#&,g7##Deh#R`Pf6^(lM)GC5lK2+@/$GwH[DjPWhn>EC+03S@>C3<iM6WHQl%&3v1<.+q?N,2LG<D@IgBmvJL@=<q<#6>'8KYp[^08>A3(9gsF#C$5qC3W:Z&6/eKIC<X92j5mu$rUVN2Q=+w$3MGWX,@8Y0N'',%4t)8Y>#YCk&$B#SXL;,idKpY'o]?'3*[8;04ma>BZPS66s#YO0>M8FFj1uQ3f(G#=]U-+D`N]J&7H6d#@V.k6]wtR5Z[t7.#)5vC5G+C3-$3j-rl8#-rlS,-rl5=*)%<;)c_<g#%q&Q#$kE3#%q,<##6_Q)j?1M$*AVs5p9TNK<;[i<jx$414QK5AZeVO36?u]%U3UN%p$V>2JtkmKl+$2Jp5uf%onM;#B1q$6_7Xe7QW-B5e5XfDMPAv%:V4$#-B5&.#T:9'C8#8/8eL[#';Z1bxNA799BhN_l2[0U/C,X%d.1p2G=EQLg)<##mY*V19OaN(3h&>&(riK19cuY=D^eX4Fk,2##$CQMw^UdabWCj#$F>u.<R`T%=D[:K#x=*:OXO`BFf[$3Ia&Q)1Vsr(4ea77BoxiCJ5Uw6*Lv**3Pv>(5I<I(qAGr>Hh?)6d*LR-@IHL%XqHv4`4V.BC*H@T*?FN7S((#X]^'t)GPO'%>]fM/wBgH)L/$V.*-eH##heo=KO$)7C24uJ9<pd6b%s'rvw6%0icud(kHi>#Cw:f7%t_ZIoqPX.XbB$%sPhD%rw>S/lq8GBQYo/FA6IQ#($xfA5*WM6;/N75d4WgKOvmnBe>aD)p<Iu#MhJ;.&XCVNDULYJ//.R$s-%q%jT2$DXT9M-[eP^:87ja[S2u`(R*+O#-9.fEh<lZ2M[HD7Bflf0aM2jBrmYd9qMxi5A)[o@CUN>$ogD3Db,egCao(FD??/05>3fa4FN:x(l3l@#$Lx;BM8ul@LXKB3,or64Eve207:$8#-9D%7CaD,(m%Bp3eb)Wkj.Mu##)]f(qe1n#Sh:4BmuvAkp7#^6_-lA(2^4<-xF0a#$t&o#$k/s#&QA]%87Cs.81oG50hK>KMWB.HWD9503us*9s1<a&H<s,ENpkhEDNjS0#epx_K(N[]mLqt#ehtTFGKq)]e]l0#%)aw#wrZp$(Z*iHAQ[5##@UB-Abmk#>FDf'Zh>[7YX.YJwN9v'Rt`^D1DXlUWEO^>&7^$foY?'#$X>s%:L_6#YZD$-EfvLSQe_M%W+:ea`@Plb];xG3.1qQ##N*T*PM;Y=a#RH7):q12oU^hgM2GtLr[ipH[.?2G9?u0I#2kNG,[$a%D=plI)q]`-WL0v0?8(?G'PhO6Z,/:0jo?k6$E<U0o%AT.;hYn#$jh:##/<*4*N30.81(q#'Dx[,>8/I##/<*)8]+e)k]'=Bn=sYIt=A6a-c10GHIahIWPgv$5C6`;J]+b6,qmI2T7j&<GW4o#F4tj.#:$R6YxvQ6[(,826)&T/93u>.*;huIsw2nJX-RZIwLAP7x)io5ad=^&1Ik2<Ltx10Z]W^#&Qm5*D@E>*)$w;*)%9;*D@*C1JAbR*)$Ei#%q&R#&Qg0*D@H>8l_J3:6GTh9iZ8&+%wW@P=v[]gi<@;gi<'Lh.XT]Jp7j&G)xm80#^9l:JDww9&K`n9UZ$B3/U2(#ckcB;28Z%^<Ofl2MX`f1JALTY>gSe@?FjM-wMUw(O;pg#n16E96DEd-wex36AR7[6[Co$#=KSw1m4DP6w`%b1j5C3-^'wB0nYF-0R>C.A9pSQ1su'#7=$xNKZGev/:&NI.#^[x@?GvQ#6mBn0?6`P3f=]d#rfQ(9SlMZ$XFt;#*qe4@v$[[<JN#x0T5w>??fro0nGgb(q>s7'`<N+Bp.+%&8XGAiGYDR8p>EXu#-,*.TekI;25Wf1gFBi#&mZIP#Y>N14:[GP#Xj(1Qe+3#@gL7#Am&NI8'kj#@/j3%r6sS##36M$)IW,2,,EM0NxN]H>v3&16F1><-phG6;.s922D6=-)t(2#Z4<6&<Qt816DQD9M@+*6I,XH22FBO##Hu?7#CuZ22XSc##Hv*/;bFB-#v.P$Z:?>MH17T#$)it6reZ-66QAC-$Pf^#Z(D($(1dxOA$bOO%_.21XvJ1C<9rOI<9KW'kkZ`'kbTHb,4;XKAw8YGgC8#?f#bRep7I1F^]WI*nad4/w6[kB6nOuB>d@66<4)52jA;P#I&AU0Z%ed3-JcrBSnb4.<6cb#+R3U1oZX+&A0Wu2h6[`1LL5+06Ud[>f+:l5^hIk.ogvM4A6Pq89SHsBBe*:>YG08#$c)Y#&I4tYv_u-8]S-DB>e$I2,tX'5_aY<%gQH6rxq'mDeb3/L1([PW4N.oG$eDlFbQa6Bg;rp1;+t-1LL2e/le21/le%c/ldua/ldi]/ld86I8JD7$vd2b9Q0vO9biPQIuSJO>RWT%U0J58McP&.VG.(SI?%q^G`^+V#&Xka?EGjuH'n1*#CUZ#,iETc%9O1(%9O4TuISWjH&d_UFERXj%(vX^HcBE;I'%G(H=UPb<`rIR2SsoBI9e/##(:((C1@6Nah6k`#(Sqr6K1RE78+#B85)(e)n`M-#bPHx4A5kd#$<^d7v(aFCZ?eX2[)$U2K%)Pe'OJ$HvK6I#^M?1*`oE0B=rN?*k04e6%aHuC3'sB8:(p#O^`nE:h*n(/tU?X##(uT7Z1jEC?^&`Cjk7?#a:1J6mhVi/sN9T3dvtg0Q]`W&PNko),*lZ141O*cT:,W6@LdB5YM8e.jxl]##>c5*I/T-%?__J2iFM&$=v2i#%BQa#&#vf#&?2h##5Dl##IEd&;:+c06K=k6XKl?C5*4&8$=JX1NP3bBWO*s4^<N=1G3ga_0a.46n-MsCs$kG%w*iw+%w*-#$v`F4k@NL6*s8WHcZ0w)RSlU#[%//GJRl:CSbU3N*?MwJPCd](7,2.)3@G4#KBAFr$nHY<E3'>#-Is3toMo4##Sg7#?i,>F00^2Hc,Aq$1kL2B>1]%$#NLFfl?2^bAfO1#@7CxC:fAv-.N(+##8kX#gf3E6*r]h+Gm62$maJ]'ZVB26j/QG-$rG_/94+Y#Zr(2Z`%50##[]9.Be%..T@^2(qPY;'#s4&;/vu98mL'c2RG^aVf$Chf4_LmJJp%P+/EJ7HvssAf4p(H&9mE'),($@d]vFg5e>;&/s+,Y1glJu$fPVf%8@SNpG@Xkgi]N'#/(r(0?:GW)6VQB*k.;S#_o=NC4._A$7SM^>R4lu4/kbcJnBpab,4JtD_-mrCjrfB5CP>N5'w?H0Gkf=Dok@v&HY1(kxZ&V-s#J0.BP':#[M-7PY?qS2h$ZwAmBr%-],<0>>G6=5YlQh)Qb1k#n_vR7]U'Q$#Obp-,VC_FK5FI$@7)/n+N/glb<.#/Iss:6VR`gJ;F80#EU9`CkK`u#.%OW-bGA8B>-fQL1)KB##(l-$jX(F0Avr9jeDBSX_t)3.'WcU)ZsFA@tDL;F%l3u$:j=)08CcJ+'sGd6Ag6)6$33VK?5ZJ<PsOsDRT[S'C6Q>J5-60*bW?'>wTOk4a2F0f/]Nw#'YIG/7p[2FA)fxK2l^n,HiS+#bEcE6Cf79#vT#S#+AA'0GS)+N.WqH3jVBK8?G%KBTl&V8/i[+),,=f$(`<-D>FU_*`q],$SP.w@BOU%(Oqnr(:)e:$jC6LCvjWOD:&^>Bp?+u$R6El:MUZ/*)$K%#@;k1(L*#+#>T*((nbm&&GvQ?85C@T;)9uW-[`#?#wB#p=(MLY86pi@$s;X_$2+R<GCLK;:h4(m$);XgJ&n$4#v-=^$8*j4mRDnj(QClE6F*](-[nWd<IvZcGX+^&11r02WImoADnD7/$>4Qe=bVF6C?v_>s+?S+d=-kZ#[#`f(q4*Y#;//d1pmkE$Hpf](JFqcJla`f#&#a2-^'Tp3@>lOTiw)T..wwO6vsIo##+HS#PVAk.)0?=/6jE0gqmaaBsNOh##@=U#$1fT19c1m*Nk+X#,VT@0<GFs1>;l:9j<4(CQ/<uv&K_f%Sn(_##/Bl$_VQ5tc-Yq(/VDB+Ebxp)2DOM$rj-e0%L5VBn$G8$H2w`6.Q$XER+Vj+AW#Y##M_37Y=w#De^>IJR]n$##63Q%7V@A]nZcK99gKv1Dh+.C`ZrX&r:M43)UmZ4<^ro2,XLm%<+JLIF&te?VCJE2c[uB<g':uEI*1>-?VP12c_gN223O+#$i^g#'#(C`G3JLJpkEqCh/g-#@0ubWe6cD#KeMm02-5'-[90v)d9.o#$1x4YCRh^B8@RJB2*PhC]4pZGDT?O#s=YJZ:u>D#vXs:>a1#G1VHu%(3T9X*e^&6.>BS)HtUUFGAg3h5q?>@#%DT_%r'3-#vJvP#@@bu-[[I]###_3/@Re%##>gZ#:W>dBBB51DFc.n1O1PM-XhxD&9L-hQsXbD%88X35fZ]u#U9c#BD2X=,upiDG>&BrK='@c#.XcCQXr>*DXBMi@8wA0Pw7)A%<O[k3G8M8MHg/,#@)Qh=^pvq#):94)GD@,6.H6EUO*$U##q(U-`+Uh##^q')i9VG1q(TwDNQK`19d@;+Kh-&#f&6%BhqWiCe(n764-%fC/P+D=bY)#6qLn$0?Ngt%t/4aKM2H&#$-4W(,#`n#Tfi,A<e16CldvVG--@R8s6v%#$ld#MHte8&R3B7%T3LX#QT0f3Sc$KXX>BZ3:.&V07b+>HW+*[$@Ehtl]`a%BR_GJB;^:];.F(_&lw&l+Kjkn&aF_EBf9at.aX5k:QXFw##>=.08:[B8T$&)0n@rUNI3@sC=5+HOAeI<0E(veo4WnvB=UT?;+r(H#('r,M,#'rF%w7S#YuGt&R/%7%p-)O$mU0nP>E@)a`HSA&CUnL,>Als-*DVw#>Oux7DX&_K1mSm3#DX3;18O_>Hf*>5v.N]#((:2<(o'5YuP`*4%qaJIoq2Ngn-AN5,ij:#[f:Y$PNMj'T#iAC$lu,mXc(K09nsw12Y4n#7rDX8lgLg/7:U_.;WR]s@.n&&[F-VCPY-e.9R4vR90JZ&P`2,$1xI/'JBYj,Yp%V=L0H/7Bg[6#a*V10MEeZ6Z2t2,>8-0=D^M;1if/$BOc1KluNA81DMvc`+Xu1.S]Z%#PlNkI'%4o#Zs[:6DtslO%_*O#>e@6Bp.qV*/eI+-DsU0HVEkF##Pc:2v=/wFd$<)%ou6Y$It*6C&A$HVG7+sp_o30DL-EHDQxFk#[[np;H*O1()?nV%,r8@2iF9I8;AteBYrDd5INuD@t;HCj*xB4#$aqV*dF,v0i`Vpc#6`n-*Ph%&6t&60O$)6,AK_9#?xZF$XYJE$afBlHc==9#&=4`/nC5<%8x^['vh5_7C@$H^M02n2j'/='w?Yj>B`KR6EY;s#J_D02h%3AMG5D16u64%rYUQZ-rm1@%dwf;2Hh8i26_[%#*'e]]P*9S6N7%?7'0x6]P+?i01uG]6*5jK(k@5+(,?/$28Nbw#%ft4;G7@bF2;[j#%ft1;G7@bC:/5_#%ft6SlKH9FbO4&/[^2i*`_*Q7^xugK-LNRBQll[Bn4':Z:wR72Kda?%p6M?27o)H#%@dI,#*/`#?r7D2dKt[Ejk3$hffK)3IV6FXA999#YYB%/wIM=#`XcD6h4YUTPts/#aWAI6*J(m5e*>dpM?15sCieeCUnmsCrFlQDe-%D**l@v/o6d&0juYb+hA7U(U)m1#LLOtE9IO_^ONwV#$t*>#&7V$##DS`%<rli3e:XOC5F9[(7sWO4*4xgR7x9Jm`=SW##=Z@#tSE$+n'=0#?Mx-UJ2;3A*+ibZrUeA##$@T)0M'HBRX6ABnP$h#B)]w##-J$J*[2IXQC&w#(?m]#$]355YiVi#nQK*Z:lXO488fk%ke<AmYe(U)Hjr@/qLsF#$t'&#-;I(HESn8$VW@x6b%h#&1f?n??h(K>`xuvCVCiR'sf9A7ClY*+xs3rD2DfVEHsuRuk<RiCg:=_0ug4w(nlc9-GO&cb@n%H#0[EkCO?,_HFo-OCg17?1f^e0FiB;02lY*3iKp7g`+kgk3lg1H;Hu?]2Aw=BCqf/nEm9,)9Ql3:Ch[6[Iqa7oKD#=dD?U&U4%aFW^iJM?#>Out'X.XQ_.k5cmtWPn1:KDg#CJcO5t+FIeoLL$HPmjs&>pQ127G)gHRJp?FXR9'-[TJd#?HXc#aShgp1_=Jp1^R[26p=O#@%?[2,qce#4<.4ZV`7o$rs>#FFbEs-%.XS&W1]YHN4=_*Dx;?Bq^HH31:7^Y#d.G%p<7c;,QUE#Ad,$jNFvK6[^TU#8f8)C3Rb=%hsPT`,_YAL^&nSHNtbq*I]B,($,t3$/QJ,e7bUN&5gOE/9l]a9l6#8&7%&q'4ao9##$&o#rdb&F''&Z,]]qRD&s[t.=XJc(K@G='6<fNW)O5t#)c0g1E[-<$;hmHGe25-B<NFf,[jNU%SuG[#(2fDC4@>7X`%Z@t_`KA@qsm1:fn12$4=(bCBG#`-dC+n#$]K=*aEu_#+vENIxR6W$03+S-wKvI)R/b8*-Kru$c76]l(Eg%%8QI]#&quR*j0F^o:V>i##5CJ0Yr:e3/;%1BTN40C4dLjUOWoP##cV.n9B6f%w_Rj-Zikm#(8kTBCvFY08Du_(q3eA#B?`W#Z)>6-vLTN(K(M@+]qjw$J9K9BRl&Z>BFML1LF]c.NE&hC3O9SC3O<UEjhcBnoe2(7=xnTND(1'LfJ5+B83k5.X5U#3+-?.#%2F]#$m%(o4_=a#11J)l;EA=1Mg4o.S_uvHcU-8p49uu@D1.1#$i46saqktBGq-&6c+c+e9UdVnvAtE6bOBn)3a,,15U#do6Km71q1d1/xjhUOf2elo76,@=_3Xrl#G[O5.XuA_,?Uu4pYNh@:<wao4s$L)o=1%(R#J8.DRDS##GZR-,$mX$_d$hJ[uxi*lDMZ$*]SV)GCGgo4s+R#<i<]rFs;q6q1QX7Dhn-2g6?8$M=k3RolH#93iOH2Q?4n%UT3?<FZ*O^Nbv:%qitsAPEP=.ttIU)/Wgj+WaCx2LoD'#<Ej0X6:(p&n$WA6Ad(Sdrkd)+a')slc]C`>#'+$$tsw]3JB`s)6fP<)j$,e-b,dm#%8o5#+[/q-@$`E#:qwF/U(ZX/T)^PFig-8np2j/08:nIVGM9)#D^4MJ^TIKH'/219iafF#&c^J2iPD@'2>'-.'P/C$>bJ%?MP+J*GP_P##/*$*3_15')l:,P`KMv%u-OR6`mciBn#N)$/$fFCY:2l.(42E0n$mn%<*M=5kp`O06]ea#>>S1l-^*C-C/)fB>7t#DoL1@#@(cg#V9SxDo'An5]rh%CNY'<o65qG5wGnT$$q@2BOr`V),q^i#>]Mq$HN9RigLBqFK$EkM,FJI,[=g#-ZNUM[fCsX6l25)B69Db(((=N(T4dh(9,;u3Nmm:/ldOP029;f&SXL6^SH[^/6-Um$3qstBp-@DlBfVkHV=KY66sL<pPF_,,_j@pBxaPkT>M:ho[&F9##Fj8$<nLH18l1^g1d9r+^$U`#>I?d02)r2BcUT%##L:c=a,X=-wH>.$'&.L134Xm0mA@l6#Ja2/q/kR$fneNPDBnh)Jr^jE5*Jx%VB0r#^F@.]nnG=CVZKq'j>$N(k*vU$eAv^FAj7)$;Cf]'psH/'Lahk6*<kb$5bUqBSfZUMh,gG$^54@(gixg-,M$5#]YvE##)L0&8rPm3Gxo'584/f[8f][,(M.H<jqDUDRG;Q;8I:cEe7Y.4*_iLG-,Z'Do9ZW#Z*n,8x&mfHRp/2Jl[(h3D:e@BjuFW1>)]I0<>/A3J&u<$>U$p%Ssk1/@p>v(Jp'S*5v&s%>c[MEl@HV#KQ=mFiAr;L3l]cYZV@DB>8a5BpW0t[5o>3TSlOe3gX2OJYt_-FiT'/LJ.]d##%3b21[X=#$kF.FiW?/#&N$g%(0]w/TEXw-^'4L9;GOb<LZh913&j-ST-E>.uB_23JYx+#8erV<`Pd1.u&tt#+wd,.uB1;#.m=:6$58:QV7dkoT>Bq,uo]H,@Y,0#c>CkHvskJ&PQM<.<6cf7;H=;$rqt3WFKVg>$ccs-WsZL'0nUI^N,g^l`pkP/72ud$XPU=6;>Fd#:4c6BgIxUDe*5L#*(bW@=EB_&W-6w0;Jj&CPfM0#%R_KCNuSpHvsu'1/(ST(l6e[#Avx8#v(Eb+a&R1;ek-g06f]QFBC53CN9EXCPF%TGZu0]K#iMg.)Z[##X9;D-on,TqQus(##*s[(R=t29PmM=B?'u2CWS[6An:h=&Q`l9/r,s8#wrgg#xdE40Q10R[;e[]3R.l>.ogsW(gB4)<OHG[FeE5A$2=L,]nvG4'3,4t-;7*>0#2Cq#-`vtAZ%GM*aa]p##>;1%AKcBB_64:'R:(M#[V0/-WpDV3dmh9G>'-ED4DcR&lke?D8eZVCPOWr&R8f]$]UasD4*#,1:,&K2Qh8Gn+rxp#'2JQ^5@X7J9*jfY/S#d@=VX6/?h_^6%9`T)1NK,+bu83)1EE+#p++[#)WF/#BDB7'ifVf#eJ343/D+5),(%@(JTsvG'Ilk3J`46BiSU^7%JIf3g%>Cs(M-=)2@o/$+#c4D'_9BEE3'WEoMhe8;W<6G(VQ-19apt%87AZ'20bH6ZNCGI>LIK<g&J<-wTqY*bLkDBMJ>ZlD(XQ2Mv;$JrYoEEJGvU##)xf(3xejG.0$<0p7WJv8jZW%sr`l#$jh###8GDW-hf&6$5]O6[qx?0Uu4b4FB8.#%B0$#.H:RClkIT.SKiZ##deN#/:/C7%?>l<d]802iWmN),(*`#$bZ(%=C[#Cp,FhFK[*n1:JCir+O;6I>:=J6cukx1Pq8+D=paF6_'TC#(Tb@<a^:&9SnrXDB:W`6b@&&3MJ[U&54qR6c)2A#P(Nx/w[(&06RP'GBYIS1RpoI$ruYq/x<L[06RP'L35Sv/93.kF2]K6F*4,u(V(&^(V)2'(:k*J89ft;F2oWhB67tECOt-%%<W6$tlNoh#FnT32L$vQ6;oc4#U;KAOPKx+%89LV.YTeI#+.,x2Mb7q,e'%/1O(X)#%iCs##-J-21@[C#$<%-A1SX;1$d;aBg?K>1KtjpC?QF@,YSdq3+2jf3bO$e7%dm53-^)c4G,g/C-5-pYY6HxD>Y]mW([</7pUb;#C/tO3`U-AI,669DEKi(6^QFB+,`ON2R4w^Mk=EpTgaIo16+NC0Yg>o3-Jca1:^Qo26LH+<djG:H?Bt+#3:9&6[<e1drQe?1NYsqkP<=nEeMo`2MtxU#>wEb(4K%FAq._A/wHq>*b;dN)hl/BEo3JF<g([I9n:B-D2UBI6arvVseu5L(JPI(7v;>BD8]E'6`#_Dp7J0PCL-wU2sP@K1oZUk9jD%<3JhL77];E%85gMG3/MH[#)4r#CqtF]<rd8uv#D&TD3Hd(G`b7h#E9-w+AsZ)YZiEB'lJt-CjM1tRTrS[7BT[K;MHBC5g=ODFFFi6D,_LE#$d?7,>>V/#E&XwBwu(,7M?pZ1sHfKCO.B'A[*m;19WpS#>?D7-?NjZ7UBS9$`;.PFGFFUhfAPg$RcwZ8QvuF4BruT&59WB28F.w/QNbT`,CH6##_uB#Z(`0YZLo=%8;db'rG>9-%/Wp#ZBYi%4DBfCJ4ej%=Vt)H?^Eol#`W&Q<R(&.9ee;$Vr%?*k5Zh)9$<6#>Z:HW([vBL/K4]41Ya=D1;Ol5&1xN)GC3Y,xJH9%:NeO%:NhY#%;.T#%2%^%:NafXbP2UBc%&aC5HDTC3FTFB'`+d0YK$Q6bA2c.S`eQGBjhM(9Qg%$q@L.D$&I3D--eXCKLRuC3;'l=CYucjJD,v0qDZC.6%h3#$m:d*g2>&GW$XIb%ZRc5[.3='3NCj(q0BG#ctqp^o$?#6#`5&q4cAUB8HmT2Qg2kpM7,g65R%9$CY7l2MtZ0>c+-B3N4R*^MFf$#qBUnC<8Q36asMc>YlEf]55Rx#19PbB2B]bAq4Q-6*Lp2=Di30:S:R=/s*wo%pfOC)LS/a)6d>H-,U+8&U5lA>]=6tB34P,)6vcf4L[JH'P[VuCg?#L)KlX_#cs8j2Q>OX/$iC[+&k%[(U@,<(mKA;++G86(lx.:/9lvLsbB]4FHS2w6bF;3%^ie@@=FfO.vJ:R:S&xgG)7jeIqHj2MHu*#l$2QvNI4://mVhk05:K&G]R4rCiasnCiasdEcYS[A5**[=A0mAq.R$R@CIQ'@tDtICp;&vGf8w96bx`+7LpT+l#MY$#$t0&##7qO2pgb$twa<rrdnvs'MK4608bQPCPX<gD<MhQELY-gD-&VxSo8YPP`&oLE.)MVF>F;.8<PEP/G0$l@;]/1<ku6)/x4+#4i*YqYI>4+W+Q*t*)'Kb-AQ3f#`6aVD)FJP6bp.n[o]gt6*gqE2Mm:=<D=X$>H%U1RB-U?##<*M$tWeP08T[h2MYnl6g_DS6+8x96EseY,.Tb_2L76.JleMA.0<fJ9t,oa)H]a:@=5Jn#3+Bd6^OQs*4wU[#;-<o[paaM##&K9/%x1b%pZc=4iaA#'MJdQ##%HiNkhL_27uBjES:JIEHOn4#7[VPCi<gR;G@;36st]*7XnP878<s%5oI$x,&f-[BZht7D,:7:APJ`420EOw'2fxB1Mr/w0i`_c#]]6o#c5r%BQS:-CN:vA:0Jkd5xHe1Cs/;>l?g4EbA<Vfk]R,H65p*,Bv;mIK<PlxPY`nu(JPe]V,/5HRlc=?3D9oc3k2d(Q;AL8Q;@i7##JWg$tjqe19x86$>)1xOntmgCt)pdB4jTDB=J%aB=J%uCjv;l&(CSbAPH%;6arjQOBl)e6bCT8%WOSO3DErxFM`J+Dg)engm&(2BYtknG)b.=.W-?N3D9Ni0i`eaQfZ)'JXIk8;fZ5r9Ug'r#*11118d_0CRQmnCrFl*)j%1EHt6U8Fh>W(CVVC.X]8exPv@_%+BFVi#.Oxr0?5@R&1xm)bp2F2##eEa%]as7c@_we#'MQ7@o[jS?raT$1pjvI(T[%3+h,ji$C:awGYAN.I9Xar+xxuY&J>)^CrkK%F1KvR#)L?(RXn3.CW6Ph&oV,xGe1+M.<TxF143pQFL&sCGe0/1#Og0:,uoJu=dJm0$<T)h7YLr'CfkYh#<sa*107)&C56?EB2jQD$#q5gB6$7E;76M@4'X=R?;MDM(UMKU#tT&=Cj$fCCNVl,McQWT*kOC^+h]M<3guj+#`a=9WF%_v5$TqshK]BbD1+C&@pF:Q(8j7YK@hQ9s_r-n5H-0F6'ul[>JG*sCPsO'(k_+I7YY?lCb6m?0Fj;8L/%iA##1tC#(r/*Gp%F8[j>CQ;GEGB#hu,Z6arvO/lj_S%UT3PB^eTTBw?ge9)UT]6*apf#,2*$kj^?oElA@(2iG>#']X/9g22VDT:Jw,CVEb6g<ndW1ns:3(/-0uGw:8jF^odbHW_>TW&4`)DdJ(E#DaP(GZWLTB6?qB$Z:.&*GP_3]%Q:-Dn2<xBGV%[ovs3,qKTKrEE,T:-?XZk-X8u(#BDB>&JZ`+0LFI4CNrUr2K_.K%PC(s6akEH%I7,$$_(N_7=8X2C^JHDBs>FJCT1U+BW#Er2mYa@@([o7-ZiEB#mJCmK#goD%:pNEISD/bGxn=g*D@QJ;G71:Gx6p/06J);#?#/KJaEoAVvHm`KlurFn=]B*G_<a-WdS5g]U7d5CZr435[k_t'3#Ks###SeV&BF@25VOaBQ]@QdsMX8$RZ0x;Mrj(C$>V3J4pwSBp+wxB[$Nb$LJnEsrPN/4Ffvu6[hrV6%1`X6_+*HB5JgP3d,JA2K`*53IVt5(U#-S0WeL0##,r<#*'@8;]:H_=]q#i#:9IENdnRPE&.R'Uh%7<#Znt.0R./B#A.R^#>F%W$(<>L,v$87Cjj7B#<.NZ6Y8lnXh9=(/?23L,YTAoIVJn.K#iSmCjtb0A;N$rhIsO//m+1K14kUv%dqd=19RQ,)Qj'.#r?$]bL)=[b]s*X%'cIkS:LglP#)t$&VU4X6b&T$13XFw&ljC(#$,Ot#DLQH;=fR^8ZbHepM&c^#[89SA0Oe]6[hp>lB13eR.:7SDQRE'@B3Upr<^rq@tDmDGBc<n2K9qrjxUXJ##=BW#>#o>JS>[S=_D/0gi@lh3IP1gj](:A%:2%#hIvY1.Y9U$#$cI$##J2J+K_/J/;I[ihm=:T6*7x-#4Mc6.&px1Ge2(t.p?lCVcCKa1P%6068Qq&1O`4(IYU9EAruH>FMBFuIs&`_rpBAOH1E/E.N$e,-@Kk^$;<qJG/QL/hS$^f2hdr=^3II$&7^/:k@llZ8Ul#x0/rWi#Guwn6Blp1<1vBl0DH5v</j2=2w:.(iY/O^A.e=gB6?;4)),Nc8Zc.iK<LMm>`b;,$%^Kh@J_%WF)<JS%w%67$;DD'?IK2EIU-vcMhTWYGq4M>(fc1a.Sqe_$;/HN)GC.s$swtD$tLJS@o[.GaDR)>4HM`McX;PF:fs]*#?(V=:g@?x1Y<u-8$0.H6,%u&%1o2$IT-@-kC3BhLfc+q.'YEb#&Gk9J`C*a*F3*M*)@S`BT@A5C349O)IZ-t?VIf9#1Ov7Es-ueaK1fR]ds0a_O.d$6)lE?Ehn&4.DRDNK3U;e8Hawc8Tv]>HAQTq8kd*RCJ7Tf4/kbUCJ4v,/naBX#[D2B(5e3wEh-?m2hn^r*`ZrQ%SwqE%J/4ULNasD#$*pD&S1sHD(Gk2#(C[+B[n381OX.E-Gbg3##&I%#?Rw1qH]p_giKr9$X*O6]oc-8/wR%V;f6'AF_-aY+A_M7#G6*S0>IX.1H*`]3et#N2iasC5('PZ#-S8<K1mNgie_ch##Y#W*5H[)#*@Yo6'G#K#.4ub6q:Zq:-/NhEfe;SC33<a#O).meROFK##&'+GI&^p12_tRD=fL2lYrQr_M%`)#(CF68Y$6X@(U?uC2k8o#&@_e###Ycfm8>vHED.ADRF,pEr^gCjCkj0RfHmZGZ5Io,'B)T7@-*^_.]aP0DGXLHA?-cHQjWU3.X'B$Ys:1#$2#)ZZ/-qK`POvi4-vj@?lCT$Z.p5X`fpK]+q8_#&[)I0u[f,##$.I#>uPi06iIw#>EKT(4vF((%V-($(V9,,>8ORj`ULs%(l;:10=U,G'30#&Tl-cfL1vfnSALt4Ec[vH]k/vXS4sB5_cG@0YAtb6;/jZK1>pHO834P4GGi]91/d$8>vW+8SfWg-[cSr$$QYk-Z^Pv%.t_m#>URR13>sE##.Ys)S8p'$jQs:QrRR,09#t:22=Ss#>d%v:XBVt#ZD:mn4p(&kE<GD%8I$I#%/k3##8ch#9O4TDd$Q[-Z1?%Rob'.%ZF]JG-=cP=+E$70vGVP#w==$3jO[X@8r3+5(6em1lH*O(<2/;&OL]w.(kT&%r'VYZYXKk8PKgEQ9@Wo@t9?k_h01^#^)PL_B+c4Y`,/mJ8#0pN@Fs-##mID#Enrk-x0HI(;pPR'PIJ^3G8Cw*`Zeh%Vx;UCW[1&##6i25-Y)l)8VRu7C+DmT2cvCG/TfY)16qD$v5jHCW/#m@tACh#$S*>kW,J%4Av8s2Z^ts4ECL>5#iTF2heS-%sXCc*)$@s#A,BX#,*d/5`LTa#B2^4/lvDE#&IRx0/*QR#$aq*&5Q%P9sBc)2Qe$q3k/Nw.-D=L_.^s=4;%X03KXYa3ls4:Am^)p&5;Yl#b5L0IRR=OJ5&V#D00dk#>EQ<#tx]vk]2l;32oHV2Jc4nIhd<^/r,Vd#)Y0v5VshQeJ3kLZX,Fr#'`ufIo^tE#[TSe#>[Kp'VGJf5B`$=m<*4Q%G;+0.$%'$=dkoo=EJP;Fov^>YM04t#*V$U1:.Wt)M8Q(&<vF&7qQ+<J6a.jGO,TE(JGhF`H%5oZ@*'c'Qv@$(/,q(CbTh>CcH',]5>W.06h-@##6k])PF;C$NUNZ4,#Lq'mO(^Ed,L/B>>`o#(K-r6&>c^0#Y)Q1;JsS#]xP7#$W%^#>GVU#BsRh/6<hc.9A1;63H(L<1YMMB8#5U0D?TDFEjCT@<s5c@9WlJ##8?918w@u(/;V8#<2e94gKZB#XJ^)>9O.DhJBM+7u4gwEH(ua78+AX[uQ/^6/RdGGg/6IkroXt###V^kGY](@Px3wu4WP=>c(pYX_,AGo59k7,Dw1<3-6U6DeF$H7g<Om(j)?U##>;X##8mK'Rq*s+A<9,#&-Nn#$VqJ#>__k+MS[r20($_###ic=L^*u1Z8o[s`cxpFh-/I5v4Cr)nj7P#Flj*G_<vHBXa-,6a4Psm#/,hGW?Ops*Ul+CUOf*19pd&-wSFiqh$]p*dYJ?9MB#b-ww.q.$twA'ifr.)dTnB:Ph9Q.&R&N(JG32'R)+FJ56gqc$c;U+]_L+##lS>I9ls=@8[mXWBUDv#$l(TR=8/YCFRP?Y?k`RG&xnOG&UmV-;>>0+BT'?##c+u#C%CwrFhsU'jX_-#i2.Kr+Lin-spoC#P93aD^B4#^M&Z::M:JudV4Jx'MP;L$//<^elD%b#w3uQ9T;3L61PY7Cm'2O$$QDfEE)wE@Y#,f%KS#eCmSX?CmSX'dNv;A6_@w_2RcjF#>HCj-xY&u?;(sa(fbxlG>JpU*L;Ov2SD8L;=P6aKx?CB##.9c#w712754re)I+]+<a$:F%owX?3(tLf#$tBv5%A3QKls<]_(tP3ClmQCo4d6j6cG%g+]uUG#q'Ld=]M,?2MvA:02*$L3/Tm>?QLV_G,#%B1//>&`9<8f)d+Y>%MpX[<$r]gR9tt+DcQ3r7`C'v./tBR2m%84MTT+TGBYQmF%d^l#)-s`FU.v$5bYl')6tjn#_nG6G)?0v/%7W2@rKC>@stsOIVYx#06T_>2he<D/o4mc:.ud6&5d&'+i('I&f5x20Y'fZ&RugEPY;1T#&d5a)L)8&*+aus*-OE7%Up[v$vRl[P]V4v8Q5_bb]3Qq(6AD7)0JFo%vD'FIenGDp2?gl7&t@B6]xaH%rZW9FGc=>d_]e;FEK-Ufpt'=hL:d6-roTw6d:Or6cxXt&#C.I;EGxR6)0BB3N31w^3[`9*ZgKT/Ata=8U3%L3gA5m#+Rb$6]x1h#_xbw6dT2.3.*^<1ALpt0#D4+#%R_^3I_iC.(;@&#(:nMD1ruZ/r,L;'C5bH#%)/?pLv:V&O$x97SEmF##QXL3-?[7Wbd%Ka`xKo$-E7[D2N+U6c.)=[`4jE1:^Q=164TAZZ%.UF4L><3.*hS$(:k/6-1$[HkdI%HwBG;aD(MZ%e<wu+xt,=35eqp8b$wwVG%Q?Qu-f^hZV1w1:KE1##<3COd)#S2MNvK59q5EEY''r_J5$_#[6@$(3GnKq.gRm<jn^w<jnwjFh#s4;S-x]2IL@0P>3c(7`aN[:WX/O;M/>l14VgQ7V;bN6+X>q-EfT##CL_--f/6Y7t/`Sag+B?6bLAR2RcdL'O)-M3?r)CI>LkF:.v.$$ugKR6_e%P13ES$+]W,`:/NKE#wRC5>;7hb6)Ihi)5_S@+/W4F,d4bK)5_S@+Js=G-)OkL#>?1EBY7g)/A,IbLWk5@1;[LQ17-+#3.asr@gQM:m`n$xFN?Ur##L])##5D19fR^D?Lf,:;5t@v4YI4g##;X20V)Wl##Cwu)8wCrQEsaTB6]3YJ$$:'7^fieC)>74I'+paHaw-b<f)[=21KUr+0SnP5fT7n>>,nLpH,a<GRip$#mQ#cGU_F:v3a6.1I/^^-G:_gCJ;/i#0wZmD:qUHkTGRo#>o)u+G[ph-Z(U:'52G[kD?vJ=fQ.B#$VxO&QC#a6b/`g94wjxCMd5*K#iJL6`/VUB?5Km#?.3IAwm6&8Vr#krHYZg>uggp.t5>KF^iw_2k>Y>cwD*souQ7E_J;36#-mbK4+/j9N)9W8p1XZ.*duSk$-/-s-vM,k3G^+q&s]$JEliHs/q2JH'l&=F%sEN),YTT4/vlSABp+[6Yo.J7i(<9(2k#rOCF4=A4TDw=2i5F/(qIN8-]5R0IqHQE),*D6@=hM+6b.TM-vMMO(fm&L(4t.S##u[j4gKwIB6QMP0mC7;-wVtx-?iUi#$a]a-;5Re(q+sc)R0q&2Mux4,WZXSSP1`nBnYQe*e'iRCm)a808=fNp4'wt##`,S$+0cdB81i<26A=?,#g/>XAp:c`lJK.G-*0,##NEh34NoC*i3Em-V[J--c+)^GvU%L$+LXQ+xwaC-vjbE0t)x0#>Fv2#XZ@5Fxiva`Hg,?Mi*_D2JsM14v+6r4X`_rBpbHA#Zj(l$^lR'+AC=VB>,xDFhGaf#(8Y`6#T>0<(FQh<lEFUAlam&;qYX8BT56i5bOT='p5Fg?&)qGIYhl')6HoE.&8Id$?Rm65*Zuw5*]q/BnP&j##-8I1KF[11U&[1*k?da%3x,Dj$Jdo4]gSm#3,aVEk9&t_fumaul8+?6wjCTt'#YP1IVhY0t4uc'ox9PBLaSILdcdsBW]q_)fCSS'3*(v6b%roY%Sm2Y%Sp3Y%RgY1@vQ21@vPj0^@MJGDUX48s9jt##t]a#aI)8=`f1O.s.v@[pajHE`XDl#6TvkV02nGXA%sG(9&R,#Jn-?D,C>D+GbUR79po.5f_H5hW'AL.pSEX)QpbZ(U,gJ#R:E:J4rotC5WL((5=>sN3R9GDnF)mGduLZMj9C<B64?jqg)UXC5-;SEm:#Q1sM&Q1:VUpC3l/_?;qs@CwurlENR+C33u^_MG+T#)w?<NJqi3`JQVu[r8lPHENO`I%oo<b3)*4a2GFI&C4$&*$OAet+qBWeE]<S[40hs`'29+S'29%P'28Vq/RsB1K4KCJL/9@J7w5:<B9+BFk%^c^$;Cl3#XWaO.,xaYBLtLVE,#KUWa)]u-[7J2##IWj#vI1*.Eb&nC/ZHa[OO1n6Gm0X<d'7v1W.7u<eJlR6`F4kBm,8V7#>Jo#-idn6$7CbC9L+A6d3C[F]YeZ7^fi?I=jlMe3p_A&lkLv78t8iHAQ-sI>,44#gi1SB6]^eBQxWaBn=6SC<:lk#lxC8BcHA.hfx2Xj`:*h#@VLT^toMq#&Rl)mrS@KQoSMG4JQJDIW[5[#=S[+1s`)Z1sLir25NCI6[:)&#'+wDc`,_rBR4pVBR4pWBR4vXBR4vW9M?>=0igt/1sLmY1sLpZ1s`#[0i`SV##3=+2n>N]e=s3tc`?1%9MNQm#r%WH6G>%aC<1f97'/a98q+[21S4cbJj25GHxm*=L/8kpI$#i07<Du)1fgZYD64eh(9]Z_2RG$W%88],19H1j-?jtg7Sxp$qIw0[B6[C06b'qQJ#u5gFgfjL(TYfL=2-<(B6q')343Y?(fd'&/@d`#3J&sPBsXFU/w.8Kr2R[l<3;>7Q[1NB>'DT[0X#5j33>BXBLNDV##7CI98I)d3g3pPBPRTrJ#tit#>71aBSq<-4,X)K-;4FrRU[pMG%3(38mnW+0n,%w1Z_'MFgeh?B8J>3L28<ieWA'uDn3e</o.@f#)$k8J6DriGw(-)06/DaL0&pZ-_Q6w>ul-,#A`:`Cq5(5/B^MYBDBVQQ14jb#[M34#$sk+q7jtc8T]E2Ve*^kEjs/j2j0]sf_=Zcqh.G/'5TC`05:K3##0c_%g,[YIWR%q/:/ishdY[Ph-#IMgKEZBB8L^A6a0xp6'GaDJ?:v8B8K<T#E3T56^og@Q&/DN6^PWB2^$kF-b,^Y7%>vY6b_?;,ur=O#J0M6d#ta5f9a<n96OsrJZXp+(6FMM5)Wq;'iixm1OV$95a0TPHECp$$E4,?##+e@$<xXTBnVx&07#(;Bn+4&*>1-CFixAh3JV=]G(h#ipnK&V;n6=,hr=ld:CH^=1;X8x-dIYD$%FXr6[g#>:=pQ+#&P^;3`TPlKM;`U#&kTIM)TF@2MXg70p9T),e;De0R70vrOTKs1Tsof#@&tc:Krre#%rG/:jBeS7<fpQ-/1SLBm,xk/94eG#YfBT$$?9,ENtf7kxM7W#*8-mHC&3mK#iAVBuxd/&PN6_$V`%5LOV(HBvl[[2s;vO2hwTNgdhM)#?#/=2Qo[1]*5)a2VJ4I3TZB<1=*+mBvl[KJk)K:ENtg`]WS]vJugP_AppJVEdcifCMloj^pNd%]M=L').-Ef*E)oe13+b>rFmHE&;cL8E)[@.#?a.^3`^ma[BB]D%8]md%6tpoB6[1ZB=f7TLff$l2H=_O*l9S:'gmS'dWUFvDoUPL.(<e:B[1=mB8Ihf-uMOg12b#K(3C$j._a_8#(1L0FClM]ZXGv.08ms<7<s@,5>2'FFis0b#$N+&5YM5a/YWa?#$OW*'v_/Y(;=k''pW-/'w?S`1s4-u#$]E?##6qW(To-TA]_NbBSMON#uxm:&uAs+>Yv$5#$G2eBSJ%Mv+iUvB]-t6IFT3=HqSCV>#ubRs*3[6&Q5T)0RS=%/m4^7$EpA5DF=iL%QC=l#'M2a/vg+]@4*FiDJS*4W.G+micu=q##PF?-w7V,5D:8ICpp%7_heF?i.%pfP%&#UP'hs0D?3[>dFF.N&Q9*A/V[s1&PQ80)j7Wx33muZYOGB(B8JeqM$ZMsB67h?#@V1t#A7V$#@KWY(hJvo#BifgR7ACNK1k_&4sOGdFxwOH7[m$Y6rxJS1O`)m#&JRPm<nMF3IW<*.8<<w6cn.qfZL6L/ulGF%V_'?=EIVwHEFV)#cn,`c#]dg&W:.NBCQCM26LAm##,Ypc>Jo=Gx[91#*LRA/97xv&/h:?;8Y&7@'0Ar+/;/::p7ZR10ttCBWahA'RtT)6d]:ta`84]/w/&U)OEh.#b?<6?FBkF6#C&H[C$_##_ZS4#[?f%':a9b@uoFr*/n%PCNNwp#,#7:;@t%=VcRHP#Ycl7.W-_Q:JK`d.'@%_-^`^&BWhvP+gwSG''CWu/w3jX:5(Z_B9+E_B;-GjB;-Gh>wfY<BWaf##'F+^*SVC[*SUTJ&05K*CS,_]F1dnX6%L`C%csqw2Mv%#EN`V,mwCeFAPsS?jMSaSC3U=p#QP^]/o#&lH;d0)BH`J40-C@3-lHWPBYfg9Ili$.*)&]-#3Lxr7<Ho'7toTtGTF+r(/.#S@tCU[##gA%#=pxtHFo-@#$kVl#a:[E/m_xCbxaS?/H?Eus(oMkB;'-wIWw.Mbdr(*ENU-`/U18t7sstgKTn%sP;EFut`ggIiFA?9iFA97iF@R#$;RU9$S2*X3a#lf(8*4kCO1-3,v6q=07R8C%YSiRBGsUFB`M[KB[$['B[$Zco9Fxr6Z>MH6WO7/#_o/PH8>l5jhsuvB<Ef7%quwX19N7Y07%;tITwXpa%)4?#&HB5J%f1s6#_8U#%gsM#@'AX$=H%J#@`d.cv,6Z-vqYK#6pCiDn*j,/94@7BL[rt:wJ*h?s@)'#'OIg'2A[G##Gf7+,:>20t4rw#[BJg&RwNLu>KDG#4s(&_J+`:olHp(#vV+F2kjK<12exGC(1>P@802AJr6+i6sP@45BS<'+%vjpuAGdA7rG5L3IP3h#>?LX,KBhi2l;A/AYTGdt]*/](W($-35K+ACk6((&5paF(6(1T(6tJXQGe6e0nGI?6d>%>-G<sShi^gx7>:pehj=hTrceEH$@e-3H=e/78ZdthgP<^i###>b#.Q_w1r@]0.82@E/7SZm5YMFl#$kd0*D@Qq-[],_#*F/C6[V.8(Oe'%7Z`&H0$mU`8u$#m(j43(;3MR1MP(7n$>sfS$#:*?nVBUv5Dk?n7=HrJ5_c>SuuY3I(s81>-%''(&PtqJ#=&Mv&).g3rZ?nY#'M>D(/,q.G8jicDicK1,YSDGamhZ`CrsAK#w_<XnS,mZ)6Y&e##,,%GYpTKJ@'0#'MT`%7sr[EMcu+)6%^9=2MkT$T7[,Y=&T-J;07Vf-^iestD1jKq%fj=)KqMZXAKbd[`sQ@%;TI@%86eN+]oiO27R*&)I<EE$=7;E$=7;E$<,JZ2ivUjUZs'<$Y2?R$V]dH%3lu'2MZjk$sI1[2ivsl$Mbw9LJ]-b&+W3%6dX;5ENbfUKj&+d5?g[Y+&[=Y's;4M&&(rF>DNN;gn[FsC?H=IC]5cb18K>+;G@C.#(&DGu$V::VifR&1:TEdu$Vfe-x=[OEffe<)e[Yg)ee;:&<CCT6*rP7-crmk#*:qm1r5cSCVVRBIv.k@&5mJ5#R_vWJPQouGQ7JC7cqOxI^c,6#$aQlRoOZ+'[$Pa$ikXUb`b2[AQE?^IYVe,DHQu)Ius.t#/+Q62iur0H@>nQBShN@fsX_s19V'i35nG^>;^9EBQYm=_(168>aUGL6F7Zo.<p@1.oj@tQAKF5CPQDeF*YP7%?;170Wmr>0WvhP#s,koJqpu`7<D7b%%KoUBQw^d#AdGl3b3id:U,+M##v2x#vWRl06j:Y(q7a?(%;QH7X/b^6r&i<)GUNL#'2j<)GU?oglcmEjhL-f%S[:?#`RA;/nAU,104ad(O5bp2Qp?YnqRAoC.8rC*m]fI(JGw)13b(Z08:mb(kIH<(kIH<&uTDHD0d3.ENUl2BmuvK'4E=A%Uhr@%X^_[9Ptq34GZeiC3h&#9S>H3=^Pk/%8Eh-#Ph@%CppkU5D;18'OW[p$[Z?q)HIJS2+x#F$snI=#:BRn;',l0K:+':U/DT$]R5u/#?1]n#*)*a0=[0K%QY]Go4bQx78*cQ#@i:7#?)%7/rwo,#B)'ADG1+(&ng't&7K'u&7&h##w_pQ$VcYK,e5*r&Eb($93*$Z4AGnB$>j4aN%d_.Bb=ggCPdYE-?t35##f^H#<a3Y/wn7V8orkh217?I2Y0[YFMJa.1=@#aDL-P_DL-S4*bCC'*i6fuDL5lw*iQxxHw^A,#v2R`#v)4Ei,Ou3%sFfJZVGu13.svC20@=()o$,W2nRDI+<7`L2K_O04*<*63/V^]%sVqR06q$w1s);h/96DW*e'#E'mXMC.YhMh'N2;P)lYrl(R^<t.BPe&#@0c`#Y[Ko$]JFeYjHJ)*w;+d%TOY&JrXP8GvZ*?K,5;N8w(6]$61RDB8PgN#f_4FqgJ>kJlmGE$;Oj9-#Hnt&PsC2%(f^L7BV4h#^gKqCjj7I$vo%j2d9Z2#E2'`/98t<Qxp1<GHaQaBvr3($TfVwOxn9TJR8Ia[p>&?25S.T(OL.+S%sIR/xcVLC3:g$#$r;q2hZtg0WvqX0_Y0QC5V1X@#HUs5`%_2,e@Gl0X39[#$u[((JU]b#K)_21fx+q*DW<2#%rl208G[3#(S,96O6OnZ5tRNIxT3C6_&q:#(7rT9vIss1NZCN(O2ds<e8;j6[b2$-Bil`#0fmq1PIBp6^P%])2?:;-FnRO03M.U.'7aq#&?/w#%I`/<E='Z#rD1,K#g[P*a9Z($nw)xD[oVS;mu/sGHX0VB8K0lnV3NP<gwIc,YV(.2O%X(*hxl46,Er3B#T1nB6vfe1/%nU&7><k6*_+)>*NHMI''b:,-Wf*-*K%,$uEi_+xx8.2L/fhK/t7V+xtS489o_$J3c/`DJ0j==(j5]=(j`k6W3v65e3Ou.Bltq,$oj?,&CiW%88%3CMl+r(/--;A-Iq3C?_[aG8_T:#%pM?##^lk'Cxf(8m-,F'j5vw@Tk1v/t'LK##+#_-[9[O$Z'UkcL$C8%8r1S*KxZm.(jxs=A8_2%DMx_1l@-h0VqX1/WO8$#';VROxv*k#0_Z,G'%/LG-6(7#Bj>F<g'Yc6(AWN8Sq2I<fB:96^;0K$=@we#%)I^#%1Omt(uvLflh@E18-kh185+Z#*&lU16kx]jD:fa2_AND>-%L7BFD%Z.TQObEE3'UI@p1u.ogxZ#Ae>N/:%D<#@2Ii#$kg.#%(3&MG0(<(3l=C%2_.$2Z<p=2L':X##3?A(758/(<-M^#bQ*-+A=MaB8MOP-[[K4+]_%$#,D*c6[UGW$VV,8$VV/2+A<?J&PN33,#Or2)6Og()l:f)(mwmc&EJDo?&;wTHEBA2.]p/RB8K[F/71Lqn)rv46ZeI`6X/`n-$5SF#bq(l2j%m.#;_+SB8K2c&QI4A#Swx[dSH'Gsf)pGFIrVxRM?:Io6IM<#@'@0EEdqV$;j<W(#h$5&T$Q8;eq,S##-jg$I`.fK#nqS#rZQrGu]h%>YcPQ#[r0k#b&V_HE@pd/&5S4##/Nh#0Ams4K0nUiL[GoB6]<:=j#')1;tp1'gn%4TSPD51;e%S'm3lS/:p_)##/Z4(4eZj$X*O_4cXAL08)&o##6XO#62'1K#j)H0>xdSAZ#t%(W(0C#[@@i2heT##%'HD#')&@i-hpAJP7j2/93=G8V:<'J9LwI/93=a#2^Gw06I7vi+SEP6;.C+#?:;8#@/3P4cb8S+&%p/'l75I#_ZPeGGJ]_2G=++CTT<q%>>R,*D?Q7nVOMW+%x#dBAjixUfW=n@'^jCm81/K87rq+#.OYKHCc+S:S%QhAZ%PJ@qp@R<bLB:;lHR:##+,r$.()9?&W?6<sc*iuL4atBbd;(?%NET<eJp02Gd&Y08Th8#.G:gK6%$&eb%p.'oT8q6e>[:e<.%RBEoTqBW]qP26LC)#ZsbnBF4gL(.g6V0<ScD#_'Uhk]@8;BIk4;BW_5v0t4tm#[<1*'lUmd#vD4;%9N_dBW_g0/w8Y=#Z)+:(*Na`&7ljLhfJ2t##t2Z&=3B*iG+E;##b,Z&7cdMj(bGu#$TS`&o`2Ri+fB%##X#X$[)PWh.iY$%$,MB6`jg/MkvE:B=`WoCN,#B8[8D%@T+A8O`XsR19`RD#AGa1.UG4H&o#;*&5P*-%'i*m+)`4LCk'BC,Ax4H6rf3+e:Nw)$rri:B2]fZ>HK0N$D%6'd:gL<BO1[Cv)BA2CSuEC.X5WX##..i#(v#fCNadi$m0>%1l?fA#dfBw14V670Vq4a9B-Uw0g5u)$`_w`6b/&W6*NMEB88qg0StG->>cH@DCQ:ABn*w?C3F-e4`xcwJ8fp419aEvDBRP7QXV/T75A,:BQZDN5uik)26R[]V/xE,El>`5-?UVN(kx6%2H9cR7BoAW5e;pT6*d;M*OF:,*O4.*L9aoW6@(>H0]$iP>L4Zx*`m`H&8lr-dId.5B6@_NmH'13'2`G-Q?lQM06hw=0Sr&j##YG@C*<ThFge.8B6Rku0Wxr_'2:;gVL14RHap*F1rn?/&n['DtA$Kj%8.([6b)T&#,3Mo06lUk&'5Bf06hqV6[PPGH8w7N<Hs&@JF3Jc=04<XMmfPH6[CGF4;&sJhJ'MZEJYE6#[ILMDHn0Kn7[S0McjGJ#/qwVChe>C,^4dm'MN&dK#iGXIq)j$It&HK)7iG(.DwdZ#%&s<,YXp$7_P>,B:Xo%0WmxN1qfcj#R=noCO'pUHw0.gCJ,ACCNb9A6:NE8BR;oV19hwe(U,d](9m5L*Q^Y=/Vf-C*F*C8#[r=G#%2b4##d:B?*d&r0Wm<w(:Rw`7C5.o^M/a:D-I-S#Cq?NDG5ek4WXXD'RiBZ/xiYHI^YdJ6asSeBMMCRB8L/bMLdo8;_a/[b];e]#w_8E-^_==C5GTrC568c9t$N]Dg[Uv/[,5&Zv'9;j`M;EFj(Xn/;IglB5iILE*G,aBQc]*$qbm#9iZ`I02MPpDM`xZ/wn9O##1<V(R%Dq#0[U<Bn47E'k*M38UNY;BDA*h8w'PZ4%qdOBv$O6BSg62cpIq`3AV1]D[Kw45e*B=l*J6)/wZEx#jvc,SQvS?H>e;Z^Z_BTN,C(w92%(R6b@5+$*bxUBrHj$BSSaF(7DF:(%`vA20aZ`'j>Ww:.v(S#$]3D$sn@a.<K+k'l8h8#wr0_'j]7h?$1RR96m/,(R$r19=/,p9wF,NHVG'eL/9Y=K:4vA$ltev79BPP5^hQG$WDb`#)<f:=KSVX/WO<r0lFpN0i`U%]9Lpa0SrEG4*X*)%SRuZ[Wj0tC^#a$CT@xM,UHpg=KOaB2x?O9C]B<<C5QT?(0)8V#IpOn#]<x](2mOP+A=T(1U3R,(qSL(%rYgG?U>pkC0hnS4AdGo-;`O[B6I1c0pg_s8?OCi$;X9J#lohE06@A<C&2[h<`]Tt6lxqU/qs&Y1+b&t.Te7?AO-FC$eCdF/:Jqs/tt,%#?r1C3gG,3/q3RxVi]*)Dog#nElmD0'O*+S##'2^(7CD##=K8RGdaa))30&J'npwc#.F]nK#h^>##UPK7v;GT<pfOKEO,X`BXAi,>diCP.t63%'MLN1+h8l7AsCgD7?&`3ol93k%;GmiCUw2D7`sN$:1XE/):frt8$R$G6[:;BoUD4g#[A%@Vknet5@#QN#[BeV#@1D<$XI30-v;>c<APa&4pcws0Avt0)fUV%(fvYi$^@#Nd):ch'kPV&1j-3pUggOg1qIah+0WxH#mG<M34-oAUhF+2+C%_[b*ik>CdEKv/w]p?3-@<]*D@$BV1&G;v#=wU+&)30H+IG,H*iM80#gH?06K@vB]GLPF%dT?u]AT:?VUVgPuc($-?hwL@sGoE'if_1+.kw7JZsRmU2`mP*XMjs5>DYl$&;<86ajID%qRU+'2L/3-$@9F#^rK2haQgcc)xk-/wfpo+*E[)$hSk;<dLL?/:p`o5YRbC(4n=R#Ainqeoi@'6XpSX/w?U_pWKXkBE4H86+f(Ja^Y0Na^]=V@Bb%&-bW/M(Tw_#(UKxh8^Z:2D/c)2e_DEgDoh$NSP@l[#a:sRWD4;7pR[BR/m4g:#/l.l2#NYS/x)b..5i5X]vnW?19E-a7102I##*Ms(k4iv*ihuc*-gl7*eGr5#1tv%eS'gE027:>#p<SHEaE;,#%W*/#%^oE##2Rj+/5Km(*3H^$7.*jCju*V@8'S0G.VS>*Ha+$IxR17##6FI$&/GNDKU<X),)92E_3v:>jv0,##@0x%>4c96(q8B(5MG%OKC*jK<@ADBhDdFBhDd,$.L)80CF:*CMb*`/93/FB^9%x%R)bXbq&NF@8A.w/HgBqE&u7/Z$HUl##,`6$/7+:7R@2.jDr[:(k0Xo&k5#V+TDLGKPag`bUoPdnpb0G(Pfk>'<gMqC+CBAC)d;=g$+KM6X4)dbBOH[$s,kW4*>ox>A.KeFj%l6DDQ*e2MXrh#j9'X;j<Pp5_YZ]-@J@8C[0uk]iG=f3ZtBKJs)=.#&m8X,>8,.#[&6Q.up_'#&,v?#(SOh5&((O3IW#QHYw^8GeCu/6VK.o3jW0a.Y0FF#(&+eAP<,M3<^Cl4+K2PJlQ^?##$1u2JN5-;FDOQJs,%2'?hGm2g]o6:dK:r&u9AY#&vPY##-4u41A4+2Uq)X$s[4<:0_8X9MC(q%Efb15C?c6##6[P%`5&7u=i=w0oLlbF_.=QJ$(Jn8w0Ur2G?Dr06h5A#>TlXBni[p3dvx'v$SbgCQ_<.K#j80C1(K[$sb99-bI10E`H_U#AbBlCpwM>)RAq[#=l;B7<D7h%v;We16DR1;gtXi4]Pph%VwSY2cY@?Gw;i(`d$Q7#%1/W%U3XU###MM##6R^BT8mn.AHmw#>R'b#E^:<08:m_(8KEl(%rW9#Hx24[7ih]BDV[o5eFiX##V$t2nYYw_)J8hBc6^D8w0`^6dF7Q<eHWiD2VP$(*jmc'wHZ;$6gISISBpx#)eH8C<w5l#8*/7/CmJ#0#@#`$sRLKHlFr;%q1O3@=A`k2QqQ0'mHt)Ha&[/88C$-@=S`i##ls51;R1U@uG2p1;R1V@ucD^1;R1W'ML7%B>iKS#J_`*Ha&jN#+TDPDQxJT#%KZ-#.xQjI(3o3ES1=sUJ([j)s,#HD8'H$DREuo##1@e$5@j61;UTs&Q*qZ*)%B5*)'c_FLZV:Dq;h@06i,<2M*aJCK)P$1vlaSH0wXs[pa]fC/6wq$Z5w)F1#p]Dk)gPB:9Z@0WgS?#&AC>##HDh2G=0gF:9.lDn=M:/KTLN(fd-.F*0s]+A;gN#+[<d1rRYO&PtTo#xX*?He*2%BRKs'##'wA<lsFoCVRMl$tEYtHF.`-H*iM0CE4$_'R3B/Bv+8oEjjgdElbccEm`lDGgX@FHdTaF17Eix#aJbh&lj;t=0d8[6Z,lo-;4Q/#(//V3+2gGHF7RU1foE_#D5ah2Imfs/X$NZ##>oj#%7L8hG^2tqInuY=i&%jCUhWH(kPJc#BBg`HsU/OaKqU;##*gU#[n_>%on:.&b`<-I&xgr12__JBHh<306h6J&ljl^'QXoZO)5H?YC6x%eor3w*Z52e/_OP6#(T_T:MS-YDHI+Pd;d;A#]/F9Bn&2+(.2`>$VN9_b3P9G##56tX%rsX$+cc,D_,WsI*W*u&S*G1DHgxB#]GW1&olr*#[8Wg'klU(&p0%K&nHZ6B6+K,0?O<D-&[4V#(&C`J5$HD19t'[hf893bWi>EDchE#&5<[>$)/GDT47r5##$-m$Xat=8#md6#-:4ZClm*+ZsT3+/q0+?%UYgEF-$g>cZ5FvNE6C(##2I:'p&;o(qZ3u#h`kRCuF`T%on/fNDH]A$=b'ECfR%/6bsh9*4$7W#0v7UBW822)S/.F#h&sk1:h=p-^)GD##+>q%/0LF/xN92#*L-8qIl^C]RR91ArONI1cA^EKB<xdCJ>=Ge0VV*0?:l9%+0W0ds(,H(h`A=HV`7^(5_1A$0Do)cYg11`,:j2ds(R4`,:j2dVcI3`,:j2dVc[9`,:j2fP[-:Z;M7#ds(k<`,:j2g2<QB_fud2flw9<Lt?&I$ur41LfZ6(-$Zx/$rreI,CnS*#fCRcCj'VcE&.Pe%:L^3#e#rA2LI_#.8C(qCKuX2uH)bYIB@P)r,.4V(gaD'&p@VT5#tG9BQYl00RP=K#(Le?Ca?#Oeoq,&.9qA@J86QV##$`'08JG#7XR;BBsE`#D3Qah6[Uuo6_pv=(7a<H7[cdl<(&Hv>.[IX#^`>uFdmfa&n[oY`G1GJ$q4ixZO%8ktn?*([:+M`(76iAC97R@#@,]o4SI0PB8PSR-]l,')/rvv8FQ_0'21]r%o;%Yi9nR`6Vo8,D+l(J4pSut(h9hs5(e-oB2L%,/Ckv18TcT(d*.l9=A1K&0?4**(W>9G%r-#^khYA?9O21W9MP7;/$aJ-jbQCM(11Oe#>OQO&3h]8NIrEW(0js:3b4rK$X>-##@#CR#$0<E#r?NtWEgnw2GeP-%Z<#HY[%8C'l08xoP)]w#O?/?3&M7aG/.vxc'Y=nA.gJZn#;$R(Jn*o3doxk9Cs8<JUr7LH<_GU.fOw42[h+J5^h(2)gvKm#Yv(C4xm#ZV+f4]$F9cC5wba2#>dCD(ppK#0QJM+(gY^a%#>O8KJ.qf#IX^)#`u-sA#2LvVeU:RHYslU,YTs3(m9&>+*aIA$A<D@Che<K7(kPV)c_@*G@3NvIobWe)LN)x(q[Aj$X<[IDVv@K6]/4@EJYjd0$=TM/993L#>#f=&PN=>l+?OX-Z)W:.W$aV'2/Jg.UG46,aHNjJp,7h(Uv<Q(2hZo(2j2:*IQim#Nh,D<,G<VK#mcY)KeT7$pAs/*`ZSe`JF1DBsEuM5H,W+#lJq<+%x)C3+W)IBvOpZ&7'<w#';V]+]Vm?@qhar@p:7k?c1X9EdoBd#j6J)5$]:?r+YI)$4:?Z3;#]/CNtgc1)1CZ,os%o4,P9J34XFgA4vvM#%)MU##@0^-x=7H##RHI$*A?.6^#d_cAg)Y$.qvY0=0Tk(9x$g$l33+F3&bOQ.mY4h.h)x#-Fl.JMI9ij`ON32k6C_pKn8d6^slC0B0?f5,jf^#Br)FEJ]Z2>>2`;>Jc*hCV.BZ3dpJ1?*Z/X0o^.I$4@8kCPV(b.C2-&&TVKKn8k:l,>>&c%h<AN[a'AS4GF#H3R&D=l#a23>#GJV&m@Fx$PElOVZ@b7msYwfBYWKP&P<IH0?KGdN(bLa'30jm+c#5N%t]UwDInEr9W]>1389Kwoi'v/&WJT*32sTr&(_ixDa263oP'enI2R$v/95mdJWj,v9nxhT@x3tF:%xde%wA?706ia.@=0Vb14Ce614Uq:@v#<:9p'J$Ed*>86[TSO(9xWX+FOs-(;:Je+FY#.(9S?T+Fc)/(;U]h+Fl/0(9fKVB7W.<6d=F0%:DQZ#wqJ&'TXZZ16YNv$T.wH9vr`FNekRMJq%679n-VR:(Rr>Mo/oh#+S0&B>@3?$=,(XYu]-2%x=&6np'?c=`)s/b]ot=>-j7fC2TLg.?f6AQwjY7DHULS,YS4o#B++nUnNt<6bXlt$]$gE<x52N4FgJZDe?3eIr(vr#&#d=##%xe*Q0+)DLYs[4+/m3##(cL*QB:,Y(0gG4G,AG5(liE##+md*Q9@/T7L:93.<ZF5CvR4#3$)3<dS2(4K1QO#4tX34cG]P2i=$>4A6?KLfJs)BE7(-IpHD`Iw'g&BssfaYZ4)cGeV*0#Qg7*DKo[+It?9p<lob,6,P+'%=/#=%S[%]16XlWF_H<b#v&HG34tXjTg(63K#j(c/<`O&7C55%:hkAf'249r$<wR84nsGo+C8`j[SJ&R#E/XfXs8S,6cN]6kp5HjmAR:81rv42&Hv';N)LOH63RdB(//r3$v2YcBPRTP.EO#[:JV.&#vCfaK#hJaom$:)CrbK+Do9B50jQr`-AtTw6;e$T#&F?v3.WwI$Z/SMLJpo(BQs$H$#l?0C0457=%x*qD2E/<EN,C1G-b;uCjriYY4iwN##@su=+N3;0u392%(aWHp.LW##F#<DKRRHtEZvERFGYdV<l(;s/xS,oMp$na06M/wEj'Ih799J.5fI`[1:+U4-+Irv#EUKp6Fs:/$fYYg6Vqo#1:&OQ4]v,n%p:0t)nhip4cGW$ulfPY%<NrI?sROx$;Av_&0D'`c>J@u##20U#f0lA29?ol,#gG4*E38^%Svv8&[)7p/95O+,$XrL'3k3rF%jx2(V8Nr$c$Cq19Ubg-*R/L(j+7o#?a.h-VOVJ-G^r1#[DIY#%27p#Z=v:(U%.Q5fork/PZ@.'3-Mf33YQE'Efv^g1Z[L#$;=>#BKmk0F.lj$E=)37p9v@V%b#g$Z%/?=^I]<D2B._,c$?v08mK5#]7PwVe4Ew%qsrO*lcOq8@<Q[BCIn$CjCJ#luDYjH`UX7#Ysk]#GW8Da(VcI/pCZKH?b(H##<'R=-$hW._)BI-_dVcVG-Zj$D@K*j)DMI/94;39notYA0D1mbrl%_&%O'JA2%r=1J6)B/rVf)#o.?&>BF<,#Y`Yj$poYwJ5Qb4#[i3>-(QaT4Gn`*=xoQ%.Z%^J#&ln54ZWlw&5<sU$_Cn)6rf*(##_@`*3lE*$*kP@o%Jk7H<H(D*lr?F)8b:V)JtIB$'xx**/tsw`G/4X$`wmMC8:s:%>imGC8:s9+csQq#ep%i9j1wr#$E<W#;mQmkKp8g<,OFVC7udaG>IR1#+h$Bqb#qr^:LUe6$ulH#%K@c.p'3m<MX&hF#&5Q7BoD`6#R3:bO'x=a)T9O,(wt[$LoI.Xq>`ocx@BU*D`hB&DDVe19I0t$&.J_BEf9U79gi/6oatw4AGv^1kF&QkwpE+##l5D)6Ib?#Tk[xGu<Eo6qi%`r-Rtp(h`QTn8Ys'$G7-biD#5lmV)iB(mKYT-]bD='O>>kI8@u)#$Cr8)bOS)(MoN67>;>7lYD5LRUIccRTje4#]@QZt&=>p)nJh98'*345p8NsD1EI011UJw#&H#W[FZ)DZ;(_d+'jEi'66+B:fW1#Em<NJC01INC51`w6+A4X.v@]K##=p.'XG5`,@:bl*b]xSg5:WI-[gFSJuHne;60c^^MSH@$?]nfG.[Da(r:xZ#Nmf9Fc'L+O]>c'>-0gh-C82#22u8A7'BS?8$4xOBX/nV#'k_l6*3>/97JG31qqm6X?(<N/?aN06_0?C8X*cPBlC@l3fcel#Cmfj;-Yd)J?;c$#afu%J9^(<7,/C)C.p>.jKZ7B1pm[n#7ju8A`]lBX]:Fl1pmhc26^6J2GOqv:kcWcCPeC>cxosI&PN9+1kaj$muvm.NS#A14UTT,D0o0v<.'lE0p9IqCNtHYa;_FdaB4dh)GCn3)GD6<4Du=JClo$,9Ql$5CDM^0C3F3A67;iu6b&T_cl6:p1qi2FDpQ`:/),$V6ZdhoB6BfL*3j1@#&2Lk,aj],XSH7WBnXED15em+14K=O6am)I&@):aHFrRl$w_6>BG<U6c>8E_6Y'Wl6ZQV%Nfr2V6ZdbmB^9#2C#T,PB6>dB8R=V%=gd.fB6x-@@X'*/1B[a@6aro7$X7]$$W=f[)RqZ1#%NJT6d1x*1qh^<C]JdYSwogdN(rPQ#j?G(<*h0K%86oi,[Fif##I+#(TeqG$A9I9B2]f9bA+qV4/psx)q,WX.Bw^6_l+x?ExGCHL3EWD8ZkqS%40)0.80aSB<Ze7?*,6'(;ZH)2ncavPZ#ln2L&sM5_[w7Bp+NvNH$A$9.G9qhfSKU1Uwo$##=gr#$uiD$b;b?C9;r*+K'Nm&$?bg@u')=t3sd_7'm_K#^:VtB;`P9a6JJxLioSpZvmFS&Ux;HAT.v[&ljuUX]8`,#&S:x'MKw,/?0Rq+%vbR[9nbI4)/TA#>UKa#a1pu?*0dK2Q`@o?Z.43ElBIwl&<p(Js*3@##0xu#_d]mGx$cZAm'uVB>OY;/q07)N2&(R6^Vbc.s]xN>]m0W'NwihBQ>kG&5=4--vr(w5uj5-%ZD^=K5`O&fP6/Z#>O>+(Sft<#PKEX0H/Ml2L+A+Lk:`A6^ljG9BQI_+xs<e.SKq/VMIXQ7BJ57BSJ80#wihp<ah>b4bfpp,]I-l##:98#dT.cQ#HxhB<XP7.S];p%Ka/-b*B>;B6<?B#7CaGnsodo&57Y`$PkhjpVXQt/@U.;$bh=pENM.9#Xa^h/92P18;Ug02u(Eh6+.$X#+KD?/94Zn$tYs`#$Y&1#Yk*n-HRh:F*g@gv)Im&#&Y['Cq7Ke-Bi-69:pJ1'MS%39V+PD;jtiXAXmYk8X35L<LR9i:Qo>XFM)Y/Btj$8>d`YUDS.+-O]oB/@`*g+%TFNRDRk>nDp$:;#*Nm<DnBXP2Sk:KP$xK=#*9u>B87(&]%d@mG.;,-3059-I4GmX'?P:ACTgL>HGHi1#&u]gUfP73Bo.>>6k.`wHcO'M8q#-q13<Oi%<Q_;1ruTfH?t[d-wI)O7;bZ32hR1Psahoccgtf?AWi)GD3#el#*8is/w?oOD6@kVKn$o:08Fu''fBKYC5I)FkAm?f&RdmXd;($90vA2C#%a&f#*<K;AXoRZ#K-VsI)IYd0RcX3V+_qi#+R3kIX69U#=&BG2L7'32hR016,7a3I)J+v..hobC>_%7Yg$Op`CR=D9:g+T?E6xw7w$0@#j?6=+A>)'Fis*gBM;BsH?t)CF1d5,4%p_<6tUvKCfcXI-CfM9.SP8VrG1[WC3j7H;l-FV9<1wp7xalbNKkMMbA)NZ(5,[4%#=p^:V(/[;S-RoCN]HD1m#N>##S0$(%VE3#Lw6qX]9iKX]8xGBCd+<-%a$v#[i*B#%:wB#$bxG-#R/37d74kHEC]pLfL%G19iNt##.vx#'i@v4xme*Y=p%9##`I)Q*)[P1nhl5;=bdq)M6e?-AQ-K-;wmI.BlFA$%4PG/vSce>?`)v;S-GNSfNm+H+C:Z#&QfJC6oL$-VP)vkhm,>]5n(CCVFp*IW5?n-;uJk5uqFlG.rURBQx_KG(tS[6*wfC-wTs@#.jm,3v.p4.:$TV-VQ?B8$-'OC`()lY=p%:CrTwuCc+LMg>1n]B8]1[BSg*i165Tu]TD8H8Zl4vBQxI.cA74J7T1O91q&4r.Y;/tHn7?qCPf<O7via-Cp0G1BnO7+FKd9Z(V&C-#=r^r'ihmbB>@rn###c_#H]>]3IW5X(pPPo)1;Qj#4kC*IBP)_@9[2E&XQA-1:1Lp(oG,>CS>IaH@7^a##*Tj(4=iX$)np.)igKM6h.anEIX7X4Gnq>EJl902Jarh*Vg^2n9M8W3DJn+#0MRg2iF#v)a-xi7<E@4.'I-.1:03T@>$VL126fn#$ahG3,8M&#$oKP3GSVcH?bcO-rmIU4c=o_#.A;c3d>#$CrM=3Ed1rn4)Y+8.4#.eHAO&rn8.3+G']CfHRg8&&[HA3It5MI1s_uu/r#@01O_t60Wp5E0t5?d$VUne$[n-F0D5TB%DQd%Fii]8HEiF@H?jv>1;GEQEe2#=&so/h5`31f(UxoP-xutp#'MobR7nV/##8Fu89vuB0_#(/B=plF0`l_R1OLh9038.S0t,DNIq;unIrJbe&PR1t20:O.4*Eck#BKmK1?pE+#&-ATHGiEL%#mst4*Xf07WsXeIZXWl19Fv>J?hVX,YS`U#?i`),#/5:,`Tjc.+&7r-wKdf.*3ZvDQT2p.C1GXu?E0i87X8Ns(S><$c[3jKJbjoC*b%,Bw$X%C*No8F*Jq<(4RQ;&V11OHGinV%X2w2(JGUX(JK.rB>??MF2SVo/xZ4?#)c9aH@mK:2i)ttN`NH3/xZ4YO^);jhfJin(;F%I<eZNW0Y/j^#RM5nI(hV)=+2:*3/NVw-Gkh_C*%DOJ9<sf3/M.(27[0)#>QOO4*4ul<D4+?<D3G;#&If.u(n%g`c<I%.E*ebDGJ2A##>MoG_=Ug$VUP2#&S[>BiU481OgwG(3^teC3;)@3-plY#**loI(kN(W4vxv0v%CT0#D[E#6]PR06`TQ0X#/B6,b+XF2[TP(;eCr8&0550&dlGH:x@`0YiOX1sO[]%VK;7%:<v.)eA;1#E*GRBxW`u$#N:ZGD-*2(gUn.#^+L8tc%YIO%_Y=O%^i)GLZ[t#G2pNDm=RhC.oY3+GUH@#&>e%#%Ihc#voGd)i%'U&wDR`Br#BsG'IlA###TO)GCFM%V'KT#$GGF7D(1cBjG,%-[f(u5>2WhCo;,]%UX0w%Votg##Z#X,uovY,uoc#%BXT(.)0GCYdA:]##PBpAW&X`BP[ZV2Q_D8)8Zpr##fnL-w7Vj-;4YZF6jnP88J97(;%vK-,Le.%9wxe#&@_m%pP']B5.EV<i<aP6'_^M-Ad]N#)naM6c*J+8]B,2GBGn09n(iQ&$.OL5,h'+g[i1s11UF$/q1nD)-%mo1ln`k@pQeH1s=Kj)c`?w)c_9YDp@OF.Dh?%12xrm&53iV&54x/I^tou*3_Pi$u94SBuADQ2T`6&$@dls*?uT3#$ua<i+URI(q46M#+>O.Bjc:<<(nx?&PNl),YS8K##Ceo()mCA#Y>#,YvLjR#%rDf%ovi'&ISoLi+Rk@%qD8&-,;gM)/F>a##,Z0+A<mq7obCv/PH27#$&mj*-h$(7YsnR0,$<M$rsqOBp+bsk%oWH'?_a'3I(U.=N:lv#$c^E-<O8Y*Ntcd#_A;16armN6q$Iq1:Jh[1:g$V6(x$YAm]oPolA4l.#DFFV,9-O-^)<HpbGs/DL5jIFGXejBR%`8#'w.Nnie16FN$P'3-^$VDl(6i0#0(27]++vBn2:H#%;Cb#)l=H6[]Y_)i2q4#/'xKFxaR__dXBi0u6k[-?tXvqRWrW6b/(U#.xd=FE^HpCrKc,C3X@.#(CZKCpwcRFB&<Y3F2^T3jP9_%onOr+]Y;;0p7hM&ll)d-d7@b#>[@E'oU4+&ke+DJdZZk7O^OtB]T2=HEi_)#=&=;5_Y,x5_Y,qElH(u5_c4E)qC?v2hAmWB>Ye.(;Bvk9<Bi_BP.Nb9cR]IBUSw+KMEj.IV8_u>&u$S<Fm3o#Z)(9.(Nd=###l;42>FU&Q01X+AD9/BnNbN?D(;x9<2-r7x<ri]m-lO7ww2b>+8ml8t;^)#$j=Q4%qYT;jO;X9U/;S9:e^XBQtMj/X9(d#%8vDifn)HCTxx8Ie1jeJpMW3)c_>a(g1vO#V@m]1sFl5-@0?h:o1tMI>MM&CO84Z/lm_h:dpcE304r[3.*9uQLc,f#$u'AiG@ji%d7;68$9$x#%nqTChwHa>7:ne8$3P8VO1/]AW9Zm7vq4r%WF+VJ4rVN2[BFg'u=6Q#sa?-%R;/d0)mlu7tZB*BBGtnK9HGF#Z3b=&BP6(DPnM>-+@)`$[k_qD`o+pX^ukJ@#^-LD07+N#^+vq/Eff)1:Nf6(Tl:3(ThGgLk_lEB65laD9_v)2Mv.8D2Bt22i(FH6[^UE$Q^l*CjieC#BQTRCO1'O/92]5(4I3+.)1)?#&%Wj$VdF]%G1om=h*u&1s=L[14CeR$kw+`Mf?Z>$VVnS$4_KNO]HFd`qJle#@:ov#[M&K#>`4XQG4jEBQvFj9t.W&ELo]712SaDF&6Fh%PBD?,V9V@?Vqhh6;.Qe#fDZp%T=]&G1l`XgQRxFe4,4(*DuQN8@jBIC2c(s(/,FjDd7@fD,[e^G)9[^Bn*qP6x/$;$kAUsKMsJx(JM0%/w6`=1OU_/C<.g,)8[4p+h2`e#h45o,>8)B(LCBf#('en*)$C7HFo:2Ebg#xB6J2t*Hlqs#vLuV6b>^UM7?w8CVc&2H57^UB6>%q7`)tMG&fI84E3)drgbj]@=<6$7C@$[1/&1-2L#:,$2+@&npKLA%sH.3drG=D)c_FY#>JTK#owAC&53f%1/.mk1JSjm$NW7o+xs'f?uD)PF&IX@.VsQJ#>?@0)n0WRT7&d41sCpX1sIue.X5GM7SN(Afw7Gs6F&ik0XNLK5_cdu)R33l.===fNP&lU6*aYj2;t'j]4dnWP$W=e1i0xv#%:w_#6ACn3-g.oCkRr&Bb4WS60f<8I'IM4@hNkeDBL-hDPoktHlSfcDY/-XhiRM<iJ3bkTb`RMq8oK)#Y_)H(Psd.#R)M^)`)&*-<jB3$;NE^#jYj6D0oTQ#/M?cd_+`':Wuv01U/Tm13Wo*-@'67#+T=`32r>J869KF&$4Q(2O&>gtNDl?K1+_+>udSxCJl1D?0rd:-s&,s<k=h&@C&oC#@746$^+nu##NKH-vqY=$;:lg(q4[>(rSIZ#<XokB<`?m#w%%1j5,R3#Aeo<lfeKI#Av*)cuVZ]7=@.Q5q-2E1H-=X;/e/&nV+rQBR4@wHsNqf&9M)o;30bdDM_]e$3L?fDo0Mm##]Pe$LJhN-_4b=+Aj3&#(qk,E-D;?HEi`%X&1g^(:jld%XWA:9#CX;/;4<'$;=U<$A8CnE`IUiH+Eva&PO.$1gu==j(XZX:/(?P$&0:(noEt*#E<m<6*H&j%srfo04##m?ZH.,%;gwqb+OJ/M/l]t(JFt7L2ChqN,kK/0XNw03-K(_&ReIn0O-AQ#%'0+#%9<-#$an&#%'9.#%9E0#$b'+#%'*)##<CB/B9J:I8;;DQ[UdR@t;C<H+p(Q.up[Lt6lBQ22QF?EI0kpU439eT2)0C#6k_FDMdA-(4u$C#&+ec=gkpG5b/n@2p$vf6Wd+81<)er=1BZ?1:[Hj(OaZCQG+ps1;cZj6a6]v3.EK;K7-US6]xbRq@JC-F`d#<QVJXHVsJ.j*)7'i;/QGN#Z0''#H%_mH]kGAH]dI&HYEnmF$N_K6F8iv#]1ax6b'`?0XN@S@tCiTZVB*@(;b,S[_BXx.)-t[?anV^]).fG$W9hNCk7.Oabt5=6d*'U@v'[g2j0^G>n@(P7Boo21<)J:6stA'J1(Dh3-@=3ueopt0o(UB6,e;W#$V(rJ;8GM##,5>#*)pqBsV$p#Itim98RsV(/=fxVp3]/-x5^S08Dx?AP>Uk(QjgK#P&4*Hkq$c0YT$_1:ft^0Yg6c14:_D141Xv1<(cu/PHA>0v,Aw0ib=B0vcfK#88;,8>dGo.<eJ-###M4V8+X>16*pU1;I7##YfH*%XA&6F*Bt-#(%fR^M&X3H?`d2J=$D^06ghr/942B0ib'##C-j]F,E/>1/S$f2q2t6<eJ8gFM`J26dED;qJ4#*<eJ>tF20sg1;vD3F*gZtoX0HgR;>$Zj`;+]AZ)kq7t'$385>Fs12[M()TE1i(<$P`QvtNw08:nN/u@d%6d;.(AQ_+l+BAJdD.X,jIUE.hidLm7F^g_#5ZoVY#$W1O4%qW*F^g60#$3CO<-SCQ%q:$hBio`e<3ImMCKnjO#x6['$aoT-<eJVu$/5KL<`Rwp)LgG,B;^t`6`&T>C7nZ#1q:wE&9j*F_f$;6J]_jI#EhBN6.pntGfC_u#N<(+IMAP^Bi&2G&PeLt+0EMDL5TT07#<X`D,L@?aS:SoCfbf.(Unae-]kD,5&iwe0?YVv7-SKEDM`v/(2PPA,aVm'5*.>96]'Dh*gCsKL9sUn0Q`,gFPJ7v25N@N0XseW;?e47E(wuZ8[LY$KF]<9ClpN/.C;2B%<#eBYv<Kr6*GE>-DuKA&lmP2W-N'53-T/'C5FHN#%BGl$]TrB6m09HDHxZ?EJb,o(:OjY*Ns;SItGRYEHNr@C9]D*)GCR,%qW`,%on.1:q2FbA3i>DRwtI](/IOg$L7`;DX%ei6*ELY,DYv+#?DkZZt4]v62D.>-&8X<*cwlD(1[Hb2,DsH#JiKm/5x_V6b.oH2nP'a7J8RT6cm?](OZ`TAqA-Y=*/#,pR2+g/rmDoUW<I0X'A-?7Xp9nG:*g(S7ax3-wg+1.#C+.K#mgB#NupO3Jgp=Q2Eu#EdNqY[oR0s(QFQ(#]3qR2f2pGHAOqt2e;ul*)0RV]<0(YAXQ,j;jOVb'MN+l6*WVjB=IrVD@$c](fd_16bMDT8[h.wEKCEBEKCEdCPQ]p%9wwtF^p>c*OoqR(U1DX8?k`l0;s??DoC)eFFf:rHS'd4G):%B$s4'QQboQ$C9;Tj1;0`iVR]7O6c,:P7(l[=#X&qF@=TiZ9nJIG0o3JtG`orTGDSiE9p3oEGD]SB6+K.P27Yi0#w^4WFBbv5#dgVw0?I`'$W@cYLUnxE##d,J5id;8*bN[E?tQN&#Ach/7`&d7&RnIM%sGq7m$aal8pJ9r(/+i%&lm&>'uFs_.v.bW$ZKeEe8(qPD$Fau2J4@CLhqIWf5=4n#a?5vK3ok?$Vw?`$=+k;4GnSp92*B5#]+'eB;rM^#hE?RqNZpL*a/f=#=-RAW([FK^2CP$.'7#h7t]TxVkxI6)GDW513sr<6pChREJZ2x??jro-AQ^K0mLjnLJf-i*`xfV$6&uq6,8o(%aCM6;X+w]M15MqdVevC0Sbcs6VKRF%tL1k@;[gI12]kqd+O0[0ikK.$NL3Y6,8eo$-sTV.[EJgH?tbE##6#2#$r:9%on'('MV#/#k2o-]lE._1/;rf(3t1i#:BLWqm,C]##/L'#w@79QC/%o#&R`b<(n?>**cXK#$1D$.Yj,;#Yur6&^FdY(fc+5'MK3E$t?#2[G(bT%p@XY.@+D32GU:E+h5-_)6a^(.#2>.T5Qh::gpdl6*13[#0&09HR1b`8UiMiCL&0t0l`GDER$og7=?lK3JPY?#faJu$@tqj5_lSO1:gW]6FT1l5es;bmreg$)cjPT$8MdGFGFXvFF.G^CN`l[6*CGr7(5=ws(qlA1qUj8EekTtD-?qD9]KKg)is6cFD`(vD%b8*B8:,R6b8(x#(1'<BIl6:.ohfo.ogwG)eY)u$^SiH6bF_;%_5r]DKr57(9Kq726fU-#$2DPb^BRLad`HCC34Qk4]jL;#N.(K0BN:I8sF)'Pw-_a)LV1:#RqmFs-p?lE(h;1/nEk2#BX([LkM[E0?Gd#?rj@)8?5tU53%d/SpYF8##-/k_Ixx*4*sF,VG%J)l>2^A#$D8N##/pr&P=pcW)XSF]Q^a[4(&3B$;?l2$bCFM1RxOaHW:ca-x,BW`,M+P-[pA&U/`o2-]#G*U/`o2-],M-U/`o2-]5SX_48;W6h4a'6*3On)n)MG3k0tWj(O<M5[.c1#>A-&3O_HgQ;KGs6*pm])hsd2%5x90DDrQF6*jIQ$_rn3EJJ4ZHBw9)2K?0HHPfcU9EQMmJd]&<*J5#oO]?w[5ZIg(3E$*PCVr9l,ZXq'8mFtf#*6Z/s(R1L*bE6K9m+_ib7gSI>vM,DCq,D(1rRZV%=1C3/qngG#$k>g+AVpE#^6&7#A4-S##?K:4h?E]AP<S#@9>:&/AN`($u1lJ#%K9U#x[Pe%ZN0p19b)K#g8[#DpQ@@a`7%ud;Qb9/92M3+0PQI)RHlX#5oOIC%MCC''TC$2,=@t5vh'G$,Hkc2TGm*=*u>f$%Pte7Qht9B81NZ<*r%b#$8lI#)AFdHN?gN3<TE$%9A9h$daKf2Ja@wXbCXC#CL[+6$i*mgInG,#?(Ga#T6sS>?)9KARYuK%p'pf%]O,HK<k*DC0deFB<GeA$)1U.7Yr,@qPhMMCTXnJ/'*-?##^U=&&opoHH$82HS-%;+AE,c3*X@,%T8&H*k+++.vRl=&84,^$V``O#hEHX]t<Ts%Sd]c$-EBYPM?FN%p9R>#M09-F#Ywa#5h>uHCdq(Q%0;1##K;a#tqRYuucnnnoEnR%T'sE#L##.b3c&-##'#&Aqm_u15.q2imSNOG&fqV&536++GD8rK,XfuJlQt3^_>q5#>rm9'sV.?)Qd81%.dAfrT^E0$Xwg-t]JH9#CZ`lDP]:U'jP[^ebohW,#>Lg#@%:7(oicY(fc*+,%,*c,%,S>+xvpg#?@kp6bJxaIn>94D4ildD4MYs0tMEs2h8ft.oh(&ta8G%EF^b-r.(/P%SRJZ<a^hZ*aE-r)G`Aq.BR6&##0lk%<<>eB>8Q7H*VbTFi1s3&Pd8..'[Vw#/P>qHG4+.H-#p%HT)tK)M0dcB=sRq$mThc8ZDh(-tSPguF[<$4*<5<##7I4#@wnPCLnKcHu<:^/`Us#1/&qICKheD-rkWxTkVQT#_'R/;eL'PDHHrQ5Zfo-(s@.p#EB@1C*T192hAv%7IkB4B6?7o)GDE3B41eU2kv@()c_Bg#$lZ.1ffZg$?Q8a2i*Ge6;0)M6[@nf#C/45(JFhD##1oS%Vi2cBn=>p##m7>5_?wt6+:CA0XN9^1G&W96l^_B5Ya_N)L)Wq$Xau;B6>^=13EY*4xlsr#$2Jr%9,0V:q4*8qJ)L52fW4W#)u7`21BNG$dG;VDM`;x=0kHt6[a]Z#qhQq#FmLCSlU*AKM</rSP98$X$?a<1UAUD1qfbJ0t30h0o(UfglJ?WD0o:#06V#_EHm&F#+q'mCk0B>#%;]*##8*##Bh)_0Q=T1D0BTX:9Q(jC3X4A4a;hi/Scw4'MK'l'l@G%7`O)_/vE*4FX]G[6'X91(T+5fB;T.'EJ]5l-1X3SC8Wcq0VqlF?VLPBTMfWl#64xX6[<I#?]aEF#%`o)#+S5u/w6cg#=JjQH?arQH?auTBn+9HC3F^R1Ts@D0XmU:(U._w#(HW4C3XFw##PY0#B_$8C3Xe5Ip^.^IYiW2Mdw<2#PL2d0vYpf1;Kj*4b]h#[i9IoK7+BQ6HUIr8.DAZG):*(UJ2YM(4voo#&(YQ:J:r-9m2`M*DBr1FE^6xCib>tF1xT2H?FT&^idINVLh[l6cFbs5(Gi*#(.jA0oE`:$g;PR9i[Ic6b'b<-x*tj#%M+Z#$t3)#%M:`##(@f=3,dI3.(w8-xtZr#&Z,T0ME:t0ME.C0ME+;%SROp.81MmVO8+;r&L-h5YYXP6c5@3EtAV'0u9>*##NKY#wRD3-vhGcF'fpOCfY(?#>e%S)7$`.,&WV'$<(VAIGRYJB6d5bND+m-7^i')BFPV[%SROq%SROs%SRRx-;4v4Y$MXT.ohlU,>J@M-<p&7#uxvm(nI=E$@a%s2M@'LK6V$u@8pIC,HhpX#6Ix2?b_'S*F376mWdT9E/Z?f6b:pL#JM=#B?r8uHB9l9C8YuX#<cXpC=Lu*2Mctv##,*n$&qKp1:%?m-@T7c4&+ti&9]%W/5.CG2m-M%D0IR8.tPb;#&7ra##$ON/9sua#&Io*1J@lf#)-jFK7Jch]8)2X#FA#78w'09/wHocZ%$2;1P8&4D2Up*D8e;u(P)q4##,nR&).o(<`[(WCk%XjHL)roEHWF0KV(*H0<M6`#h7_*0wUKSlYVC^#`OSVFY=ob/xU+a2hB4s<+Z?`/(.wsCm;liCk7L7#<DqV2j0^=AS*[6/w.EL-?tG</7`O679iD)a,@^M-VQFN1:fT='+c`<08FHL.qvS0+j5hi@t9GhFXJGQFHwlaE,Yfw7>ClH;XG:Ae;_Xe/8P</2g&J>5a5VR2ivLAp1T8v%r'9a/7DuL,&:V]%owV5Bi^8CS_wkN#>bd[<Pa*vF)Vx,/9m,]+)Yr]h%P^&+&8qA2g2ED7TU/%k;T8nF5]L96,5_:')2MQ+_AZKN1u:BJu4>9#>A3i)S$9](Vk0qQ?[D97t&?r6,4Xb(VKvr(rKde)0j@h8s7YEFA<OZGBeulF[H7_1:^u_(UL#F-cr9nYC(5BC_;Sn6cOs#F)j1&d-S8_0?Fe/#HUb1UVw6##v?Yf(4JL5#wI=U1ql]7#%/:7CPdn;+`uq(+]Wmr6=_YB)GCTo+D>U$+`Y^E+_6h-'m-b/#%xDS+_6L$&Q6De7CcY&bCYKm5am%]T4J+?D:@*_Epf0C-+IB)#x789&pV?H..oeND8QmjV&DV,CNtJC#^3l4.G#0H4v3Fm#v.U-'*MRs19j?h0Tx^@DGU>K$;<B5-AdR.)=1r$Cm)xb3-IgHd'STj&:ffg@Qv9Q1;Q,I1;i$(#CAkB[qgOS&908L^jI%l6d?0=3Or<$WE)mN8;SrHfmG)d6cPYn?to6h&7plk&7KhY&xs1L4EsWIHpJ*A3-rB)PgX)_Y>@+U(NpNXm$cLK08D9S3J^8W/93S0#$t/2#2FNl89eOiJ;82;#(1QYGt).dH]X=Y,0Vh/6c5L>6^&Vl(;>*$=2?>M2g0%K(2Y0u9#Dh=IVpUb2pqAv8l^iS.]6Wi#$tK]#$mD>#$jtN#&G_8k%KQs'222l$%Ds;1;Z2N##,r<-]#EhA78qn':b*.J9b<:#&HAn%SZP-2mSn`6ZeX.I<JG>0YKQq6Zc`MHw/>A3-KQ5&Uw-(IclJ/GBRihIYj'0<g%/f-@Iwp/w')H6dCV'$VV,%$VV,[$VYN>0Su(-6,jkdI(i]e6[V#Fr4WMW1MxY0G`qJ;tIM'/08=c-#)eYjHwG^r7D`471J@i;8;BNf##%+K6^Nb%+K_EI)S1^P)8:<C)8ZY`)302q$3ZqYGK>/j-^)]n78+;I6a*,4@t<0vT6s/i1*L2C->lotGDTb41Ncqm$e<19GGe.(0ui.-$b_(qCk0mNsakHs%Vpsfb%]@EEJZuc)KnvAQ$+w=8;VVY2X_gT(VQ]N#.FSj16+N,#<a-C:3:?-FEiGQEe2SYHAbJAkoV)qG)OUP#0Y`81:#W(1;ug7gMa-,#(CjP87EmfF9jql5>2&q.oj'/$>:a719HtZ3P$dRP?^#]D,;I05]0rCD2/F$($$^H%VGdLUN.O0BEg$[EJJ>B0p<##Gei.LBssj7%TPB^0n@DY)Nh=I#&+vm5ui^(9:HWrCk.CbELnlZ95<b3E_CAN/93M36bvp#7<0apt&/pE6CD1e<Gd<vJol?l-*]1h#$j];0mLj[Y'0lR##%2E$LRqGENVF;B6d7j5D(]O3:dBE?8il1<FJ)NOF^0?.SL=V30=e&QF%Kpk],Yp#>X,Z0Qfh)#(V*P5$S)X1r@RXikuBM#$=mb7<E=$8SKH)EH>fue7o&b@?Fj_ETWBwK@_-o/93/V_mgGbR7xUOX/m?v(/-8k3fr45C/n*N5dpp[Vig2GFKps8FiVX-#$mND:N8UN-;6LT0nN`/#1,YB:.vLZVIgi?),I&M.t68P'MljA$TSW$2lU1]#(Sl-0&[(DX_rWO#$8n&%^0id@tCwW%bo6bIqEm&M+o]=jP.7+DKg;h*-E$#*m8[s$)7K0X(rw*&TK7PXB#wn=MP:t+]_Ej#E9X0oPaf[B<<]<^%wQr;JdRA*F3,YX(m,N*DLuI#4)Ft55?#-I:E<6:gX=b#-/>m.^s-S#qA^*DnCe?5%4O3Xa8^:=7e9@=7e*;@whGcB<GIORQ:Id##9#($%Dul0FO1]BjlA51O1Ob=b`C)E***M7oap9&oPOj&mh#W+blG9-&+Qe&=lp%BR)dZ$;o07)hnsU$5>O-5v@c=5Z8>;/Veem)f*7?$$/2?PurjMQ;=2e%O`?nITL6(B@x/,t*Fp%3sMecHG4+A3kNq]8>v/bR9iFt1@.&[BnOsA#$_#G#F&&t14S,?'Smb7HADQ/<LwWR3/@QB(7eQl(UZA/'M_0%Bg?B6C1%$R*f=q:%>Y444&NV<%CQIE;<_$_Bn9A^&#51op:Z/Y,Agvb5PlG%+'_<H02:kl(3]2[(3d9o(NxD`#&LJK-rlA8-rlA9-rkZ1eB@l`1O_h*/5-f?/5-f@/5/9l@t*7)#%i'7UJN%^#H4>CDn0eh$&_nx1;5<51;PNA/ZS;K8qEeZ8U*OU8?FG916b>d17'Pp17f)P(7=_LlGBg/16kDq18HJ6B6]5QQl35OBsss&B6].&1:5Qc#VU$w'kVQe@+ui*#[DCn,$db_X]>#@-H0EZOAijV(7;rnAU8ZW8$2EG#CB+Uri#,Zpi82]B8Jqe78+8_.qj:q#$mPR)00d0u_moC*IU5d5hBwJ&lnrVB6dfT17)HM#Bl-x1P>hQ##./Q<m8C52h[>n-dTUlP[5rT#$b`DR81IxMQxe_BSfF/C,Y3^92Gc)&<&*hB6JBi#KZtm2ikP;#W7O?9<BirCoZ2bCYhf&3.-bL(:@(E7[[]Q9EQ%@5_YZACNNOi1;eRI4E40/&PN4(H>PNsv+`hE2eQJg-=7=:78-1IC3WF4##>V1=)`W'GHas.<heBL.^suZ8%jGg;rN=@:TmTY5G2M=GYKKVC]jCo9<ghp9<ie*(6M[Y-bnmX$KEPJ17)O(K>(d3:h@u`#xH&6#(:*8Bf0Eu),+8@B6[Ok)GK[)@'(vuBQZDUC32uZ1;IDo#$kb3##dqR%06TIE<-2v9t5UA=+=j/0#AZ5)3@Js<hI9`:TZ%*(47:d#Zhx48.#?7$b*+96d(74RoY0.BNP8W5BSO*/t_$U#*2To06ggf3JhAB&PPHV<jwn)O'OL`#Fx^(5bGu</Wk,H6b&GL(ScNI%=TraD0J-kH>Y7<<-:Hn0tE:YCQ'kZ1s?`Bs)#)s6,5XWB6f*B?]aNd1UJX<6+Dio9Y)[<Gl2cfFZ*d=^4=HdG`_GS*d3CN4m6Db$OhL2@?W7_1;R7^@'HcR=-[6I6';RY-EhnS#$c[l$>`gD%ST-G@v#29#*LbNK:I+H3mX=`i,?>*6aoeg0p'3f/PLl#8WcgsEYTF/Cr5b6Q'),oQ'*SNF0=,u%,TvJk(B_.Be<[_Ok4T5'msiK2k#]M3g7efK#igA7#cZ2(/0:0/@g5U8$4@T##,x>.=Ee[##6kU8xp^(G[LMTTg#d#1l@05aQ]-`GdcluFi&pQ06UtC0Q]r.6u--x)2/'7A6Ump,xB$1e]&#.6?tw5##+3l##mVL06i<#0l(,v1aliMK=l^]]mrM&B6vCj3(t^a#<oou4cme`J$Sd^(4so*DhkL$@t;_,#&>Y2cZ=jagll^Vq^J-e2M,4h/qUvaG^e+m15%Qk##%u3(4dP3&Rc[85(HqnS4pZ)C9`E(->l?NBrlgJJAHuTBZUvpa4>s(#Yg.S#k#)lg)5WI2i,MQH$G[%IB@.[=-,M+6Ab-W(;7E8#h=Jw]p&hHGSeq'JV?:g@=4Vm(Nb^4*.4E*-?:IW;cWd5-Z(Q),[>?`KNBI'.`'eS0ik3&9YFp%=:Go#8Zl6OZ#F3m&$>u5#[DeVKiPf-#9*YJ#,2:YED=d_-^`a.4%s4L(O0o&099T3#&S@nBiXZ@HEANE4,@hgK1p-u6[qZ4HW)2^B2g`JGHNCF9`PW96,T%n.Be11E(mGa(lNB62Mm@c;eT-298>sl1Nf&o6`%AQ@uwC`6dC]*6'=C[1qg?=6dE#A8V^q)J#EwO6'kba&7Ybt3)/bJ9Vv9dIrK3xh/l#<6[Uuc6Df4W80J@Y8Tc#>2-GR$@tCr==,U;^<Bqp#5e2mgGd*q<0?7l@6Z-kk0taBXEd*Cx'o^DT@t9-6P`*rKBSfHv:9N;g$cS5v*)$[+RULM$)/;^c##H_p4cm_uOl*pm9Wgkt=eq=57@=.8;olZ223^PTCZv(rBtDBm.ohrA.oiXS7$tbn#5g-mCTTf$c/Is(6_B0e@'0KF:5Jtj2j.NL9Sa[i<3-().81]?.82FQ7&C2,#-.aM</R'p31;x,0R(FIB8KgWBWXCr6*=YA53vC<;MSA?CTT](tCr(-ENMCCBQnR4.)I0_BWX@w'3qb?B;nurK#g@CLlHrkB2^.Ams?<x18A:h7SY=7.#Cri%pAh^(of'E4auDL3^->09n0KmBt^D:0VC&CDKgp*#$d?7Tlvq06eAN?6`GwJ8d99S;G7<$,>r?A&7lj]3+W),JdIh%8ZbDD@;JmT6`GwV+d-m)`;GJR5>2ou(Tu`h#%nqQBK%5C[+Pxn<8IpX'S@Qr94ZhuD<MIV17#Q'.[toCu[:,8#*)0e6c7Po-[80o##jm`(R>Y:$WJBU'v*%iHapT$#2`+x;Qa-vBopDP'ai+C6Z?JA;Qb;[<YZss9bc1#GHX0/>uckV(JG+>#5hZO:9PwqHapVx:qw1%:q)tYBQ+M-2Mu,>7<E[c/941m?wYcuBQYlTk)uwTiUMbY#.xZlH*MD88LBITCNO`DUQ/QSBW9Ns*-e9R(7'8W)S5q>*5rcY5)4BspNE^cBdJ(II^nX'28jxH'ih1,Bo$YGI^nb*1;n]H'jdD]-&+^i&nq'i#c*v:K:q2+#^+r@mZ*TLtA9HFt+MS_6cW`-oRFj/B6eS+,>Iv?3MSb_LkB(?,vsa0)LUQB#>#P3G4GW=R=n;A6ZN0c7<EIA#$c0%#)lU#6D5MD7XRDEB3;9@+xt,365^kO2heb%1sb-G#*3K6/xY.t,H_0h)QgQA3NlTX@txH*$=-7g3.OSd:K&HQH#3Oemwc1p@uwFa0#(oK7p']T,r/u()KnO$fh2QdBk_wK.83*r3H^cU#w,**.*-h:5#-sf%/F@>K1e8AMSDQOBmvIW#$$hl7$1v6:fUq+n8vK1$iIx:f4_>43G']&#>OtB'_.>vBB`3^0p'23020G0$Z6,qI'%w-*MQ,3#0[+L:Pa&::eG1v><j:[:T5nm/^TTfF`xZ'$s%.I>#lWn-^(q:%xFH=%p=R>8nDO)6rf..###Z4W`Ff)>5pXObA3DCh0$ev1P^$JrhWo)6a_9?6,d#o*iY3(1m$Au$#=j-#v)GiLffs<b]Ns+b]N4j#&?8i#$:te#>PY7#j#WEJ8vwS(0m/X$W:rv.XkL)%UXNH&t6;06dE>d-[9gJ##<b62L&-4'2/YS0Q/M?B2T;<G,d[M=N1Ys=KVhb(Mw/g,DxHa#g_GA8w(8kAl]=k=fpPX/Af5i=/KJpI'9PB(9f*K#6Z5T%ov#B@uwbl6`7cT/u$18=Jv5I8u/P-7E&b[1lIe;BNw&n^(n#:?r`gFC(1ZD=b4Vp-WT,Z-wn.m@';).IVq[JC0CUbD6Uj`._1(P#&[fd7SFN64&#-^18/3E@';-+C5HB517`qAD6PS@Bp,Zx19P/S2i<gH3I#Xo:Hfg=2L[3lBp+X<3fs$q/96'C)13TpCD@&)J?L7HG-GPEJ?M2f3++>P5[7'uBWsr?>e#>T-,:_.#@)B7VI*l^#%)(m##necqLx0O06ges16,kwE3LnvBn=I.1:_rM?av$,C3X=)1:hxNFh*F>C3WFe1:#f@7]O=F?oDAIH*Ae)luF@CBn*Z'6EFo87<EUc#_$v;5?9J`C3:l,4Fp2D_d^v%0V)_+08<?;6[;PB$tFhJB>Oiq8?Y1iC5I%l9^%_c7#=7D6&pIN%qW7EAw4P721[H9E`LGfCPbe#?*B&g2gs39tA^a37iJ&5C5F?l###]6S9Aug0rDh/CU(mo?,:'(1:l2O#$`.E?0rW<FKd0X2Mk,QO2u.b8$=xDKiMKI#&HT=gGFXk#1dfg0q?%#Fh+cI+iU^V-bnQf#/5&k0X52DEajBXF^f^kF0Iq+#Flfm19c>uBWue/E3K[Q#:WDs?*=Z?#=gloC3X2sa9p1]Bs?'f@v5':&53(U#)m^v1;JkJ$AAM.C9KNx%Y4XgeS'gk#$bkR#tJdU0TKXt8$=JZCPcaw0nub619Y5sC9Lq0;QqL3#-.a-+A;mN#+nZ[6bC98#%KH$#%^WA#$b$-#)u-l19d#&$)%H+I[_o.=rc;Y18895Bkjg9C:F@]CM*aR;1ATUDeHui=Dh::'MhE8J[+pRG)9cD1s=L&)c_9E#$m=`#$lrT#&]/'ofiK9AU&C4qoo//*DIAS&49<ECTgbx'o?9h-,;?@$>XbD##5d2+xt#q3`TZt##68A#F;8lmV'%J/wP7j(9se7#Z:],#v(T&$>s#Dpk/6GQA[E3BrvSQ-H0H#*aE/X26qax),UnB7s0pIhpl2*BohE:5Zf#T<3A9q))Via@qVw&#CC'sYx+G]78*d-HA`d:Zu'^8##,^178+sDIdOhRCLMO+;so5?9X-bB2Kih-4C8)j00:`YCPcNr-^(R11pld7t<o%RY>v445w+.WL$_u'BR4C;H*LrxRpCMg6^;4rDl+5]2OSKuf5[*SE61xC3g6YE3.VbFn8Xen8xY2C#&ZSZds;6aCU:-HMGvwJB6PlP#$4#n#9OS,9X/ts$]0I.=D7ntC/,(_#wOmEl[P0N5vU1wK#iQp^M/vA._UXN##-1C)hEE-#AF1)6*bsl-<$L_(nv:_#DE._;G:#SD6Z7>Pj?j%CPcdv/93CJ#=9''/t9ft2Jp*kPO8FV#b@aV;j;)hAVNqmK<dor#AIgZ6tavE*IMM70<ZnOCmCSg2R?uIV+`/J78AAf<heKNJXM)QB6R(b17iuG#0ha'Gf7wC6_]r`#wRCh6_`LC,[=&f]Pm.)#.O]XC,[&U=#`+'M#.>Q+)N::>/rp,BB+MIF1s7$rHlrRFj0OT.)0@J+718cFii[<6]w)%#K]0I@pjY:]T@jTD,D[$(S>Dc-F@@&,%52F*gMYECPbTI)nrSEQZut56_2/MDn@Jc#?IeN/q3ch+.CDrQ`J#W<3Rwm18>+Y2p7,O%SSV$18P7[q.gqk/tKr830>x^J#u/Q3-]#w%GXOj6_;59/r#6t#$ccn2O>lI9tEeG8pS=-9iqF>$$_3x1:hoK<No$KC5F_5Bn<8X#vL`E.B[7k#(:(3CM=e2Elk*:08;1/2Qi)613n?D%T%2cC34C-1:=6)C:ev1GdsQE#2O6SHH%MY1s+BJ##$^P)R:PkQ'PwJFh$4rBdx=##<t&K=e_:WDR&,+-(h*>(hB4.#]oIL#$Trl'pN&s(S*dp.(+<d(hLj',fo*/6?$J#E4'dA/xPJX9t@k?S$k^dBAwZUFKI@@#%R_;X@FJVG]P*v2JlUvB4wNL-e[jY&_)<9CMNq=9qf#^K:;nQ#+x,vCPeEq>[Djx$XdRZ_0kMgd<OoC#$uYl/n`@f#+pG@G/.fWF'VW'XBf]*%sNror,rbZB8Je<9<^7:BTZi^DRFSH#/)S&C3Dc?C81j8%:Tq`=%kbPEv&-k17)R=/r#=BBmuoD##)_3+eanG5/JlK(fbwSG)]S@6B;t'bgw@`8ZtVcBmnCj16)?r06h00#%1MO#*F(^178o^4/?DA:fVwb06.fEFEFWjS4jrU)P1K+CTp;9#6-3hC3t*u0TT_t:M57%J?D&`C3WLc#@1^w$Vc#hBX)*$3-]5<##:Cj$uB9QBl%.DGgD;aCgLInIt=hi42>bG1rRwf='#CfIt=m+6`%]AHu,',&$[]5CPbX>CNies1<*nm;R%eBCPbXbB4D$Z8=KULHGrG+%ool/1;83S.]1*]#%;bf#%;eg#%;hh#%9g.#%9j/#%;SG#%;%Q#%;(R#%;+S#%;.T#%;1U#&SCoj(O_10N]R,&YkBZ06ia2&PNb>TuXw&J$LQ11;uYF,gV69ENas,?[+lh#&6JV#&Gn@02*l?BQX<2C9Awi(;iS)+hEIx-*fu'#$d>(#%rS$#%rV%#%:J7#@UVC#%:PC#=/ZwBSgKw0Q`TS0TBUvJ?UNOC3DrX06hK:#(AoQ0l12v81G'Q*DCG%C3EIh6,m^Dqft>YBQcg?BQetx0tlDCC9B&%BQYj/)GC0F#&Gn.,>;Ku1SS?3GwC>Q4]QHG4]QF((fbqb#$llO#$c2f##$(A(l,Ih#c(hfCT^8*>>,UF&PNhl@8$n/#$lg&##$(mQA8GP6[;JB0V,[V8;C3X6Wb>X8$G(Z&ljod^M'E-^M')^1'.H$49>Le)hSlr-%aR/*+UT3#%'>$#$dKT#&d$@L.r[a#$dIb#$smu##;w<)T?p)-%t*<.;Lta#$*C82]#i9-@IWj#&S[wCYh]DCZ>DN=0])r.%Y#?#(7xlCPMo*3JRT>TiH^3CZc^A=Kt?jBQmek#$t-r#$@I#1oA4Q##8H-8?mWX8V[:]44p13ENjlZ=eaBHIBWac8%3#]IC'0+;lu3E7tZlI7+rgJP)B>,*R&)F/<tc6:Tm3N8<wi>5ZRlh&m^tTC2kH*IB]?2GFj<28w0`9Ug(X7Gf7q[FM]a@H+uf:(;%['(:lGh(mK`E%:0$t5f:DpG>9,^#$V(SBuk<s$[`r])GC2O#$tZ.i-FR;%;fJC*`[<w&POtH8[-X%#rQ%/8[.&S._D5_%;'Z/3csDN###.R3iTBb6a2[I5>qwV(7m:Y<g&5`0Xtg<#:Wg%D6bn[)LaE)-x#<u6;84w)LsT,(Ons=(UOp])M&W,(kwp<41&UcdV+u_TPcw@=S0Cq=Kbm2#$IR&%*T3&=U>+6`/9KQ#CAP7Q#Zl.@SK.gC5Hb1n<L.`UN.^]C4J5/<NoWV/xPJD06wVv6_rVO<P]sd=qm[5DR%^&#VdUf/94I82q2S:Gvpb=Cm)**/94]6&_+x(6bhTq=ic>J,+p)59=JMx>#Lrd#+pC[HEJh=Cm'=RCk8km^nW/(@tDkX@eP`fCPdm@7CZja,ZWBZ30>xOFKx'LBmYQ?h?Sf3_0cM0Q;%DB-c3b5eVM=eA-j6^##S6:$$$$(CPcrH.qR$`>AG`%.pAQtF0@_gkK3:40p9f`XIkIF1Pq%d7#J(4#$:l3*)%#x*)$D0(2HqEg1^VoBn<%]0Iw3M1SJFp##YG:Ip68pJ>qM9qIp%`;6MOBC5Gk&188?H8tVGP>v_mp2mS@6%oo_:@uuo)=,Bun0V^>6(S`:?7u=mw?<$vq5,h';txgVq4]Pt0#%00;#%0<?#$t<A#$k$:#%03<#%03<#%0?@#&Z/Q02*OLA(D$i=h'w-CukWe=h'piBnD;o&_5@06`Ixv=h*gs/]ljY&TMq*P?03YB]<d`HEJEXcuSc$+%wmrDnidECjgY`iFx+C&_4Cn16>x4HEJp.GJ%OS2L&?:;--&kCPcs=#@/Tc#/)c#19G/T=M6a<Fh4*8BQdeY*FNiv#*:RK1;+)x8r('#GZXt;3jO[T&lj<9F&39K#>=B/Cm(/UVLDh+/xY]KGe/^J=ABQ6LOWTc/xccLGwhVhC1%%s3jO^`GHj[D)GKX2=h1&<CNbh71Tc8BH*Jq'C5HB70YV+R?tt(/)L,8s6a+FJH*JsMCNbb519uGWFh3EvC3OX30VDt1GHjX$i+euY.?-6QCq72paf$=hC3=.&6[_W'C/Fxi/w8gG#&Ifc3D?*[Ck&hn06Sr`C:]S8?ERVl##cOb/uZ[@C9g>3CO'F*0YN<H(9RtI=*]>m0Y<0F(9]$J-@''L##/0&(T*'o(N>78(q-lC'VYT.G-X8`G^ax%H$'+8HEfp&LNP&2?b2d:CmTgg6D`4q/$`?'#Ja$YF0Rn7Cate&#Ym`fCW,)aF0R9T2LHt/#@^$xBl.Zg6rQEEM,'7m6(`YQEO%[.SgxBm#YdwX.a#^<#)lXjCMbJa%0w/X/n87N6cw>hZd$=wCPw;I2&$725ZRn-Hc`2XBQYn.#$EK].`&vC#'+Oo1/&73rIq)ca`uc;#<5UcuLc9>0DwSF8KYdRi,5PRBlo9MB6o=;%V?B,S88?d$V`G9@(q-*2j=B<;94-C7.=E10<S,T5&Fc^Gh6IAHX]Pm(Arb19<VR5@t)@=BqXBS9vwBx$s6>A%)e9s7uj%w1PGhRC?%9tC3`h`CIC-s4%q01=c-Qs&U?BN1/&'el+D_v)/Ed;CJ=l]COKZE133K>6dW^XHA41UCj<o:HX@H&d'Zrr0?JXS1pk-DA]2jOmBD=be8_g`'1,5u%8HsS2GEl<$s?x4OL$0eBiJJACAS$kBW4(ugk$+Dk)&]ZQ2(dl2ciLx$)qh.n;<WOqNwX/qNvwX#'`S_Vc@/O:K+hL#Y[@L<NRhGs;w,A_0Np%`hO4oI9Q]V;/w5Q/-H'J3DAaO#XGoh2L&,eX:?rA18NlA#$i4DBMfda>)=ur1lIWIr?0+7K6S[m_.o;6g<8VL4+9#F5(lVI1:9cY$EqCG=_J[D'MK1e%SRP2%SRJNfdZ*#,>jho#SX_QBnKg$#%)R./:rDwB?BtcDTVss;JvPP7pTJ(98*@`J6Drj;,eO2<-SF9&Y*9b=KO-]B6[Um19P)@G-3C7BQvlV1;[NuY$76'#'2>p*D@g94(J>DBWj7V$>0A&@tDc%6a2Pu:J;JA*`]&>4(SD<F00]:Vj>/?;n.bmBQwDl#Yn*o-Bipj)=:)01;eUVGHNL'OxZIIJ]fXP14_w<@tCJU6Z2I18#7Vu2QA3T6&-%U)L2sw$=*Xb2iVdH,,?De)m,m*%W`K)1;%-+HX1;n#&w5I=J%koGJRwK**e(S&5Fw`0=>lk=gHJWHGOSpLfJ=c$PW`Z3Bg6((6'NhK=;SD6^x*(#'AbC4&r$[2ib/w0?AQ7hfk>6(No0=bM2<1I'H)aB>]H)D<rt@S8SNkRS<ZsW-VnoHF72$Dmo)u6s'kq#KoGu=B7j2Btid,`Hql0oP2EQ7`aN[H>oF>,m@[dYA7bo##>97#$Zwi$Z@JK5ui=+##-UO$-WBW+]Vws##-+A$g1lfE-;v3)chFntA+DJ*3u5t)R>cQ)6kwV#?LoaG.rPZ0WpB7Dn<jB*`]GL08:aU(O]]Y#D,ENZXm@UENL:p#^tkpt=t^.Lj[@DpJ/+X6%J,<(2`i7&,@)Y@<scp.K^gOs*D9j#(889A0TpX06PY[*J_q%.(<XP3ed(_6`H)9E)8I5B8Hi#-@SA?WF'3^ECL&#>EVIJ=K=da>0(618t)sQ:0wxK=fJ3_8X2ug##%XF#W$hT;jrfv4EtT6AP=f81:SE0=dH=]8#8(H-?sC(#(8r;92Tf@+A<?f+A?hW9p`MpBt.lI-?s9r#=JTs<1dbU<09SZ8>T:X16Z0b#.wn/<Lw0E<HA/`9UJVF>'N]d#5iH%:Q8,C;NXo4I:aI`-,4Dp8ZP7]8#(-[)6c$J(kNbJ/$D*uu'Vd71j),U]&0oO/w?x&Ap^Yg4*<5R>>,T3*fY&-$t3LU2hHEI-x3we#&J@ne?twe$s=&a)K]`Y7xa;Q>%@V:[8,fUHc*_=C3jXI>aiq:1AH4M/wHtv;NX`G(fbv8<`l)HlFYYCAW9Ba:5qh=1o.8Z%=rN^ARYXL7og#8>F8*q9T;E3*)(qtHbnncB<Po2K7-Op>;*t#^#Y&NHE_r9;jOoj)cuUZ:SqR512Xbo#$C&I6F1+W^1aZ;YB;CT2LndS6bL5Qt_*.O$=c6v,>>Q=2otEo%:gV/t@d$f#)sV606fK2&/HU=ENNNH8@<?NFrw)B22X,J@tF&K8<Za6JhaRZ5eu0VBlnhP5e2g_G;OHDH%p)+1B[xk),)-:-JSW=-<,7p),)C/19Z)-5f;Av=bYh-*-VtiMLdJ.Jm;Zp3,X/&jgb^M#&ld6KCg1e$VVj6(9;]0(o4vK#gJTA4GcbwNDWZ&4a3BK09$'X#(J(mB?:<g,j&q]RSn]Y#sPP>6$-ON##46]%cr(qk[^Cf$=Z&2-%If76t0LuRnR7Q]9L)woN$icM1&hHCGBC8;Xi>iFKpl<rw*o-4$kASPwHR>GuaDZ#(6Jh/ud-HVR?`S&:R??2P#SPFgotW$%<+qHWj+9;,x?r,YfC.ic=G^%Sp-(111)f2ckZu##g)`)6[Yp2QoHX7K*i(@p*Up-<i6i#%h`O#$_Z?#Z/$A$?_Su@DW4h##?/d#IS`i*)$B_G/$(d#-w^GCNKuh.Wn:R#%8tg-v_Ma)GDsi08DAq$^@-*4GnU96>_DJ0Iw65###$>%AkM>W([A<#&v)H&PN8&#>G`4+GoaS$KZGD(fc&5)jSEs@CpPO-?tjl5%Iu:WDF+a#35d#D@GH,%87o#Cn7(h;cRIiGv#Gb-ZquM#$d9%7T_F<$>'9C.SKtV=xs%/*/E?U#S0qH3C+Osu`>(N6Zd1221.SauuCa&EjjjkBX)U%Iq)jCH*rJ-n7wmWbL#WvC:o8K-TVn)klM5>C<45>FiaSK-*V,T##B/^#J(r'C5I%[%gvqZ2g1_m0<I9R&=e9dC5H0$qInwLq/*Z(2L%'A2L%-?2L%0>2L%0B5'V$Y#Q&J`2heTB14:pc#.vbR4EsT@3rlRk3.*:hSR,T>>.-T+0X3_ThwlGs@X`qSD=S6W3B=R[C8Y_R1UPL<(5WE&.tl`l_8ul3CWU+?dk+NVB6Ih>1l(qY#/T8)&lj:@-s>V9(Nh0k(:1Y^#@1H3CNtBB0M>'^I<^:iD0gn8@svIu[`Dnh=)2>e##?]fBK,Bc2*;lD<nr]q*D?MBg2-_?#5LSoHZ&w$n8<&Z$cR_1C572V/q`(H&5KTI6[Uv2+A;lQ(57-o6%VU6SP_#Wk?GAW4+';g#=sdO6nQA[DDZQaCjtWu@Bs&16,ADC#;C=)pKFxL6dZ*.3/2(#W`>76Css5E%;Gm]2JN5-2O%R)CrKjh$i-9?2Mcjo(Muc:5Z':u6E]Ni$oFJJToiR=217B?13un?08EMo>)bW(Bmus=0TuX7><#/X4)?q6>'M/<2j2FeCL.RIqc8JT1rn>4HAO8<0NS8Q0nYR-BQ]b9B8M3%.Zx=8Aqo+3H>WkqaCq@EeriqKU0B@;9WpPF#*>[nF0TT(Gg>obI_t%16ARCSLlv0+?X+x0aGo#=2^j$n8PLnL7W``D06@`NG^`g.-*?TB#@;`SHsMi(?(O3:08:'B)9Ku,6b_wP^1e+?0n>_S6g.mITbD$;'QQt]fCZP+B6^fN.#0OEaG@^6W([fx<oegM&78lf&6&Tt(U-A@*3jrw-^(cC(0gEq#ajVeD0dgC&Lne^Isp7V</TwW3'XZOinG.m2j6Aa(Q7=/QEMWo7@.GIJ?=dx+1eG8,0AYM)6Fa[4*2r'Y>#&J3.3t/Bi*8Lr+Um)?W)[]&EeD.tMY)-FxtGk(Ql-q#,X4mFB/BhDn*?I.<oKq#&[5L%SRP^(/,C=(/,FF/ld?->&Ptd(/,Ca%SRP[*`[3R2G>QcHQ^S*#HovHG/c>rRU#s#P@.v4Z;5i@=b`k<6b/^A*0Nmt#LuGs0>D`KsaK9SoW7[nG.`wKLNRtWB>8#(.&n<Z.#'.c6bXAw#M>iU^_5_qYDv;h6bS>S#P%Xq2cX40S<#]>5eU:o(N`Q=/;IiO##$&=#FYX33hq&62icPZX&,)W&^1A_35GU<2mSn[/tq(M%Tf-a1P.F9##0&?*Ij$31lT*qX%mg$-%8w#%Y$@F5eCDp.D6&##%i=+##=)[$*O>FEM$sb2T`+e,w)4F3.i3W2Mure-@Iw['RtPVC[M1`3f(G,<`PU`*4RYL#SCjpF<PF96+Qp.HNoJI0p7r-;GB2,(qkmYL3v2*7>3F[1M$Q+EH8qW3-?_U#+[0&4*cW(c$8d1C0ld.C@Et7/x<CN0uAeS,v#5:,uxQ%12Jc_)GKn7CrM==0XjUR0XjTc1UJXO1VcK]06V,`#$jt8#(0nx1:>D=APH$_2Lp(uY)4=5`cCK73.jvr:f`+4#]v6l##5ciHrYauH?U'9PuX<jCk:oB3.EsPOxZeKOx[<ZE]eaH1;FE(#2#YSYY6w:@t,bq,'a^a+*]K)$tak;dBAkdWu8-q1OVHw]s$Q.#Y]1m-^2]j#aNPf2im@Y2heh7(//Df7=@5B1BVvD2?ZCR1:TK*1@iAI5a7n]6bSDl#j'*H6[_Jt5f&:gQX254#CxcA15v<W15v=8B=pf41>$uhf4gr1EHNi;#@VbL:OYHo;Lw,5CBQJ308q$?HVtpi:f]3)&Z,WZBt0)'0Q_t9(JYTH+G:>1$X*O[08CYO%%[Qk8$+relh+4NIBeA)Cs+Wa#6)r[qFv^VAQ*2P=jcvM3J^`*#JLFLd2xI/Cgn06%,cRZC5Hm@6+_QmHvErn6b1w5uUKX-gla@)noXL^&Vhpo'2T:g%9+L9=V5=S1K+kMm@&i._kS]d1>jFj1;F&*#:j/F*`ZSU&W]Z%BR2:XAvwD1IspX%#CxG=7:ZCH5dm/4NdHJJ0n>`+BGLifSP0-i9<CG.BG:]Tk=(x*u0&UQ08ES3/;[p*?W10O#o@JT&.B&K#@&uV5vF/a%)7[KHac3<(;a?9#5xX@6ofUQa+L@/6ev*Mqf1[W6,c7w'MSq,bAcd9'e*t32Jo_`3mcZcNM6Sr$twUD#@0+ElY>gj%J%#TFgceM$7C+9Fd^3xhO^E=i+cJq#Q]UDZ,6pv#Yh&<-Ade)5[>k+%8opb)L+oY#JamZFge[D.X5p2##>M./qM=l#>Cl2(*svc(rXw&*O03f#g7*[)0w*dh.V^j#%Bg.#&QED):]bB*c$O:#$j[p?a[qrDM`x_eRv:11rju49nV,?Ek%gU6b@j%qIpudDJ`PQBvl]I-^)aR5vI]hikOZgGwu^n&ngDut]B;_-'HB?#>dHE(;8#eAqvFl6G4umj)>AT#%7M59m`S4I>:UW<g(j^&w3nG7(l1PV4%Sd##,rT#$m/9Efe)s*vA@w6bSrsB`$-`Dn)7J6_M;J?b(sv#*p;U1q(m51:Sdvcx/iw:TiBU$:MC0%omu`*i?aZDnO@R%SZSG&oM&Q$?@GP6eiQD0D'?mR8OX4Z%l3`6[95H(Ob,-$tWe[32vqm$vQ8T&PNue&PNcTUA#85D?E=h@t<'r8nO9g8pvxMPaPsb#';cfPE6N>I?4J+#&I)JnZJ.,&5=kv6cl-T-CA7e#@20C/P`YYB9dr]I<]7dAo*ArAn@k$?W$N+(6a52DL$AX?[-_A#';sS.81rN:&.;#DJpMs9mC&*%[:ITCk9WHHZrv5GBS1c9n1<,1UJXZ'ik2)13mBCHZt.F##$xh2k5a='MQ?i1:Jb]13nlpEHZJq2I()49mc[6j`0oQ(MEhQG['6E%p3:I$@SnX^%ekTe8X&&1l7_.'ig0w?,C$.20<JfJ94FxJ0XYiAPWpRqfCgp(1V&HHX(7K#vP8J.'uLH###l<#Q6AcF+kUMBiTA?%c1rlVXXjk5L*lo08D0@7'riT*e*NY#7BEveoBbd#>RIWHZhh<B6J*JCfP')#+SQ&28t#'Bm#<K-rl5j=(;?MIFN(e6[h]_B82/4)nTwL)0e6,0R.F5C4_'*D'f%HNgYC#6cVNA2MZ(J:L[qS_;Y)Y2h6[K7;/v>?3ik05qHcbGBN8XGC:q*1krR2&lkF(2nE?kD3-Qk0YIL&)6tbb#W(%pEMnY.D+uLD(:8A8(5KS><l'Z61:X;w2TKX#?#h&5>$l`GXgF%/Eff=89id1bV>Lq`Q+-mt%qL8_##,Qq#8WGLDTLjF8$kUoDKGrqEmoAn<L+iU6hx#b42)<HgOPT-3(t[%#)4]L1r3NjZrLV>#?/_]<g:eL2ij'TG`URb6clf/[o[8U#^FkwpCs=eY')55bxa3##].^n#]J3##^X[5((Luplhgam$ZU9T&tJTGD0hBL6a5$]#YYvBG@9pEGDTweJ#uB)B88wDD0hKCV,$Ma3-K;,HAPlC1;,3313lVS;0#ms'MK+S'MK3s'ihR'6a1Du7Zr;6EUx?X%SRPU%SRPO%SRYTP=%[[6[_N.LMoa;q;ws,r?&(2@;_'w$VUPU@tA%D(;uaM(6/C?(sV9&AuLKt1;RH4R:7U_#&7tl#&7bf#%;1_##9NQ2LI'Jb)4fA2L%TUi?#FZ6^nOVq.^bsI<R2pI#3*UIAodj6d*`pq0q231sV#:6d(J*21@*K6[_G998Y<m06^C//t/8f06^=70Q^^n#-Bc@3-H_A+xrw(,+L-71O:di#&Gjb6HF`M1<(j298@b4bia:R2iX,K3qAoG0@9d4M+fPPb]5OX1sM&p1#E.L#$mLi##R@1-Gr<)+-('VHb2%L$JY[KJ;H+;I#1@J80B.G@Aug`$VXBl16u(]$;=vr4,QXr:rw,2HEB>h6ARFN:lu*8>/NJP6,OeJqfbGG0#K3i1OU_%J9XMLI^#TC17+oB2NU)K'ML3^6d'=:.$w0nr(,BoHEAWb/tr$Q3-[jA2N[vO###M)#&4-A(fcWs),)3=;Wtcm3g,xr7D1k91kqtJF]Q7s20;KIJ62gR07,I=3GJPg1Qb<=-;4DO#'5'D02)EQDcV^c#B9aI,uoMr#%^B=#%pZC#$mJ+#$dCa#$*0V2LIZSZBYLD#$EK]&'=n306h&U=f@7>1sMP&##-LLM01;l16bE?6j?wiQV7Hv#,6F196upX#-BAv16F`pKME,RKMEVaKMEo38JXh2:>>/?&54eM06iK5-]lB%VcfL>)k`[N(oDeQl/ir97v)>U8?Fv#6`dbJ;,'D`(5G7_,0;$6(&]2Ng#a0'J;H:O7v;DU1PJV.*KEJ-2Lnp[8[/H*#&Q^=?raiU@DdDA<+f:7#&HG^+]Y4V2Q8i=eoU?U-?UlK#(//76@`kZIYfM;#[n_k2Q8mYAS61>#&HJnn+2Ao#)lXo7)EiK(<1;r(;en:(<3CgB#8sHIYqF4#$dCp#$kPOfP$jb(6-2((mEpK#%(,A7)T),2K_R/6Fn/32dgvbC.qnN06iX3T$1Eh1;lak16'N[#SI;gHd`%#)7ha1/U1jG-Y$`,-Yn:4-Vlm0B9pK#kDBRJB>856-[[IN#(f:V6,Q-+01g/j2h%c^#.rn%5d0^C7>GNBKqj9n0)JCK#hb8x+]Vvh6,9($#mJXICBH9,6cod_%^$hbD.vIC0n%'YCNi;FZ*@rp20:U,DEL@B08;;f++#)5#*q^q/wQ.+'j[S7&B>8x=Rms+<]6(c08E)-(qPB$/qpe<#$*Tr#=/j(UQltc'Q>e^g3Bxg1VG8I((:4P(kx,['sx0=$c=^F7=I:n-B(R16a1(HLlIIl18dh]5>rPf$rrf&4^DE01PHWK#ZLf=@sY5/@Ac`,/n_8s#'2>R$;:G^#$<9W)L3d8)L3Z5#bYNv78*vp##Q+=%#P$x1=#sH9<YhS)8gKr(rtU&$ksfvH*TT.gMV^eeq6E'Hsn5d$=M.`o[Cgs7Bxt`EeV;aBa@O*%on>`iOxP7CjrgI1wxi-Ck'?FF0^a2$Wo%o2eHHwK4][*cdb+B1rn>@2Llh?+'E4U.>^7GY[8PGY?sDVbfU&qFj#:GbBq(wbCZS0bCQLAbRhV#IVb,T-GXrT4T-uH6a81B(PFGn=G8Q?@tCPq(UE#12Kb2TWVI[ECh=/O*`[3Z*`[-X*`ZY:(2PD5Fu/W:3jOZX>arnfBC,g1%Xs?BH:';h(NhwhDKd)I4gKww#Ydv_)66_W1t%<lZ;8ub#IN)idJ^o6G0X>s?#j5r2Muu#*)&'3/?V(2#'W5CKiXC^K6<&T7=R4UOA#YF-Ep,5;c[VY#%;%uc$ofN#)c6q4-0GR$/GVs;+r*wDxE8U#'Mf[=A/e3#].ECdvUcN'iht3FEiInY#..2)M^G>#G-'rD2W'@p1V2:&bL<<+A<p9@w$.fD>cs>B`DF8SlL5eSlK3-I,l9QI,l9K-x5J4+'Fr6<I];=5N2ZR#W;e'CHK_KpM67:OSKHF&5F(i'2/d5c?>Q`%IV2N-YaWfquPq^##/lU$tf?gqJ*E,.%(<D#&bKJXrE+>5w+8Y6]$iL,>8EtcYh>G#%nqHBG)`?2[pi=2MXx3%q8n=6;Br)4,7BFcY2;K$:2]62iO,UC2)@;6cso`J%K=qC/,OJ#w.+=Tim/XetF0k3vJ-W6*N3p#xQ,'#[/'K'npwd*NSV`6-24&3fIgw*DJo<rH#5`1:]tY1;YTe1;ugb6+K.62k#o^I#2^tqf2grD&'3Wf>/1Y0Z#pe6Zdenfuax8%8?iA#%2Wo>><US2R4hJ=XkJb,)h,f6d(h2(;`JC9#<[46]#2t6$uh_>w+R?&e/`K[s'_=07-jW2h?b/6wWX;ho5eFF+T6r2Kdm[(;BOirFm1$Ck:,jG^o+^It-*m2H:)nUfK._06iMk6d(D'0Stu*u?NF^1F70J__s3H0Z=nUHcr8V1:^Q'(LR8b(;+[SG'7`WJ$/l,1N[SiG'Ph7fK,=ODcN'EG^wo+2T7+xuXxs'IN*HcF,=bfHwHjjG'GTC%9+vb#3m2K08FN]B&.E_IYi[%G']GLlC@mFF<1O4G0+_g#PxR;=U]A?ZR.D^C3]dC-w9mn,[=5@]lRFk(WAQl$X44DBR;Ot2Y:3xC5Jgp#(Q^T6*aYd/sK_9FA*7Yp[X9eOUcjRCkT^F23VJ#19vL?+hBKU'v9sT)Ro7#'U1X_W(^I53-^;7RS:DC'qUhf#$N-=B8C,fB6S3WB6f@GCPiFaQ?6Ph??gr4??J`V/[?q]%ZDk%FKX4w#0%b)@Ru^JZ9FZ*07-jU3.jp>*5ijb5Z4qnak%/E0X37Y0tN@]0RWrk07-k2^@R0/k%K]^(kQr[34CNhMSCnc1sY'l98@;=JI8Z.-F^hW#^q)qHFm.@(%DB1$R#waNg]4C2L/`a0Vv1xCk&tHCkL>4<D92o*P&+p#;%ml1s_YA#v8Ig?]a6LIv4)>(V(Sl%=/%^0YM#36bA>p1'o%eTv$gv*FCP-hMh`k2,Fk@o@9ZoCj9>XEhr$KB6>m51:x6'(s[+l(<$oj)h=JP#S-pNF4C8.G%1PgChwKRZ-+5U1/f0`$;r-$*d5><]L&$&5YV8E5>B4r#)jel)4(K`#[U7P]:%rT<&#+mrElIMIqQp-#Fx]e0R>U2(hT#wH>uX)<]dr@B6]WSBk>+8#@K3@##ZCG$a=);&N`:k3-YGGEHYdI/wR'l%SbQQ(:*''D0n]H28_mXV/9XoZA)oM7'.pM6g80.6%r$s_J*Hm=hC32/w-wA*-ckx4*>v'fP[[.KJ^g8+q'+,6ns;%1;d:6%>$.C6dpXa1;sh?$wa)f5_Y-06]lv&1;:f9#,W)]1;uuo'Lqxck`H6DBB.n,/q07G$]DsUC9u<OZrLV=^5V>Kt]&m?#&I`s7$AkX5>i9:2iO.l)e[ei#GZ+%F*(v/#>oT7CVE#c2iNgH#$amP+A<#G0Z5HS*`a%h$qlg#EeKO#Aw+CX0Z#:-*`d(6A;2M]0p7Gc#=G@mPL:S12ej1k>uc96F$q%I16ik>1:Jax3H'7Lq/kj26^skg%SbNR%p*I;qAc8m)enlB&QE4K#9'7J*D?J)^OH2,#%Mi4#&8-u#*<9A08D$$(W#$;?+<&I6cRSN$G?eoHw$N76F8up-t%V405i]W7C47M#]<w?r>V&V+%w%Y&5O9f#%[e?`d@&x#$#u'+Ms+P+Lm)=+N@cB(;1`6(;?JP7sBd@GQxmHDMa[pJ;J9#GRlX,Ee7sFDMaOlI#2ZphhhH8C.qO#(QWLN#U_V73N40hH[%k>(0t6cQl*ltEe;i`:5NuGJ;5A#)Sn&;>.]C_.#'0x7X]R,DKvAB6,Ge4#AmQBE#'#7GvYE:87l,Z4,6Lq&6<.f=G&WC5bY#p#@.=5LfK+Z8R2=%gLvk@4dBsJA4wQ%]nuhanukSg8l^>&:.uc:16?w.#S6wL8TH/v/wmO#$>gmm6BjQr(RA$[LQF[9170D=7tP2tF*'h)##g5B#=bchE`di519Wn9E`I1AY>>>b#'2pDE`JI+6_2Ck-*Pk*#)bq`1Emh*g8Vs,17(/;0SrEC16;^DLNulC1lf,[JC?B52K_Qc#(8V#GM:jP2KbGp6`a@?&P2w6(ac0@0qbH@0t<.O1RDD3$J^j]Bp%)'0#Kil#'NiTj%P.g=,g8h0qg[vA^$[S1RB=j#^(sTaF=u$6[<n/?[,51)H/AFBp*1*#(kq(t/[sE0Vp.a3.*j[O@a$W06h-F&?R[@/tf&b[7X;Q0#gBkISG$x29%,B1</_m/9to3$Beg00tCUd<gfc`1Qv9X&'uD`),(%M##[gm/q'bI#';B/=%kB_O(gdf0p#b82.o/10;fit16C9s-?a%o,E4I38sE?a(RPJ4%CvUL85:Cb9%kGr8q,/Z#,)$465gp0]ve^62hCdK(qpGa35R2;OtaN71QX0k#L-l98s.YY/wZBw(RSeV2nOt**EWpi.ogu^#$aUd#]c_f#@0'6ompjD#YZ=E'wX?s)L*xR(3Yc@/TjMq'4>vS'Q[jN86ZrH86]7)6*W+L(o$o%2heb9k`HWr7<H=Q/pFDV$%b`V6k4Q@^l@J8#[B$%#(.rW4d,]41f[rg#Z>5=8&Qk/5[bY4Hd?.+CO7ep3eNZI2i<jMdrFIlQ;j68)O-=x#DA1PS4jsp'j=L*$$HivIVTI0EE<-Ju=^WTEa*7*(/0V4#-&`JViY:#1Kwho$s'%6$VW<kIJ]V41GO&gJ2f?bJ0l]?J$'$'3._h:7tvv<0F82p/qVYp/o=vsh.Vdj#@/ek#$dAA#'+b:#[@rj_j'O7&T0/IdN+q-s`3Su#(Al)IK:-ejamK=omfi@$4J)44,Uu=&Rw#&CJfdC6+(3iPX5Lde7mBDWl;dS08iHA4,,LhsIAUr6q'X;u%T*=2H?#SJp2&L>ZQv7+b$@[<eQZh._1he-@@VxI:-X`DJr,=QF*H>IX,_d3-K#L0FsA=5?x:j&Pswh&'ix%1A(Y*&56*v7YWUOGZ4ZXConP)$VV/G+]WTpB:^2AP#<oO5'iC=Pub^4B6oo>&lq.0%S@(3+xsdg[9N^>FC7:3#>FW5/@7RK(gLst*O%Ud<QQg<Cx<Hf#8]/$B>,$b#@Q2$Go9ft6Z->PEd*uIpi@2Y#9PLF@uwH?#wnUX3fSL;'$9X+6[`&Iq6Rr#2MZ^Q;Me#i63Qbc4A5q0r+VN+&Glt$04+vPqfG'u%Ta1u6[CcXF[#mquY>l9#PAU30wKq:plmqP'2/c'##C+]#nWJ--bE`fBsGKFjJL-Q3J/Mo#$m7h4+og;5@FQ/Hc;Li3J8#K#F=`>-xEwi#*ajC6Z*H=34k=Y(JG/(qoKw.5(ctwuuUCd%YkwhhIrq4uuQLJ#w^9UIC*S#`2Jf='2B6F'af2:gx@7T=]_'d=]^4EH,*l0C9;O3#v)+==0Q`WD6m0f#1u>/;,.xU(/,nhDp/uv5'e3OH`C.KBS6x)v5ODC6p+nL02R1M4e%52UfWbw6)&k2%kwBC%8@xY7L9,xv&/aD#%BXl#(8PQ7G.Z[5oO*sK?5[hoOt0vFC??)2+TK]AZ%EJJ5$rt3mF1=&PNui&PN;>l>2[n$E;vgKl1:^s`3E`8:jc/03xY(.)[<b-ww4P#%Vwn##*#YI&SZE2he</),)Q>5$o;)./*eQ92%CmFiC4J07R8A#%',x##-27,-R)4#qTx=25Dg66vFsA9&9VP##$At<kP$&1plY#G`TX`A^-.=(JFi9t*S72Ah.qo(/+b_#x,g[>^)+8*)(LgFij+@F+vj_#-<W26FtSV5&idwl^.6UkB?&N0Wmo@5pKv3Y$4]h2Mcr(##ZJV3D:$x$m_kdEIRts(r2;)*4[l/#A&b[2Md=3##ZJb3D9x,+]f*?26oeP6bo`beLmR$(q%]5ClmYl#sbPoFEr.I=1Kq%1VC7a#+uw5AWSEGYEq'A(b8v0#>DUc0=k;g##*'AL35`o1U/OQ5f-?_07,I.6VIM]#>@6a,.B[<l'hTh7Cbxn1UgDtF*V`k#(hWC0GX_qWOs51RVkOq[IbSW#ZDUE(:P/c#TQ9RFCP;TnU-97##7np-`4^tL2;.Io+n&fS@qJSB8LM]IuI?&0MbeO0X<686b8,VL/.uF7ZMpK18@sG-*B1O$;fdK)6^:*-]m'CCl?/QAXJL,GHYe'<empf0Wi_H#AtNgB<;P=-Bi-DX]ruR$<I4>:v;l>3(tqNC&7r$p1_d>#e*K.0i`bS?$vcKk@v.J#`qU@6EMgN-^+jF.t,;XfPw+_$-.k0U.cXh3/rF(A^>J)$V18)HOh=&#%Ti7)ONXRB8cAF(WOaj2j1.]ZV2LlC7tQk&PN18##Au;L3u]3/r,L30uE$W/phs62KAfq1l@+-H;+DM#?2vw<P0a4JZ^#`$V5f`BwwgDH+3@_7`WHT79G+g5d`ne*6+2vDgR2N/q/UUUfKK^#c2*<BBa5vYUToa0irF8(9Kdn-EV6v7<0jB2+x+GK:FF(0o(V^$@ZF)C:+7Qd$^n.#&va<ND`3U/:.A47S3m45daVg&=pcIBT%1Q(lv5s#IMg]78*uj<)O0/$ERvGJP6Ze),148VG8H_#(bR&ME;HdME<T06b&*1$vu0>ChdhCn+*)l@SR0%#vJ%3#;QkcB6$/K2GF8cn9kG8k]2iF#cem@FEA7$3fr./7XlWR#>Lu3.^l?_#>FB/.s@%,0MRRc$`[QO6c3c2*JY$W#?%5C2h/Va3-JgX#>Go<%j#+KqIm_C1@RD?cnb]]#CQcd6rrgO#&Se(B5N'(Am0l_.2;Vfk#^$106n%n#PmVJb@R]4B57KN>HxL(#(Bk*0?P*2.)0m9DF01jm'l//6`7`-#vM+7-^(m>7;ZV[t&;FA=KO3uFH.g)=KS;U;i-di@x*I<@%..4BC;@>BSeu&0nI1c:L@R=7S[B$.X5E57St`#&EAF^BS$A5-ww%='ndpd&dW/GQgAE7F(]q6#&v)H_J#3*X-k8e#$c?]u$Y`dhL4OGPx4@1b]JIp$ep*1-^&F=$rUJ/YYGK#gkJ:*#vaxf6Es)W4H9Kle:$Xhh.X+O2MkT1kD4rCF'WB0Uj7p@UV-`57p+I_)j&'0-Ad9O9Os'G.;XFb.T-i0X%Yqo06KL$m<de)4AiiV#Mgot9iZ];A+W=IA]jH&AZq0xnAq;I%;THl###2_##<Er#Del8iG=M,:/Me5+bB`c20CtpQ;7[e#>XDV#20*lK6T,408A.*%-gddQoJ]OHV>3?<(p?c6*GjC;MSo:0L4^80+fRvn6Cc%3)3_D#Ypxw2Mc=`$gD-11rx7M-w7d_Zro);B6PQ--wK0io*MX9@=qPK0rs31s`b<>:/VXd@e+)$$>`SP2NB,MB3dt,B5.G52K_Nu1kUe%0E>ZvBiSS3V%bKQOu?uN`G8.8#cVm>1I`DQ.vx+k;L#(Z(W5B140)SGj`iIv/w,.g)R,'-g#)(3EOBomH*MCmCUhBl&8M9^BWYeaHc:G(#d[m?AW#`V`_cl*#&Z9,F%f<@5^eWBVmiYcGf81ECVDF,'OGls'MSF;%YOhs/5-/*CUx&S#&m,rj2AMd0?4K)$$(E6=tR@:K#ho'@Uj>k%94<M@#J^M=b2K$)28g.#t;I',,3Yk1rRYOG'Hs<6'mvMYT#4GJp_r?Bu.mkEHlF.#]J>0LJOIG#PS77CUX7T)GC?@Gvccd#:LL+B>CCiG-,Dm??gwl#$uHlt*S=E:YCa0C8k7i7HkB4CO&(<_JPQV%SS:/@w%og0X3.B0X)wo#(dmw#>TdB>)P+o5`(Rc#8I8V:KkZ)=&&g4#?M0J$;C]-BMP8=F0SZiB=Vw42U_cqS7Vq9]56@N.Y(hu+CR6?#&Q)VkrAEB&;_GQ%qj2^#*4%^=an?t#5)50D,_Qr#?'Df'RhBqJmMjk%q_W;]5+5N$hQv,CPNK4#xO0IjA:R<5>hWR#WNN.eS_,T,urE9$R.<aEQEPL4AG0/$lEVKN)BX`o6A'5>vKvs%ho.vQV7V[##6+I40r)d[87XT;9^-Q##cxB*O?5e#C:d:D.$boDD>LoDKKNG),)^91F3*2)7(0e#:6sjAmVBfCm)eJ#$5#x$n>Xk5Uvlp4gLJ]%8@1mrc2%FEjkGvC7oxZD6]287PFhH6u$<9nq0M64B?<&/9PN@#??tl'pW0,$Z@i;EVvovCPQ`U##+k`*4M^k#9Ge1,ZOuX##q7Z27Pfh###Qt###,nu)-vI2vNce-%3%&(g@><''gRPHcd4W--<,k)LXQR5dd/6Q>?RU:?,p@EN_iAEN`N7#Ao(>V<#CIBYfg9Fi2tX06JLI&SkPA$t+O*L/JFd,?>H*6RO=;=K2RZ17js&#K5/$+&XPF11CGl6;8B#),)^91D0l&#'9ju17s<P(%MQ7#LH&_5eu6jCPRRO#$:x4C2OT]/:@S=#$scdP>8Da's(f7%nL&.+&aT)17ivb(L%`]7rnE(k@v<E%&kYO-_))Frj(SsAtHfj0<Y'2%3-b]6^#6XkA+KC$K;S%2Hh8S&T'VA&m8UF##x.T)Qf3i$.QOm'MJ`+##Uem$a0S),45c3a(gPS#IN5m[Sn1X$s0*$-]G`gjfr>p6WkIx-HLT^i/@#P9MHne04cAnnSF(5$;CV2B8Jed7Bfq]%8AZe#uP8((fdEC@r7v40X)+?0i`W,##$4E#CF<m>mOpm$x2+(G2MAG2icOV##'J((%;H3-[968'o/vECLIam>(5nD:8IsU?<i$A##%*m)R-^=&eAMDCw%G.DofH%6bV6mGZXsq1:4;2%G9dl2iOo0(PPXh#S$$0;cS9g:fV+A6$t)F$KM1loP'5xiOn*K6[Us0##0b>*k9Bf(UDse#7I`Le8LFDC5I4gcD-)Z#K.f8K#j7h/L(hB0>edsiGYVK/KGrG<laLqB<w@<.<R3c'3?Yf#?O)o3DPwBDQRvqK#g_5(JFs>6vbdl.^OiG/6DnUVes*=CVOvl#$c4l'O4C6*bDQ6VdPBZ'p33'%.u'C>YK<nC3l,XBnMt*/ULwg)jvVc1sUM>$7Kc3C#^r3>[e`/:ktkJ3(<oK=d$XCHv^h91lYn5n=GH+)H,Er0YSum'jLg1#>PoL/rO2@/92s(.#CAv$oD(1/94%B3,:)&#>>,o(K4'v'K6&rB<<g,H%9O2-r+1cG&AXW`G(s-Z:uAo.pBep#bv3<DRT_d4^VQ33IrN@(lj8x7C54Ec#&CoAZ%Om.u'=H##SH*-%oWi&m3@N.'P/m#$^8S#Yj.7C:.WpHDE*&#%1Seq0;BI6;/nr)7`3#$x;2[sHpn16=.KU6+FL@Ax:(A@CTU<1g6oU+LhV4#r,w^`,M,#78G8;0:a)a@%@:'Fn^hJ=]L'`6[T)A=7.BU6Qxf^FE^6gEMn^a6iKAf/xg+h)8%;%=f@ku1;Y`R+i;2j+,OT7'mO.`-->_^+AFwn$KV]4F'8Xh2j0]LIspQ%&s_`ZJxChJ%=&([W`G.bD#F?B20F9R##HD,[S-[-DQtGi#E;pREQPew2j2+2e8;<YCv&WAHq8HR8mGt@)I[)D).6vm.=YjaAU@Zd<+dJT##;Iv:k?T=?KP6q5^n2CS6x'O>YGh(#DN4qBX&Ca]r3cr6_;,4fqpH/Ck;*u#'V'%@=;G42L#f4#,3reELR#@<gL=@@s8wO-HLT702)eXJr%'YGDTwguw.7g$vJ5@V,f2EL1UOr&7ei>##<#g(U&(@$Uc5W:Td-@$V`bIMQq_.CNtHEBkd$fb%R,]Uapfh##'ZW.D'hb9j'OE#Ph]qGU*;U3(w,+%VHJkF36S96G,D#(/L@B6_2#2FJjvc0ik[S6cY+<(s7f-<m-x]6GYI?8;AC:-ZB?l0p7*/-?ReR1'F(n0XBfg2JbRl`si8;#%B?##(.jG7RjmL0X<at04+_*Bsrk<-?kXr#VC))3e5cV06]i+6GYn66VJVbA%qa'-,^rx+&EgI)6M%n#8^F*Dn9aL+%wrV#<j^&nBnLZm*UQRWD-Rq##vOf4G-qCB89q'G->1^,#1.'#n@T].)0^?Dn1F)##Vh5(:Vpk$=Ww>LS?#[DRdNHg1Z6$##[BaPFd3tDp$L^C2O#pKD3Am,FK[31:opQC`UGcR:[r8C`UdPC5HO&D-g<:+A^$-+0H$I(4buC$Wx0ZC*(&mZo2;%#Z:P<%9t$@+`<tWH(%2TARg0L%9v(tMGpkM-^)C=#2NY&<M)b406i'=7p3vH$JGJqC$k&J%lRr*,v>Ob(9g^*+0D+x#ZLi/t(iaU6Z$rft`feFr=l,0##-__#QP08RUH>X.XtIg6$f676b(-)GHm@<BWac`Xq>*V`iWEIGZD+W[8q_aASt$16*pmc'mF)h>>.vbuu]X:C9`BhFKo?NHGF+9AZI5ld@m7%6rfEK+xX,r7>1`f=cQjZ##v(8G>'_&6*QB8-&+$U)drSt)9Ij@#xs=&G-V*T#%M[$VHmhX8nO6TRs1=$mrJ$Y6VT>g6*JkD((^J1#&+'@Bp41>GuxNU.ogsB%wTG32h$ZT#lxI81J@wh3-cL0DIjjq%UW_R#vD+8/[gbVMJG;F*`ZQO##2j@)T7__$=*XOIqE&:DSLL2#*3>v6[[*d#?1]_G)p%f#&[/@mx#_D#>>]VF]X$+t@jTaAZ%DJFD=+gGepwQ%:)#FqhfgH#&@/2##R1h0?<Ki$'+@V:.v7e>>,W^8PBBN$$@rf-t$Fb#$(AF+h:Tg#:KS$I`vIr$#TaNl$g1@,wh^(#?;4:/wSrw##QQO$[)MY(fc-hu=sQ5%qT*<9#hwD##s<A#$`.4,ZFp<##E?P#Y?[VhgOVl##Xv@*3]t`&kwh]5wlb=@1?2LHcNr%/leJ<FM%Tacu0LPBkL_b6*I/R%%I?]F1#nv#'45$@8/^$Do6E_#bd93^iS]Pmrx?u#/2Hm'2/HL*DwDO#Q?)X'MKkxG#xaRZ:l9c$$/Cwf5.gQ:74%E)nIUp)6gc,((CCd-*X_]$;KEl-]l#Pt`K[$6^N>+03]F?3Isv####`&88U)9G$=s^4$>d4I]eHc7%RoEA[ZZ:%8:IW%(#S2#>YMI#&vg<'t/#P-W'xw#%&h<>>=SN'QO>(0?KJ`6xI(ORoNxJV-ACq#/OagHGOXA5vnumpiGOipk)wM#$aASqKLX$#AlZ4Mg(GwGeu4`#[@@G02ik[oY$###(AfM1lYthHcO>jn9?Q($;SFN'lIAW#YWZW7Su.[drc[:drcL5$s@bq$s?xr#@/OS#D=:U3&_iL)dnX$)/gW$#@'&-7rEk$##&l$$fucv4G,uY7t#uY&RHZj`cEC$(49Fo$X3UG4'M]k'*_4W:3;8>%[.&xIW,C/)dFr0$XEh@g5M7V.pHCr#&S(p2gTFuAP=83Al2^)*)6YH,v'M.($#C#/A#fn##>i8#Os+8-XR-o/ldXVkCpk(Ba5up7PY%kC:/-*EjkVs&n''W#6bO968/Cd-[]aq#.u[bSPE,#/w?i>n:-3Z##D_R$?v]`5&1[p$;:IcEGIT[8508Q#$OH%'odQl)n+<j#Kj'10j&Rt/5H8Er/@eqMcF5x-;;F)*JTMv*6B8#31;x<jdYm];HXQYH?LEl3&W8/3Ib&v@tDSjAsqT96CR+M(9tl,Ga=,M@Bk7M<)*ls#,<m=6[UB00H=MR7?8e_3/1km/8gF6#>Hbd%e8R]7ORD(+]WH%0MDN/mV;^@#LmFcBm=Aoc#JFGLfIgU0kB65'm,PZ#%AI.LfJD>LfIq4&R0ml$$IN@Sm@7v-e;WwlWg-G#&AIX##QJl:.vUPIw9r?-+g:C,&;,a##ZPcR7oTGFm37*#[7I;]Pso99?ho$B>8N*D7UZj(N_XG2nRSGN_3[>j(a?E2n[)@;0jd$r+Ljr'R+)SYw]<^QVp#_Crkej<JUYK$XH->),3O>(NirS'leSS#9GLUIX,R[Fa/lHWbB23CU/&9Ch[6p0tD?r-?t*)J6X^g:ho<v#(9InG)2WLG'@J5##-F>7BSfefnSmA6b4qU&5O^rQdF?8BQxgfC<:t;#b,3pbDiK>re31j2GBBe#2KPw]R5Yk1:Xv='mk:g#D_W2l'I39##$km%?1?p'ih*80GIMo4A5keDGSUO$_Ujt)c`?AXxSr'-u36J,[.0N'mt@_-%..E&p)Se#$WEX$rrxK$9/$=2iLF##w[IK2e?>p'293x'MTn+K;/sx6d13u8WY''#_Zlcg2s/l#%gE_%qh^<##/--#r60c[pEWN##K0a$tjq?6?sau'MVSZ/$`=&'RaTd0#Uht>%'qgBoq;4#&@]M%8JRABh]r+(n]QE$_aKF7=QxK2k3s>E.SH215o<;/q.YS(Pb?/#apO&d;kw'##Wp^%:pN`0L5cDVXvRD/w_L_7uc0&CbSt^(/,9fj`1#5Q;q2sGer*e<*r3D0mhaj8TY=[%;[T7=%jo3&9T=MBN>-X#?u%E#$Z:_0n5Xm)8o%U/6s74/q5m_##pPT)68w*.BwGe'2u0*$h.o*,^t6R0moo[t)oH493UQ_(U+Lm#g__moPgb'%p&'k%M8lj6q(a[&t=W#.&fD2#v):[2S3xIk%KrD3IP>[DEs,hH$G[u*O+A^$YX6[TaYFVZv%A1Pq-guHB(iA6`m9R:QfPp1;#dw%87P]#>PotFJVtX/xj^e->3ax'25rI(VLZ#(3VvI#?Lp+DK^jK5]'l&fPQEo##jBG2Kjoi]v#e/$]_[d6ook[6*UH/CJuqQrG]/^8R`mGuxGNZ3I5M.:ObY15sJwlCd2R$BSfI.EpP]XE`HVC$tRRP'm.h0##$,^F%dl?3/2F>CZJ@$BT$]oGXD[D#>HD,37BIGGDU0>$sSpd#3]U9C5GEpYCo?j2wLh:*D@0*>,2uHkxGnc3DDiH#;deI7?T'0#&YmS5Z[xC1J_DM(;AqR-@f-D+jJDRG`pkp/qIDEIWZ'D()p)F0=b,^#$6St0RP=U#&fe>9XG>:#$W1m?VCQ0NO/`uKR@3]DOND*C[X*e7=6W$5]0r#WITN>1U9'_21@&i4&x=E#O4.C7=6W%4]PlN3w8KuD2)xe3-T##2g1`>+&(I])h2^q/9m/H#&PgSS4ktIS4mMl0nm$'##:Ig<kXB4EfXb$;0u'aEJ=HvSlL3E5>2(J#+TI`1VGiV##$F&(PuFO#)aJ,BNlLE-*@c`$[4]I4xm8t#A[e`#>uTE#&.Vj#$ubF#%rJh#$cV(#$uc*#%rM3##9/A,eB@5#/'xOCcv-.Ccv,volLw-BSYPO7>YQ?j`0>VMd_)3#gUD0B6f0C5[OMK1Ta0eAQnrp#JqnT/51?*0tN=L08:-D=*]A2EHMFn#Nx6mGxP0:C%?r3/wG+m%m+6A19_[u%qpHT0B<q_epvkx#$cfOHrd)W0tPWM##/h/%mu>3-u3E`=GpOt2tUHI#;7Z7(/u<j3)sbo$&JXtBSd_n`IX2p#$cW)#$;[S#s.NIBZhHd#%1W;%8hlL&QZucn=,foR_jw02e$0>&5=O2(3ld*/qLx>#^DrT[0mvg&mI]F#/O`X/PI77/PHLTJbF2IKR3mV##'AN$@)W2Ck.Ue3DhB*$3hK=2e[8dB<reS*a6W_#_H)nB64xq&0;-f*`[,%%pXUHC+6H6=H<Gg-([G,(/.)>%R(PQ-^(Id#BC`r%r#M`*i?cnJ^9lo&PeeY%Wi]lB9tQ@3F,UF4K0nFuJi:Fe;&oG-)al_1;PDx#&Z>Y3`TTF,vd_)#ud:R3`TR]3Iavt13kt`79T]+5uaxIE(hr&UfCj6-=T2N#$Wdc$=>O[##9&^*/c2.223<3##'j45(['qG-*2+.sHpS#Zs@v0/N<JJ^S*[[D+m16*s8eFM;?3#uvcZ6]>oR?x8K5'jl<V.BP7M'3>H^)n1#^#.bfm-^(u9.8>%k(3m@4/;I)vDcPcQ%EJq1DML/U$H::r#0ewt4^)dRRT(BZ,#/>MtI;WJClmhH$;V@J1:]sS(M.)`&pMKMYZ<HmJ%FSN#]lDbIE`h8**/f;(-taa&;'tsic55K4u-K#.(42EVfH-A$#MANeS'tD*+Ue#**+5&.BP0O^UaZPEk7B;'ooZ,A)P[I94oBM2L5C-S593xicl13$l+#2/]m&x?q+`6CMY2G0t)tW-v<VB-Fx-@-ESE0Mnk=F3`_dE/Uj8oCVkMx/w6_NM,1]9(9p:9(3<;Z#8n,?92*bKB=2QkC5*k_0tQ/;sS.tNaaOJ-Co_p8n2-Ig+Whv-#(%p6f4hNYolqUOB?6*LCNCi-:f`,I*d#70#>>0`3b?56*.02x-sDk*SP9W'4'j*5$]3<BBj>7CRStCP,#6$a%G)SO2L)0D+b@I=(3SJ<-^i'RfP'kw-$0m,)dVg##LN?X8oAOY4'WaVZVCe_%8Mqp$X=3Ih0#Mi%rcmLFa7D(.9o8_'oed_1$J]e0moOl/TjUN*aidO/Y,'7#[p:%##a$;%o6PB0F%lg4u-X,9jRo*++stS#0sWDQvW=V(J]eM$=k-AeTQjj##^,u'eu#+2>[YT#>Rmu0=>l/#b&TBH,^2U#15&eHcXkG4(h*o#$AY%#:MBv5,h*H3.`Ka2d*nu%@A2X79T]15eh`x85'^K9JH[K,#/Vs#Bh3RG.Vh_Bm##-86dK^6t3H6$BX%K5@OZb6Vxvf#XhM<K#gWnNhLC.k%U?)_snx=6dBF`1:-4W-]m<a0j9gx#o$WA=_3D1EFBE31:S'6(3jXu3I#M0H;4]$-;>@p%@*01G)6d6*fo'X+h4?&$$ZGX8a0Yh##D70,.oG9)SGb)-?O5`/PNcw.Aoo0#%',q#$aso#(o@iG$c8vG`pU4GD0]RDn2=INimjm#%ioj#%9Wg/Upw:Ge%0cGe%0cGe%0bGe%0P'J9pD5v%Gn##c;D9noITGiN/#H]lkZI-+FE6:O.J[df=L.__SM6WgljIYgf6Iv+lh$Z$H(16IUk$9le.8Vr>:J9<sE7<Com#`XOT8b[n.B2;wR7<E_>8V@`8H['bG#&Iu+$P3;Y##eKu#]k?K5$ho.06gmC#$bD>C1SQP#,FK128Lr^#$b5,#'M]I;cSO+I<#<oGwLG=+I.2)6^VP&##/<C8QI*@cuJoD`-%>AH;,Kr'l.5NU/DPRFAj4'#>@Zt(WJwS#-S2k/TmL+-Vo9G.w<&O'5T4p&lkx-16s/K(s_p-8%X##;,eO@IpUd#$']Cn&SiCe/m,u_0T@NQ(M#jF(ra.f0Q`JqHX9L<2LHx&6gB5U6X=;uEHO@9:J;`#:J;Uv:J=d^06Scl:J;JO:J;=ni#7uRJPIJn6Y[9q8&w)j#$bXXm#82C5?`Tf06VJn9NiG09Q`j26$shOC;MXP0p[`u##,vo(mD_)C;V_R0q4)$###r=#/*-w=aQ6c84Wd3Eg3_tG.0-E5_YVd*D@gw7DJonEeMSeX:cbQ.C:FP7vDGB(/-^>7v7h^$$vZ$Do7T*5)=?7(/+kg#'=S#2+x0V.=abr9WJ.x(JHj@9SkBd$atD93(tIg#$<Wb$=3b1$?]Fx6^ESD0XEk66^srJ0XEk8b%[MIb%[DFb%[YM&5E=2T:dbj=]^e/:J;`':J;V$:J;l+&5E=2lbsE_:J;Itk%Y3$06VJlIYUO1#$bd8#*X=uD2E([9ox%^JAiMFJ9;E@%'4d-0T@Qv)IOfHHcTRoJ;Z+GJ9H1&;2Is;#&?m'##f0l06ThV#16)32MOlXIuoZB(<2PC)OCr;(RLi#/8[P)/8T_ca$LM76bU?T7t-AU%SS.@0=jd?Hrl6BE`[h5=mpe#9]^]Q@s.9t28LjN6^t+K]6pB:9t8NbIE6gC&POFe0@iM1CTT/L/Tl6O`K/orB6xmXaH,%e28r,f=?Hx[$Wn(S0taH//s3GY5^?_HIW,;9Iswjj7<E)bM-Xq&13P4`ch-n@*)%m85_<?T7tP)>(n6IS#$Cu4)O0s#@#8pY<Jaxs</F(w:Pk%FG3pQREqX/E17:5%6`mg)6]xv]*H4a+[7sEa@=VXM,.M2V,.M2V#YG,$pZf)E%X11Q1:LR(*a*P_)o6>h%$GnO8<v#J8>qK2@0t?.2MX;[IYW0%0n0Zl$_;WW1;:=+$^>U2dT;MF^p])@@DmH<G_+2K87HWg-x$9+@A,pD0nlN]#$c?-##P`28Tx@G3*QC*:T#uW@tE9T#$t$?#$an.#')H-&55HF@&Gfq#(B.O3E@A?@@[C(9i[6x@tJSh-[Ann#(9[A@>l1m4A6<G*`[-'$VUPd#)vEF@BhOfLREOI17KlI/n87$0tN.](3L?r-ZquP###D.32oI1DG1(e#*DZ9/q+b0$$QAg?w2Nc>4;Q-<Swk]$VZ))<MrR]@tCwm#$c&E###2(-[/I,#)wW718<&&)1PBl#(?Sh;e9<];io*K#QI,v3HevJ;mM=H6dg@e1;.-&$2oGI@@:Di<MsR#2-0eH5_Y,f*`a66@?l,e=Joax2-'_,5_`3h#s$F-mrKX`17D^d#(@&*6Vsrk7C@uI%#-Kl<2X^L@v2VK0YLoJGgVRl2815m4hvpF(fcgqD+lYD<).=`1W3Lr@v12q1W<Ro@vUIn6`6^K@@:D:###jw4/#mR(/+gH#xHcY##Dh9)P/6Y1P^rS'MnGA#jk7GDnCe^0?:Bb#Bq8TC;3?1@CKNM)h*_G,QIhk##M=7(6>3++HGW7.WQlN$<vS)0?oqg7<E=31VD-.##lS+,U*6[<6QiYD0U#Q6`E,u&up;4F]NOhAlas^s(npX##l[(qf>dx$38%KnoEi?&QZd,.<^@-#$8n(-[&G'#%gpP#$WW_#v6Oc--:Rf$v_1$@k(pq$uUUO'5j3KJ5R;4UKJ1^4^sZ1aaWUq#'F4+MI6Lo#$)tP$8Daj6g8LA###ca4%pZf%9U#Y#P%o+=%k7L#]b>o.xU_uIYjC?.oh=S2O?MF`Os$e6p6K$[nDq(J]2`A%3>[iG,$ICG'.d1q0BjEj(SH>,J;6B$-*w-G,mOMEHax(JS-b-21>bP,.v-A,dt(1(l)X2(6SjD7ZpEa65WRT6bCd::QwBK5]0r#Gu^@-1M$R1Hw[W&:3UKC+`YK6#)Gn*B86IkHV>R01M$R5I<wa':k6?,28Udb0vcYwH]=&@/wQr'(JGwq1b=p:6*W%24ALHG$<@I;)crNnBs4eCCK(:;UiLFXBk)+bCK`$K-&+10I@qYc21@*P6_0aMAPI8Z&P*@75&*$56^`7V&46oV1;Ov7$(Cq)pjWDm:0j;E/r#=f06h*U1T`$h-G`-FBT-<+4FA`#42NMBhdx,[I<S<GK5<?(pXvE$CkXQg=axrBbDk#FH5w_Ir*5Hx#?sqR6^GxXR$'V*21@'g6*s0I##IML8UEV:1<(v6D80@[dWH=&22P7e;0uI.6#?^$#%)>q#%(sf#(A)B0lC?51QNGX-@&)k##%#u33OtF)<Cm,#/N-W@t9>m1%Y(./t7a^Dm/VD6'm)3/:Ke^#k;9/1/RTu(V#e(@X`U:EfY@k(N_X#2MF0#sPi@FBT$EIdthj[%p$[++M?sK#+Yt8Ccd<<DMV2O98bwp<fl@86aUa*/Pv]q'kYMS+H:6iJu6:m*3fkJ(k3d[$Y-AF<@SU$Cg1iYCg1N9(/3c/(4@Y-20`G<G>x^3tC$4$**mweZv't2%3,Ts*R/)HJ]G@$@s9K@#$(`P6b'*>.'Ywqfn1>q*,Bu21J@f*#%a4C=f&pQJ[h)S+&L:$#ohNPc%)tA1HS-RF*&BB$=P2uI6x[L-[f(86dFFh6l7qe2[sGbI<%w#6[X=Gq.k#j%i0DG4c-hkLBq/3>BD(?*f7IB0nFwZ4)Y494MM&'Gk6E<.&v*:n3sbd7?8nJ/8@OU%9+F^p.hJfBK6<aBQ]^*<`]1K%_Q4?I<vNbW#Q962,-,C&(49bZ_D.%=xtFE8w'`gFBCc<M5UI-3EN]g%C#r;cOPg-0lNwK`d*5-)Qe[E-?sxJ2IhdN%SXF6#[[R:m>o;,CG%AO/ldFU6W:w<%Vv,NXO7GV6;c'e&:bbcDcL9:(0@$[$IwO0.oh$IT93dQD2XW_(:/1.-+$QR#??@Z$]O:AoRiv,O)Avp/86,Wie-B`DG`dc#(VxM0i`hI(g%3$rFjW16_VAO1lRdP1l[F$6a'kPB=`ar0`w3?6^i@S*)%E=Dj#_O7CPF85^4m4#+,t:Cit*XD0TWFDJgG[_P=M#6BH4x(6C@d(6C]F(6C]F,EU6:%$asM2Md.:Y+v;-e89M%'PncS2]vUC#&oF4pLp<YCg;kN#xEt?_.g?W/PH8'-#XvTTdFaI*)$@>L/b+8*4Us2-+p1?#@`N3#%`d9##^,='ANRr+]W+.##[*X%HILo8=h<b$=7[W-x-8lJ_?2V)pVrj$Vf=I%6G?lB8JC16cx0$2fQj.JL1a]5[5`F#wg>185-3Q&T7YS3EH6-2-l8CV2QuG6cZ7f#YG/%JtdWr-+x/_F,OX_F8d/Od;+MlfQ0nx-,=i4'MmI*$dW:L9<^i]0JPkw1i8u2IVqU6#cjPl06gq-#%;r$#&xw;@r65&:hGs:6BN:A$Ee';8wCZe]x]w#,>95FF:3J4JhP3C:9>r:@C`k][t1T59;dX917::Q_L=?v:jxwMC:/545bDqc$Fh)-6>f<LM+hb3-wJC>:2Ot4@t:V#-w$p-%X.pw2/Xr?0mB2c###V4(RYl=.>L<)KM6-LB#xoV-vOJ^@qCeBBk=<?#v46#4I991&PNtw&PNes&PR`?-wKN_-w%T5d_]@M4G6xn0>DOaI'7,&H@6d<S`lT<6F?B$-K?hu/VY+62LHh9,xHwg##;.%-@'+02jrx'CPE-w(5KM,=*]>lBuK#D-Fv8&)sPcSHA<m86GRWF##*FV=1)PMEe8_K(lxk$#B'T[C2X*0G-,:r,Cii463$x33.2]2%XxLtG'O*mEeJba,>9xPG)@AF(4q'K(:d;,#/I9EYS7/#PYI0C#1:J;ID./S#?KW_3.*Tn5wXLr(JGt22N.X+J;GxGjAmLX0#h&x0Vh7`jgZ0V@t<ef(VkZ2<fWKA08@*_#ciT09i^2]2M#.gI-1mAn26Lq_J'b8FKpp#B=rg-rfgp1/VnsTHsh@;-w$pZ0moP+/e;>wHw]_qP#24^J63bp#8/oS2mU*O23UR^/<k7G#:^h`%Yf,U6_0-sf=du9*)3DL3L)c%Ug.;N#@2FJ;cSNC#3Z/6:L$Z$:O5bWJ6W),F2&5i+1ixe*Pl@H#)jVD-wS<j=ABE26$4aR&RZ6Hl>W%h5w#7dJ=?qOduO3@Y,Drk&ljL*ZA(Sr:L%%F:L%%<:]P63.,v%^:Z:)7*D?IV4`vk_I2=`n-wS<f#&4t;??[Tk##Q%;#64c(CrFT1=nw]p-x*mJ##5f7fskI_Do((Z.#j8cB=J[[8[sKUCbMAM<DEOc4nXg=FLm&-:7u=Y4Z*<;9nhB9:3.Ud4e8e5IxU5e>*VC*.'4]xcYl-l>_.shC3?oT33YKc.?dI%6ajea(;m_%(:2:c(UD#n#2`.WII]ttmZ4830L]gbGe4^%?wtuo@t9oC-FIBo';%4F@t<-X#%9F1$Xc@<$5Ox:/TjRl/U/Xk0vE:)7X$&-0A34?B]lR]EDH[Je7m?IHwSkY$,C(TT%XbhK?FoSQWF1E09%BS08F<6*Pt.P0Z#GI,ZcO](5GvL#t&,nnX#23&nT]IG?>8d=j;`@J]>K/$7Q=AHv_Sr&6jON(2IBk%9kw@;$?s(I;BH&#vUcfBmYd?[q9(vOe.B26d.Sm3ek3-^jG0M)GT1>'%..oNIi<=nTUa9#vBXm)1PLf$b/dPEHQWN'MW:F+L%xP#5G?1(/,%1#&Ph>[oRCf#?ru>2Qf=WKIiwbI8(,-APQ#($Fk)T6Yd[<12nA%2d'X2$;K(;<K/>U8#mYr#'U2[1Kb_%6W%&qBuf0$Ejjk:'7<?*7wf0x2`-c;D0-7l-$Ve]%pe@X-_6)?(0u@C-s&V[)R8rh$K#?65`0,Cb*.g7#)6aB5tcUCCMd5^:2;T8JwGii$5YF#OAZ4(#$b>q@87A;$O,OT06iZr.TM70+H(>I159ui.9o9k#&J4w$atF1)Hma^%rv#j1;_VN#v&M+0n>1,2Mtlj&m&XH3@S'E[oR'2d:fdE#?a=,I.7AV2P_CjK>Jb:%G)08i9H(Y&St#<mPgncTPZE<VQ_m5#Egnq&llXA6[_M#$=>AaH(ZkG;MfL^#[_,5#ZJ*)&Ox3X['Ki3(Tgk86*<AuB3.?aBp.#F&Pt-$#x<nA'MJLL#$d?D.oi3t8[<'FF$Bf9Z&^Fi(JOp8$[u%D1AG<hd%eXm6pC-3kjow.0Ml$&C323*(JXvw$;hE.(OddsB>AQ6CMm3NH@('nKiMYr43IV0-+&/*-=_aB#&%^'#(0k23&)x43fB0D#[7:T2i*Qx5_kp35'S3FBe8qI170;@;8*$63(tqC_oLiR7qo#c#(/1d4-H1B'MLEI@tCsG#e=;^4bi?S*eg]G5CG5G'MJLmpi]ks2i*gEf$T`[##d))U.d>^U.eP-3.=+s>CJ9814Tk<Ckf:P14V5s#%TWG#%TIW#';Y`+xtrS3ekM%5(5>I9i[R+3f&Ya$Q8xKo4Yh$4be'/3f/sB5>;aJDH$Vd#AYN'#Z$M/BXj3/-wRG,#Z4BX2M>@]##n.62Ul-7BH^*X-vK8o#?(xH-rKS6&fP0-(Mlk^t%O$D#YlE3#Y[Ef.=ukk)dch$%Alnr0,hXa3IEN5Y#d.7Bi]VN#@&K/$(N2pBT$@);cew0LTceD-wT6jC'n[@=@<C55ZPkV#YG5-<HhIH/91v1-G:n)H<;)##PSF+%sX_d6,GemoXsI?:5M9^XA't<'V[t)98Wc8B3V9D,#e/p#e45BcBk:pup#@F6`tUo#+cx#:Td+j1hqm$Xxp+<##c,o$?-*K1;##g1@#6d:nP3lu[8OfYZ23ZC]A'L(.x[6#ESl#:IJ64@s35k#JgV9PvoR'&p^+]0(p^w1EHt9-?Uma*Eu%,#B)&Gk^W*b%qFSd#Bq/oCNgce$@be91/),kK#iMl/r=11AP<J:#vCGo#8q9L+xs15%8B8x'l%G[3H[B7aCr#AYuR3;0ZL:x+eJO#6$4X.K2)Y32LI[1K;XW26;ITqtEg(+Pehq%SuZ7TZx^pXCFeD6'if[?02M8b#;((/gTR,dG]S>7G]R;'C6]nACG$WLCBI779wWsO%rB.;+CShU02@=/$#rr/ZYKiu(2R^u]n/?u3N6;NcY/V:#?rc(D1F-qA#>/m?CW+:?CV=?C8=[U2mV,[$r2ur6+JClB>A4Y$V_x4)Svld#N)c4-wU)n(V-aD#^q;mCIQ6Ifdn7K.'jrj.)Q7mF*&VMIZFJYGg9xo)TE+g)p*Lv)p*Lv)SeCu#-fAM2gM?-C6Jt-UtgCoF+Q062KOXX:1tXo(/;R&&,QB2(JFr7`frQMs`Wgi=&_8u$<@1a6*U<W%)W/TBQP^R9t?%[0?IhbMd;Ws<eda^@tDHe-Ff>o(/1+W$tEXW08:.W&r9o=3JBGP#*jg<El#iF%:9,B08;3>2iX#N2heio#@KHX#$#d,%:9+608;*?5>2)d%rK66)dAc$%nr(h5_unx#>OAc%DNdn6;.r'#$M&T%p>Vt&eA>FUi(.&3DBN+P_>L+4F@6SCAh.t;3CwT)e6R*2he0iYw/B14+/fg[?qvVM+h,Z(q40K(W%=w)h7?I#x#j*.,mJe6_@e`e1$,9s*`d9b%s)`7Yswq3qW>?%87AN'20%P'2/x1'20%1'2/D:SQq/v_fK&G%4>26G`q#j*+F*1+AJbZ*mS[p#%EHQ6[V)E7D_R74FB3:1;YU9=MdMAI#:6c#&kQH[*+$;6cXx(Ga#ws>HMqv1;vAJ20p8v*d4*4n)^hglsp.SN*LQ4N*LYEO)gQ#A*FgYY0q+n06gt/###$C+/3r21;,45O)K;s4Owpj22Q:,G>S?T9Mleo%FGvG]'q5b16O)C?[-'=uwi^+D7l1JJ9OJ99bHMXtjU]CMc_]=rFjHf6cu@p1;vDJ1Qb5H4dlPJBnBnVqfQ(#IvAK7It$0u7'^%n6[_xZ,)6dGOO4dWjRAFRE&KuHCO18huBimO6gVvjj/T.L37ke+ickL/V/.^qY>>87$Z.GjLwH@ABO1[I2$crh12vsP(:Di'8<.8J.4WXOB>A)<8pw.[G/Pr=#(fPOI^h8O??A8p@-[t,_fYJE%r5NG.ogwL#Yf#t.t2vD#$lE@##HkS$?mJW,uoNn##HOJ&#^JB'2/F2D+olx6&-xV6'VFU&1>&08j?ZYFA*2##$[t.)-`Sp+`>cd%S]$R#<jj-^%%V0'2/Mb]lYV$#FxFlpXG#`4%wn0$jijqBv+m9Fi-P7#@[[;Ip%9'H1Mm44bhUR#(:b6H=$Z33.Np(#*<QECUp.,''K=%o<tHZ##7O&$d2nkB=wD8%))`dH*M>#Gdd*,J5=6u%+%r1K6;Vfg3:.]$;`+VBtrH+9V+vu)P(>g/@n9qZ;'qt)LOdw.Y9B9@8&9*<jwwe6Zh1K(6AlP-wgNG&5BTV$X8l<2L&cg/w6f6D0&C,5?7fYE5kvU6arsRK?]OBYd88M>F5De?XA0Y%U:1d$W$'n=*vR?6_ST)GHm578%NETrGRFhS:>r;;c%[M=DIoD7Ce?e+xs2eFc0U%-,1C&#Z0QX#o_dVAla?%78F3C,D?EW>exLiHd2&x)0O&*#?EKnCkllX?sR]m_pA38]P3[VmDl%(9kE,9*)$k20=>o+'MZ.S#Dpr<Gfo9iCVXLdZrj&].ae$8^mRp#+gwZ9H,#)*#3+$xDmuU<5H%S018]QJQW?25G-Em.%%SGDhG1>&BlwduFj<7J$Ufv>W`I#S/:gU;6t9Rs-VXTPUfi0m&7L-I7<D<=%;7W5_5Oeo6a%r5(7M^u(Qm)J.a#Sp_QLb?06J+_#EJl=3-ZZO#9^Uf3e?^j(mLti(7;V?':8d?5cnUm98TXj2L9ScgRktbb8p2Q7<DxR92$x;BTsL%%C#oK9ATY^&4Zd5#(fhf1G?)D/r,RA6ddh(3.X83#'W:aG>&R0Dd?_^GZP`d#fejfCUX:t08GN$=G^J3GI$IT-vE#K_J'E3%13VOi_p6k<Gko9$iP+'$eBgpB3lRHEk5v$CJ8:3#<jT%SZkK.>Zi&1+]W.t+BG;b.>Mbf)5&bJ@t;fc$V]pn-@Rkh##2=*Q?Obu1qCQ(Hb@)2(5r+U#'hj.05flH05W+`M,Ds14+8sP'MJZ^5wdYQ#$k*?#B*(a'MJOPJo.>50T7^q08mg:+,1Y:(N+M((jJdR$+Wj9M,+,*#^<GMa=57g3-@8p#&Z/JkxHT(6O5W)<NQb7#V)mY,&eQa$ZC.(=_MDK#(.jCB>fkrkHh'l##++234k(0^QbNY&phb[4C&'x#A8+]CmTt0?Ed'o3dpV_:':[E'l&:4#')Dc+&)w:bD<]s3lQT-BKmmb4+_c>$s4M(2R=tUl]UAX*bM6;;1;aY1B`ZK2Q=U+(W-rk++4j,$3]=T1i7a7C*>H<*ajsHL28j,@t%j_4LdshPDh_+BRKp1F0:`EVS6JqBS&(f5'1YcJpb)m5ui=NBPpvH1G8cZ:fd/O#.LF4##5pMol:4U@=d=-)GD68)GC-7(fl0=bb[vkF*:8sDQoGv1:03^1Oa8e-DuQ>*`k+j*LBW.M75Wr08jJj;Csp[3H[C&ux=kn33jeCCk_PrBxQw[GDUX*<C?m66[UvA6G5J,0n>(<0p:3dU24u)BDVc]g53@3hu=R26dO+L(3j)K.`wR<]lIw+.u`.*#%;jc,fm-g07,M+2Zo)`2ilJ(K3aXX[)G1q/v;w,2hTAd3/2%3H]ZLU.:%4p.?w&D0v5,=5(>W0.SM@O@s)-o3fi%Y/AWdd#&?#k##.+=5gT'n.a=M)%Vx5TQrqPOHbnnvk6@3*Sct%R%8=n,/:BC.1OUi(/:p[T#,F/AI#2v^#/aBbGDUX4He?5n2hwaR_[Mfx&PR2g6$7=(6cx.SAsUobGB%rk':(/6Fh+G@/VH/u#.$=S<38=0VioK?3d.$YDOD3;pr;Wb#&d5R8PB6OMI/Db#I8Z.K?6N.#v(G0P$CHV,[>/-DhdHDC-a,p6+B(NgY%k2hXRx/Jx+8')76b9*Ou^H-A=.L992NR/xO,p#,,UV16NPZ&^iCf;JHQ0#,*g45,gwnDOc-lI'%F67ot@p#/%0V104HZY#$7dFuK=kcDo9`B8K8e=NE4W08DJ5<mpNv6c9U2-EUNS#@:_`e(FJ;Gf80G9K1eR/pDM5)g?K7(7'CO7W'E(;*G,fBu#Y,6g]69.#'C3g3g2V5wF?/lwxIP#&Gs?/t$,gGYS-A:q2Ff05_d*5a,PH6MD57.8KsjZ&Nr?6c(,M*P)GZ3.WjF$s%u5FEnl43dxsp#=C4^FZX>w5(6eK#$t#r##x&q(<'::*/BYeLq1h<B=2WDJ4b<hFZTu7L/4(o06/Dh09JDWr6rJoIpdYZ8'n*K-w7%v6$ul5#%B/L0Tq_JFGHp#6+AA/fP&;j4c[0nL0QF`F_8nx#^icR3l$'C8@C4f@CXjlDKU;v6[i+.H<aq:.p>KK(k16x-x3`>#%r`D#$v2pZ(-3nD6PEv#&Gk>UfV*hGukqU8B?1q0CZ]Zh.X2SCk-(f+h[AS$*4,IIB3EY%b[Ym@CTU.#vPPI3mE@r<DXn,IT?]x3.XQw#]tF.Hv_T,9ivM$Iou9TI)wr#2LLP*.#:<f#-9iI@t;.)E,e%[4'd*;3.C??3guxPE)R=H+_L5:B6$.k2hwdA>Z;<6SXhII=E>`&7@4Bs3CNLvCjrf=nq7E6L/+7G(3N7#-Fev488qZ+&lOo-F1@G>-H'eUYv[a-%;PsM'igh(1:^cX(fbq]&5Iwb#-f/Y3e'Cf#nLN9J4qN9Z?%.sGgh8<@v1Lr#)kq5@U_:n(KOuNB6#ux01sxW6bL9S>BML51rtH&(6p;3##Q1p6bUBB-uc0/c$Swe,Haxa@t*3S8PCl;B8^5`(PXPG$B+v=D6GA%B6nLG'22)P08F1sTlA=[#'a5G-KZ8j(JH*>D>V7eI/[iah/xKN#D-$l/nA<[=N:Ha,#%M;)7'6J$.ojuFi/L`$W[72[sDTQGwYq'-YQkv)p>(2F07UFBYea@:9?[P62NBs1;&9@(VcW(7sBN*Hs9sZ7u&Zw=RbV9@AugRB6;El%=hEn4+SsD3Hw?C14`074+8a?@v#-'##f9+(lCeTal5aH4,7ef6BlpDG48h]D0#_#G-*3J5CP`YdGO;,1O1O23avGuDD)Z<3:4h[&q.dv0o1[rB6Q4t0qZ7UG-**R@t;x+06&x3jv7Dp/r,U0H*&U5B6>M[3.k&O1:(DC5YQ-T3.O/YD6;_GG)^qv=K4NB1sjFp7@mYxH-$,$%:3`@r+hB_(47g@$Lr*/1qV/DF,wJ-2gs^Ejbxnd7C6KW6bL3dHsC#l16'qj7Ya[a84_h0=]LW:D65Vx(6kc^#vL`,#>JwMB8A[2Jm;_j0n>(%4+B?.B5KgVPGfX6%;^np@0?_:HtC)l(0u:M$X>GG,#x61(7(YT#0-n.DQlRGDo9Z./wg)@K80G1")), e.params || (e.params = e), e.vars && (e.params.vars = e.vars), embedhtml5(e.params, "krp:0ph2jPw29kC'SEI^0EfS9~Vu`F-1WpPl oOln2ofVMmLm]#^,E39>)7_8n)@<Fb.ddp_sE-5p5)D,Y[G$=/%fp(he~D'NC74N6q,|jwx(c!&{Fp#Xr^i1iHE9{;6#69*$Q`Rsun`,;'qR8C@ u&w#eq Hbs-|c{]6Y,[W5Kx)yyQb24K2M@@JSyp7yA))q!Y75r*LA_1<Pbh~=<CDLy#=VpYTO,R<2shx*slI`z*j51;U90iP^7@'}!Je('fg+5E=i]V_;o+H{-0sDHQ#XFfC)->}i`BmGJ*5vo%WSvK<$bR0lcPDx,%3p}<b`=3X4HnDD3V;.W[V.guZQ~GB#<%;#[=nsT#O~`)3Dn=QtQ8r2a`GLo,J<P}YE4g@F~$?kg:3lN:Ez(J ;TZ@zu)#%XOd8os*[K~J1!e)w6; DvNh*rf3NROC9%]HX9PD7@0wM3xUK)/6|B PW=9M`ntvyMr'M3'62a)/5igZN}uklAc-=iTP}XQy3[S=;ACbt=OZ`1?ayNjsFJUx:U~tV4lfj_39n:G1lbi{fE1]V%)PZB(fHqU)~GVDs+P3wy{$C?bPC_1+<{a.x/!wL(c/N_Em!|#5A]_j%q[(w3:N8FR;t|Ly`zYK`'opXp,!&T^wj=9Drs7tL%^wQu^lz|$X(-Cz5QHraqyb43)0KT');r,Iged$U@FuYB#q`+XNV/k{/9sP9Ne'5&Z&TL-kl'6dWkyuHoa_TA`~xN- %s0urz6^u` gSrIBNk{xp>X [9s?S{d//s.11nGi|IYo YtbnH]=KZ1/14Q.4%of,9e1!QVi0WBTz}?<bnA0bXrO8n3{;4Y<`mh4NpBS(sC'cUq1%1>.L+sk-6tY2C':rR*e_O<KR?1SgnA~JK`Kodz7`1P)VcEmk6i&8d:68]P3q[AvTMteetSL<U=57=MEY9o)o4o; #.>c8p!ptZz~1UEibbABfWsIS6.X_q&Wc<doxlEDn*&_38`VNNYs5hH<#?^K*#]!U=xBuCdlpyexyGxPM852ro1ezY;E_^[%|DK!h49[Gq~Wi*3Ah~J{mg6ErV=fv']8^Vp-p+#uJ5;3=>Fr f]z'*i<[MZK;C:Y:#H@ArY!N{k9cr#6Q4%{+f|Ak7%Yl6yT6zIMU ^|e?zaWyy{X--QCJ_<n~ch4k:?3AjHhg?@Nu}wZ~4y#M1NpGq/g8lFA=/!,8/Fk6z];}rjD0YWE=st6:]Q)Q^'UKL5?g=)1%:R6wUX4.]hnhGOGrHeu0OFm*xp!mwL/4p=^I3)zE;04g=up~s{s~0YbWH@noyGHl;3n]Mb)BXumvH^qc5(C]=_:D=w$fiR~<3Pt,>CS[Hn^;NlXOyqV0c`eUSy|H~4m|PS{dY|1kPaFfEZ=lStP*cxqF;M>ENTB6ZVdVx2dP}m>oN6,SE8Vcn<|[lnHkmcINT.VBiOi_Buv9gs%OD1|q<&xh<N6$H1@9jZJM?c;V4H%k@BUTSrpz1,~gwn+S}Ik>0mZ55c.jOa;mC#6,Q$1D2Tgw~MFeU0|F-eal3Xd%nYu~O,P?:/Lc:lOL.1G5iZn-3c(`<0l74wEJsbrj6V2hO5[jk0rBV){E-i%[{ySg-sZ|2v4k`IxLu`KF?%`Z$%z4m/uB)^jZWrMk8'Ao~K7'4R9~Jl`%.(WDgz!f%[7g@!%PIrVo'z9ZSk!wq!L[ed[8jT2QW!/LY>;:'~g|iI6;HnR>0mam3i*qIjxnW@]BzFXGF+dXH!aU}>WJ0N.l}R]'U1`M-E)Nq&B.{)7ya++Ma6YEIfZR'@>5:HPCO++L`yorzyxgzR/D-X9}?yyRI1A'lMtYi$x^ZbYV]Auo8dnzaKhUx)t}D7::#0}lUv/e;8nNSe'/Oi8C+q2N'tWe(35 J@,Sj3*y&ilA|zR 1P-U1|/kaZZ!Y<D1h;R6Hy_9T_n,+d8GD6;<2h=Z2xGHG/~<)oq,$w%ibq^<TSC/O@&2$ 7_ZM,N0nNC!xa.{+S+w9/CwV6H./(DSj+AaM<?EdFoX ?aALa9cyp8y<LUSxGI&|X% 38s4yWbB[na{Rv[xZ=L8Ynd*}rKr%|?Ri?H`y6ni#8p_lU9VaPwk~lfTE2n^k DzY?+Er#`iGWSb'fH&5?:DeM;%t(0eCMle ?K%sTbWFzbkEg{FeHfK&zeP[DyedJrooX.D;V~:Nhb[I.[ZfIK}#,pBc6.~=s$O>UU_w}E8.pM~;9f=6)S;&([6~?6wQj7h=%JqPx9C'RI, PhB [SSNeDsZvw-|ghd )wau2B+;C}eYJF!N#`Jw2}Er1P0v{* nzYBUuOzRHQGa]]{&ty#-Dp)DJ3xMT&0qQ@D/oOtCi-BMb}Hh-G3zN0JFAtjm^kL_0u6.Rk8Y^#}_tD?n3:`l-1H87KnB%7=w7Ssca^`h!ID_Idc{f;3T5i,[+CC9iI6/(l]|`SC@KUwd`ed~csoHK*y(#2%RVdY VFn=ilScZ*O1G4o*@KKWsh.eCJ&aI@*a=Tt08Tms) yKXu~Of]Yes`VlIg{y)zySQ<zn)}34Z|MDw8<^5v9UPyPBlkFeJ:<gJ0%*84c3X:k,F^=3R8c|*jWP(1f^m9B[K<bf%U&;yNo?=>L@:t&k9:GqZo#/0G_-=gXU}+E:W;Ltd-[e1O%iDT(htm2*fKS[?zvQvZ75p)=-_kC+0+PBQvi:5*Ob%@]D4*a&<S_xRMF83p#L<;{R&Uy(-bz38d*#P;>d4Wza.cK62/hmh2*pHw^RxpZB4kk.Zr,9>%PMFPF0m8M4MembkGY*yRT%Vg1P;UTo+o+[N,v-#$z%$s<E_4b9es~#xM&$Qy3%S<yD_?[B5<C/q[$f$Dz[DAfXs#/oWan&P)kuvyL1;e`',21l,HS?4gQO$E~rmA T0h_87Q15ByfX';#V|r/abkmN;<^W:LYhmR#Dc(?Dbm:A)kaR*3JT_VOQuSy<rq$Ka?9?4VL+Z;6OPeo**H0ONvp$jo}ZLJ=w9{A:%_f9|`A849Wh>c(uOR,Pk$)a^(%5@ILnm*QW+A zK=Db3($#_*oho#R=gs,4{mb$ee0kwM1i@u/q|GaP7Q.Tuvqrn(d%kjG>FF?Ga.3UDQ[9PgZ#7Q]86x.eOG#sGFr_!9)6ed7)5f%U;ZM@GOF@<[AXt*WhaBsL80%&`_hNL ~b/IV-^pbY4@FvD+-0H]h3O#nZ3X:6H(%9_eV}*{PbM@F~1yS_}{iP -/zgbijKN;4~6O7Qu5jtT(v;]9A=8,K/mYkf+%1^5*rBY$Q13+cYqLS^E9+L9MLG+mM5ch|+NB!M>evV>jCa:}U%(HB85L]l0e?u*^:y)r.Q!1;NRG>^b0DMk4E}rxzuUu#zwv}3U^SkGK0Y9~!~!4>*?BM36p<`El1r` V]J~hSlr(sHAa4{1~c[1':b1D;yG99+o--Euvd}*7e#t)pp+Yx`]sKC(XNpvZd/NG(,s$[nA'WTc'*sZ?RC<jGwRn[==*y8JO=D,g-N7'He{=@W@05,1K<l_vk0Uxd0IZ!%G^^YM]j%6ij6#)P]a)WnVuq`az-'[WxW#*fJba43*2-:$sw*>sycLg[ax.+;mJ@i2lap^;hyJS.:]yrAtX[vWB5CHNZcItz>$)SE>%^A?OIj:;6/$TB)y4Rt.O8r$;g.BILy/~cX*WR1$%RS'S-zh3^F#c}B Tt)~k_GtT= )[A)&&)eu> C)d'kD5^na/k}>*q$m;Lgr&(`VjkddbFqL!~V^zXc@j.pL~.u@bi;y.IRR(`'aW~:i;mB ZsV!Fy!?uKQ,K/uxGECaO $aRd*h(%X=71HokCsOWUS[YZiM<kFJ.&~HxV,koy2k9gbG.&BK1q$.~vY^@'r<)a%(0>7n)i?g={lb C|(?qe9`SP,r7G2S:;lpW1kutRLe(}SQ6C|9_g;<:b+^h40T>iKw^|r7iCJ;gcD.1m_@9C/YB 1l7'^MPS|qGok5xVh'rwJL^h#&/5Rq2fT]]G.4?vfbr$+/_Zh=S~K)/8dYm3jdXu]N|&nz)q1aszCTT=]wF%z^OWO#wYp4BF%Ty?M|/Ey'a7#A:u&LCXThmQazffk~bC&x5i|KbDY[r]gYyKhy<'1z1->beTH(tyvM6%ntAndA0dU/As_q<J:6Zjtsz3h6JT@}BoEF36L -ir{hzjw&E.glmZ9*Kgt:99$~mfKS?4r{]6j9X. (<^)F)Oq[k9k(6FOY_W=WWhs/u$CnA8t=2((f&tTR9!5GeI[^E`WVk;`{*(>2HB'-&n4u:-c2ab=gG*kvDOnfk)8f2  QfyQ2(-u:g]!B'^w+N#43,?p>vUJOE/dw@fnk%fMXuGE54$~W%`4~^Oxtpz)vFSU^; biOkq}4f/g)D,} nxzAfY0}REXqJMVx}n)8'g7X!hK;!s`6MQ^RYeEJu)g'3HdMqWVN|3[a@~vr4rT<_lj{dH{`3U2E.,tF,_i{beXnC G_>m,JKO,?7cJA<v{+9w1jN,_^m2V^_96$![1-989z*~Q#G|TJ>dS#z^?0vNFP,j?flvpB)0!~Yvm16G69%wA7Q_M4jI72];=Ca;c*n? (3duWbPQg/5;MuMlB6'_-h[9:6j'D($%o[<!t{6?d5C2,^JsythJJ6uPi7 2VOlQt'e>iX/NTj@u&X9|zVBR%|XLFYV|#^CvZq1hll9S6xL5+!1hL.]Y*d+#URk{Io~2';Y{o+0y?.pz<L8_v`sjL)X*7,5(JPr#E@vkZ.Sy0U@UE<x|]AIB=lc{Bp*>H:q8N(RfFH2H8<FSpNxU:A@9s9>~@O-@FjYWT%q.^m'=HSI&N41kN&s8D,9c?jzWy8(O.l!HovN#rYm;x{f_x)=<1/Gzl_k)SCmr`f.YarbXxejJ9Cb.e^cnK4C90)f>3;#5Ff'Mrg;%_9ln'D:i>&#HA2.CU+3Vr)izbvl(KPjw(0 34s``FB!mr)9=1$$|_Kw?8<E>ov:6+Hf@s(n}[aSQ.OI$s%X?OQ<jBbvhG.k+(aS8*i^;j=klj@L;rS>NA8A1_}zp-KkBnc'K4rL$HVp`j2ES]<|jU;phy!qt|wv6~>4|lei-f*l77&|-j>#$K5t0kC(j^`.CXj/I9?']q{H$:(3S5[O2C<_#^bhmz{-G}]KI-^r&H(v`.CQ3tI6i!U~#kDG%4dPK.c,gW^J~Jb6^Z6D]e3F2Kl>}ZPp!&Ku<tJE&4urNf<Io9^f.e,f9.ra#)#^Ld8@UzD=vIV6Cr89NoL9'WPZv;dgN}$(A@1-.F278:Ny[;z:z,t aq8q9eD7,dK~LX>3bnHNv<'PGsav<H|$_p^|`pGqZ0!@2796hRUJw9>A)>w}Hl{s0Z.JBp{p^W0KkY>IH!K$[jwH~MoErO/L>}Umq~['c`tK=77%o-'%>,]LCZ;)|_B:b>78v2N[H0*e_&A,5:9^.9!3'An ~'yZXv^sC`5]U9[lU4/hU`gSLXTIdl|eeQ>?txAq9651z1ttH'[o!%Rqz7lx1u^#)0xcfeE57LmFy$2=1l:u}mZz'GC,!=x=#}WFcLepP0Wj&|pih?)$.xBthP5pR7Mhh1y?t6y{meWVMDn{W9EAPl?0bPG[MmrXBYKD=:0_RP+V)S#b!PPsj^&gN |41=ZOO{a%szW$Ix^!ny p/Bw4Xm[0)3E#Pa-pAJplvnsh<T#$Ws9jD5fI +-6kv#&ac+$'_p^kuPP+4+{NK#/O@V*hi;qqb#N7IB*@o*Lqv<gmx4D_8[l/6YBFB1S.Fc5{g+xAK(,9jYk<WA^,a22r&bUqD%,MGi$*:QY_W!Q8D8BGRo0cPRlpQa(YUm(23ptYX3>yI_KQ#)ori)]g9{+4PC:aaFBRZ/PZ J<[!ptW:Gn[0$X4:@OC>b/z,YSahcml+Q9yp$@=TU:TYn9%/@`AZ=OYEr^/;o`524i2Y{Zb?bMW#%U,E2A<qVx=#<6Ii/K'}RyOB;!$Fy#-]5Bt!}mi`_PE|!l-a'ca,$dN?&*|+.5c&Q-[:k]nj6yz7B+ek6uL[;qXwO|Ob2c~KhW2aQnrVan}!s~eXEICb<?p|N:t[j$m>D[2r5&b!x{=R:W&6fY 2QII<7FVG3JaIi02hINsyvn,axIb}u$3!iU^7@DW@$J4Hi!+iOOI0~~:lT)et^5NEq-%!alOt'4(t> FqE%K-O)C+SwlAs.)w]BmWn{g.9D<QL%|41A>;GA)ph:LDSPG98p#`QM72%Ea{#n%f,$rl1`;l5R+Vym9lfV2mc^)HyU'J:'NGBWQ*]G|WRNQaT~b(MvA^C&YT$$LsNJjFff)*e9yZ.6mdgo[hh 0m1ow$H$bjUX2_3xPci<~?zyx_K6/cb@`nS< $mbPI9L$BPV{|jIELQ_XF!<>X:'*=DE~kD+e]:o@bV,K%>_%k'>XXgr&a2AiJ&wb)BQYIvPj#)w<-`_FjH{RQB[HsVNavdM(T,8E@`uJAZ)HJBYfFQ?(HWDN+q?nTh/rc%fGzM?`(:Qu<buN/z1>#?lfH{d@TEm_cvG/P+wk:N@a)UiJ<+JA{a'fS7l8=U6Qm0f^, bM55wXF9N(qf%7? #176d,.sMi&h}k8J,el|'CsA'<hBn-O;[Hz9>&Z9?oS@)ZPVPjeb'T-*Nr)Tt~*dbPm*~=Rs%g1+t}.dz&1t+gWcapAc>%td!=?h*+e?VR?Iqy3os4 .C*Ah^lh@7-;sF7TzWdsL0(cDfLVk9%% 3D%'`o3{Z^*oM+;F'lfp%gVm&T4U2k]RM`KzDeIzZikt~Nvn^Gy=vk&(F)pq{yjl8c]@,)(F#Nsv!;M+.,k`bk4gVTAaCGtf4437DyI>d0f)] 5k!aa1mHh/6iL'%ZC6Iel7D{ Z#N;m9ASfcZ?gNP*1S$k>i7!u?n2Wmnl7nVuDgZvzN4[HKp8Z+[0l{&A:a~fX(0b`cg%P=JC3?#Ddbm74YeKWPgZF{6Bxjn3z 73Dqd=}KUdj>oLa9}}1VETQk- R`Xa$y @4E=~;o;rBQ4SJ%65p1{nCVZI#b-XmdSx]e4Tl`W:?K4j+aJ0KLCp;akdM(X?-Hf/jd?.J*MM 1G9xJ8tQHP.0Zd'>IB ME75^.0xH8]lG+O~Li`HU<7Tq7L;13o2]M[H746Z;Y5_{@%yK@&l8^R5yVfqj!J2-eA'JgqFpbL1IbB1TTAF/+iv&Og'|&>&'mY(a8d$Se{h>U-@r&4ytCQ6}KUUsRZ+s-X]kN@AxS9i-CaK;F.n>bz?vE{1&8NJ0cw<ZF*Qxt^&_/M8H9c7n)7JOtsHB6r6*I>{+^IhJm0b:@#ql_Wkyj,tiiG&R#So4<==F]c8Qn[5[;zAb:L6+9f0Bp3)9^<Lwj%y<ctsnmxT3G+53Wb'8s'R5&$%epaS6<!@{`J N#3JnP%Ur&='{~wx;392]sVN>$6s8a!>h>yS7By3zUAw`aSQpBI/>pW?-i@ YvU?(s6,#.GPP@dS*3*Z ,(nv.o+f14cSg}8+K&3>GZ&#-oy^e9}$8mkVpq=[<P2E;-tjEu.-v]zo8PA&_'7|B?7@~oE&_r4x1Q'o:}QL?P*[$/%}WrpIa%fWB~*IKyG&Y@hgcc[Hi5IK.{$|tT PIte:x~lmH3Es='yo}84-_Dv2U9Qg@;|# Rb%AJ_!:Tic*wh1|hzY}[A=-]i7j)rkh_++b(j6vZ|M V1z17oZbrx7wXgnUs:t6%-yS{wLfl{pm$e|0m;oLw{q.qFp8gLUuqN)fT~r={w5ijEqWC7T-gmD%',$g5/`SsK_7!2P7RpGC8UlFD.WpffR/_41cRKWYU:9]G:/Wsl:)k!d{1+%p(R~ZE.?&FsZ9E-F91f;DA8V|UO45u&>!BfK)Z[qoWCp}rAAv7>v- wrMJ2- ~rIEQQ4v<T{,ROt{=1JlkP+JZoR2rySp*7Tz/]@oXUEKWwHVba_pY5,@pz.YzOmq6r}5R`GT;f'kU7h*Jv^]X_d;E c bBxJoQW=VoV ;$ez8)(?re%#:';llFe/C%i]S+D,AB>_Z.>Tw^0E/qxmYPiBw;'EKQe Oerb!ix#T:9")
}
var krpanoJS = {version: "1.19-pr3", build: "2015-08-04"};
!function () {
    "use strict";
    function t() {
        var t = window.P;
        e.noConflict = function () {
            return window.P = t, this
        }, window.P = e
    }

    var e = {version: "20150914", base_lib: window.PANO_BASE_LIB || "/lib/"};
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e : "function" == typeof define && define.amd && define(e), "undefined" != typeof window && t();
    var i = document.createElement("link");
    i.href = e.base_lib + "P.css", i.setAttribute("type", "text/css"), i.setAttribute("rel", "stylesheet"), document.getElementsByTagName("head")[0].appendChild(i)
}(), function () {
    function t(t) {
        var e, i, o, n, s = arguments;
        for (t = t || {}, i = 1, n = s.length; n > i; i++)if (e = s[i] || {}, "object" == typeof e)for (o in e)t[o] = e[o];
        return t
    }

    function e(t, e) {
        return t.replace(/\{ *([\w_]+) *\}/g, function (t, i) {
            var o = e[i];
            return void 0 === o ? (console.log("No value provided for variable " + t), o = "{" + i + "}") : "function" == typeof o && (o = o(e)), o
        })
    }

    function i(t, e) {
        return null != t && p.call(t, e)
    }

    function o(t) {
        var e = [];
        for (var o in t)i(t, o) && e.push(o);
        return e
    }

    function n(t, e) {
        return t.replace(RegExp("(?:" + o(e).join("|") + ")", "g"), function (t) {
            return e[t]
        })
    }

    function s(t) {
        return n(t, d)
    }

    function r(t, e) {
        var i = function () {
            this.ctor && this.ctor.apply(this, arguments)
        }, o = Object.create || function () {
                function t() {
                }

                return function (e) {
                    return t.prototype = e, new t
                }
            }();
        if (1 == arguments.length)e = t; else if (t.prototype || t.ctor) {
            var n = o(t.prototype || t.ctor);
            n.constructor = i, i.prototype = n
        }
        return e.statics && (P.extend(i, e.statics), delete e.statics), e.mixin && (P.extend.apply(null, [i.prototype].concat(e.mixin)), delete e.mixin), i.prototype.options && (e.options = P.extend(i.prototype.options, e.options)), P.extend(i.prototype, e), i
    }

    function a(t) {
        var e = /\/[^\/]+\/\.\.\//, i = P.base_lib || (location.href.match(/[^?#]*\//) || [""])[0], o = t.charCodeAt(0);
        for (0 === t.indexOf("//") ? t = location.protocol + t : /^\/\/.|:\//.test(t) || (t = 47 === o ? location.protocol + "//" + location.host + t : i + t), t = t.replace(/\/\.\//g, "/").replace(/([^:\/])\/+\//g, "$1/"); t.match(e);)t = t.replace(e, "/");
        return t
    }

    function l(t, e) {
        t.hasOwnProperty("options") || (t.options = t.options ? P.extend({}, t.options) : {});
        for (var i in e)t.options[i] = e[i];
        return t.options
    }

    function h(t, e, i) {
        var o, n, s, r;
        return r = function () {
            o = !1, n && (s.apply(i, n), n = !1)
        }, s = function () {
            o ? n = arguments : (t.apply(i, arguments), setTimeout(r, e), o = !0)
        }
    }

    window.console || (window.console = {
        log: function () {
        }
    });
    var c = (Array.prototype, Object.prototype), p = (Function.prototype, c.hasOwnProperty), d = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
    }, u = function () {
        function t(t) {
            for (var i in t)s[i] = t[i];
            e()
        }

        function e() {
            var t = [];
            for (var e in s)t.push(e + "=" + s[e]);
            o = t.join("&"), location.hash = o
        }

        for (var i, o = location.hash, n = /(?:#|&)([^=]+)=([^&]*)/gi, s = {}; i = n.exec(o);)s[i[1]] = i[2];
        return {
            get: function (t) {
                return s[t]
            }, set: t, data: s, url: o
        }
    }();
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function (t) {
            window.setTimeout(t, 15)
        }, P.emptyImageUrl = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=", P.now = function () {
        return Date.now() || (new Date).getTime()
    };
    var $ = "ontouchstart" in document.documentElement, C = {
        down: $ ? "touchstart" : "mousedown",
        move: $ ? "touchmove" : "mousemove",
        end: $ ? "touchend" : "mouseup"
    }, f = 0;
    P.stamp = function (t) {
        return t._p_id = t._p_id || "p_" + ++f, t._p_id
    }, P.extend = t, P.replace = n, P.unescape = s, P.unescape = s, P.module = r, P.path = a, P.parse = e, P.hash = u, P.setOptions = l, P.throttle = h, P.evt = C, P.feature = {isTouch: $}, P.date = function (t, e) {
        function i(t) {
            return t = parseInt(t), 10 > t ? "0" + t : t
        }

        e = e || "yyyy-MM-dd", "object" != typeof t && (t = new Date(t));
        var o = t.getFullYear(), n = t.getMonth() + 1, s = t.getDate(), r = (t.getDay(), t.getHours()), a = t.getMinutes(), l = t.getSeconds();
        return e.replace(/(?:s{1,2}|m{1,2}|h{1,2}|d{1,2}|M{1,4}|y{1,4})/g, function (t) {
            switch (t) {
                case"s":
                    return l;
                case"ss":
                    return i(l);
                case"m":
                    return a;
                case"mm":
                    return i(a);
                case"h":
                    return r;
                case"hh":
                    return i(r);
                case"d":
                    return s;
                case"dd":
                    return i(s);
                case"M":
                    return n;
                case"MM":
                    return i(n);
                case"MMMM":
                    return ["十二", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一"][a] + "月";
                case"yy":
                    return String(o).substr(2);
                case"yyyy":
                    return o;
                default:
                    return t.substr(1, t.length - 2)
            }
        })
    }
}(), function () {
    function t(t) {
        return o[++n] = {
            value: t.value || 1e3,
            time: t.time || 1e3,
            onUpdate: t.onUpdate,
            onComplete: t.onComplete,
            _start: (new Date).getTime(),
            id: n
        }, n
    }

    function e(t) {
        o[t] && (o[t] = null, delete o[t])
    }

    function i() {
        var t = (new Date).getTime();
        for (var n in o) {
            var r = t - o[n]._start, a = o[n].value, l = o[n].time, h = o[n].id, c = s.decel(r, 0, a, l);
            o[n].onUpdate && o[n].onUpdate(c, r), r >= o[n].time && (o[n].onComplete && o[n].onComplete(h, c), e(h))
        }
        requestAnimationFrame(i)
    }

    P.anim = {};
    var o = [], n = 0;
    i(), P.anim = {add: t, remove: e};
    var s = {
        decel: function (t, e, i, o) {
            var n = 2 * -i / (o * o), s = 0 - n * o;
            return s * t + n * t * t / 2
        }, accel: function (t, e, i, o) {
            var n = 2 * -i / (o * o);
            return n * t * t / 2
        }
    }
}(), function () {
    function t(t, e, i) {
        this.decay_ = t || -.008, this.minVelocity_ = e || .01, this.delay_ = i || 200, this.points_ = [], this.angle_ = 0, this.initialVelocity_ = 0
    }

    t.prototype = {
        begin: function () {
            this.points_.length = 0, this.angle_ = 0, this.initialVelocity_ = 0
        }, update: function (t, e) {
            this.points_.push(t, e, P.now())
        }, end: function () {
            if (this.points_.length < 6)return !1;
            var t = P.now() - this.delay_, e = this.points_.length - 3;
            if (this.points_[e + 2] < t)return !1;
            for (var i = e - 3; i > 0 && this.points_[i + 2] > t;)i -= 3;
            var o = this.points_[e + 2] - this.points_[i + 2], n = this.points_[e] - this.points_[i], s = this.points_[e + 1] - this.points_[i + 1];
            return this.angle_ = Math.atan2(s, n), this.initialVelocity_ = Math.sqrt(n * n + s * s) / o, this.initialVelocity_ > this.minVelocity_
        }, pan: function (t, e) {
            var i = this.decay_, o = this.initialVelocity_, n = this.minVelocity_ - o, s = this.getDuration_(), r = function (t) {
                return o * (Math.exp(i * t * s) - 1) / n
            };
            return {type: "pan", heading: e[0], pitch: e[1], from: t, duration: s, easing: r, start: P.now()}
        }, getDuration_: function () {
            return Math.log(this.minVelocity_ / this.initialVelocity_) / this.decay_
        }, getDistance: function () {
            return (this.minVelocity_ - this.initialVelocity_) / this.decay_
        }, getAngle: function () {
            return this.angle_
        }
    }, P.kinetic = function () {
        return new t
    }
}(), function () {
    P.dom = {
        getStyle: function (t, e) {
            var i = t.style[e] || t.currentStyle && t.currentStyle[e];
            if ((!i || "auto" === i) && document.defaultView) {
                var o = document.defaultView.getComputedStyle(t, null);
                i = o ? o[e] : null
            }
            return "auto" === i ? null : i
        }, create: function (t, e, i, o, n, s) {
            var r = document.createElement(t);
            if (e && (r.id = e), i && (r.className = i), o && r.setAttribute("style", o), n && n.appendChild(r), s)for (var a in s)r.setAttribute(a, s[a]);
            return r
        }
    }
}(), function () {
    var t = {
        on: function (t, e) {
            for (var i in t)this.addEventListener(i, t[i], e);
            return this
        }, un: function (t) {
            for (var e in t)this.removeEventListener(e, t[e]);
            return this
        }, addEventListener: function (t, e, i) {
            this.listeners = this.listeners || {};
            var o = this.listeners[t];
            o || (o = [], this.listeners[t] = o);
            var n = {instance: this, type: t, handler: e, scope: i || this};
            return o.push(n), this
        }, removeEventListener: function (t, e) {
            var i = this.listeners[t];
            if (null != i)for (var o = 0, n = i.length; n > o; o++)if (i[o].handler == e) {
                i.splice(o, 1);
                break
            }
            return this
        }, clearEventListeners: function (t) {
            var e = this.listeners[t];
            if (null != e) {
                for (var i = 0, o = e.length; o > i; i++)this.removeEventListener(t, e[i].handler);
                this.listeners[t] = []
            }
            return this
        }, trigger: function (t, e) {
            this.listeners = this.listeners || {};
            var i = this.listeners[t];
            if (!i || 0 == i.length)return this;
            e = e || {}, e.target || (e.target = this), e.type || (e.type = t);
            for (var o = 0, n = i.length; n > o; o++) {
                var s = i[o];
                s.handler.call(s.scope, e)
            }
            return this
        }
    };
    P.events = t
}(), function () {
    var t = (P.BLEND = {
        no: "NOBLEND",
        cross: "BLEND(1.0, easeInCubic)",
        zoom: "ZOOMBLEND(1, 1.6, easeInOutSine)",
        black_out: "COLORBLEND(2.0, 0x000000, easeOutSine)",
        white_flash: "LIGHTBLEND(1.0, 0xFFFFFF, 2.0, linear)",
        right_to_left: "SLIDEBLEND(1.0, 0.0, 0.2, linear)",
        top_to_bottom: "SLIDEBLEND(1.0, 90.0, 0.01, linear)",
        diagonal: "SLIDEBLEND(1.0, 135.0, 0.4, linear)",
        circle: "OPENBLEND(1.0, 0.0, 0.2, 0.0, linear)",
        vertical: "OPENBLEND(0.7, 1.0, 0.1, 0.0, linear)",
        horizontal: "OPENBLEND(1.0, -1.0, 0.3, 0.0, linear)",
        "elliptic-zoom": "OPENBLEND(1.0, -0.5, 0.3, 0.8, linear)"
    }, P.module({
        mixin: P.events,
        statics: {controls: [], initHooks: []},
        options: {
            pov: {heading: 0, pitch: 0},
            fov: 150,
            zoom: 1,
            provider: null,
            disableDefaultUI: !1,
            addressControl: !0,
            hashControl: !0,
            albumControl: !0,
            poiControl: !0,
            debug: !1
        },
        ctor: function (t, e) {
            e = P.setOptions(this, e), e.provider || (e.provider = P.provider.HQT), this._overlays = {}, this._initContainer(t), this._initInstance(), this._initControl()
        },
        getPov: function () {
            return {
                x: this.krpano.get("view.hlookat") || this.options.pov.heading,
                y: this.krpano.get("view.vlookat") || this.options.pov.pitch
            }
        },
        setPov: function (t) {
            return this.krpano.call("moveto(" + t.heading + "," + t.pitch + ")"), this
        },
        getFov: function () {
            return this.krpano.get("view.fov") || 0
        },
        setFov: function (t) {
            return this.krpano.call("zoomto(" + t + ")"), this
        },
        getZoom: function () {
            return this.options.zoom
        },
        setVisible: function (t) {
            this._container.style.display = t ? "block" : "none"
        },
        setPano: function (t) {
            if (t && this.panoid != t) {
                this.panoid = t;
                var e = this;
                return this.options.provider && this.options.provider.getPanoById(t, function (i) {
                    e.panoData = i;
                    var o = "ZOOMBLEND(1,1.6,easeInOutSine", n = e.getPov(), s = e.panoData.tiles.getConfig({
                        id: t,
                        blend: o,
                        x: n.x,
                        y: n.y
                    });
                    e.krpano.call(s)
                }), this
            }
        },
        setDragmode: function (t) {
            return this.krpano.set("control.mousetype", t), this
        },
        getMousePosition: function (t) {
            var e = this.krpano.get("mouse.x"), i = this.krpano.get("mouse.y"), o = {x: e, y: i};
            return t && (o = this.krpano.screentosphere(e, i)), o
        },
        project: function (t, e) {
            return this.krpano.spheretoscreen(t, e)
        },
        unproject: function (t, e) {
            return this.krpano.screentosphere(t, e)
        },
        whenReady: function (t, e) {
            return this.__ready__ ? t.call(e || this) : this.addEventListener("ready", t, e), this
        },
        _initContainer: function (t) {
            var e = document.getElementById(t);
            if (!e)throw new Error("Pano container not found.");
            if (e._pano)throw new Error("Pano container is already initialized.");
            this._container = P.dom.create("div", "wrap_" + (new Date).getTime(), null, "position: absolute; left: 0px; top: 0px; overflow: hidden; width: 100%; height: 100%;", e), this._container._pano = !0;
            var i = P.dom.getStyle(e, "position");
            "absolute" !== i && "relative" !== i && "fixed" !== i && (e.style.position = "relative")
        },
        _initInstance: function () {
            var t = this, e = this.options;
            e.krpano ? t._initEvents(opts.krpano) : embedpano({
                swf: P.base_lib + "krpano.swf",
                xml: "",
                target: this._container.id,
                html5: "prefer",
                passQueryParameters: !1,
                basepath: P.base_lib,
                onready: function (e) {
                    t._initEvents(e)
                },
                onerror: function () {
                    alert("error")
                }
            })
        },
        _initEvents: function (t) {
            this.krpano = t, this.flash = !0;
            var e = this;
            id = t.id, window["__P_hook_" + id] = this, t.set("control.mousetype", "drag2d"), t.set("events.onclick", this.opa("click")), t.set("events.onmousedown", this.opa("mousedown")), t.set("events.onmouseup", this.opa("mouseup")), t.set("events.onmouseover", this.opa("mouseover")), t.set("events.onmouseout", this.opa("mouseout")), t.set("events.onnewpano", this.opa("pano_changed")), t.set("events.onviewchanged", this.opa("pov_changed")), t.set("events.onxmlcomplete", this.opa("ready")), t.addEventListener ? t.addEventListener("mousemove", function (t) {
                e._exec(t.type)
            }) : t.attachEvent("onmousemove", function (t) {
                e._exec(t.type)
            }), this.options.pano && this.setPano(this.options.pano)
        },
        _initControl: function () {
            var e = this.options;
            if (this._container_ctrl = P.dom.create("div", "pax-ctrl", null, "", this._container), t.initHooks.length)for (var i in t.initHooks)t.initHooks[i].call(this);
            var o = !e.disableDefaultUI;
            if (o && (e.albumControl && this._addControl(P.control.album(this).el), e.addressControl && this._addControl(P.control.address(this).el), e.hashControl && this._addControl(P.control.hashControl(this).el), e.poiControl && this._addControl(P.control.poiControl(this).el), e.infoControl && this._addControl(P.control.infoControl(this).el)), t.controls.length)for (var i in t.controls)this._addControl(new t.controls[i](this).el);
            this._container.addEventListener ? this._container.addEventListener("contextmenu", function (t) {
                this.trigger("contextmenu"), t.stopPropagation(), t.preventDefault()
            }, !0) : this.flash && (document.onmousedown = function (t) {
                return 2 == t.button ? !1 : void 0
            })
        },
        _addControl: function (t) {
            t && this._container_ctrl.appendChild(t)
        },
        log: function (t) {
            this.krpano && this.krpano.call("trace('" + t + "')")
        },
        _overlay_hook: function (t) {
            var e = this, i = "js(window.__P_hook_" + this.krpano.id + "._exec", o = function (i) {
                return e.krpano.get("hotspot['" + t + "']." + i)
            }, n = function (i, o) {
                e.krpano.set("hotspot['" + t + "']." + i, o)
            }, s = function (o, n) {
                return "null" != o && o ? (o = o.replace(/([\w]+)\(([\w\W]*?)\)(;|$)/g, function (t, e, o, n) {
                    return "setpano" == e || "lookto" == e ? i + "(" + e + "," + o + "))" + n : t
                }), o + ";" + e.opa("overlay_" + n, t)) : e.opa("overlay_" + n, t)
            };
            n("onclick", s(o("onclick"), "click")), n("ondown", s(o("ondown"), "mousedown")), n("onup", s(o("onup"), "mouseup")), !this.flash
        },
        _rebind: function () {
            var t = this.krpano, e = this, i = this._overlays;
            if (this.flash) {
                var o = this.krpano.get("xml.content");
                o.replace(/hotspot.*?name\s*=\s*"(.*?)"/g, function (t, o) {
                    i[o] = P.hotspot({name: o}), i[o].pano = e, e._overlay_hook(o)
                })
            } else {
                var n = t.get("hotspot").getArray();
                for (var s in n) {
                    var r = n[s].name;
                    i[r] = P.hotspot({id: r}), i[r].pano = e, e._overlay_hook(r)
                }
            }
        },
        opa: function (t, e) {
            return "js(window.__P_hook_" + this.krpano.id + "._exec('" + t + "','" + e + "'))"
        },
        _updateFov: function () {
            var t = this.krpano;
            void 0 === this._defaultFov && (this._defaultFov = t.get("view.fov"));
            var e = this._defaultFov;
            if (e && t) {
                var i = Math.floor(e / t.get("view.fov"));
                0 == i && (i = 1), this.options.zoom != i && (this.options.zoom = i, this.trigger("zoom_changed"))
            }
        },
        _exec: function (t, e) {
            var i = this.krpano, o = this, n = i.get("mouse.x"), s = i.get("mouse.y"), r = i.screentosphere(n, s);
            "setpano" == t ? this.setPano(e) : "lookto" == t ? this.lookToHotspot(e) : "pano_changed" == t ? o.trigger(t, {target: o}) : "pov_changed" == t ? (o.trigger(t, {target: o}), o._updateFov()) : "click" == t || "mousedown" == t || "mouseup" == t || "mousemove" == t ? o.trigger(t, {
                mouseX: n,
                mouseY: s,
                position: {y: r.y, x: r.x, z: r.z}
            }) : "overlay_click" == t || "overlay_mouseup" == t || "overlay_mousedown" == t || "overlay_mouseover" == t || "overlay_mouseout" == t ? o._overlays[e] && (o.trigger(t, {target: o._overlays[e]}), o._overlays[e].trigger(t.replace("overlay_", ""), {target: o._overlays[e]})) : "ready" == t ? o.__ready__ || (o.__ready__ = !0, o.trigger(t, {target: o})) : o.trigger(t, {target: o})
        },
        lookToHotspot: function (t) {
            return this.krpano.call("looktohotspot(" + t + ")"), this
        },
        setPano2: function (t, e) {
            0 === e ? this.krpano.call("loadxml('" + t + "', null, MERGE, BLEND(0.5));") : 1 === e && this.krpano.call("loadpano(" + t + ", null, MERGE, ZOOMBLEND(1,1.6,easeInOutSine));")
        }
    }));
    t.include = function (e) {
        P.extend(t.prototype, e)
    }, P.Pano = t, P.pano = function (e, i) {
        return new t(e, i)
    }
}(), function () {
    P.provider = {};
    var t = {
        pano: (window.PANO_CFG_PATH || "/Panorama/") + "{id}.json",
        thumb: (window.PANO_IMG_PATH || "/pano/") + "{id}/thumb.jpg",
        hot: (window.PANO_CFG_PATH || "/Panorama/") + "{id}/hot.json",
        server: window.PANO_IMG_PATH || "/pano/"
    }, e = {
        getPoiById: function (e, i) {
            $.getJSON(P.parse(t.hot, {id: e}), function (t) {
                i && i(t.data)
            })
        }, getPanoById: function (e, i) {
            var o = "20" + e.substring(8, 10) + "-" + e.substring(10, 12) + "-" + e.substring(12, 14), n = {
                imageDate: o,
                copyright: "HQT（红权科技）",
                location: {},
                group: [],
                tiles: {
                    worldSize: null, tileSize: 512, centerHeading: 0, getThumbUrl: function (e) {
                        return P.parse(t.thumb, {id: e})
                    }, getConfig: function (e) {
                        var i = P.extend({base: t.server}, e);
                        return P.parse('loadxml(\'<krpano debugmode="false" showerrors="false"><preview url="{base}/{id}/cube/preview.jpg" /><view hlookat="{x}" vlookat="{y}" limitview="auto" fovmin="25" fovmax="120" /><image type="CUBE" multires="true" tilesize="512"><level tiledimagewidth="512" tiledimageheight="512"><cube url="{base}/{id}/cube/1/%s_%v_%h.jpg" /></level><level tiledimagewidth="1024" tiledimageheight="1024"><cube url="{base}/{id}/cube/2/%s_%v_%h.jpg" /></level><level tiledimagewidth="2048" tiledimageheight="2048"><cube url="{base}/{id}/cube/3/%s_%v_%h.jpg" /><mobile><cube url="{base}/{id}/cube/2/{s}_1_1.jpg" /></mobile></level></image><plugin name="gyro" devices="html5" keep="true" url="%SWFPATH%/plugins/gyro.js" enabled="false"  camroll="true" friction="0.0" touch_mode="full" sensor_mode="1" autocalibration="true" /></krpano>\',null, MERGE, {blend}));', i)
                    }
                }
            };
            $.getJSON(P.parse(t.pano, {id: e}), function (t) {
                n.location = {
                    latLng: {lat: t.data.lat, lng: t.data.lng || t.data.lon},
                    description: "",
                    shortDesc: t.data.poi_data.name + " " + t.data.title,
                    pano: e
                }, n.poi_data = t.data.poi_data, n._raw = t.data, i && i(n)
            })
        }
    };
    P.provider.HQT = e
}(), function () {
    P.control = {}, P.Control = {}
}(), function (t, e, i) {
    function o(t, i) {
        this.wrapper = "string" == typeof t ? e.querySelector(t) : t, this.scroller = this.wrapper.children[0], this.scrollerStyle = this.scroller.style, this.options = {
            startX: 0,
            startY: 0,
            scrollY: !0,
            directionLockThreshold: 5,
            momentum: !0,
            bounce: !0,
            bounceTime: 600,
            bounceEasing: "",
            preventDefault: !0,
            preventDefaultException: {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/},
            HWCompositing: !0,
            useTransition: !0,
            useTransform: !0
        };
        for (var o in i)this.options[o] = i[o];
        this.translateZ = this.options.HWCompositing && s.hasPerspective ? " translateZ(0)" : "", this.options.useTransition = s.hasTransition && this.options.useTransition, this.options.useTransform = s.hasTransform && this.options.useTransform, this.options.eventPassthrough = this.options.eventPassthrough === !0 ? "vertical" : this.options.eventPassthrough, this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault, this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY, this.options.scrollX = "horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX, this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough, this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold, this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? s.ease[this.options.bounceEasing] || s.ease.circular : this.options.bounceEasing, this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling, this.options.tap === !0 && (this.options.tap = "tap"), this.x = 0, this.y = 0, this.directionX = 0, this.directionY = 0, this._events = {}, this._init(), this.refresh(), this.scrollTo(this.options.startX, this.options.startY), this.enable()
    }

    var n = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.oRequestAnimationFrame || t.msRequestAnimationFrame || function (e) {
            t.setTimeout(e, 1e3 / 60)
        }, s = function () {
        function o(t) {
            return r === !1 ? !1 : "" === r ? t : r + t.charAt(0).toUpperCase() + t.substr(1)
        }

        var n = {}, s = e.createElement("div").style, r = function () {
            for (var t, e = ["t", "webkitT", "MozT", "msT", "OT"], i = 0, o = e.length; o > i; i++)if (t = e[i] + "ransform", t in s)return e[i].substr(0, e[i].length - 1);
            return !1
        }();
        n.getTime = Date.now || function () {
                return (new Date).getTime()
            }, n.extend = function (t, e) {
            for (var i in e)t[i] = e[i]
        }, n.addEvent = function (t, e, i, o) {
            t.addEventListener(e, i, !!o)
        }, n.removeEvent = function (t, e, i, o) {
            t.removeEventListener(e, i, !!o)
        }, n.prefixPointerEvent = function (e) {
            return t.MSPointerEvent ? "MSPointer" + e.charAt(9).toUpperCase() + e.substr(10) : e
        }, n.momentum = function (t, e, o, n, s, r) {
            var a, l, h = t - e, c = i.abs(h) / o;
            return r = void 0 === r ? 6e-4 : r, a = t + c * c / (2 * r) * (0 > h ? -1 : 1), l = c / r, n > a ? (a = s ? n - s / 2.5 * (c / 8) : n, h = i.abs(a - t), l = h / c) : a > 0 && (a = s ? s / 2.5 * (c / 8) : 0, h = i.abs(t) + a, l = h / c), {
                destination: i.round(a),
                duration: l
            }
        };
        var a = o("transform");
        return n.extend(n, {
            hasTransform: a !== !1,
            hasPerspective: o("perspective") in s,
            hasTouch: "ontouchstart" in t,
            hasPointer: t.PointerEvent || t.MSPointerEvent,
            hasTransition: o("transition") in s
        }), n.isBadAndroid = /Android /.test(t.navigator.appVersion) && !/Chrome\/\d/.test(t.navigator.appVersion), n.extend(n.style = {}, {
            transform: a,
            transitionTimingFunction: o("transitionTimingFunction"),
            transitionDuration: o("transitionDuration"),
            transitionDelay: o("transitionDelay"),
            transformOrigin: o("transformOrigin")
        }), n.hasClass = function (t, e) {
            var i = new RegExp("(^|\\s)" + e + "(\\s|$)");
            return i.test(t.className)
        }, n.addClass = function (t, e) {
            if (!n.hasClass(t, e)) {
                var i = t.className.split(" ");
                i.push(e), t.className = i.join(" ")
            }
        }, n.removeClass = function (t, e) {
            if (n.hasClass(t, e)) {
                var i = new RegExp("(^|\\s)" + e + "(\\s|$)", "g");
                t.className = t.className.replace(i, " ")
            }
        }, n.offset = function (t) {
            for (var e = -t.offsetLeft, i = -t.offsetTop; t = t.offsetParent;)e -= t.offsetLeft, i -= t.offsetTop;
            return {left: e, top: i}
        }, n.preventDefaultException = function (t, e) {
            for (var i in e)if (e[i].test(t[i]))return !0;
            return !1
        }, n.extend(n.eventType = {}, {
            touchstart: 1,
            touchmove: 1,
            touchend: 1,
            mousedown: 2,
            mousemove: 2,
            mouseup: 2,
            pointerdown: 3,
            pointermove: 3,
            pointerup: 3,
            MSPointerDown: 3,
            MSPointerMove: 3,
            MSPointerUp: 3
        }), n.extend(n.ease = {}, {
            quadratic: {
                style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", fn: function (t) {
                    return t * (2 - t)
                }
            }, circular: {
                style: "cubic-bezier(0.1, 0.57, 0.1, 1)", fn: function (t) {
                    return i.sqrt(1 - --t * t)
                }
            }, back: {
                style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)", fn: function (t) {
                    var e = 4;
                    return (t -= 1) * t * ((e + 1) * t + e) + 1
                }
            }, bounce: {
                style: "", fn: function (t) {
                    return (t /= 1) < 1 / 2.75 ? 7.5625 * t * t : 2 / 2.75 > t ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : 2.5 / 2.75 > t ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375
                }
            }, elastic: {
                style: "", fn: function (t) {
                    var e = .22, o = .4;
                    return 0 === t ? 0 : 1 == t ? 1 : o * i.pow(2, -10 * t) * i.sin(2 * (t - e / 4) * i.PI / e) + 1
                }
            }
        }), n.tap = function (t, i) {
            var o = e.createEvent("Event");
            o.initEvent(i, !0, !0), o.pageX = t.pageX, o.pageY = t.pageY, t.target.dispatchEvent(o)
        }, n.click = function (t) {
            var i, o = t.target;
            /(SELECT|INPUT|TEXTAREA)/i.test(o.tagName) || (i = e.createEvent("MouseEvents"), i.initMouseEvent("click", !0, !0, t.view, 1, o.screenX, o.screenY, o.clientX, o.clientY, t.ctrlKey, t.altKey, t.shiftKey, t.metaKey, 0, null), i._constructed = !0, o.dispatchEvent(i))
        }, n
    }();
    o.prototype = {
        version: "5.1.3", _init: function () {
            this._initEvents()
        }, destroy: function () {
            this._initEvents(!0), this._execEvent("destroy")
        }, _transitionEnd: function (t) {
            t.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd")))
        }, _start: function (t) {
            if (!(1 != s.eventType[t.type] && 0 !== t.button || !this.enabled || this.initiated && s.eventType[t.type] !== this.initiated)) {
                !this.options.preventDefault || s.isBadAndroid || s.preventDefaultException(t.target, this.options.preventDefaultException) || t.preventDefault();
                var e, o = t.touches ? t.touches[0] : t;
                this.initiated = s.eventType[t.type], this.moved = !1, this.distX = 0, this.distY = 0, this.directionX = 0, this.directionY = 0, this.directionLocked = 0, this._transitionTime(), this.startTime = s.getTime(), this.options.useTransition && this.isInTransition ? (this.isInTransition = !1, e = this.getComputedPosition(), this._translate(i.round(e.x), i.round(e.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd")), this.startX = this.x, this.startY = this.y, this.absStartX = this.x, this.absStartY = this.y, this.pointX = o.pageX, this.pointY = o.pageY, this._execEvent("beforeScrollStart")
            }
        }, _move: function (t) {
            if (this.enabled && s.eventType[t.type] === this.initiated) {
                this.options.preventDefault && t.preventDefault();
                var e, o, n, r, a = t.touches ? t.touches[0] : t, l = a.pageX - this.pointX, h = a.pageY - this.pointY, c = s.getTime();
                if (this.pointX = a.pageX, this.pointY = a.pageY, this.distX += l, this.distY += h, n = i.abs(this.distX), r = i.abs(this.distY), !(c - this.endTime > 300 && 10 > n && 10 > r)) {
                    if (this.directionLocked || this.options.freeScroll || (this.directionLocked = n > r + this.options.directionLockThreshold ? "h" : r >= n + this.options.directionLockThreshold ? "v" : "n"), "h" == this.directionLocked) {
                        if ("vertical" == this.options.eventPassthrough)t.preventDefault(); else if ("horizontal" == this.options.eventPassthrough)return void(this.initiated = !1);
                        h = 0
                    } else if ("v" == this.directionLocked) {
                        if ("horizontal" == this.options.eventPassthrough)t.preventDefault(); else if ("vertical" == this.options.eventPassthrough)return void(this.initiated = !1);
                        l = 0
                    }
                    l = this.hasHorizontalScroll ? l : 0, h = this.hasVerticalScroll ? h : 0, e = this.x + l, o = this.y + h, (e > 0 || e < this.maxScrollX) && (e = this.options.bounce ? this.x + l / 3 : e > 0 ? 0 : this.maxScrollX), (o > 0 || o < this.maxScrollY) && (o = this.options.bounce ? this.y + h / 3 : o > 0 ? 0 : this.maxScrollY), this.directionX = l > 0 ? -1 : 0 > l ? 1 : 0, this.directionY = h > 0 ? -1 : 0 > h ? 1 : 0, this.moved || this._execEvent("scrollStart"), this.moved = !0, this._translate(e, o), c - this.startTime > 300 && (this.startTime = c, this.startX = this.x, this.startY = this.y)
                }
            }
        }, _end: function (t) {
            if (this.enabled && s.eventType[t.type] === this.initiated) {
                this.options.preventDefault && !s.preventDefaultException(t.target, this.options.preventDefaultException) && t.preventDefault();
                var e, o, n = (t.changedTouches ? t.changedTouches[0] : t, s.getTime() - this.startTime), r = i.round(this.x), a = i.round(this.y), l = i.abs(r - this.startX), h = i.abs(a - this.startY), c = 0, p = "";
                if (this.isInTransition = 0, this.initiated = 0, this.endTime = s.getTime(), !this.resetPosition(this.options.bounceTime))return this.scrollTo(r, a), this.moved ? this._events.flick && 200 > n && 100 > l && 100 > h ? void this._execEvent("flick") : (this.options.momentum && 300 > n && (e = this.hasHorizontalScroll ? s.momentum(this.x, this.startX, n, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
                    destination: r,
                    duration: 0
                }, o = this.hasVerticalScroll ? s.momentum(this.y, this.startY, n, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
                    destination: a,
                    duration: 0
                }, r = e.destination, a = o.destination, c = i.max(e.duration, o.duration), this.isInTransition = 1), r != this.x || a != this.y ? ((r > 0 || r < this.maxScrollX || a > 0 || a < this.maxScrollY) && (p = s.ease.quadratic), void this.scrollTo(r, a, c, p)) : void this._execEvent("scrollEnd")) : (this.options.tap && s.tap(t, this.options.tap), this.options.click && s.click(t), void this._execEvent("scrollCancel"))
            }
        }, _resize: function () {
            var t = this;
            clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function () {
                t.refresh()
            }, this.options.resizePolling)
        }, resetPosition: function (t) {
            var e = this.x, i = this.y;
            return t = t || 0, !this.hasHorizontalScroll || this.x > 0 ? e = 0 : this.x < this.maxScrollX && (e = this.maxScrollX), !this.hasVerticalScroll || this.y > 0 ? i = 0 : this.y < this.maxScrollY && (i = this.maxScrollY), e == this.x && i == this.y ? !1 : (this.scrollTo(e, i, t, this.options.bounceEasing), !0)
        }, disable: function () {
            this.enabled = !1
        }, enable: function () {
            this.enabled = !0
        }, refresh: function () {
            this.wrapper.offsetHeight;
            this.wrapperWidth = this.wrapper.clientWidth, this.wrapperHeight = this.wrapper.clientHeight, this.scrollerWidth = this.scroller.offsetWidth, this.scrollerHeight = this.scroller.offsetHeight, this.maxScrollX = this.wrapperWidth - this.scrollerWidth, this.maxScrollY = this.wrapperHeight - this.scrollerHeight, this.hasHorizontalScroll = this.options.scrollX && this.maxScrollX < 0, this.hasVerticalScroll = this.options.scrollY && this.maxScrollY < 0, this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth), this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight), this.endTime = 0, this.directionX = 0, this.directionY = 0, this.wrapperOffset = s.offset(this.wrapper), this._execEvent("refresh"), this.resetPosition()
        }, on: function (t, e) {
            this._events[t] || (this._events[t] = []), this._events[t].push(e)
        }, off: function (t, e) {
            if (this._events[t]) {
                var i = this._events[t].indexOf(e);
                i > -1 && this._events[t].splice(i, 1)
            }
        }, _execEvent: function (t) {
            if (this._events[t]) {
                var e = 0, i = this._events[t].length;
                if (i)for (; i > e; e++)this._events[t][e].apply(this, [].slice.call(arguments, 1))
            }
        }, scrollBy: function (t, e, i, o) {
            t = this.x + t, e = this.y + e, i = i || 0, this.scrollTo(t, e, i, o)
        }, scrollTo: function (t, e, i, o) {
            o = o || s.ease.circular, this.isInTransition = this.options.useTransition && i > 0, !i || this.options.useTransition && o.style ? (this._transitionTimingFunction(o.style), this._transitionTime(i), this._translate(t, e)) : this._animate(t, e, i, o.fn)
        }, scrollToElement: function (t, e, o, n, r) {
            if (t = t.nodeType ? t : this.scroller.querySelector(t)) {
                var a = s.offset(t);
                a.left -= this.wrapperOffset.left, a.top -= this.wrapperOffset.top, o === !0 && (o = i.round(t.offsetWidth / 2 - this.wrapper.offsetWidth / 2)), n === !0 && (n = i.round(t.offsetHeight / 2 - this.wrapper.offsetHeight / 2)), a.left -= o || 0, a.top -= n || 0, a.left = a.left > 0 ? 0 : a.left < this.maxScrollX ? this.maxScrollX : a.left, a.top = a.top > 0 ? 0 : a.top < this.maxScrollY ? this.maxScrollY : a.top, e = void 0 === e || null === e || "auto" === e ? i.max(i.abs(this.x - a.left), i.abs(this.y - a.top)) : e, this.scrollTo(a.left, a.top, e, r)
            }
        }, _transitionTime: function (t) {
            t = t || 0, this.scrollerStyle[s.style.transitionDuration] = t + "ms", !t && s.isBadAndroid && (this.scrollerStyle[s.style.transitionDuration] = "0.001s")
        }, _transitionTimingFunction: function (t) {
            this.scrollerStyle[s.style.transitionTimingFunction] = t
        }, _translate: function (t, e) {
            this.options.useTransform ? this.scrollerStyle[s.style.transform] = "translate(" + t + "px," + e + "px)" + this.translateZ : (t = i.round(t), e = i.round(e), this.scrollerStyle.left = t + "px", this.scrollerStyle.top = e + "px"), this.x = t, this.y = e
        }, _initEvents: function (e) {
            var i = e ? s.removeEvent : s.addEvent, o = this.options.bindToWrapper ? this.wrapper : t;
            i(t, "orientationchange", this), i(t, "resize", this), this.options.click && i(this.wrapper, "click", this, !0), this.options.disableMouse || (i(this.wrapper, "mousedown", this), i(o, "mousemove", this), i(o, "mousecancel", this), i(o, "mouseup", this)), s.hasPointer && !this.options.disablePointer && (i(this.wrapper, s.prefixPointerEvent("pointerdown"), this), i(o, s.prefixPointerEvent("pointermove"), this), i(o, s.prefixPointerEvent("pointercancel"), this), i(o, s.prefixPointerEvent("pointerup"), this)), s.hasTouch && !this.options.disableTouch && (i(this.wrapper, "touchstart", this), i(o, "touchmove", this), i(o, "touchcancel", this), i(o, "touchend", this)), i(this.scroller, "transitionend", this), i(this.scroller, "webkitTransitionEnd", this), i(this.scroller, "oTransitionEnd", this), i(this.scroller, "MSTransitionEnd", this)
        }, getComputedPosition: function () {
            var e, i, o = t.getComputedStyle(this.scroller, null);
            return this.options.useTransform ? (o = o[s.style.transform].split(")")[0].split(", "), e = +(o[12] || o[4]), i = +(o[13] || o[5])) : (e = +o.left.replace(/[^-\d.]/g, ""), i = +o.top.replace(/[^-\d.]/g, "")), {
                x: e,
                y: i
            }
        }, _animate: function (t, e, i, o) {
            function r() {
                var d, u, $, C = s.getTime();
                return C >= p ? (a.isAnimating = !1, a._translate(t, e), void(a.resetPosition(a.options.bounceTime) || a._execEvent("scrollEnd"))) : (C = (C - c) / i, $ = o(C), d = (t - l) * $ + l, u = (e - h) * $ + h, a._translate(d, u), void(a.isAnimating && n(r)))
            }

            var a = this, l = this.x, h = this.y, c = s.getTime(), p = c + i;
            this.isAnimating = !0, r()
        }, handleEvent: function (t) {
            switch (t.type) {
                case"touchstart":
                case"pointerdown":
                case"MSPointerDown":
                case"mousedown":
                    this._start(t);
                    break;
                case"touchmove":
                case"pointermove":
                case"MSPointerMove":
                case"mousemove":
                    this._move(t);
                    break;
                case"touchend":
                case"pointerup":
                case"MSPointerUp":
                case"mouseup":
                case"touchcancel":
                case"pointercancel":
                case"MSPointerCancel":
                case"mousecancel":
                    this._end(t);
                    break;
                case"orientationchange":
                case"resize":
                    this._resize();
                    break;
                case"transitionend":
                case"webkitTransitionEnd":
                case"oTransitionEnd":
                case"MSTransitionEnd":
                    this._transitionEnd(t);
                    break;
                case"wheel":
                case"DOMMouseScroll":
                case"mousewheel":
                    this._wheel(t);
                    break;
                case"keydown":
                    this._key(t);
                    break;
                case"click":
                    t._constructed || (t.preventDefault(), t.stopPropagation())
            }
        }
    }, o.utils = s, "undefined" != typeof module && module.exports ? module.exports = o : t.IScroll = o
}(window, document, Math), function () {
    function t(t) {
        this.pano = t, this.ctor()
    }

    var e = (P.evt, P.feature.isTouch), i = window.PANO_CFG_PATH || "/Panorama/", o = window.PANO_IMG_PATH || "/pano/";
    t.prototype = {
        options: {api: i + "{id}/group.json"}, ctor: function () {
            this.el = P.dom.create("div", null, "p-ctrl-album", null), this.wrap = P.dom.create("div", null, null, "position:absolute;left:0;bottom:0;height:110px;width:100%;", this.el), this.wrap_body = P.dom.create("ul", null, null, "  position: absolute; overflow: visible;white-space: nowrap;", this.wrap), this.group = P.dom.create("div", null, null, "position:absolute;left:0;width:100%;top:0;height:24px;line-height:24px;color:#fff;", this.el), this.expand = P.dom.create("div", null, "p-expand", "position:absolute;top:-32px;right:0;height:32px;width:32px;background-color:rgba(0,0,0,0.5);", this.el), this.pano.addEventListener("pano_changed", this._fetch, this), this.kinetic = P.kinetic(), this._bind()
        }, _fetch: function () {
            var t = this.pano.panoid, e = this, i = {};
            return this.data && this.data.panos && this.data.panos[t] ? (this.tabIndex = this.data.panos[t].group_id, void e.drawGroup()) : void $.getJSON(P.parse(this.options.api, {id: t}), function (t) {
                var o = t.data, n = {};
                for (var s in o) {
                    i[o[s].id] = o[s];
                    for (var r in o[s].group_list)n[o[s].group_list[r].pano_key] = o[s].group_list[r]
                }
                e.tabIndex = o.length ? o[0].id : void 0, e.data = {raw: o, group: i, panos: n}, e.drawGroup()
            })
        }, getThumbById: function (t) {
            return o + t + "/thumb.jpg"
        }, drawGroup: function (t) {
            if (void 0 !== this.tabIndex) {
                if (t) {
                    if (this.tabIndex != t && (this.tabIndex = t, $(this.wrap).css({left: 0}), $(this.group).children("[data-id=" + t + "]").addClass("select").siblings("a.select").removeClass("select"), this.data.group[t].group_list)) {
                        var t = this.data.group[t].group_list[0].pano_key;
                        this.pano.setPano(t)
                    }
                } else {
                    var e = this.data.raw, i = "", o = this.tabIndex;
                    for (var n in e)i += '<a class="' + (e[n].id == o ? "select" : "") + '" style="display:inline-block;height:24px;padding:0 10px;margin-right:5px;" data-id="' + e[n].id + '">' + e[n].name + "</a>";
                    this.group.innerHTML = '<div style="position: absolute; overflow: visible;white-space: nowrap;">' + i + "</div>";
                    var s = this;
                    setTimeout(function () {
                        new IScroll(s.group, {click: !0, scrollX: !0, scrollY: !1})
                    }, 0)
                }
                this.draw()
            }
        }, draw: function () {
            var t = this.data.group[this.tabIndex].group_list || [], e = this.pano.panoid, i = "";
            for (var o in t)i += '<li style="background:url(' + this.getThumbById(t[o].pano_key) + ') center center" class="' + (t[o].pano_key == e ? "select" : "") + '" data-id="' + t[o].pano_key + '"><span>' + t[o].title + "</span></li>";
            this.wrap_body.innerHTML = i, this.scroll_body.refresh()
        }, _bind: function () {
            var t = this.pano, e = this;
            setTimeout(function () {
                e.scroll_body = new IScroll(e.wrap, {click: !0, scrollX: !0, scrollY: !1})
            }, 0), $(this.expand).on("click", function () {
                $(e.el).toggleClass("hide")
            }), $(this.group).on("click", "a", function () {
                var t = $(this).attr("data-id");
                e.drawGroup(t)
            }), $(this.wrap).on("click", "li", function () {
                if (item_click_enable) {
                    var e = $(this).attr("data-id");
                    t.setPano(e)
                }
            })
        }, setDate: function (t) {
            this.data = t, draw()
        }, _onDown: function () {
        }, _onEnd: function () {
        }, _onMove: function () {
        }, _getPosX: function (t) {
            return e ? t.originalEvent.changedTouches[0].pageX : t.pageX
        }
    }, P.Control.Album = t, P.control.album = function (e) {
        return new t(e)
    }
}(), function () {
    function t(t) {
        this.pano = t, this.ctor()
    }

    t.prototype = {
        ctor: function () {
            this.initScene(), console.log("init addr", Date.now()), this.pano.addEventListener("pano_changed", this.onChanged, this)
        }, initScene: function () {
            this.el = P.dom.create("div", null, "pano-control-address", "position: absolute; left:5px;top: 5px;display:block;font-size:12px;text-shadow: rgba(0, 0, 0,0.8) 1px 1px 3px;color:#fff;padding:8px;background-color: rgba(0,0,0,.4);"), this._address = P.dom.create("div", null, "pano-control-ars", "border-bottom:rgba(255,255,255,0.6) solid 1px;padding:5px 0;", this.el), this._date = P.dom.create("div", null, "pano-control-imagedate", "padding:5px 0;", this.el)
        }, onChanged: function () {
            console.log("listen onchanged : ", Date.now());
            var t = this.pano.panoData, e = t.imageDate, i = t.copyright, o = t.location.shortDesc;
            console.log(t.location), i = "&copy;</a href='#'>" + i + "</a>";
            this._date.innerHTML = i + "<span style='float:right;padding-left: 10px;'>拍摄时间:" + e + "</span>", this._address.innerHTML = o
        }
    }, P.control.address = function (e) {
        return new t(e)
    }
}(), function () {
    var t = P.hash, e = function (e, i) {
        if (e.addEventListener("pano_changed", function () {
                t.set({panoid: e.panoid})
            }), 1 == i) {
            var o = P.throttle(function () {
                var i = e.getPov();
                t.set({heading: parseInt(i.x), pitch: parseInt(i.y)})
            }, 300, this);
            e.addEventListener("pov_changed", o)
        }
    };
    P.control.hashControl = function (t) {
        return new e(t)
    }
}(), function () {
    function t(t) {
        this.pano = t, this.ctor(), this.overlays = []
    }

    t.prototype = {
        ctor: function () {
            this.pano.addEventListener("pano_changed", this.onChanged, this), this.pano.addEventListener("overlay_click", this.onClick, this), this.pano.addEventListener("zoom_changed", this.onZoomChanged, this)
        }, onZoomChanged: function () {
            console.log(this.pano.getZoom()), this.update()
        }, onClick: function (t) {
            var e = t.target.options.data, i = this.pano;
            if (e) {
                var o = e.type, n = e.type_value;
                switch (o) {
                    case"3":
                        i.setPano(n);
                        break;
                    case"4":
                        i.showText ? i.showText(n) : i.trigger("poi_click_type_4", {value: n});
                        break;
                    case"5":
                        i.trigger("poi_click_type_5", {value: n});
                        break;
                    default:
                        i.trigger("poi_click_type_" + o, {value: n})
                }
            }
            console.log(e)
        }, onChanged: function () {
            this.clear();
            var t = this.pano.options.provider;
            if (t && t.getPanoById) {
                var e = this.pano.panoid, i = this;
                t.getPoiById(e, function (t) {
                    i.data = t, i.pano.trigger("poi_ready", {data: i.data}), i.render()
                })
            }
        }, clear: function () {
            for (var t in this.overlays)this.overlays[t].setPano(null)
        }, update: function () {
            var t = this.pano.getZoom();
            for (var e in this.overlays) {
                var i = this.overlays[e], o = i.options.data, n = o.z_index;
                i.setVisible(-1 == n.indexOf(t) ? !1 : !0)
            }
        }, render: function () {
            var t = this.data, android = navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Linux') > -1, e = this.pano, i = Math.round(window.devicePixelRatio || 1);
            if (android) {
                i = 1
            }
            ;
            for (var o in t)this.overlays.push(P.hotspot({
                position: {x: t[o].lon, y: t[o].lat},
                data: t[o],
                icon: "icons/hotspot-" + t[o].type + "@" + i + "x.png",
                animation: "bounce"
            }).setPano(e));
            this.update()
        }
    }, P.Control.Poi = t, P.control.poiControl = function (e) {
        return new t(e)
    }
}(), function () {
    function t(t) {
        this.pano = t, this.dom = {}, this.ctor()
    }

    t.prototype = {
        ctor: function () {
            this._initScene(), this._bind()
        }, play: function (t) {
            this.dom.video.src = t
        }, stop: function () {
            this.dom.video.src = ""
        }, _initScene: function () {
            this.el = P.dom.create("div", null, null), this.dom.btn = P.dom.create("div", null, null, "position:absolute;top:5px;right:5px;height:32px;width:32px;background-color:rgba(0,0,0,0.5);", this.el), this.dom.wrap = P.dom.create("div", null, null, "display:none;position:absolute;width:100%;height:100%;top:0;left:0;background-color:rgba(0,0,0,.95)", this.el), this.dom.menu = P.dom.create("div", null, null, "position:absolute;height:64px;top:0;left:0;", this.dom.wrap), this.dom.video = P.dom.create("video", null, null, "width:auto;height:450px;margin:auto;position:absolute;top:0;left:0;right:0;bottom:0;box-shadow:0 0 2px 1px rgba(255,255,255,.2);", this.dom.wrap, {
                controls: "controls",
                autoplay: "autoplay"
            }), this.dom.ctrl = P.dom.create("div", null, null, "position:absolute;bottom:10%;width:60%;left:20%;", this.dom.wrap), this.dom.ctrl_pay = P.dom.create("div", null, null, "width: 32px;height: 32px;background-color: #fff;float:left;", this.dom.ctrl), this.dom.ctrl_time = P.dom.create("div", null, null, "height: 32px;line-height: 32px;color: #fff;width: 64px;float:right;text-align:center;", this.dom.ctrl), this.dom.ctrl_progress = P.dom.create("div", null, null, "height: 32px;margin:0 64px;position: relative;", this.dom.ctrl), this.dom.ctrl_mask = P.dom.create("div", null, null, "border-top: 1px solid #fff;position: absolute;top: 50%;left: 0;width: 100%;", this.dom.ctrl_progress), this.dom.ctrl_cur = P.dom.create("div", null, null, " width: 2px;height: 32px;background-color: #4bacff;position: absolute;top: 0;left: 50%;", this.dom.ctrl_progress), this.dom.back = P.dom.create("div", null, null, ";margin:14px;width:32px;height:32px;border:2px solid #fff;border-radius:32px;", this.dom.menu)
        }, _bind: function () {
            this.pano.addEventListener("pano_changed", this._onChanged, this);
            var t = this;
            $(this.dom.btn).on("click", function () {
                $(t.dom.wrap).fadeIn(300), t.play("http://asset.logomap.com/hotel/jiaxing/video1.mp4"), t.pano.setOverlayVisible(!1)
            }), $(this.dom.back).on("click", function () {
                $(t.dom.wrap).fadeOut(200), t.stop(), t.pano.setOverlayVisible(!0)
            }), $(this.dom.video).on("timeupdate", function (e) {
                t.dom.ctrl_time.innerHTML = P.date(e.timeStamp, "mm:ss")
            })
        }, _onChanged: function () {
            this.pano.panoData.poi_data.description
        }
    }, P.Control.VideoControl = t, P.control.videoControl = function (e) {
        return new t(e)
    }
}(), function () {
    function t(t) {
        this.pano = t, this.dom = {}, this.ctor()
    }

    t.prototype = {
        ctor: function () {
            this._initScene(), this._bind()
        }, setPano: function (t) {
            return t._addControl(this.el), this
        }, load: function (t) {
            t && (this.dom.audio.src = t)
        }, play: function (t) {
            t && (this.dom.audio.src = t), this.dom.audio.play()
        }, stop: function () {
            this.dom.audio.pause()
        }, _initScene: function () {
            this.el = P.dom.create("div", null, null), this.dom.btn = P.dom.create("div", null, "icon-sound icon-mute", "position:absolute;top:5px;right:5px;height:32px;width:32px;background-color:rgba(0,0,0,0.5);", this.el), this.dom.audio = P.dom.create("audio", null, null, "width:1px;height:1px;right:0;top:0;margin:auto;position:absolute;visibility: hidden;", this.el, {controls: "controls"})
        }, _bind: function () {
            var t = this, e = t.dom.audio;
            $(this.dom.btn).on("click", function () {
                e.paused ? (e.play(), $(t.dom.btn).removeClass("icon-mute")) : (e.pause(), $(t.dom.btn).addClass("icon-mute"))
            })
        }
    }, P.Control.AudioControl = t, P.control.AudioControl = function (e) {
        return new t(e)
    }
}(), function () {
    P.Pano.include({
        setGyro: function (t) {
            this._gyro = t, t = t ? "true" : "false";
            var e = "set(plugin[gyro].enabled," + t + ")";
            this.krpano && this.krpano.call(e)
        }, toggleGyro: function () {
            this.setGyro(!this._gyro)
        }
    })
}(), function () {
    var t = P.module({
        mixin: P.events,
        options: {type: "overlay", keep: !1},
        _position: {x: 0, y: 0},
        ctor: function (t) {
            t = P.setOptions(this, t), this._position = t.position
        },
        focus: function () {
        },
        setPano: function (t) {
            return null === t ? this.pano && (this.pano.removeOverlay(this), this.pano = null) : (this.pano = t, this.pano.addOverlay(this), this._update()), this
        },
        setIcon: function (t) {
            var e = P.stamp(this);
            this.pano.krpano.set("hotspot['" + e + "'].url", P.path(t))
        },
        setVisible: function (t) {
            this.pano && this.pano.krpano.set("hotspot['" + P.stamp(this) + "'].visible", !!t)
        },
        setPosition: function (t) {
            return this._position = t, this._update(), this
        },
        getPosition: function () {
            var t = P.stamp(this), e = this.pano.krpano.get("hotspot['" + t + "'].name");
            return e && (this._position.x = this.pano.krpano.get("hotspot['" + t + "'].ath"), this._position.y = this.pano.krpano.get("hotspot['" + t + "'].atv")), this._position
        },
        _update: function () {
            var t = "hotspot['" + P.stamp(this) + "'].";
            if (this.pano.krpano) {
                var e = this.pano.krpano.get(t + "name");
                e && (this.pano.krpano.set(t + "ath", this._position.x), this.pano.krpano.set(t + "atv", this._position.y))
            }
        },
        _onAdd: function () {
            var t = this.options, e = P.stamp(this), i = this._position || {
                    x: 0,
                    y: 0
                }, o = t.edge || "bottom", n = this.pano.krpano, s = this.pano, r = "hotspot['" + e + "'].";
            n.call("addhotspot('" + e + "')"), n.set(r + "keep", !!t.keep), n.set(r + "ath", i.x), n.set(r + "atv", i.y), n.set(r + "url", P.path(t.icon || "icons/marker.png")), n.set(r + "edge", o), n.set(r + "onclick", s.opa("overlay_click", e)), n.set(r + "ondown", s.opa("overlay_mousedown", e)), n.set(r + "onup", s.opa("overlay_mouseup", e)), n.set(r + "onover", function(e){
                window.showTitle(t.data.title,{'left':s.getMousePosition().x-30,'top':s.getMousePosition().y-60});
            }), n.set(r + "onout", function(e){
                window.hideTitle();
            }), this._onAfterAdd()
        },
        _onAfterAdd: function () {
        }
    });
    P.Overlay = t, P.overlay = function (e) {
        return new t(e)
    }, P.Pano.include({
        addOverlay: function (t) {
            var e = P.stamp(t);
            return this._overlays[e] ? t : (this._overlays[e] = t, void this.whenReady(t._onAdd, t))
        }, removeOverlay: function (t) {
            var e = P.stamp(t);
            this.krpano.call("removehotspot('" + e + "')"), delete this._overlays[e]
        }, setOverlayVisible: function (t) {
            for (var e in this._overlays)this._overlays[e].setVisible(!!t)
        }
    })
}(), function () {
    var t = {
        bounce: function (t, e) {
            var i = t % e;
            return i = Math.sin(Math.PI * i / e), Math.round(-25 * i)
        }
    }, e = P.module(P.Overlay, {
        options: {type: "hotspot", animation: "none", frame: 30}, _onAfterAdd: function () {
            "none" != this.options.animation.toLocaleLowerCase() && this.setAnimate()
        }, _process: function () {
            var e = this, i = this.options.frame, o = this.options.animation.toLocaleLowerCase();
            if (this.pano) {
                var n = this.pano.krpano, s = "hotspot['" + P.stamp(this) + "'].", r = t[o](++this.currentFrame, i);
                n.set(s + "oy", r + "%")
            }
            this.anim_handler = setTimeout(function () {
                e._process()
            }, 1e3 / i)
        }, setAnimate: function (t) {
            null === t ? clearTimeout(this.anim_handler) : (this.currentFrame = 0, this._process())
        }
    });
    P.hotspot = function (t) {
        return new e(t)
    }
}(), function () {
    var t = P.module(P.Overlay, {
        options: {draggable: !1, type: "marker"}, ctor: function (t) {
            t = P.setOptions(this, t), this._position = t.position, this._bind()
        }, setDraggable: function (t) {
            this.options.draggable != t && (this.options.draggable = t)
        }, _bind: function () {
            this.addEventListener("mousedown", this._onMouseDown, this)
        }, _onMouseDown: function () {
            if (this.options.draggable) {
                var t = this.getPosition();
                t = this.pano.project(t.x, t.y);
                var e = this.pano.getMousePosition();
                this.offset = [e.x - t.x, e.y - t.y], this.pano.addEventListener("mouseup", this._onMouseUp, this), this.addEventListener("mouseup", this._onMouseUp, this), this.pano.addEventListener("mousemove", this._onMouseMove, this)
            }
        }, _onMouseUp: function () {
            this.pano.removeEventListener("mouseup", this._onMouseUp), this.removeEventListener("mouseup", this._onMouseUp), this.pano.removeEventListener("mousemove", this._onMouseMove, this)
        }, _onMouseMove: function () {
            var t = this.pano.getMousePosition(), e = t.x - this.offset[0], i = t.y - this.offset[1], o = this.pano.unproject(e, i);
            this.setPosition(o), this.trigger("drag", {position: o}), this.pano.trigger("overlay_drag", {position: o})
        }
    });
    P.marker = function (e) {
        return new t(e)
    }
}(), function () {
    var t = P.module(P.Overlay, {
        options: {type: "sprite", currentFrame: 0, frame: 30}, _onAfterAdd: function () {
            var t = this.options.width, e = this.options.height, i = P.stamp(this), o = this.pano.krpano, n = "hotspot['" + i + "'].";
            o.set(n + "crop", "0|" + this.options.currentFrame * e + "|" + t + "|" + e), this._anim()
        }, _anim: function () {
            var t = this, e = this.options.width, i = this.options.height, o = this.options.durarion, n = this.options.frame;
            this.options.currentFrame++, this.options.currentFrame >= o && (this.options.currentFrame = 0);
            var s = this.pano.krpano, r = "hotspot['" + P.stamp(this) + "'].";
            s.set(r + "crop", "0|" + this.options.currentFrame * i + "|" + e + "|" + i), setTimeout(function () {
                t._anim()
            }, 1e3 / n)
        }
    });
    P.sprite = function (e) {
        return new t(e)
    }
}(), function () {
    var t = P.module({
        mixin: P.events,
        options: {type: "text", keep: !1},
        _position: {x: 0, y: 0},
        _el: null,
        ctor: function (t) {
            t = P.setOptions(this, t), this._position = t.position, this._el = P.dom.create("div", null, "pano-overlay-custom", "position: absolute; left:0;top: 0;"), t.html && (this._el.innerHTML = t.html)
        },
        focus: function () {
        },
        setPano: function (t) {
            return null === t ? this.pano && (this.pano.removeText(this), this.pano = null) : (this.pano = t, this.pano.addText(this), this._update()), this
        },
        setContent: function () {
        },
        setPosition: function (t) {
            return this._position = t, this._update(), this
        },
        getPosition: function () {
        },
        _update: function () {
            var t = this.pano.project(this._position.x, this._position.y);
            this._el.style.left = t.x + "px", this._el.style.top = t.y + "px"
        },
        _onAdd: function () {
            this.pano.addEventListener("pov_changed", this._update, this), this._update()
        },
        _onRemove: function () {
            this.pano.removeEventListener("pov_changed", this._update)
        }
    });
    P.Text = t, P.text = function (e) {
        return new t(e)
    }, P.Pano.include({}), P.Pano.initHooks.push(function () {
        var t = P.dom.create("div", null, "pano-layer-custom", "position: absolute; left:0;top: 0;");
        this._overlays_text = {}, this._addControl(t), this.addText = function (e) {
            var i = P.stamp(e);
            t.appendChild(e._el), this._overlays_text[i] = e, this.whenReady(e._onAdd, e)
        }
    })
}(), function () {
    function t() {
        this.ctor()
    }

    t.prototype = {
        ctor: function () {
        }, update: function () {
        }
    }
}(), function () {
    function t(t) {
        for (var e = {}, i = 0; i < t.length; i++)e[t[i].name.toLowerCase()] = t[i].value;
        return e
    }

    function e(t) {
        this.pano = t, this.ctor(), this.overlays = [], this.target = null, this.hot_active = !1, this.action = null
    }

    var i = {
        hot: function (t) {
            var e = '<form><input type="hidden" name="ID" value="' + t.id + '"/><input type="hidden" name="PANO_ID" value="' + t.pano_id + '"/><input type="hidden" name="PANO_KEY" value="' + t.pano_key + '"/><ul><li><span>名称</span><input type="text" name="TITLE" value="' + t.title + '"/></li><li><span>经度</span><input type="text" name="LON" id="p_lng" value="' + t.lon + '"/></li><li><span>纬度</span><input id="p_lat" type="text" name="LAT" value="' + t.lat + '"/></li><li><span>高度</span><input type="text" name="HEIGHT" value="' + t.height + '"/></li><li><span>描述</span><textarea type="text" name="CONTENT">' + t.content + '</textarea></li><li><span>响应</span><select name="TYPE"><option value="0">无操作</option><option value="1">跳转</option><option value="2">播放音乐</option><option value="3">全景</option><option value="4">弹出介绍框</option></select></li><li><span>值</span><input type="text" name="TYPE_VALUE" value="' + t.type_value + '"/></li></ul><button class="save" type="button">保存</button><button type="button" class="delete">删除</button></form><div class="close" type="button">x</div>';
            return e
        }, list: function (t) {
            var e = "";
            for (var i in t) {
                var o = "发布", n = 0;
                1 == t[i].status && (o = "取消发布", n = 1), e += '<li data-id="' + t[i].id + '">' + t[i].title + '<span><a data-id="' + t[i].id + '" data-status="' + n + '" class="pub pub-' + t[i].status + '">' + o + "</a></span></li>"
            }
            return "<ul>" + e + "</ul>"
        }
    }, o = {pano: "/", hot: "/Panorama/admin/hot", pub: "/Panorama/admin/hot_release"};
    e.prototype = {
        ctor: function () {
            this.el = P.dom.create("div", null, "p-ctrl-editer", null), this.menu = P.dom.create("div", null, "p-ctrl-editer-menu", null, this.el), this.area = P.dom.create("div", null, "p-ctrl-editer-area", null, this.el), this.wrap = P.dom.create("div", null, "p-ctrl-editer-wrap", null, this.area), this.menu.innerHTML = "<button>热点列表</button>", this.list = P.dom.create("div", null, "p-ctrl-editer-list section", null, this.wrap), this.detail = P.dom.create("div", null, "p-ctrl-editer-detail section", null, this.wrap), this.preview = P.dom.create("div", null, "p-ctrl-editer-preview", null, this.el), this.pano.addEventListener("pano_changed", this.onChanged, this), this.preview_mode = !1, this._initEvents()
        }, _initEvents: function () {
            var t = $(this.el), e = this;
            this.pano.addEventListener("overlay_click", function (t) {
                e.preview_mode || window.event.ctrlKey ? this._onAction(t.target) : this._active(t.target)
            }, this), this.pano.addEventListener("overlay_drag", function (t) {
                this._onHotDrag(t.position)
            }, this), t.on("change", "input", function () {
                e.changed = !0
            }), t.on("click", ".save:not(.disable)", function () {
                e._onSave($(this))
            }), t.on("click", ".close", function () {
                e._onClose()
            }), t.on("click", ".delete", function () {
                e._onRemove($(this))
            }), t.on("click", ".p-ctrl-editer-list li", function () {
                var t = $(this).attr("data-id"), i = e.getById(t), o = {heading: i.data.lon, pitch: i.data.lat};
                console.log(o), e.pano.setPov(o)
            }), t.on("click", "a.pub:not(.dis)", function (t) {
                var e = $(this).attr("data-status"), i = $(this).attr("data-id"), n = $(this).addClass("dis").html($(this).html() + "...");
                $.getJSON(o.pub, {id: i, unrel: e}, function (t) {
                    t.status && n.attr("data-status", 0 == e ? 1 : 0).html(0 == e ? "取消发布" : "发布").removeClass("dis")
                }), t.stopPropagation()
            }), t.on("click", ".p-ctrl-editer-preview", function () {
                e.preview_mode = !e.preview_mode, t.toggleClass("preview")
            }), this.pano.addEventListener("click", function () {
                window.event.ctrlKey && !e.hot_active && e._onHotAdd()
            }), $(document).keyup(function (t) {
                switch (t.keyCode) {
                    case 27:
                        e._onClose()
                }
            })
        }, onChanged: function () {
            this.clear(), this.pano_key = this.pano.panoid, this.pano_id = this.pano.panoData._raw.id;
            var t = this;
            this.fetch(function () {
                t.render()
            })
        }, clear: function () {
            for (var t in this.overlays)this.overlays[t].setPano(null)
        }, render: function () {
            var t = this.data, e = this.pano;
            for (var o in t) {
                var n = P.marker({position: {x: t[o].lon, y: t[o].lat}}).setPano(e);
                n.data = t[o], this.overlays.push(n)
            }
            $(this.list).html(i.list(t))
        }, getById: function (t) {
            var e = this.overlays;
            for (var i in e)if (e[i].data.id == t)return e[i]
        }, remove: function (t) {
            t.setPano(null), delete this.data[t.data.id]
        }
    }, P.extend(e.prototype, {
        _onAction: function (t) {
            console.log(t.data.type);
            var e = t.data.type, i = t.data.type_value;
            switch (e) {
                case"1":
                    window.open(i);
                    break;
                case"2":
                    break;
                case"3":
                    this.pano.setPano(i);
                    break;
                case"4":
                    this.pano.trigger("show_text", {data: i})
            }
        }, _onSave: function (e) {
            e.addClass("dis");
            var i = $(this.el).find("form").serializeArray(), o = this;
            this.save(i, this.action || "GET", function (n) {
                n.status ? (o.target.data = t(i), "POST" == o.action && o.update(function () {
                    o.target.setPano(null), o.hot_active = !1, o._active(o.overlays[o.overlays.length - 1])
                }), o.action = "PUT") : alert("操作失败"), e.removeClass("dis")
            })
        }, _onRemove: function (t) {
            t.addClass("dis");
            var e = this.target.data.id, i = this, o = $(this.el);
            this.save({id: e}, "DELETE", function (e) {
                e.status ? (t.removeClass("dis"), o.removeClass("hot_active"), i.hot_active = !1, i.remove(i.target), i._renderList()) : alert("删除失败")
            })
        }, _onHotAdd: function () {
            var t = this.pano.getMousePosition(!0), e = {
                lat: t.y.toFixed(6),
                lon: t.x.toFixed(6),
                title: "",
                content: "",
                type: 1,
                pano_key: this.pano_key,
                pano_id: this.pano_id,
                id: 0,
                height: 0,
                type_value: ""
            };
            this.target = P.marker({
                position: t,
                draggable: !0
            }).setPano(this.pano), this.target.data = e, this._active(this.target), this.action = "POST"
        }, _onHotDrag: function (t) {
            this.hot_active && this.el && ($(this.el).find("#p_lat").val(t.y.toFixed(6)), $(this.el).find("#p_lng").val(t.x.toFixed(6)))
        }, _onClose: function () {
            this.hot_active = !1, $(this.el).removeClass("hot_active"), this.target && (this.target.setIcon("icons/marker.png"), this.target.setDraggable(!1), this.target.setPosition({
                x: this.target.data.lon,
                y: this.target.data.lat
            }), "POST" == this.action && (this.target.setPano(null), this.target = null), this.action = null)
        }, _active: function (t) {
            this.hot_active || ($(this.el).addClass("hot_active"), this._renderDetail(t), this.target = t, t.setIcon("icons/marker-editer.png"), t.setDraggable(!0), this.hot_active = !0, this.action = "PUT")
        }
    }), P.extend(e.prototype, {
        equal: function (t) {
            var e = t.getPosition(), i = t.data.position;
            return e.x == i.x && e.y == i.y
        }, fetch: function (t) {
            var e = this;
            $.getJSON(o.hot + ".json", {id: this.pano_id}, function (i) {
                var o = i.rows, n = {};
                for (var s in o)n[o[s].id] = o[s];
                e.data = n, t && t(n)
            })
        }, save: function (t, e, i) {
            $.ajax({
                type: e, url: o.hot, data: t, dataType: "json", success: function (t) {
                    i && i(t)
                }
            })
        }, push: function () {
        }, update: function (t) {
            var e = this;
            this.fetch(function () {
                e.clear(), e.render(), t && t()
            })
        }
    }), P.extend(e.prototype, {
        _renderList: function () {
            $(this.list).html(i.list(this.data))
        }, _renderDetail: function (t) {
            var e = t.data, o = e.type;
            $(this.detail).html(i.hot(e)).find("select option[value='" + o + "']").attr("selected", !0)
        }
    }), P.control.editer = function (t) {
        return new e(t)
    }
}(), function () {
    var t = {
        planet: "tween(view.architectural, 0.0, distance(1.0,0.5));tween(view.pannini,0.0, distance(1.0,0.5));tween(view.distortion,1.0, distance(1.0,0.8));tween(view.fov,150, distance(150,0.8));tween(view.vlookat,90, distance(100,0.8));add(new_hlookat, view.hlookat, 123.0);tween(view.hlookat, get(new_hlookat), distance(100,0.8));",
        architectural: "if(view.vlookat LT -80 OR view.vlookat GT +80,tween(view.vlookat, 0.0, 1.0, easeInOutSine);tween(view.fov,100, distance(150,0.8)););tween(view.architectural, 1.0, distance(1.0,0.5));tween(view.pannini,0.0, distance(1.0,0.5));tween(view.distortion,0.0, distance(1.0,0.5));",
        normal: "if(view.vlookat LT -80 OR view.vlookat GT +80,tween(view.vlookat, 0.0, 1.0, easeInOutSine);tween(view.fov,100, distance(150,0.8)););tween(view.architectural, 0.0, distance(1.0,0.5));tween(view.pannini,0.0, distance(1.0,0.5));tween(view.distortion, 0.0, distance(1.0,0.5));"
    };
    P.Pano.include({
        setView: function (e) {
            this.krpano && t[e] && this.krpano.call(t[e])
        }
    })
}();