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
    const { id, branch_name, branch_description } = req.body;
    let message = "";

    if (id > 0) {
        await execute("UPDATE branches SET branch_name = ? WHERE id = ?", [branch_name, branch_description, id]);
    } else {
        await execute("INSERT INTO branches (branch_name, branch_description) VALUES (?, ?)", [branch_name, branch_description]);
    }

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
    const { id, full_name, phone_no, profession, role } = req.body;
    let message = "";

    console.log(id, full_name, phone_no, profession, role)

    if (id > 0) {
        await execute("UPDATE employees SET full_name=?, phone_no=?, profession=?, role=? WHERE id = ?", [branch_id, full_name, phone_no, profession, role, id]);
    } else {
        const { username, password } = fnCredentials();
        const ins = await execute("INSERT INTO users (username, password) VALUES (?, md5(?))", [username, `${password}:${process.env.SECRET}`]);

        message = `Iltimos, saqlang, u qaytib kelmaydi (Taxallus: ${username}, Parol: ${password})`;

        await execute("INSERT INTO employees (user_id, branch_id, full_name, phone_no, profession, role) VALUES (?, ?, ?, ?, ?, ?)", [ins.insertId, branch_id, full_name, phone_no, profession, role]);
    }

    return res.redirect(`/admin/${branch_id}/employees?success=${message}`);
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
