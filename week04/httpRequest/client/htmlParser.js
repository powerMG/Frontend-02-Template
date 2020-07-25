const EOF = Symbol("EOF");
function data(c) {
    if (c === "<") {
        return tagOpen;
    } else if (c == "EOF") {
        return;
    } else {
        return data;
    }
}
// 标签开始
function tagOpen(c) {
    if (c === "/") {
        return endTagOpen;
    } else if (c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    } else {
        return;
    }
}
// 标签结束
function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        return tagName(c);
    } else if (c === ">") {

    } else if (c == "EOF") {

    } else {

    }
}
// 标签名
function tagName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        // 属性
        return beforeAttributeName;
    } else if (c === "/") {
        // 单标记标签
        return selfCloasingStartTag;
    } else if (c.match(/^[a-zA-Z]$/)) {
        return tagName;
    } else if (c === ">") {
        // 普通标签
        return data;
    } else {
        return tagName;
    }
}
// 标签属性
function beforeAttributeName(c) {
    if (c.match(/^[\b\t\n ]$/)) {
        return beforeAttributeName;
    } else if (c === ">") {
        return data;
    } else if (c === "=") {
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}
function selfCloasingStartTag(c) {
    if (c === ">") {
        return data;
    } else if (c == "EOF") {

    } else { }
}
module.exports.parseHtml = function parseHtml(html) {
    let state = data;
    for (let c of html) {
        state = state(c)
    }
    state = state(EOF);
}