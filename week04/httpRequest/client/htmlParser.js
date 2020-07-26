let currentToken = null;
let currentAttribute = null;
let stack = [{ type: "document", children: [] }];
function emit(token) {
  //   console.log(token);
  //   if (token.type === "text") return;
  let top = stack[stack.length - 1];
  if (token.type === "startTag") {
    let element = {
      type: "element",
      children: [],
      attributes: [],
    };
    element.tagName = token.tagName;
    for (let p in token) {
      if (p != "type" && p != "tagName") {
        element.attributes.push({
          name: p,
          value: token[p],
        });
      }
    }
    top.children.push(element);
    element.parent = top;
    if (!token.isSelfClosing) {
      stack.push(element);
    }
    currentTextNode = null;
  } else if (token.type === "endTag") {
    //   console.log(stack)
    // console.log(top.tagName);
    if (top.tagName !== token.tagName) {
      throw new Error("标签异常");
    } else {
      stack.pop();
    }
    currentTextNode = null;
  } else if (token.type === "text") {
    if (currentTextNode === null) {
      currentTextNode = {
        type: "text",
        content: "",
      };
      top.children.push(currentTextNode);
    }
    currentTextNode.content += token.content;
  }
}
const EOF = Symbol("EOF");
function data(c) {
  if (c === "<") {
    return tagOpen;
  } else if (c == "EOF") {
    emit({
      type: "EOF",
    });
    return;
  } else {
    emit({
      type: "text",
      content: c,
    });
    return data;
  }
}
// 标签开始
function tagOpen(c) {
  if (c === "/") {
    return endTagOpen;
  } else if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "startTag",
      tagName: "",
    };
    return tagName(c);
  } else {
    return;
  }
}
// 标签结束
function endTagOpen(c) {
  if (c.match(/^[a-zA-Z]$/)) {
    currentToken = {
      type: "endTag",
      tagName: "",
    };
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
    currentToken.tagName += c;
    return tagName;
  } else if (c === ">") {
    emit(currentToken);
    // 普通标签
    return data;
  } else {
    return tagName;
  }
}
// 标签属性
function beforeAttributeName(c) {
  if (c.match(/^[\f\t\n ]$/)) {
    return beforeAttributeName;
  } else if (c === ">" || c === "/" || c == 'EOF') {
    // return afterAttributeName;
    return tagName(c);
  } else if (c === "=") {
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}
function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c == 'EOF') {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}
function beforeAttributeValue(c) {
  if (c.match(/^[\f\t\n ]$/) || c === "/" || c === ">" || c == 'EOF') {
    return beforeAttributeValue;
  } else if (c === '"') {
    return doubleQuotedAttributeValue;
  } else if (c === "'") {
    return singleQuotedAttributeValue;
  } else if (c === ">") {
  } else {
    return UnquoteAttributeValue(c);
  }
}
function doubleQuotedAttributeValue(c) {
  if (c === '"') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributedValue;
  } else if (c === "\u0000") {
  } else if (c == 'EOF') {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function singleQuotedAttributeValue(c) {
  if (c === "'") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributedValue;
  } else if (c === "\u0000") {
  } else if (c == 'EOF') {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function afterQuotedAttributedValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  } else if (c === "/") {
    return selfCloasingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == 'EOF') {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}
function UnquoteAttributeValue(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    currentToken[currentToken.name] = currentAttribute.value;
    return beforeAttributeName;
  } else if (c === "/") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return selfCloasingStartTag;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<" || c === "=" || c === "`") {
  } else if (c == 'EOF') {
  } else {
    currentAttribute.value += c;
    return UnquoteAttributeValue;
  }
}
function afterAttributeName(c) {
  if (c.match(/^[\t\n\f ]$/)) {
    return afterAttributeName;
  } else if (c === "/") {
    return selfCloasingStartTag;
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === ">") {
    currentToken[currentAttribute.name] = currentAttribute.value;
    emit(currentToken);
    return data;
  } else if (c == 'EOF') {
  } else {
    currentToken[currentAttribute.name] = currentAttribute.value;
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName;
  }
}
function selfCloasingStartTag(c) {
  if (c === ">") {
    currentToken.isSelfClosing = true;
    emit(currentToken);
    return data;
  } else if (c == "EOF") {
  } else {
  }
}
module.exports.parseHtml = function parseHtml(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state('EOF');
  //   console.log(state);
};
