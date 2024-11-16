const { execute } = require("uzdev/mysql");
const { fnCatch } = require("../function/main");

exports.employeeHome = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    const [timesheet, requests] = await Promise.all([
        execute("select * from timesheets where employee_id = ? and date_worked = current_date()", [employee_id], 1),
        execute("select * from requests where employee_id = ? and active = true order by id desc limit 2", [employee_id])
    ]);

    if (!timesheet) {
        await execute("insert into timesheets (employee_id, date_worked) values (?, cast(current_date() as date)) ", [employee_id], 1);
        timesheet = await execute("select * from timesheets where employee_id = ? and date_worked = current_date()", [employee_id], 1);
    }

    return res.render("employee/main", { data: req.data, page: "home", timesheet, requests });
});

exports.employeeTimesheetEnter = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    await execute("update timesheets set start_time = current_time() where employee_id = ? and date_worked = current_date()", [employee_id], 1);
    return res.redirect(`/employee`);
});

exports.employeeTimesheetExit = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    await execute("update timesheets set end_time = current_time(), hours_worked = LEAST(GREATEST(TIMESTAMPDIFF(SECOND, start_time, CURRENT_TIME()) / 3600, 0), 8) where employee_id = ? and date_worked = current_date()", [employee_id], 1);
    return res.redirect(`/employee`);
});

exports.employeeLogTimesheet = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    const curr = req.query.page || 0;
    const [arr, cnt] = await Promise.all([execute("SELECT * FROM timesheets WHERE employee_id = ? ORDER BY created_dt DESC, id DESC LIMIT ?, 10", [employee_id, curr * 10, 10]), execute("SELECT count(*) as count FROM timesheets WHERE employee_id = ?", [employee_id], 1)]);
    const count = Math.ceil(cnt?.count / 10);
    return res.render("employee/main", { data: req.data, page: "log_timesheets", arr, count, curr });
});

exports.employeeGetProfile = fnCatch(async (req, res) => {
    const { id, employee_id, branch_id } = req.user;
    let [branch, user, employee] = await Promise.all([execute("SELECT * FROM branches WHERE id = ?", [branch_id], 1), execute("SELECT * FROM users WHERE id = ?", [id], 1), execute("SELECT * FROM employees WHERE id = ?", [employee_id], 1)]);
    res.render("employee/main", { data: req.data, page: "profile", branch, user, employee });
});

exports.employeeTraining = fnCatch(async (req, res) => {
    res.render("employee/main", { data: req.data, page: "training" });
});

exports.employeeGetRequests = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    const [arr, one] = await Promise.all([execute("SELECT * FROM requests WHERE employee_id = ? and active = true", [employee_id]), execute("SELECT * FROM requests WHERE employee_id = ? and id = ? and active = true", [employee_id, req.query.edit], 1)]);
    return res.render("employee/main", { data: req.data, page: "requests", arr, one });
});

exports.employeePostRequests = fnCatch(async (req, res) => {
    const { employee_id, branch_id } = req.user;
    const { type, comment } = req.body;
    await execute("INSERT INTO requests (employee_id, branch_id, type, comment) VALUES (?, ?, ?, ?)", [employee_id, branch_id, type, comment]);
    return res.redirect(`/employee/requests`);
});

exports.employeeDeleteRequests = fnCatch(async (req, res) => {
    const { employee_id } = req.user;
    await execute("UPDATE requests SET active = false WHERE employee_id = ? and id = ?", [employee_id, req.query.id]);
    return res.redirect(`/employee/requests`);
});


exports.employeeWait = fnCatch(async (req, res) => {
    res.render("employee/main", { data: req.data, page: "home", arr: [] });
});
