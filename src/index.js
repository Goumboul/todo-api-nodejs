require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');

const app = express();

app.use(express.json());

db.getConnection()
  .then(connection => {
    console.log('MySQL connection successful');
    connection.release();
  })
  .catch(err => {
    console.error('MySQL connection error:', err);
    process.exit(1);
  });
const notFound = require('./middleware/notFound');

const authRoutes = require('./routes/auth/auth');
const userRoutes = require('./routes/user/user');
const todosRoutes = require('./routes/todos/todos');

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', userRoutes);
app.use('/', todosRoutes);

app.use(notFound);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ msg: "Internal server error" });
});

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
