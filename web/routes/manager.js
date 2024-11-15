const {
    assistantHome,
    assistantGetBranches,
    assistantPostBranches,
    assistantDeleteBranches,
    assistantGetEmployees,
    assistantPostEmployees,
    assistantDeleteEmployees,
    assistantGetCalendar,
    assistantGetCalendarByDay,
    assistantLogBranches,
    assistantLogEmployees,
    assistantResetPassword,
} = require("../controllers/manager");
const { authIsAssistant } = require("../controllers/auth");

module.exports = function (app) {
    app.use("/assistant", authIsAssistant); // check

    app.get("/assistant", assistantHome);

    app.get("/assistant/branches", assistantGetBranches); // get
    app.get("/assistant/branches/del", assistantDeleteBranches); // delete
    app.get("/assistant/branches/reset", assistantResetPassword); // reset

    app.post("/assistant/branches", assistantPostBranches); // edit and new

    app.get("/assistant/:branch_id/employees", assistantGetEmployees); // get
    app.get("/assistant/:branch_id/employees/del", assistantDeleteEmployees); // delete
    app.post("/assistant/:branch_id/employees", assistantPostEmployees); // edit and new

    app.get("/assistant/:branch_id/calendar", assistantGetCalendar); // get
    app.get("/assistant/:branch_id/calendar/day", assistantGetCalendarByDay); // get

    app.get("/assistant/log_branches", assistantLogBranches); // get
    app.get("/assistant/log_employees", assistantLogEmployees); // get
};
