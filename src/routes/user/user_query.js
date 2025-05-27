const pool = require('../../config/db');

const getUserById = (id) => {
    return pool.query(
        'SELECT id, email, password, name, firstname, created_at FROM user WHERE id = ?',
        [id]
    ).then(([rows]) => {
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        return rows[0];
    });
};

const getUserByEmail = (email) => {
    return pool.query(
        'SELECT id, email, password, name, firstname, created_at FROM user WHERE email = ?',
        [email]
    ).then(([rows]) => {
        if (rows.length === 0) {
            throw new Error('User not found');
        }
        return rows[0];
    });
};

const getUserTodos = (userId) => {
    return pool.query(
        'SELECT * FROM todo WHERE user_id = ?',
        [userId]
    ).then(([rows]) => {
        return rows;
    });
};

const updateUser = (id, userData) => {
    const { email, password, name, firstname } = userData;

    return pool.query(
        'UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?',
        [email, password, name, firstname, id]
    ).then(() => {
        return getUserById(id);
    });
};

const deleteUser = (id) => {
    return pool.query(
        'DELETE FROM user WHERE id = ?',
        [id]
    ).then(([result]) => {
        if (result.affectedRows === 0) {
            throw new Error('User not found');
        }
        return { id };
    });
};
module.exports = {
    getUserById,
    getUserByEmail,
    getUserTodos,
    updateUser,
    deleteUser
};
