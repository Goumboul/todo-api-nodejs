const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const router = express.Router();
require('dotenv').config();

router.post('/register', async (req, res) => {
    try {
        const { email, password, name, firstname } = req.body;

        if (!email || !password || !name || !firstname) {
            return res.status(400).json({ msg: "Bad parameter" });
        }
        if (!email.includes('@')) {
            return res.status(400).json({ msg: "Bad parameter" });
        }
        const [existingUsers] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ msg: "Account already exists" });
        }
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const [result] = await db.execute(
            'INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, name, firstname]
        );
        const token = jwt.sign({ id: result.insertId }, process.env.SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Bad parameter" });
        }

        const [users] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ msg: "Invalid Credentials" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});
module.exports = router;
