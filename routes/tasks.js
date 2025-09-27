const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Auth middleware
function authMiddleware(req, res, next) {
  if (!req.session.userId) return res.status(401).send("Not authorized");
  next();
}

// GET all tasks
router.get('/', authMiddleware, (req, res) => {
  Task.getAll(req.session.userId, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// POST create task
router.post('/', authMiddleware, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).send("Task title required");

  Task.create(title, req.session.userId, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).json({ id: result.insertId, title, completed: 0 });
  });
});

// PUT update task
router.put('/:id', authMiddleware, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).send("Task title required");

  Task.update(req.params.id, title, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Task updated");
  });
});

// PUT toggle complete
router.put('/:id/complete', authMiddleware, (req, res) => {
  Task.markComplete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Task toggled complete");
  });
});

// DELETE task
router.delete('/:id', authMiddleware, (req, res) => {
  Task.delete(req.params.id, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Task deleted");
  });
});

module.exports = router;
