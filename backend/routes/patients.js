const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server');

// GET all patients
router.get('/', (req, res) => {
  db.all('SELECT * FROM patients ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET patient by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM patients WHERE patient_id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    res.json(row);
  });
});

// POST - Register new patient
router.post('/', (req, res) => {
  const { name, age, gender, contact, email, address } = req.body;
  const patient_id = 'P-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  if (!name) {
    res.status(400).json({ error: 'Patient name is required' });
    return;
  }

  db.run(
    'INSERT INTO patients (patient_id, name, age, gender, contact, email, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [patient_id, name, age, gender, contact, email, address],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        success: true, 
        message: 'Patient registered successfully! ✅',
        patient_id: patient_id,
        data: { id: this.lastID, patient_id, name, age, gender, contact, email, address }
      });
    }
  );
});

// PUT - Update patient
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, gender, contact, email, address } = req.body;

  db.run(
    'UPDATE patients SET name=?, age=?, gender=?, contact=?, email=?, address=? WHERE patient_id=?',
    [name, age, gender, contact, email, address, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, message: 'Patient updated successfully! ✅' });
    }
  );
});

// DELETE patient
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM patients WHERE patient_id=?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Patient deleted successfully! ✅' });
  });
});

module.exports = router;
