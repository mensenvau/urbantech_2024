const { execute } = require("uzdev/mysql");
const { fnCatch } = require("../function/main");

exports.employeeHome = fnCatch(async (req, res) => {
    // const arr = await execute("SELECT * FROM vw_statistics");
    return res.render("employee/main", { data: req.data, page: "home" });
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

exports.employeeWait = fnCatch(async (req, res) => {
    res.render("employee/main", { data: req.data, page: "home", arr: [] });
});