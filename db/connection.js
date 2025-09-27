const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // your MySQL username
  password: '9885',        // your MySQL password
  database: 'todo_app' // make sure this DB exists
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = connection;
