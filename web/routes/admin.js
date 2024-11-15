const {
    adminHome,
    adminGetBranches,
    adminPostBranches,
    adminDeleteBranches,
    adminGetEmployees,
    adminPostEmployees,
    adminDeleteEmployees,
    adminGetCalendar,
    adminGetCalendarByDay,
    adminLogBranches,
    adminLogEmployees,
    adminResetPassword,
} = require("../controllers/admin");
const { authIsAdmin } = require("../controllers/auth");

module.exports = function (app) {
    app.use("/admin", authIsAdmin); // check

    app.get("/admin", adminHome);

    app.get("/admin/branches", adminGetBranches); // get
    app.get("/admin/branches/del", adminDeleteBranches); // delete
    app.get("/admin/branches/reset", adminResetPassword); // reset

    app.post("/admin/branches", adminPostBranches); // edit and new

    app.get("/admin/:branch_id/employees", adminGetEmployees); // get
    app.get("/admin/:branch_id/employees/del", adminDeleteEmployees); // delete
    app.post("/admin/:branch_id/employees", adminPostEmployees); // edit and new

    app.get("/admin/:branch_id/calendar", adminGetCalendar); // get
    app.get("/admin/:branch_id/calendar/day", adminGetCalendarByDay); // get

    app.get("/admin/log_branches", adminLogBranches); // get
    app.get("/admin/log_employees", adminLogEmployees); // get
};
