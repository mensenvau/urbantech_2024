let error = (err, req, res, next) => {
    try {
        res.status(403).json({ message: err?.message });
    } catch (error) {
        res.status(403).json({ message: "There is an error in the input data.", details: {} });
    }
};

let missed = (req, res, next) => {
    res.status(404).json({ message: "There is no such router." });
};

module.exports = { error, missed };