require('dotenv').config()
// Import necessary modules
const express = require('express');
const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

// Create an Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Define a route to fetch data from MySQL
app.get('/users', (req, res) => {
  // Use the connection pool to execute a query
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json(results);
  });
});

// Define a route to add a new user to MySQL
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  // Use the connection pool to execute an INSERT query
  pool.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (error, results) => {
    if (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ message: 'User added successfully', userId: results.insertId });
  });
});

// Define a route for the home page to display data from the database
app.get('/', (req, res) => {
  // Use the connection pool to execute a query
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      return res.status(500).send('Internal Server Error');
    }

    // Render a simple HTML page with the user data
    const userListHTML = results.map(user => `<li>${user.name} - ${user.email}</li>`).join('');
    const html = `<h1>User List</h1><ul>${userListHTML}</ul>`;

    res.send(html);
  });
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
