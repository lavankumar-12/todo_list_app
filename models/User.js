const db = require('../db/connection');
const bcrypt = require('bcrypt');

const User = {
  create: (username, password, cb) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return cb(err);
      db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], cb);
    });
  },

  findByUsername: (username, cb) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], cb);
  }
};

module.exports = User;
