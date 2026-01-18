const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/data', patientController.getAllPatients);

router.post('/create', patientController.createPatientOffline);

router.get('/search', patientController.searchPatient);

module.exports = router;