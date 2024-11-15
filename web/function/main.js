const generator = require("generate-password");

const fnCredentials = () => ({
    username: generator.generate({ length: 5, numbers: true }),
    password: generator.generate({ length: 10, numbers: true }),
});

const fnCatch = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        next(new Error(err.message));
    });
};

module.exports = {
    fnCredentials,
    fnCatch,
};
