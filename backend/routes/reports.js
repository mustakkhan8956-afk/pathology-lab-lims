const express = require('express');
const router = express.Router();
const { db } = require('../server');

// GET all reports
router.get('/', (req, res) => {
  db.all('SELECT * FROM reports ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET reports by patient
router.get('/patient/:patient_id', (req, res) => {
  const { patient_id } = req.params;
  db.all(
    'SELECT * FROM reports WHERE patient_id = ? ORDER BY created_at DESC',
    [patient_id],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// GET single report
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM reports WHERE report_id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }
    res.json(row);
  });
});

// POST - Create new report
router.post('/', (req, res) => {
  const { patient_id, test_type, test_name, results, normal_range, doctor_notes } = req.body;
  const report_id = 'R-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  if (!patient_id || !test_type || !test_name) {
    res.status(400).json({ error: 'Patient ID, Test Type, and Test Name are required' });
    return;
  }

  db.run(
    'INSERT INTO reports (report_id, patient_id, test_type, test_name, results, normal_range, doctor_notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [report_id, patient_id, test_type, test_name, results, normal_range, doctor_notes],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        success: true,
        message: 'Report created successfully! ✅',
        report_id: report_id,
        data: { id: this.lastID, report_id, patient_id, test_type, test_name, results, normal_range }
      });
    }
  );
});

// PUT - Update report
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { test_type, test_name, results, normal_range, status, doctor_notes } = req.body;

  db.run(
    'UPDATE reports SET test_type=?, test_name=?, results=?, normal_range=?, status=?, doctor_notes=? WHERE report_id=?',
    [test_type, test_name, results, normal_range, status, doctor_notes, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true, message: 'Report updated successfully! ✅' });
    }
  );
});

// DELETE report
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM reports WHERE report_id=?', [id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ success: true, message: 'Report deleted successfully! ✅' });
  });
});

module.exports = router;
