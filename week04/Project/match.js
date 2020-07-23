/**
 * abcabcabx
 * abcabx
 * 使用状态机完成“abababx”的处理 
 * abbabababxabababx
 * abababx
 */
/* 主函数 */
function match(str) {
    let state = start;
    for (let item of str) {
        state = state(item)
    }
    if (state === end)
        return true;
    else
        return false;
}
/**
 * 开始 a
 */
function start(str) {
    if (str === "a")
        return stateB;
    else
        return start;
}
/* 第1个b */
function stateB(str) {
    if (str === "b")
        return stateA2;
    else
        return start(str)
}
/* 第2个a */
function stateA2(str) {
    if (str === "a")
        return stateB2;
    else
        return start(str);
}

/* 第2个b */
function stateB2(str) {
    if (str === "b")
        return stateA3;
    else
        return start(str);
}
/* 第3个a */
function stateA3(str) {
    if (str === "a")
        return stateB3;
    else
        return start(str);
}
/* 第3个b */
function stateB3(str) {
    if (str === "b")
        return stateX;
    else
        return start(str)
}
/* 最后一个x */
function stateX(str) {
    if (str === "x")
        return end;
    else
        return stateB3(str)
}
/* 结束 */
function end() {
    return end;
}
// console.log(match("abbabababx"));
console.log(match("abcabababx"));



!function () { var n = null; function t() { this.textData = null, this.htmlData = null, n = this } function a(t) { if (140 < window.getSelection().getRangeAt(0).toString().length) { var e; t.preventDefault(), e = window.getSelection() + n.textData; window.getSelection(), n.htmlData; if (t.clipboardData) t.clipboardData.setData("text/plain", e); else { if (window.clipboardData) return window.clipboardData.setData("text", e); !function (t) { var e = document.createElement("textarea"); e.style.cssText = "position: fixed;z-index: -10;top: -50px;left: -50px;", e.innerHTML = t, document.getElementsByTagName("body")[0].appendChild(e), e.select(), document.execCommand("copy") }(e) } } } t.prototype.init = function (t, e, n) { this.textData = e, this.htmlData = n, function (t, e, n) { t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent ? t.attachEvent("on" + e, n) : t["on" + e] = n }(t, "copy", a) }, window.csdn = window.csdn ? window.csdn : {}, csdn.copyright = new t }();