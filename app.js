const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
// const passport = require("passport-google-oauth20");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const methodOverride = require("method-override");
const exphbs = require("express-handlebars");

const session = require("express-session");
// const MongoStore = require("connect-mongo");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const app = express();
// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
dotenv.config({ path: "./config/config.env" });
//passport config
require("./config/passport")(passport);
// app.use(passport.initialize());
// app.use(passport.session());

// Logging
if (process.env.NODE_ENV === "devlopment") {
  app.use(morgan("dev"));
}
// HandleBars helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs");

// Handlebars
app.engine(
  "hbs",
  exphbs.engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
    defaultLayout: "main",
    extname: "hbs",
  })
);
app.set("view engine", ".hbs");

//session middleware
// app.use(express.session());
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongooseConnection: mongoose.connection,
    }),
  })
);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Global variable
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});
// static folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const port = process.env.PORT || 5000;
connectDB();
app.listen(
  port,
  console.log(`server running in ${process.env.NODE_ENV} on port ${port}`)
);
