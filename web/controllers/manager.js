const { execute } = require("uzdev/mysql");
const { fnCatch, fnCredentials } = require("../function/main");

exports.managerHome = fnCatch(async (req, res) => {
    const { employee_id, branch_id } = req.user;
    const [timesheet, requests] = await Promise.all([
        execute("select * from timesheets where employee_id = ? and date_worked = current_date()", [employee_id], 1),
        execute("select * from requests where branch_id = ? and active = true order by id desc limit 2", [branch_id])
    ]);

    if (!timesheet) {
        await execute("insert into timesheets (employee_id, date_worked) values (?, cast(current_date() as date)) ", [employee_id], 1);
        timesheet = await execute("select * from timesheets where employee_id = ? and date_worked = current_date()", [employee_id], 1);
    }

    return res.render("manager/main", { data: req.data, page: "home", timesheet, requests });
});

exports.managerTimesheetEnter = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    await execute("update timesheets set start_time = current_time() where employee_id = ? and date_worked = current_date()", [employee_id], 1);
    return res.redirect(`/manager`);
});

exports.managerTimesheetExit = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    await execute("update timesheets set end_time = current_time(), hours_worked = LEAST(GREATEST(TIMESTAMPDIFF(SECOND, start_time, CURRENT_TIME()) / 3600, 0), 8) where employee_id = ? and date_worked = current_date()", [employee_id], 1);
    return res.redirect(`/manager`);
});

exports.managerLogTimesheet = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    const curr = req.query.page || 0;
    const [arr, cnt] = await Promise.all([execute("SELECT * FROM timesheets WHERE employee_id = ? ORDER BY created_dt DESC, id DESC LIMIT ?, 10", [employee_id, curr * 10, 10]), execute("SELECT count(*) as count FROM timesheets WHERE employee_id = ?", [employee_id], 1)]);
    const count = Math.ceil(cnt?.count / 10);
    return res.render("manager/main", { data: req.data, page: "log_timesheets", arr, count, curr });
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
        await execute("UPDATE employees SET full_name=?, phone_no=?, profession=?, role=? WHERE branch_id = ? and id = ?", [full_name, phone_no, profession, "employee", branch_id, id]);
    } else {
        const { username, password } = fnCredentials();
        const ins = await execute("INSERT INTO users (username, password) VALUES (?, md5(?))", [username, `${password}:${process.env.SECRET}`]);

        message = `Please save, it will not return (Username: ${username}, Password: ${password})`;
        await execute("INSERT INTO employees (user_id, branch_id, full_name, phone_no, profession, role) VALUES (?, ?, ?, ?, ?, ?)", [ins.insertId, branch_id, full_name, phone_no, profession, "employee"]);
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
    return res.redirect(`/manager/employees?success=${message}`);
});

exports.managerGetProfile = fnCatch(async (req, res) => {
    const { employee_id, id, branch_id } = req.user;
    let [branch, user, employee] = await Promise.all([execute("SELECT * FROM branches WHERE id = ?", [branch_id], 1), execute("SELECT * FROM users WHERE id = ?", [id], 1), execute("SELECT * FROM employees WHERE id = ?", [employee_id], 1)]);
    res.render("manager/main", { data: req.data, page: "profile", branch, user, employee });
});

exports.managerTraining = fnCatch(async (req, res) => {
    res.render("manager/main", { data: req.data, page: "training" });
});

exports.managerGetRequests = fnCatch(async (req, res) => {
    const { branch_id } = req.user;
    const [arr, one] = await Promise.all([execute("SELECT * FROM requests WHERE branch_id = ? and active = true", [branch_id]), execute("SELECT * FROM requests WHERE branch_id = ? and id = ? and active = true", [branch_id, req.query.edit], 1)]);
    return res.render("manager/main", { data: req.data, page: "requests", arr, one });
});

exports.managerStatusRequests = fnCatch(async (req, res) => {
    const { branch_id } = req.user;
    const { id, status } = req.query;
    await execute("UPDATE requests SET status = ? WHERE branch_id = ? and id = ?", [status, branch_id, id]);
    return res.redirect(`/manager/requests`);
});

exports.managerWait = fnCatch(async (req, res) => {
    res.render("manager/main", { data: req.data, page: "home", arr: [] });
});
