let error = (err, req, res, next) => {
    try {
        res.status(403).json({ code: err?.message, message: "There is something wrong with the router" });
    } catch (error) {
        res.status(403).json({ code: "#0001", message: "There is an error in the input data.", details: {} });
    }
};

let missed = (req, res, next) => {
    res.status(404).json({ code: "#0002", message: "There is no such router." });
};

module.exports = { error, missed };