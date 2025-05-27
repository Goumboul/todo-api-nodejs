const db = require('../config/db');

function notFoundHandler(req, res) {
    res.status(404).json({msg:"Not found"});
}

module.exports = notFoundHandler;