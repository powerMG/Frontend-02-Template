# 前端训练营 第四周 总结

## HTTP(URL)

### 状态机

> 使用状态机实现 abxabx

```
function match(str) {
  let state = start;
  for (let item of str) {
    state = state(item);
  }
  if (state === end) {
    return true;
  } else {
    return false;
  }
}
function start(str) {
  if (str === "a") {
    return stateB;
  } else {
    return start;
  }
}
function stateB(str) {
  if (str === "b") {
    return stateC;
  } else {
    return start(str);
  }
}
function stateC(str) {
  if (str === "c") {
    return stateA2;
  } else {
    return start(str);
  }
}
function stateA2(str) {
  if (str === "a") {
    return stateB2;
  } else {
    return start(str);
  }
}
function stateB2(str) {
  if (str === "b") {
    return stateX;
  } else {
    return stateB(str);
  }
}
function end() {
  return end;
}
function stateX(str) {
  if (str === "x") {
    return end;
  } else {
    return stateC(str);
  }
}

console.log(match("abcabbabcabx"));
```

> 使用状态机实现 abababx

```
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
console.log(match("abcabababx"));
```

### HTTP 请求(实现了一个 http 请求)

> server.js

```
const http = require("http");
http
  .createServer((request, response) => {
    let body = [];
    request
      .on("error", (err) => {
        console.log(err);
      })
      .on("data", (chunk) => {
        body.push(chunk.toString());
      })
      .on("end", () => {
        body = body.join("");
        console.log("body：", body);
        response.writeHead(200, { "Content-Type": "text/html" });
        response.end(`<html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Document</title>
        </head>
        <body>

        </body>
        </html>`);
      });
  })
  .listen(8090);

```

> client.js

```
const net = require("net");
const htmlParser = require("./htmlParser")
class Request {
  constructor(options) {
    this.method = options.method || "GET";
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || "/";
    this.body = options.body || {};
    this.headers = options.headers || {};
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    } else if (
      this.headers["Content-Type"] === "application/x-www-form-urlencoded"
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join("&");
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
        .map((key) => `${key}: ${this.headers[key]}`)
        .join("\r\n")}\r\n
${this.bodyText}`;
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(`${this.toString()}`);
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      }
      connection.on("data", (data) => {
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      });
      connection.on("error", (err) => {
        reject(err);
        connection.end();
      });
    });
  }
}
class ResponseParser {
  constructor() {
    this.WITING_STATUS_LINE = 0;
    this.WITING_STATUS_LINE_END = 1;
    this.WITING_HEADER_NAME = 2;
    this.WITING_HEADER_SPACE = 3;
    this.WITING_HEADER_VALUE = 4;
    this.WITING_HEADER_LINE_END = 5;
    this.WITING_HEADER_BLOCK_END = 6;
    this.WITING_BODY = 7;
    // 当前状态
    this.current = this.WITING_STATUS_LINE;
    // 状态行
    this.stateLine = "";
    // 请求头信息
    this.headers = {};
    // 请求头name
    this.headerName = "";
    // 请求头value
    this.headerValue = "";
    // 主体部分
    this.bodyParser = null;
  }
  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }
  get response() {
    this.stateLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char) {
    if (this.current === this.WITING_STATUS_LINE) {
      if (char === "\r") {
        this.current = this.WITING_STATUS_LINE_END;
      } else {
        this.stateLine += char;
      }
    } else if (this.current === this.WITING_STATUS_LINE_END) {
      if (char === "\n") {
        this.current = this.WITING_HEADER_NAME;
      }
    } else if (this.current === this.WITING_HEADER_NAME) {
      if (char === ":") {
        this.current = this.WITING_HEADER_SPACE;
      } else if (char === "\r") {
        this.current = this.WITING_HEADER_BLOCK_END;
        if (this.headers["Transfer-Encoding"] === "chunked")
          this.bodyParser = new TrunkedBodyParser();
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WITING_HEADER_SPACE) {
      if (char === " ") {
        this.current = this.WITING_HEADER_VALUE;
      }
    } else if (this.current === this.WITING_HEADER_VALUE) {
      if (char === "\r") {
        this.current = this.WITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WITING_HEADER_LINE_END) {
      if (char === "\n") {
        this.current = this.WITING_HEADER_NAME;
      }
    } else if (this.current === this.WITING_HEADER_BLOCK_END) {
      if (char === "\n") {
        this.current = this.WITING_BODY;
      }
    } else if (this.current === this.WITING_BODY) {
      this.bodyParser.receiverChar(char);
    }
  }
}
class TrunkedBodyParser {
  constructor() {
    this.WATING_LENGTH = 0;
    this.WATING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WATING_NEW_LINE = 3;
    this.WATING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WATING_LENGTH;
  }
  receiverChar(char) {
    if (this.current === this.WATING_LENGTH) {
      if (char === "\r") {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WATING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WATING_LENGTH_LINE_END) {
      if (char === "\n") {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WATING_NEW_LINE;
      }
    } else if (this.current === this.WATING_NEW_LINE) {
      if (char === "\r") {
        this.current = this.WATING_NEW_LINE_END;
      }
    } else if (this.current === this.WATING_NEW_LINE_END) {
      if (char === "\n") {
        this.current = this.WATING_LENGTH;
      }
    }
  }
}
void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 8090,
    path: "/",
    headers: {
      ["X-Foo2"]: "customed",
    },
    body: {
      name: "powerMG",
    },
  });
  let response = await request.send();
  // 解析HTML
  htmlParser.parseHtml(response.body)
  // console.log(JSON.stringify(response));
})();

```

## HTML 解析
1. 实现一个htmlparse来解析html
2. 解析标签
3. 处理属性
4. 使用token构建DOM树
5. 添加文本节点

> 具体代码（htmlparse.js）

```
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

```
## 所感所想
本周学习主要以实践为主，从浏览器的角度了解到了http的请求到html标签的解析过程，虽然很累，但收获很大，继续坚持吧~