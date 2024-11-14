// id, name, username, password, phone
const Joi = require("joi");

// Define a schema for user login
const schemaSignIn = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required()
});

// Define a schema for user registration
const schemaSignUp = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().min(6).max(100).required()
});

module.exports = {schemaSignIn, schemaSignUp}
