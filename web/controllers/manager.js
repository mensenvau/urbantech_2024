const { execute } = require("uzdev/mysql");
const { fnCatch } = require("../function/main");

exports.masterHome = fnCatch(async (req, res) => {
    const arr = await execute("SELECT * FROM vw_statistics");
    return res.render("master/main", { data: req.data, page: "home", arr });
});

exports.masterGetBranches = fnCatch(async (req, res) => {
    const [arr, one] = await Promise.all([execute("SELECT * FROM branches WHERE active = true"), execute("SELECT * FROM branches WHERE id = ? and active = true", [req.query.edit], 1)]);
    return res.render("master/main", { data: req.data, page: "branches", arr, one });
});

exports.masterPostBranches = fnCatch(async (req, res) => {
    return res.redirect(`/master/branches?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.masterResetPassword = fnCatch(async (req, res) => {
    return res.redirect(`/master/branches?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.masterDeleteBranches = fnCatch(async (req, res) => {
    return res.redirect(`/master/branches?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.masterGetEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    const [arr, one] = await Promise.all([execute("SELECT * FROM employees WHERE branch_id = ? and active = true", [branch_id]), execute("SELECT * FROM employees WHERE id = ? and active = true", [req.query.edit], 1)]);
    return res.render("master/main", { data: req.data, page: "employees", arr, one, branch_id });
});

exports.masterPostEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    return res.redirect(`/master/${branch_id}/employees?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.masterDeleteEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    return res.redirect(`/master/${branch_id}/employees?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.masterGetCalendar = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    return res.render("master/main", { data: req.data, page: "calendar", branch_id });
});

exports.masterGetCalendarByDay = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    const data = await execute("SELECT * FROM log_branches WHERE branch_id = ? and active = true and cast(? as date) = cast(created_dt as date)", [branch_id, new Date(req.query.date)], 1);
    return res.json(data);
});

exports.masterLogBranches = fnCatch(async (req, res) => {
    const curr = req.query.page || 0;
    const [arr, cnt] = await Promise.all([execute("SELECT * FROM log_branches ORDER BY created_dt DESC, id DESC LIMIT ?, 10", [curr * 10, 10]), execute("SELECT count(*) as count FROM log_branches", [], 1)]);
    const count = Math.ceil(cnt?.count / 10);
    return res.render("master/main", { data: req.data, page: "log_branches", arr, count, curr });
});

exports.masterLogEmployees = fnCatch(async (req, res) => {
    const curr = req.query.page || 0;
    const [arr, cnt] = await Promise.all([execute("SELECT * FROM vw_log_employees ORDER BY created_dt DESC, id DESC LIMIT ?, 10", [curr * 10, 10]), execute("SELECT count(*) as count FROM vw_log_employees", [], 1)]);
    const count = Math.ceil(cnt?.count / 10);
    return res.render("master/main", { data: req.data, page: "log_employees", arr, count, curr });
});

exports.masterWait = fnCatch(async (req, res) => {
    res.render("master/main", { data: req.data, page: "home", arr: [] });
});
