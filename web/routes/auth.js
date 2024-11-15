const { authLogin, authPage, authLogout } = require("../controllers/auth");

module.exports = function (app) {
    app.get("/logout", authLogout);
    app.get("/", authPage);
    app.post("/", authLogin);
};
