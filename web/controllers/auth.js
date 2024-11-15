const { execute } = require("uzdev/mysql");
const { fnCatch } = require("../function/main");

exports.authPage = fnCatch(async (req, res, next) => {
    return res.render("auth/index", { data: req.data });
});

exports.authLogin = fnCatch(async (req, res, next) => {
    let { username, password } = req.body;

    let user = await execute("SELECT * FROM users WHERE username = ? and password = md5(?)", [username, `${password}:${process.env.SECRET}`], 1);
    if (!user) return res.redirect(`/?error=Taxallus yoki parol xato kirtingiz!`);

    req.session.auth = true;
    req.session.user = user;

    if (user.role == "master") {
        let branch = await execute("SELECT * FROM branches WHERE user_id = ?", [user.id], 1);
        req.session.branch = branch;
    }

    res.redirect(`/${user?.role}`);
});

exports.authLogout = fnCatch(async (req, res, next) => {
    req.session.destroy();
    res.redirect("/?success=Siz tizimdan chiqdingiz!");
});

exports.authIsAdmin = fnCatch(async (req, res, next) => {
    if (req.session?.auth === true && req.session.user?.role === "admin") {
        return next();
    }
    throw new Error("Autentifikatsiya xatosi(admin)!");
});

exports.authIsAssistant = fnCatch(async (req, res, next) => {
    if (req.session?.auth === true && req.session.user?.role === "assistant") {
        return next();
    }
    throw new Error("Autentifikatsiya xatosi (admin)!");
});

exports.authIsMaster = fnCatch(async (req, res, next) => {
    if (req.session?.auth === true && req.session.user?.role === "master") {
        req.branch_id = req.session.branch?.id || 0;
        return next();
    }
    throw new Error("Autentifikatsiya xatosi (master)!");
});
