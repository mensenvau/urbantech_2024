const { execute } = require("uzdev/mysql");
const { fnCatch, tryCatchWrapper } = require("uzdev/function");
const {schemaSignIn, schemaSignUp} = require('../schema/auth');
const { validator } = require("uzdev/joi");

exports.authSignUp = async (input) => {
    const validationResult = validator(input, schemaSignUp);

    if(validationResult.error) throw new Error(validationResult.error[0].message);

    const {name, username, password, phone} = input;
    

    let queryResult = await execute("INSERT INTO users(name, username, password, phone) VALUES(?,?,MD5(?),?)", [name, username, password, phone]);

    if(queryResult.affectedRows < 1) throw new Error(queryResult?.error || "Error while saving the record.");

    return queryResult;
};

exports.authSignIn = async (input) => {
    const validationResult = validator(input, schemaSignIn);

    if(validationResult.error) throw new Error(validationResult.error[0].message);

    const {username, password} = input;    

    let queryResult = await execute("SELECT * FROM users WHERE username = ? AND password = MD5(?)", [username, password]);

    if(queryResult.length !== 1) throw new Error("Username or password is incorrect, please double check and try agin.");

    return queryResult;
};

exports.authLogout = async (input) => {
    return {};
};
