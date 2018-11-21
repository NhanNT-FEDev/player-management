// 1. Load Http Module của Node.js
const http = require("http");

//Callback
const requestListener = (req, res) => {
  res.end("Hello Nathan Sampoche");
};

// 3. Create server
// Khi có request đến server này,
// thì gọi callback `requestListener`
// Cách 1: Dùng khai báo như bt.
const server = http.createServer(requestListener); // Nhận vào 1 callback

// cách 2: mình khai báo kiểu expression
const server2 = http.createServer((req, res) => {
  res.end("Hello Nathan Apple");
}); // Server 2

//Này đc gọi khi web server đc gọi

// Start Server
// Khi nào web server được start thành công
// thì gọi callback `onListener`
// callback => async => non-blocking
server.listen(3000, () => {
  console.log("Server is listening at port 3000");
});

// server2.listen(3001, () => {
//     console.log("Server")
// });

console.log("Het File");

///EADDRINUSE => Lỗi đụng port  number
