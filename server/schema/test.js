const Joi = require("joi");
const { validator } = require("uzdev/joi");

// Define a schema for user registration
const userSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    age: Joi.number().integer().min(18).optional()
});

// Sample data to validate
const userData = {
    username: 'testuser',
    age: 25
};

// Validate the data using the universal function
const result = validator(userData, userSchema);

if (result.error) {
    console.error('Validation errors:', result.error);
} else {
    console.log('Validated data:', result.value);
}
