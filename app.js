const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const path = require("path");

const dbUtils = require("./utils/db");
const routes = require("./routes/router");

const app = express();
const port = 3000;

require("dotenv").config();

app.set("view engine", "pug");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/", routes);

dbUtils.connect("simpleAuth");

// enable sessions and store in Mongo
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.listen(port, () => console.log(`simpleAuth listening on port ${port}!`));
