const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
        
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token is not valid" });
    }
};
