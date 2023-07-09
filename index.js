const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const magic = require("express-routemagic");
const mongodb_init = require(__dirname + "/mongodb");
const mongoSanitize = require("express-mongo-sanitize");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(mongoSanitize());
magic.use(app);

mongodb_init();

app.listen(4200, () => {
  console.log(`EgloEmail listening on port 4200`);
});
