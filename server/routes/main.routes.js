const express = require("express");
const app = express();

const { authSignIn, authSignUp, authLogout } = require("../controllers/auth");

let func = {
    authSignIn, authSignUp, authLogout
}

app.use("/v1", async (req, res) => {
    const { type, input } = req.body;

    if (!type || !input) return res.status(400).json({ error: "Missing 'type' or 'input' in request body" });

    const selected = func[type];
    if (!selected) return res.status(400).json({ error: `Function '${type}' not found` });

    try {
        let data = await selected(input);
        res.json({ data });
    } catch (error) {
        throw new Error({ error: "Function execution failed" });
    }
});


module.exports = app;