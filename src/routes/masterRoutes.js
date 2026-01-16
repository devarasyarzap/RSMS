const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

// POST /api/master/polys (Tambah Poli)
router.post('/polys', masterController.createPolyclinic);

// POST /api/master/doctors (Tambah Dokter)
router.post('/doctors', masterController.createDoctorProfile);

// POST /api/master/ward-classes (Tambah Kelas)
router.post('/ward-classes', masterController.createWardClass);

// POST /api/master/beds (Tambah Kasur)
router.post('/beds', masterController.createBed);

// GET /api/master/beds (Lihat Daftar Kasur)
router.get('/beds', masterController.getAllBeds);

module.exports = router;