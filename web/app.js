// load environment variables
require("dotenv").config({ path: "../.env" });

const express = require("express");
const app = express();
const { error, missed } = require("./controllers/error.js");

// session setup
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const FileStore = require("session-file-store")(session);

app.use(cookieParser(process.env.SECRET));
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        store: new FileStore({ path: path.join(__dirname, "/session"), logFn: function () { } }),
        cookie: { maxAge: 12 * 3600000, secure: false, httpOnly: false },
    })
);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// set up routes
app.use("/", require("./routes/main.js"));

// error handling middleware
app.use(error);
app.use(missed);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
