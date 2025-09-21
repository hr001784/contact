const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

const validatePhone = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Routes

// Add a new contact
app.post('/api/contacts', (req, res) => {
  const { name, email, phone } = req.body;

  // Validation
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!validatePhone(phone)) {
    return res.status(400).json({ error: 'Phone must be 10 digits' });
  }

  const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
  
  db.run(sql, [name, email, phone], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to add contact' });
    }
    
    res.status(201).json({
      id: this.lastID,
      name,
      email,
      phone
    });
  });
});

// Get contacts with pagination
app.get('/api/contacts', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Get total count
  db.get('SELECT COUNT(*) as total FROM contacts', (err, countResult) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch contacts' });
    }

    const total = countResult.total;
    const totalPages = Math.ceil(total / limit);

    // Get contacts for current page
    const sql = 'SELECT * FROM contacts ORDER BY created_at DESC LIMIT ? OFFSET ?';
    
    db.all(sql, [limit, offset], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to fetch contacts' });
      }

      res.json({
        contacts: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalContacts: total,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      });
    });
  });
});

// Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid contact ID' });
  }

  const sql = 'DELETE FROM contacts WHERE id = ?';
  
  db.run(sql, [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete contact' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(204).send();
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
