const { execute } = require("uzdev/mysql");
const { fnCredentials, fnCatch } = require("../function/main");

exports.adminHome = fnCatch(async (req, res) => {
    // const arr = await execute("SELECT * FROM vw_statistics");
    return res.render("admin/main", { data: req.data, page: "home" });
});

exports.adminGetBranches = fnCatch(async (req, res) => {
    const [arr, one] = await Promise.all([execute("SELECT * FROM branches WHERE active = true"), execute("SELECT * FROM branches WHERE id = ? and active = true", [req.query.edit], 1)]);
    return res.render("admin/main", { data: req.data, page: "branches", arr, one });
});

exports.adminPostBranches = fnCatch(async (req, res) => {
    const { id, branch_name, phone_num } = req.body;
    let message = "";

    if (id > 0) {
        await execute("UPDATE branches SET branch_name = ?, phone_num = ? WHERE id = ?", [branch_name, phone_num, id]);
    } else {
        const { username, password } = fnCredentials();
        const ins = await execute("INSERT INTO users (name, username, password, role) VALUES (?, ?, md5(?), 'master')", [branch_name, username, `${password}:${process.env.SECRET}`]);
        await execute("INSERT INTO branches (branch_name, phone_num, user_id) VALUES (?, ?, ?)", [branch_name, phone_num, ins.insertId]);

        message = `Iltimos, saqlang, u qaytib kelmaydi (Taxallus: ${username}, Parol: ${password})`;
    }

    return res.redirect(`/admin/branches?success=${message}`);
});

exports.adminResetPassword = fnCatch(async (req, res) => {
    const { username, password } = fnCredentials();
    const slt = await execute("SELECT * FROM branches WHERE id = ?", [req.query.id], 1);
    await execute("UPDATE users SET username = ?, password = md5(?) WHERE id = ? and role = 'master'", [username, `${password}:${process.env.SECRET}`, slt.user_id]);

    message = `Iltimos, saqlang, u qaytib kelmaydi (Taxallus: ${username}, Parol: ${password})`;

    return res.redirect(`/admin/branches?success=${message}`);
});

exports.adminDeleteBranches = fnCatch(async (req, res) => {
    await execute("UPDATE branches SET active = false WHERE id = ?", [req.query.id]);
    return res.redirect(`/admin/branches`);
});

exports.adminGetEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    const [arr, one] = await Promise.all([execute("SELECT * FROM employees WHERE branch_id = ? and active = true", [branch_id]), execute("SELECT * FROM employees WHERE id = ? and active = true", [req.query.edit], 1)]);
    return res.render("admin/main", { data: req.data, page: "employees", arr, one, branch_id });
});

exports.adminPostEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    const { id, full_name, phone_num } = req.body;

    if (id > 0) {
        await execute("UPDATE employees SET full_name = ?, phone_num = ? WHERE id = ?", [full_name, phone_num, id]);
    } else {
        await execute("INSERT INTO employees (full_name, phone_num, branch_id) VALUES (?, ?, ?)", [full_name, phone_num, branch_id]);
    }

    return res.redirect(`/admin/${branch_id}/employees`);
});

exports.adminDeleteEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    await execute("UPDATE employees SET active = false WHERE id = ?", [req.query.id]);
    return res.redirect(`/admin/${branch_id}/employees`);
});

exports.adminGetCalendar = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    return res.render("admin/main", { data: req.data, page: "calendar", branch_id });
});

exports.adminGetCalendarByDay = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    const data = await execute("SELECT * FROM log_branches WHERE branch_id = ? and active = true and cast(? as date) = cast(created_dt as date)", [branch_id, new Date(req.query.date)], 1);
    return res.json(data);
});

exports.adminLogBranches = fnCatch(async (req, res) => {
    const curr = req.query.page || 0;
    const [arr, cnt] = await Promise.all([execute("SELECT * FROM log_branches ORDER BY created_dt DESC, id DESC LIMIT ?, 10", [curr * 10, 10]), execute("SELECT count(*) as count FROM log_branches", [], 1)]);
    const count = Math.ceil(cnt?.count / 10);
    return res.render("admin/main", { data: req.data, page: "log_branches", arr, count, curr });
});

exports.adminLogEmployees = fnCatch(async (req, res) => {
    const curr = req.query.page || 0;
    const [arr, cnt] = await Promise.all([execute("SELECT * FROM vw_log_employees ORDER BY created_dt DESC, id DESC LIMIT ?, 10", [curr * 10, 10]), execute("SELECT count(*) as count FROM vw_log_employees", [], 1)]);
    const count = Math.ceil(cnt?.count / 10);
    return res.render("admin/main", { data: req.data, page: "log_employees", arr, count, curr });
});

exports.adminWait = fnCatch(async (req, res) => {
    res.render("admin/main", { data: req.data, page: "home", arr: [] });
});
