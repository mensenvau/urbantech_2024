const {
    employeeHome, employeeGetProfile, employeeTraining,
    employeeTimesheetEnter, employeeTimesheetExit, employeeGetRequests,
    employeePostRequests, employeeDeleteRequests, employeeLogTimesheet,
    employeeBoard
} = require("../controllers/employee");
const { checkAuth } = require("../controllers/auth");

module.exports = function (app) {
    app.use("/employee", checkAuth("employee"));

    app.get("/employee/enter", employeeTimesheetEnter); // get
    app.get("/employee/exit", employeeTimesheetExit); // get

    app.get("/employee", employeeHome);
    app.get("/employee/profile", employeeGetProfile); // get
    app.get("/employee/training", employeeTraining); // get

    app.get("/employee/requests", employeeGetRequests); // get
    app.post("/employee/requests", employeePostRequests); // post
    app.get("/employee/requests/del", employeeDeleteRequests); // get

    app.get("/employee/log_timesheets", employeeLogTimesheet); // get
    app.get("/employee/board", employeeBoard); // get

};
