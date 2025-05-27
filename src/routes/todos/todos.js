const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { getAllTodos, getOneTodo, createTodo, updateTodo, deleteTodo } = require('./todos_query');

router.get('/todos', auth, async (req, res) => {
    try {
        const todos = await getAllTodos();
        res.json(todos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.get('/todos/:id', auth, async (req, res) => {
    try {
        const todo = await getOneTodo(req.params.id);
        if (!todo) {
            return res.status(404).json({ msg: "Not found" });
        }
        res.json(todo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.post('/todos', auth, async (req, res) => {
    try {
        const { title, description, due_time, status } = req.body;
        const user_id = req.user.id;

        if (!title || !description || !due_time) {
            return res.status(400).json({ msg: "Bad parameter" });
        }

        const todoStatus = status || "not started";

        const result = await createTodo(title, description, due_time, user_id, todoStatus);
        const newTodo = await getOneTodo(result.insertId);

        res.status(201).json(newTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});


router.put('/todos/:id', auth, async (req, res) => {
    try {
        const { title, description, status } = req.body;
        
        if (!title || !description || !status) {
            return res.status(400).json({ msg: "Bad parameter" });
        }

        const todo = await getOneTodo(req.params.id);
        if (!todo) {
            return res.status(404).json({ msg: "Not found" });
        }

        await updateTodo(req.params.id, title, description, status);
        const updatedTodo = await getOneTodo(req.params.id);
        res.json(updatedTodo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

router.delete('/todos/:id', auth, async (req, res) => {
    try {
        const todo = await getOneTodo(req.params.id);
        if (!todo) {
            return res.status(404).json({ msg: "Not found" });
        }

        await deleteTodo(req.params.id);
        res.json({ msg: `Successfully deleted record number: ${req.params.id}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Internal server error" });
    }
});

module.exports = router;
