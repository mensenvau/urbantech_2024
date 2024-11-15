const { execute } = require("uzdev/mysql");
const { fnCatch } = require("../function/main");

exports.employeeHome = fnCatch(async (req, res) => {
    const { employee_id } = req.user
    const arr = await execute("select * from timesheets where employee_id = ? and date_worked = current_date()", [employee_id], 1)

    if (!arr) {
        await execute("insert into timesheets (employee_id, date_worked) values (?, cast(current_date() as date)) ", [employee_id], 1);
        arr = await execute("select * from timesheets where employee_id = ? and date_worked = current_date()", [employee_id], 1)
    }

    return res.render("employee/main", { data: req.data, page: "home", arr });
});

exports.employeeGetProfile = fnCatch(async (req, res) => {
    const { employee_id, id, branch_id } = req.user;
    let [branch, user, employee] = await Promise.all([
        execute("SELECT * FROM branches WHERE id = ?", [branch_id], 1),
        execute("SELECT * FROM users WHERE id = ?", [id], 1),
        execute("SELECT * FROM employees WHERE id = ?", [employee_id], 1)
    ]);
    res.render("employee/main", { data: req.data, page: "profile", branch, user, employee });
});

exports.employeeTraining = fnCatch(async (req, res) => {
    res.render("employee/main", { data: req.data, page: "training" });
});

exports.employeeWait = fnCatch(async (req, res) => {
    res.render("employee/main", { data: req.data, page: "home", arr: [] });
});