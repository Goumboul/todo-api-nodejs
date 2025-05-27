const db = require('../../config/db');

async function getAllTodos() {
    const [todos] = await db.execute(`
        SELECT
            id,
            title,
            description,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            DATE_FORMAT(due_time, '%Y-%m-%d %H:%i:%s') AS due_time,
            user_id,
            status
        FROM todo
    `);
    return todos;
}


async function getOneTodo(id) {
    const [todos] = await db.execute(`
        SELECT
            id,
            title,
            description,
            DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            DATE_FORMAT(due_time, '%Y-%m-%d %H:%i:%s') AS due_time,
            user_id,
            status
        FROM todo
        WHERE id = ?
    `, [id]);
    return todos[0];
}

async function createTodo(title, description, due_time, user_id, status = 'not started') {
    const [result] = await db.execute(
        `INSERT INTO todo (title, description, created_at, due_time, user_id, status)
         VALUES (?, ?, NOW(), ?, ?, ?)`,
        [title, description, due_time, user_id, status]
    );
    return result;
}

async function updateTodo(id, title, description, status) {
    const [result] = await db.execute(
        'UPDATE todo SET title = ?, description = ?, status = ? WHERE id = ?',
        [title, description, status, id]
    );
    return result;
}

async function deleteTodo(id) {
    const [result] = await db.execute('DELETE FROM todo WHERE id = ?', [id]);
    return result;
}

module.exports = {
    getAllTodos,
    getOneTodo,
    createTodo,
    updateTodo,
    deleteTodo
};
