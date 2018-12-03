const http = require("http");
const fs = require("fs");

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

const onDefaultRoute = function(req, res, done) {
  fs.readFile("Views/default.html", "utf-8", (err, html) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      done();
      return;
    } else {
      res.write(html, "utf-8");
      done();
    }
  });
};

const onPlayersListRoute = function(req, res, done) {
  fs.readFile("Views/players-list.html", "utf-8", (err, html) => {
    if (err) {
      console.log(err);
      res.writeHead(500);
      done();
      return;
    } else {
      let row = "";
      if (!PLAYERS.length) {
        row = "<tr><td>NO DATA</td></tr>";
      } else {
        //for (let player of PLAYERS) {
        // row += //+= để nối thành 1 chuổi dài để đẩu về trang html
        //       `<tr>
        //         <td>${player.name}</td>
        //         <td>${player.age}</td>
        //       </tr>`

        // }

        //OPTION 2: Dùng MAP Reduce

        row = PLAYERS.map(
          mem => `
          <tr>
            <td>${mem.name}</td>
            <td>${mem.age}</td>
            
          </tr>
      
        `
        ).reduce((prev, cur) => prev + cur, "");
      }
      const content = html.replace("{{row}}", row);
      res.write(content); // khi đọc lên kiểu dữ liệu là String
      done();
    }
  });
};

const HANDLERS = {
  "GET /": onDefaultRoute,
  "GET /players": onPlayersListRoute
};

http
  .createServer()
  .on("request", (req, res) => {
    const { method, url } = req; // Destructuring ES6

    console.log({ method, url });

    const route = `${method} ${url}`;
    const handler = HANDLERS[route];

    if (!handler) {
      res.writeHead(404);

      return res.end();
    }

    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    handler(req, res, () => {
      res.end(); //
    });
  })
  .on("listening", () => {
    console.log("Server is listening at port 3000");
  })
  .on("error", err => {
    console.error("Server error", err); // Example: EADDRINUSE
  })
  .listen(3000);

