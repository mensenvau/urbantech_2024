const {
    masterHome,
    masterGetBranches,
    masterPostBranches,
    masterDeleteBranches,
    masterGetEmployees,
    masterPostEmployees,
    masterDeleteEmployees,
    masterGetCalendar,
    masterGetCalendarByDay,
    masterLogBranches,
    masterLogEmployees,
    masterResetPassword,
} = require("../controllers/manager");
const { checkAuth } = require("../controllers/auth");

module.exports = function (app) {
    app.use("/admin", checkAuth("master"));

    app.get("/master", masterHome);

    app.get("/master/branches", masterGetBranches); // get
    app.get("/master/branches/del", masterDeleteBranches); // delete
    app.get("/master/branches/reset", masterResetPassword); // reset

    app.post("/master/branches", masterPostBranches); // edit and new

    app.get("/master/:branch_id/employees", masterGetEmployees); // get
    app.get("/master/:branch_id/employees/del", masterDeleteEmployees); // delete
    app.post("/master/:branch_id/employees", masterPostEmployees); // edit and new

    app.get("/master/:branch_id/calendar", masterGetCalendar); // get
    app.get("/master/:branch_id/calendar/day", masterGetCalendarByDay); // get

    app.get("/master/log_branches", masterLogBranches); // get
    app.get("/master/log_employees", masterLogEmployees); // get
};
