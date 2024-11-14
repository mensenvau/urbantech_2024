const { execute } = require("uzdev/mysql");
const { fnCatch, tryCatchWrapper } = require("uzdev/function");

exports.authLogin = tryCatchWrapper("authLogin", async (input) => {
    return input
});


