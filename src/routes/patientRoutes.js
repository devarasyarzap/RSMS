const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// URL: http://localhost:3000/api/patients
router.get('/', patientController.getAllPatients);
router.post('/', patientController.createPatient);

module.exports = router;