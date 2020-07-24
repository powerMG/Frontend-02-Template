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
        response.end(" hello word\n");
      });
  })
  .listen(8090);
