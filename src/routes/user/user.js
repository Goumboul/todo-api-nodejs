const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const db = require('../../config/db');

router.get('/user', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await db.execute(
            `SELECT id, email, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at, firstname, name
             FROM user WHERE id = ?`,
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        return res.status(200).json(rows[0]);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Internal server error" });
    }
});

router.get('/user/todos', auth, async (req, res) => {
    try {
        const [todos] = await db.execute('SELECT * FROM todo WHERE user_id = ?', [req.user.id]);
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.get('/users/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT id, email, password, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at, firstname, name
            FROM user
            WHERE id = ?
        `;

        const [users] = await db.execute(query, [id]);
        if (users.length === 0) {
            return res.status(404).json({ msg: "Not found" });
        }

        res.json(users[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.put('/users/:id', auth, async (req, res) => {
    try {
        const { email, password, name, firstname } = req.body;
        
        if (!email || !password || !name || !firstname) {
            return res.status(400).json({ msg: "Bad parameter" });
        }

        const [users] = await db.execute('SELECT * FROM user WHERE id = ?', [req.params.id]);
        if (users.length === 0) {
            return res.status(404).json({ msg: "Not found" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.execute(
            'UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?',
            [email, hashedPassword, name, firstname, req.params.id]
        );

        const [updatedUser] = await db.execute(
            'SELECT id, email, name, firstname, created_at FROM user WHERE id = ?',
            [req.params.id]
        );
        res.json(updatedUser[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.delete('/users/:id', auth, async (req, res) => {
    try {
        const [result] = await db.execute('DELETE FROM user WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Not found" });
        }
        res.json({ msg: `Successfully deleted record number: ${req.params.id}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;
