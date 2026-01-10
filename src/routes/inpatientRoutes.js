const express = require('express');
const router = express.Router();
const inpatientController = require('../controllers/inpatientController');

// POST /api/inpatient/admit (Pasien Masuk / Check-In)
router.post('/admit', inpatientController.admitPatient);

// POST /api/inpatient/discharge (Pasien Pulang / Check-Out)
router.post('/discharge', inpatientController.dischargePatient);

module.exports = router;