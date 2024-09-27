const express = require("express");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const session = require("express-session");
var methodOverride = require("method-override");
var path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

const database = require("./config/database");
database.connect();

const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");

app.set("views", path.join(__dirname, "views")); //Tìm đến thư mục tên là views
app.set("view engine", "pug"); //template engine sử dụng: pug
app.use(express.static(path.join(__dirname, "public"))); //Thiết lập thư mục chứa file tĩnh
app.use(methodOverride("_method"));
app.use(cookieParser("tuanemtramtinh"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const systemConfig = require("./config/system");

app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin(app);
routeClient(app);

app.listen(port, () => {
  console.log("App listening on port", port);
});
