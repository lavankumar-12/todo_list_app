const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(session({
  secret: 'todo-secret-key',
  resave: false,
  saveUninitialized: false
}));

// Serve frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
