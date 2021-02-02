const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const config = require("./config/database");

mongoose.connect(config.database);
let db = mongoose.connection;

//check for connection
db.once("open", function () {
  console.log("connected to mongodb");
});

//check for db erros
db.on("error", function (err) {
  console.log(err);
});
//init app
const app = express();

//bring in models
let Accommodation = require("./models/accommodation");

//load View engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//bodyParser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// set public folder
app.use(express.static(path.join(__dirname, "public")));

//express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

//express messages middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//express validator middleware
// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;
      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  })
);

//passport config
require("./config/passport")(passport);

//passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get("*", function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// home route
app.get("/", function (req, res) {
  Accommodation.find({}, function (err, accommodations) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        name: "Accommodations",
        accommodations: accommodations,
      });
    }
  });
});

//route files
let accommodations = require("./routes/accommodations");
let users = require("./routes/users");
app.use("/accommodations", accommodations);
app.use("/users", users);

//start server
app.listen(3000, function () {
  console.log("server started onport 3000...");
});
