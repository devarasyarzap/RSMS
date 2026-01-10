const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

// POST /api/master/polys (Tambah Poli)
router.post('/polys', masterController.createPolyclinic);

// POST /api/master/doctors (Tambah Dokter)
router.post('/doctors', masterController.createDoctorProfile);

module.exports = router;