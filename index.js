var express = require("express");
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var app = express();
app.use(express.static("public"));
app.use(bodyParser());
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(5000);
app.use("/uploads",express.static(__dirname + '/../uploads'));

var pg = require("pg");
// kết nối database
var config = {
  user: "cuukiem",
  database: "cuukiem",
  password: "123456aA",
  host: "171.244.33.148",
  port: "5432",
  max: "10",
  idleTimeoutMillis: 30000,
};
var pool = new pg.Pool(config);
app.get("/", function (req, res) {
  async function demoAwait() {
    try {
      const dataEvent = await pool.query( "select * from event" );
      const dataBangPhai = await pool.query( "select * from bangphai" );
      return {dataEvent, dataBangPhai};
    } catch ( err ) {
      console.log(err);
    }
}

  pool.connect( async function (err, done) {
    const data2Table = await demoAwait();
    console.log("======== data2Table", data2Table);
    res.render("home", { data: data2Table });
    // if (err) {
    //   return console.error("error fetching client from pool", err);
    // }
    // client.query("select * from event", function (err, result) {
    //   done();
    //
    //   if (err) {
    //     res.end();
    //     return console.error("error runging query", err);
    //   }
    //   res.render("home", { data: result });
    // });
  });
});

app.get("/event", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query("select * from event", function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error runging query", err);
      }
      res.render("event", { data: result });
    });
  });
});
app.get("/camnang", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query("select * from camnang", function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error runging query", err);
      }
      res.render("camnang", { data: result });
    });
  });
});
app.get("/ct-camnang/:id", function (req, res) {
  var item = {'noidung':'abc'};
  console.log(req.params.id);

  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query('SELECT * FROM camnang WHERE id='+req.params.id + ' limit 1',function (err, result) {
        done();
        if (err) {
          res.end();
          return console.error("error runging query", err);
        }

        res.render("ct-camnang",{item:result.rows[0]});
      });
  });
});
app.get("/contentevent/:id", function (req, res) {
  var item = {'noidung':'abc'};
  console.log(req.params.id);

  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query('SELECT * FROM event WHERE id='+req.params.id + ' limit 1',function (err, result) {
        done();
        if (err) {
          res.end();
          return console.error("error runging query", err);
        }

        res.render("contentevent",{item:result.rows[0]});
      });
  });
});
app.get("/contentbang/:id", function (req, res) {
  var item = {'noidung':'abc'};
  console.log(req.params.id);

  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query('SELECT * FROM bangphai WHERE id='+req.params.id + ' limit 1',function (err, result) {
        done();
        if (err) {
          res.end();
          return console.error("error runging query", err);
        }

        res.render("contentbang",{item:result.rows[0]});
      });
  });
});
app.get("/add", function (req, res) {
  res.render("add");
});
app.get("/edit", function (req, res) {
  res.render("edit");
});
app.get("/event", function (req, res) {
  res.render("event");
});
app.get("/camnang", function (req, res) {
  res.render("camnang");
});
app.get("/ct-camnang", function (req, res) {
  res.render("ct-camnang");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/contentbang", function (req, res) {
  res.render("contentbang");
});


// trang quản trị
app.get("/event/admin", function (req, res) {
  async function demoAwait(client) {
    try {
      const dataEvent = await client.query( "select * from event" );
      const dataBangPhai = await client.query( "select * from bangphai" );
      return {dataEvent, dataBangPhai};
    } catch ( err ) {
      console.log(err);
    }
}

  pool.connect( async function (err, client, done) {
    const data2Table = await demoAwait(client);
    console.log("======== data2Table", data2Table);
    res.render("admin", { data: data2Table });
    // if (err) {
    //   return console.error("error fetching client from pool", err);
    // }
    // client.query("select * from event", function (err, result) {
    //   done();
    //
    //   if (err) {
    //     res.end();
    //     return console.error("error runging query", err);
    //   }
    //   res.render("home", { data: result });
    // });
  });
});
app.post("/login", function (req, res) {
  const {username, password} = req.body;
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(`select * from login where taikhoan='${username}' and matkhau='${password}' limit 1`, function (err, result) {
      console.log("==== result login", result);
      if( result.rows.length > 0){
        res.redirect("/event/admin");
      }
    });
  });
});

app.get("/delete/:id", function (req, res) {
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query(
      "delete from event where id =" + req.params.id,
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error runging query", err);
        }
        res.redirect("/event/admin");
      });
  });
});


var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage }).single("uploadfile");

app.post("/add", urlencodedParser, function (req, res) {
  upload(req, res, function (err) {
    if (err) {
      res.send("lỗi");
    } else {
      if (req.file == undefined) {
        res.send("file chưa đc chọn");
      } else {


        pool.connect(function (err, client, done) {
          if (err) {
            return console.error("error fetching client from pool", err);
          }
          var sql ="insert into event(tieude, mota,noidung, image ) values ('"+req.body.tieude+"', '"+req.body.mota+"','"+req.body.noidung+"', '"+req.file.originalname+"')";
          client.query(sql,function (err, result) {
              done();
              if (err) {
                res.end();
                return console.error("error runging query", err);
              }
              res.redirect("/event/admin");
            });
        });


      }
    }
  });
});
app.post("/edit/:id", function (req, res) {
  var id = req.params.id;
  pool.connect(function (err, client, done) {
    if (err) {
      return console.error("error fetching client from pool", err);
    }
    client.query('SELECT * FROM event WHERE id='+id,function (err, result) {
        done();
        if (err) {
          res.end();
          return console.error("error runging query", err);
        }
        res.redirect("/event/edit",{data:result.rows[0]});
      });
  });
});
