const { execute } = require("uzdev/mysql");
const { fnCatch } = require("../function/main");

exports.assistantHome = fnCatch(async (req, res) => {
    const arr = await execute("SELECT * FROM vw_statistics");
    return res.render("assistant/main", { data: req.data, page: "home", arr });
});

exports.assistantGetBranches = fnCatch(async (req, res) => {
    const [arr, one] = await Promise.all([execute("SELECT * FROM branches WHERE active = true"), execute("SELECT * FROM branches WHERE id = ? and active = true", [req.query.edit], 1)]);
    return res.render("assistant/main", { data: req.data, page: "branches", arr, one });
});

exports.assistantPostBranches = fnCatch(async (req, res) => {
    return res.redirect(`/assistant/branches?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.assistantResetPassword = fnCatch(async (req, res) => {
    return res.redirect(`/assistant/branches?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.assistantDeleteBranches = fnCatch(async (req, res) => {
    return res.redirect(`/assistant/branches?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.assistantGetEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    const [arr, one] = await Promise.all([execute("SELECT * FROM employees WHERE branch_id = ? and active = true", [branch_id]), execute("SELECT * FROM employees WHERE id = ? and active = true", [req.query.edit], 1)]);
    return res.render("assistant/main", { data: req.data, page: "employees", arr, one, branch_id });
});

exports.assistantPostEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    return res.redirect(`/assistant/${branch_id}/employees?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.assistantDeleteEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    return res.redirect(`/assistant/${branch_id}/employees?error=Sizda buni qilishga ruxsat yo'q!`);
});

exports.assistantGetCalendar = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    return res.render("assistant/main", { data: req.data, page: "calendar", branch_id });
});

exports.assistantGetCalendarByDay = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    const data = await execute("SELECT * FROM log_branches WHERE branch_id = ? and active = true and cast(? as date) = cast(created_dt as date)", [branch_id, new Date(req.query.date)], 1);
    return res.json(data);
});

exports.assistantLogBranches = fnCatch(async (req, res) => {
    const curr = req.query.page || 0;
    const [arr, cnt] = await Promise.all([execute("SELECT * FROM log_branches ORDER BY created_dt DESC, id DESC LIMIT ?, 10", [curr * 10, 10]), execute("SELECT count(*) as count FROM log_branches", [], 1)]);
    const count = Math.ceil(cnt?.count / 10);
    return res.render("assistant/main", { data: req.data, page: "log_branches", arr, count, curr });
});

exports.assistantLogEmployees = fnCatch(async (req, res) => {
    const curr = req.query.page || 0;
    const [arr, cnt] = await Promise.all([execute("SELECT * FROM vw_log_employees ORDER BY created_dt DESC, id DESC LIMIT ?, 10", [curr * 10, 10]), execute("SELECT count(*) as count FROM vw_log_employees", [], 1)]);
    const count = Math.ceil(cnt?.count / 10);
    return res.render("assistant/main", { data: req.data, page: "log_employees", arr, count, curr });
});

exports.assistantWait = fnCatch(async (req, res) => {
    res.render("assistant/main", { data: req.data, page: "home", arr: [] });
});
