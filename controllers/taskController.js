const db = require('../db/connection');

// Get all tasks
const getTasks = (req, res) => {
  db.query('SELECT * FROM tasks ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).send({ error: err.message });
    res.json(results);
  });
};

// Add new task
const addTask = (req, res) => {
  const { title } = req.body;
  if (!title || title.trim() === '') return res.status(400).send({ error: 'Title is required' });

  db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, results) => {
    if (err) return res.status(500).send({ error: err.message });
    res.json({ id: results.insertId, title, completed: 0 });
  });
};

// Update task (can update title and/or completed)
const updateTask = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  // if neither provided
  if (typeof title === 'undefined' && typeof completed === 'undefined') {
    return res.status(400).send({ error: 'Nothing to update. Provide title and/or completed.' });
  }

  const fields = [];
  const params = [];
  if (typeof title !== 'undefined') {
    fields.push('title = ?');
    params.push(title);
  }
  if (typeof completed !== 'undefined') {
    // ensure stored as 0/1
    fields.push('completed = ?');
    params.push(completed ? 1 : 0);
  }

  const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
  params.push(id);

  db.query(sql, params, (err) => {
    if (err) return res.status(500).send({ error: err.message });

    // Return updated row
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err2, rows) => {
      if (err2) return res.status(500).send({ error: err2.message });
      res.json(rows[0]);
    });
  });
};

// Delete task
const deleteTask = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send({ error: err.message });
    res.json({ id });
  });
};

// Toggle completed on/off (PATCH /:id/complete)
const toggleComplete = (req, res) => {
  const { id } = req.params;
  // Toggle boolean using NOT (works with TINYINT(1) 0/1)
  db.query('UPDATE tasks SET completed = NOT completed WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send({ error: err.message });

    // Return the new value
    db.query('SELECT id, title, completed FROM tasks WHERE id = ?', [id], (err2, rows) => {
      if (err2) return res.status(500).send({ error: err2.message });
      res.json(rows[0]);
    });
  });
};

module.exports = { getTasks, addTask, updateTask, deleteTask, toggleComplete };
