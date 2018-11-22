// OPTION 1: Event - Driven Style
// 1. Load Http Module của Node.js
// const http = require("http");

// const server = http.createServer();

// server.on("request", (req, res) => {
//   res.end("Hello Nathan Sampoche");
// });

// server.on("listening", () => {
//   console.log("Server is listening at port 3000");
// });

// server.listen(3000);

//OPTION 2: Call chaining - Gọi liên tù tì

http
  .require("http")
  .createServer()
  .on("request", (req, res) => {
    res.end("Hello Nathan Sampoche");
  })
  .on("listening", () => {
    console.log("Server is listening at port 3000");
  })
  .listen(3000);
