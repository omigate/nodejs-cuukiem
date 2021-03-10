const express = require("express");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
app.use(express.static("public"));
app.use(bodyParser());
app.set("view engine", "ejs");
app.set("views", "./views");
app.listen(5000);
app.use("/uploads", express.static(__dirname + "/../uploads"));
const pg = require("pg");
//database config
const config = {
    user: "cuukiem",
    database: "cuukiem",
    password: "123456aA",
    host: "171.244.33.148",
    port: "5432",
    max: "10",
    idleTimeoutMillis: 30000,
};
const pool = new pg.Pool(config);
app.get("/healthcheck", (req, res) => {
    res.send('{"status": "ok"}')
});

app.get("/", function (req, res) {
    async function demoAwait() {
        try {
            const dataEvent = await pool.query("select * from event");
            const dataBangPhai = await pool.query("select * from bangphai");
            const dataNews = await pool.query("select * from news");
            const dataCamNang = await pool.query("select * from camnang");
            return {dataEvent, dataBangPhai, dataNews, dataCamNang};
        } catch (err) {
            console.log(err);
        }
    }

    demoAwait().then(data2Table => {
        console.log("======== data2Table", data2Table);
        res.render("home", {data: data2Table});
    })
});

app.get("/event", function (req, res) {
    pool.query("select * from event", function (err, result) {
        if (err) {
            res.end();
            return console.error("error runging query", err);
        }
        res.render("event", {data: result});
    });
});
app.get("/camnang", function (req, res) {
    pool.query("select * from camnang", function (err, result) {
        if (err) {
            res.end();
            return console.error("error runging query", err);
        }
        res.render("camnang", {data: result});
    });
});
app.get("/ct-camnang/:id", function (req, res) {
    console.log(req.params.id);
    pool.query(
        "SELECT * FROM camnang WHERE id=" + req.params.id + " limit 1",
        function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.render("ct-camnang", {item: result.rows[0]});
        }
    );
});
app.get("/contentevent/:id", function (req, res) {
    console.log(req.params.id);
    pool.query(
        "SELECT * FROM event WHERE id=" + req.params.id + " limit 1",
        function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.render("contentevent", {item: result.rows[0]});
        }
    );
});
app.get("/contentbang/:id", function (req, res) {
    console.log(req.params.id);
    pool.query(
        "SELECT * FROM bangphai WHERE id=" + req.params.id + " limit 1",
        function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.render("contentbang", {item: result.rows[0]});
        }
    );
});
app.get("/add", function (req, res) {
    res.render("add");
});
app.get("/hinhanh", function (req, res) {
    res.render("hinhanh");
});
app.get("/addimage", function (req, res) {
    res.render("addimage");
});
app.get("/addbang", function (req, res) {
    res.render("addbang");
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
app.get("/addcamnang", function (req, res) {
    res.render("addcamnang");
});
app.get("/addnews", function (req, res) {
    res.render("addnews");
});
app.get("/tanthu", function (req, res) {
    res.render("tanthu");
});
app.get("/huongdannap", function (req, res) {
    res.render("huongdannap");
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
    async function demoAwait() {
        try {
            const dataEvent = await pool.query("select * from event");
            const dataBangPhai = await pool.query("select * from bangphai");
            const dataNews = await pool.query("select * from news");
            const dataCamNang = await pool.query("select * from camnang");
            const dataHinhAnh = await pool.query("select * from hinhanh");
            return {dataEvent, dataBangPhai, dataNews, dataCamNang, dataHinhAnh};
        } catch (err) {
            console.log(err);
        }
    }

    demoAwait().then(data2Table => {
        console.log("======== data2Table", data2Table);
        res.render("admin", {data: data2Table});
    })
});
app.post("/login", function (req, res) {
    const {username, password} = req.body;
    pool.query(
        `select * from login where taikhoan='${username}' and matkhau='${password}' limit 1`,
        function (err, result) {
            console.log("==== result login", result);
            if (result.rows.length > 0) {
                res.redirect("/event/admin");
            }
        }
    );
});

app.get("/delete/:id", function (req, res) {
    pool.query(
        "delete from event where id =" + req.params.id,
        function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.redirect("/event/admin");
        }
    );
});
app.get("/delete1/:id", function (req, res) {
    pool.query(
        "delete from bangphai where id =" + req.params.id,
        function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.redirect("/event/admin");
        }
    );
});
app.get("/delete2/:id", function (req, res) {
    pool.query(
        "delete from camnang where id =" + req.params.id,
        function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.redirect("/event/admin");
        }
    );
});
app.get("/delete3/:id", function (req, res) {
    pool.query(
        "delete from news where id =" + req.params.id,
        function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.redirect("/event/admin");
        }
    );
});

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/../uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({storage: storage}).single("uploadfile");

app.post("/add", urlencodedParser, function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send("lỗi");
        } else {
            if (req.file == undefined) {
                res.send("file chưa đc chọn");
            } else {
                let sql =
                    "insert into event(tieude, mota,noidung, image ) values ('" +
                    req.body.tieude +
                    "', '" +
                    req.body.mota +
                    "','" +
                    req.body.noidung +
                    "', '" +
                    req.file.originalname +
                    "')";
                pool.query(sql, function (err, result) {

                    if (err) {
                        res.end();
                        return console.error("error runging query", err);
                    }
                    res.redirect("/event/admin");
                });
            }
        }
    });
});
app.post("/addbang", function (req, res) {
    upload(req, res, function (err) {
        let sql =
            "insert into bangphai(tieude, noidung ) values ('" +
            req.body.tieude +
            "', '" +
            req.body.noidung +
            "')";
        pool.query(sql, function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.redirect("/event/admin");
        });
    });
});
app.post("/addnews", function (req, res) {
    upload(req, res, function (err) {
        let sql =
            "insert into news(tieude, noidung ) values ('" +
            req.body.tieude +
            "', '" +
            req.body.noidung +
            "')";
        pool.query(sql, function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.redirect("/event/admin");
        });
    });
});
app.post("/addcamnang", function (req, res) {
    upload(req, res, function (err) {
        let sql =
            "insert into camnang(tieude, mota,noidung, image ) values ('" +
            req.body.tieude +
            "', '" +
            req.body.mota +
            "','" +
            req.body.noidung +
            "', '" +
            req.file.originalname +
            "')";
        pool.query(sql, function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.redirect("/event/admin");
        });
    });
});
app.post("/addimage", function (req, res) {
    upload(req, res, function (err) {
        let sql =
            "insert into hinhanh(hinhanh ) values ( '" +
            req.file.originalname +
            "')";
        pool.query(sql, function (err, result) {
            if (err) {
                res.end();
                return console.error("error runging query", err);
            }
            res.redirect("/event/admin");
        });
    });
});

app.get("/edit/:id", function (req, res) {
    let id = req.params.id;
    pool.query("SELECT * FROM event WHERE id=" + id, function (err, result) {
        if (err) {
            res.end();
            return console.error("error runging query", err);
        }
        res.render("edit", {data: result.rows[0]});
    });
});

app.post("/edit/:id", urlencodedParser, function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            res.send("lỗi");
        } else {
            if (req.file == undefined) {
                res.send("file chưa đc chọn");
            } else {
                let sql =
                    "insert into event(tieude, mota,noidung, image ) values ('" +
                    req.body.tieude +
                    "', '" +
                    req.body.mota +
                    "','" +
                    req.body.noidung +
                    "', '" +
                    req.file.originalname +
                    "')";
                pool.query(sql, function (err, result) {
                    if (err) {
                        res.end();
                        return console.error("error runing query", err);
                    }
                    res.redirect("/event/admin");
                });
            }
        }
    });
});
