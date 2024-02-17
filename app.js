const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express(); //initialise new express application
require("dotenv").config();

const port = process.env.PORT || 30001;

//some middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.use(cookieParser("TravelBlogSecure"));
app.use(
  session({
    secret: "TravelBlogSecretSession",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

app.set("layout", "./layouts/main"); //setting main folder for layouts
app.set("view engine", "ejs");

const routes = require("./server/routes/blogRoutes.js");
app.use("/", routes);

app.listen(port, () => console.log(`Listening to port ${port}`));
