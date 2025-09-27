const bcrypt = require('bcrypt');
const User = require('../models/User');

const register = (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("All fields required");

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send(err);

    User.create(username, hashedPassword, (err) => {
      if (err) return res.status(400).send("User already exists");
      res.status(201).send("User registered successfully");
    });
  });
};

const login = (req, res) => {
  const { username, password } = req.body;
  User.findByUsername(username, (err, results) => {
    if (err || results.length === 0) return res.status(400).send("Invalid credentials");

    const user = results[0];
    bcrypt.compare(password, user.password, (err, match) => {
      if (!match) return res.status(400).send("Invalid credentials");

      req.session.userId = user.id;
      res.status(200).send("Login successful");
    });
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.status(200).send("Logged out successfully");
};

module.exports = { register, login, logout };
