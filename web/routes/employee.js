const {
    employeeHome,
    employeeGetProfile,
    employeeTraining
} = require("../controllers/employee");
const { checkAuth } = require("../controllers/auth");

module.exports = function (app) {
    app.use("/employee", checkAuth("employee"));

    app.get("/employee", employeeHome);
    app.get("/employee/profile", employeeGetProfile); // get
    app.get("/employee/training", employeeTraining); // get

    app.get("/employee/enter", employeeTraining); // get
    app.get("/employee/exit", employeeTraining); // get

}
