const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

const database = require('./config/database');
database.connect();

const routeAdmin = require('./routes/admin/index.route');
const routeClient = require('./routes/client/index.route');

app.set('views', './views'); //Tìm đến thư mục tên là views
app.set('view engine', 'pug'); //template engine sử dụng: pug
app.use(express.static('public')); //Thiết lập thư mục chứa file tĩnh
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const systemConfig = require('./config/system');

app.locals.prefixAdmin = systemConfig.prefixAdmin;

routeAdmin(app);
routeClient(app);

app.listen(port, () => {
  console.log('App listening on port', port);
})

