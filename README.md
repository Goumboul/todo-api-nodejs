# 📌 API TODO

A RESTful API built with **Node.js**, **Express**, and **MySQL** that allows users to manage tasks (Todos) with secure authentication.

---

## ✨ Features

- ✅ User authentication using JWT
- 📝 CRUD operations for users and todos
- 🔒 Protected routes with token validation
- 🗃️ MySQL database integration
- 🗓️ Date formatting and structured error handling

---

## 🛠️ Technologies

| Stack              | Description                     |
|--------------------|---------------------------------|
| Node.js            | JavaScript runtime environment  |
| Express.js         | Web framework for Node.js       |
| MySQL              | Relational database             |
| JWT (jsonwebtoken) | Secure token-based auth         |

---


## 📬 API Endpoints

### 🔑 Auth Routes

| Method | Route      | Description          |
|--------|------------|----------------------|
| POST   | /register  | Create a new user    |
| POST   | /login     | Log in and get a token |

### 👤 User Routes

| Method | Route      | Description           |
|--------|------------|-----------------------|
| GET    | /user/:id  | Get a specific user by ID |
| GET    | /user      | Get all users         |
| PUT    | /user/:id  | Update a user's information |
| DELETE | /user/:id  | Delete a user         |

### ✅ Todo Routes

| Method | Route       | Description           |
|--------|-------------|-----------------------|
| GET    | /todos      | Get all todos (protected) |
| GET    | /todos/:id  | Get a specific todo   |
| POST   | /todos      | Create a new todo     |
| PUT    | /todos/:id  | Update a todo         |
| DELETE | /todos/:id  | Delete a todo         |
