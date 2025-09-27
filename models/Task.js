const db = require('../db/connection');

const Task = {
  getAll: (userId, cb) => {
    db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], cb);
  },

  create: (title, userId, cb) => {
    db.query('INSERT INTO tasks (title, user_id) VALUES (?, ?)', [title, userId], cb);
  },

  update: (id, title, cb) => {
    db.query('UPDATE tasks SET title = ? WHERE id = ?', [title, id], cb);
  },

  markComplete: (id, cb) => {
    db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id], cb);
  },

  delete: (id, cb) => {
    db.query('DELETE FROM tasks WHERE id = ?', [id], cb);
  }
};

module.exports = Task;
