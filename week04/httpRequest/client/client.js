const net = require("net");
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
    return `${this.method} ${this.path} HTTP/1.1\r${Object.keys(this.headers).map((key) => `${key}: ${this.headers[key]}`).join('\r\n')}\r\r${this.bodyText}`;
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port
          },
          () => {
            console.log(this.toString())
            connection.write(this.toString());
          }
        );
      }
      connection.on("data", (data) => {
        console.log(data.toString());
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(data.toString());
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
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  receiveChar(char) {
    if (this.current === this.WITING_STATUS_LINE) {
      if (char === "\r") {
        this.current = this.WITING_STATUS_LINE_END
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
        this.current = thsi.WITING_HEADER_LINE_END;
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WITING_HEADER_SPACE) {
      if (char === " ") {
        this.current = this.WITING_HEADER_VALUE;
      }
    } else if (this.current === this.WITING_HEADER_VALUE) {
      if (char === "/r") {
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
      console.log(char);
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
      name: "winter",
    },
  });
  let response = await request.send();
  console.log(response);
})();
