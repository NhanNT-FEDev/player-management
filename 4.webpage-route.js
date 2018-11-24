const http = require("http");

const PLAYERS = [
  { name: "Eden Hazard", age: 24 },
  { name: "Thorgan", age: 26 },
  { name: "Trung Nhân", age: 21 },
  { name: "Công Phượng", age: 23 },
  { name: "Frank Lampard", age: 38 },
  { name: "Peter Cech", age: 34 },
  { name: "John Terry", age: 32 },
  { name: "Willian", age: 31 },
  { name: "Đoán Xem", age: 22 }
];

const onDefaultRoute = function(req, res) {
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
              <a href="/players">List Players</a>
          </body>
        </html>
        `,
    "utf-8"
  ); //utf-8
};

const onPlayersListRoute = function(req, res) {
  res.write(
    `
          <html>
            <head>
              <meta charset='utf-8'/>
              <title>My first Nodejs Web</title>
    
            </head>
            <body>
              <a href ="/"> Trang Chủ</a>
              <h1>List Player</h1>
              <table border="1" cellpadding ="20" cellspacing="5">
                <th>Name</th>
                <th>Age</th>
`
  );

  if (!PLAYERS.length) {
    res.write(`
                <tr>
                  <td>No data</td>
                </tr>
    `);
  } else {
    for (let mem of PLAYERS) {
      res.write(`
                <tr>
                  <td>${mem.name}</td>
                  <td>${mem.age}</td>
                </tr>
      `);
    }
  }

  res.write(
    `
              </table>
            </body>
            </html>
    `,
    "utf-8"
  ); //utf-8
};

//Create Object
// KEY => VALUE
// Có thể xem như 1 dictionary route.
// Sau này sẽ configuration trong đây.

const HANDLERS = {
  "GET /": onDefaultRoute,
  "GET /players": onPlayersListRoute
};

http
  .createServer()
  // Sự kiện on("request") => sẽ xuất hiện khi có request đến server
  .on("request", (req, res) => {
    // const method = req.method;
    // const url = req.url;

    // Lấy ra url + method (F12 -> Network để thấy)
    const { method, url } = req; // Destructuring ES6

    console.log({ method, url });

    // let handler; // request handler

    // if (method === "GET" && url === "/") {
    //   handler = onDefaultRoute;
    // } else if (method === "GET" && url === "/players") {
    //   handler = onPlayersListRoute;
    // }

    const route = `${method} ${url}`;
    const handler = HANDLERS[route];

    if (!handler) {
      res.writeHead(404);

      return res.end();
    }

    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    handler(req, res);
    res.end(); //
  })
  .on("listening", () => {
    console.log("Server is listening at port 3000");
  })
  .on("error", err => {
    console.error("Server error", err); // Example: EADDRINUSE
  })
  .listen(3000);

//API: Là các hàm của nhà sản xuất cho phép người dùng điều khiển thông qa nó.
