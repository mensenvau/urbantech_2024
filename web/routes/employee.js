const {
    employeeHome,
    employeeGetProfile
} = require("../controllers/employee");
const { checkAuth } = require("../controllers/auth");

module.exports = function (app) {
    app.use("/employee", checkAuth("employee"));

    app.get("/employee", employeeHome);
    app.get("/employee/profile", employeeGetProfile); // get

};
