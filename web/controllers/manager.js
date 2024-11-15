const { execute } = require("uzdev/mysql");
const { fnCatch, fnCredentials } = require("../function/main");

exports.managerHome = fnCatch(async (req, res) => {
    // const arr = await execute("SELECT * FROM vw_statistics");
    return res.render("manager/main", { data: req.data, page: "home" });
});

exports.managerGetEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.user;
    const [arr, one] = await Promise.all([execute("SELECT * FROM employees WHERE branch_id = ? and active = true", [branch_id]), execute("SELECT * FROM employees WHERE id = ? and active = true", [req.query.edit], 1)]);
    return res.render("manager/main", { data: req.data, page: "employees", arr, one, branch_id });
});

exports.managerPostEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.user;
    const { id, full_name, phone_no, profession } = req.body;
    let message = "";

    if (id > 0) {
        await execute("UPDATE employees SET full_name=?, phone_no=?, profession=?, role=? WHERE branch_id = ? and id = ?", [full_name, phone_no, profession, 'employee', branch_id, id]);
    } else {
        const { username, password } = fnCredentials();
        const ins = await execute("INSERT INTO users (username, password) VALUES (?, md5(?))", [username, `${password}:${process.env.SECRET}`]);

        message = `Please save, it will not return (Username: ${username}, Password: ${password})`;
        await execute("INSERT INTO employees (user_id, branch_id, full_name, phone_no, profession, role) VALUES (?, ?, ?, ?, ?, ?)", [ins.insertId, branch_id, full_name, phone_no, profession, 'employee']);
    }

    return res.redirect(`/manager/employees?success=${message}`);
});

exports.managerDeleteEmployees = fnCatch(async (req, res) => {
    const { branch_id } = req.user;
    await execute("UPDATE employees SET active = false WHERE branch_id = ? and id = ?", [branch_id, req.query.id]);
    return res.redirect(`/manager/employees`);
});

exports.adminResetPassword = fnCatch(async (req, res) => {
    const { branch_id } = req.params;
    const { user_id } = req.query;
    const { username, password } = fnCredentials();
    await execute("UPDATE users SET username = ?, password = md5(?) WHERE id = ?", [username, `${password}:${process.env.SECRET}`, user_id]);

    message = `Please save, it will not return (Username: ${username}, Password: ${password})`;
    return res.redirect(`/admin/${branch_id}/employees?success=${message}`);
});

exports.managerGetProfile = fnCatch(async (req, res) => {
    const { employee_id, id, branch_id } = req.user;
    let [branch, user, employee] = await Promise.all([
        execute("SELECT * FROM branches WHERE id = ?", [branch_id], 1),
        execute("SELECT * FROM users WHERE id = ?", [id], 1),
        execute("SELECT * FROM employees WHERE id = ?", [employee_id], 1)
    ]);
    res.render("manager/main", { data: req.data, page: "profile", branch, user, employee });
});

exports.managerWait = fnCatch(async (req, res) => {
    res.render("manager/main", { data: req.data, page: "home", arr: [] });
});
