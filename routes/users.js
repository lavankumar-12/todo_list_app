const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Register
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Username & password required");

  User.findByUsername(username, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).send("Username already exists");

    User.create(username, password, (err, result) => {
      if (err) return res.status(500).send(err);
      req.session.userId = result.insertId;
      res.send("Registered successfully");
    });
  });
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Username & password required");

  User.findByUsername(username, (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(400).send("User not found");

    const user = results[0];
    bcrypt.compare(password, user.password, (err, same) => {
      if (err) return res.status(500).send(err);
      if (!same) return res.status(400).send("Incorrect password");

      req.session.userId = user.id;
      res.send("Login successful");
    });
  });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.send("Logged out");
});

module.exports = router;
