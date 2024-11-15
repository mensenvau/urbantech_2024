const { execute } = require("uzdev/mysql");
const { fnCatch } = require("../function/main");

exports.authPage = fnCatch(async (req, res, next) => {
    return res.render("auth/index", { data: req.data });
});

exports.authLogin = fnCatch(async (req, res, next) => {
    let { username, password } = req.body;

    let user = await execute("SELECT * FROM vw_users WHERE username = ? and password = md5(?)", [username, `${password}:${process.env.SECRET}`], 1);
    if (!user) return res.redirect(`/?error=You have entered a wrong username or password!`);

    req.session.auth = true;
    req.session.user = user;

    res.redirect(`/${user?.role}`);
});

exports.authLogout = fnCatch(async (req, res, next) => {
    req.session.destroy();
    res.redirect("/?success=You are logged out!");
});


exports.checkAuth = (role) => {
    return fnCatch(async (req, res, next) => {
        if (req.session?.auth === true && req.session.user?.role === role) {
            return next();
        }
        throw new Error("Authentication error: admin");
    });
}