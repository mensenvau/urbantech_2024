const { execute } = require("uzdev/mysql");
const { schemaSignIn, schemaSignUp } = require('../schema/auth');
const { validator } = require("uzdev/joi");

exports.authSignUp = async (input) => {
    const { name, username, password, phone } = input;
    const val = validator(input, schemaSignUp);
    if (val.error) throw new Error(val.error[0].message);

    let user = await execute("INSERT INTO users (name, username, password, phone) VALUES(?, ?, MD5(?), ?)", [name, username, password, phone]);

    if (user.affectedRows < 1) throw new Error(user?.error || "Error while saving the record.");

    return user;
};

exports.authSignIn = async (input) => {
    const { username, password } = input;
    const val = validator(input, schemaSignIn);
    if (val.error) throw new Error(val.error[0].message);

    let user = await execute("SELECT * FROM users WHERE username = ? AND password = MD5(?)", [username, password]);

    if (user.length !== 1) throw new Error("Username or password is incorrect, please double check and try agin.");
    return user;
};

exports.authLogout = async (input) => {
    return input;
};
