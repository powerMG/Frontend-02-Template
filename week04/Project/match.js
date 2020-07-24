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
