const {
    adminHome,
    adminGetBranches,
    adminPostBranches,
    adminDeleteBranches,
    adminGetEmployees,
    adminPostEmployees,
    adminDeleteEmployees,
    adminResetPassword,
    adminListEmployees
} = require("../controllers/admin");
const { checkAuth } = require("../controllers/auth");

module.exports = function (app) {
    app.use("/admin", checkAuth("admin"));

    app.get("/admin", adminHome);

    app.get("/admin/branches", adminGetBranches); // get
    app.post("/admin/branches", adminPostBranches); // edit and new
    app.get("/admin/branches/del", adminDeleteBranches); // delete

    app.get("/admin/:branch_id/employees", adminGetEmployees); // get
    app.post("/admin/:branch_id/employees", adminPostEmployees); // edit and new
    app.get("/admin/:branch_id/employees/del", adminDeleteEmployees); // delete
    app.get("/admin/:branch_id/employees/reset", adminResetPassword); // admin rest password

    app.get("/admin/staff", adminListEmployees); // get

};
