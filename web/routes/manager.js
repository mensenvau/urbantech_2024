const {
    managerHome,
    managerGetEmployees,
    managerPostEmployees,
    managerDeleteEmployees,
    managerGetProfile,
    adminResetPassword
} = require("../controllers/manager");
const { checkAuth } = require("../controllers/auth");

module.exports = function (app) {
    app.use("/manager", checkAuth("manager"));

    app.get("/manager", managerHome);

    app.get("/manager/employees", managerGetEmployees); // get
    app.post("/manager/employees", managerPostEmployees); // edit and new
    app.get("/manager/employees/del", managerDeleteEmployees); // delete
    app.get("/admin/employees/reset", adminResetPassword); // admin rest password

    app.get("/manager/profile", managerGetProfile); // get

};
