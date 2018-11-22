const http = require("http");
http
  .createServer()
  .on("request", (req, res) => {
    res.writeHead(200, {
      //   "Content-Type": "text/plain"
      "Content-Type": "text/html"
      //   "Content-Type": "application/xml",
      //   "Content-Type": "application/octet-stream",
      //   "Content-Type": "application/json"
    });
    res.write(
      `
      <html>
        <head>
            <meta charset='utf-8'/>
            <title>My first Nodejs Web</title>

        </head>
        <body>
            <h1>Hello Nathan Sampoche</h1>
            <h2>Xin chào các bạn, Nhân Nguyễn</h2>
            <h3>Test にほんご　と　漢字　です </h3>
        </body>
      </html>
      `,
      "utf-8"
    ); //utf-8
    res.end(() => {
      console.log("Response stream ended");
    });
  })
  .on("listening", () => {
    console.log("Server is listening at port 3000");
  })
  .on("error", err => {
    console.error("Server error", err); // Example: EADDRINUSE
  })
  .listen(3000);
