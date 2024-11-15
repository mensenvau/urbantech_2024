const express = require("express");
const app = express();

app.use((req, res, next) => {
    req.data = {
        error: req.query?.error || "",
        success: req.query?.success || "",
    };
    next();
});

require("./auth.js")(app);
require("./admin.js")(app);
require("./manager.js")(app);
require("./employee.js")(app);

module.exports = app;
