const db = require('../database');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  const params = [name, email, hashedPassword];

  db.run(sql, params, function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'User registered', id: this.lastID });
  });
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (user && await bcrypt.compare(password, user.password)) {
      res.json({ message: 'Login successful', user: { id: user.id, name: user.name } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
};
