const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

router.get('/users', masterController.getAllUsers);

// POST /api/master/polys (Tambah Poli)
router.post('/polys', masterController.createPolyclinic);

// GET /api/master/polys  (Ambil Semua)
router.get('/polys', masterController.getAllPolyclinics);

// GET /api/master/polys:id (Ambil Satu + Dokter)
router.get('/polys:id', masterController.getPolyclinicDetail);

// POST /api/master/doctors (Tambah Dokter)
router.post('/doctors', masterController.createDoctorProfile);

// GET /api/master/doctors (Lihat semua dokter)
router.get('/doctors', masterController.getAllDoctors);

// GET /api/master/doctors:id (Lihat detail 1 dokter)
router.get('/doctors:id', masterController.getDoctorById);

router.get('/ward-classes', masterController.getWards);

// POST /api/master/ward-classes (Tambah Kelas)
router.post('/ward-classes', masterController.createWardClass);

// POST /api/master/beds (Tambah Kasur)
router.post('/beds', masterController.createBed);

// GET /api/master/beds (Lihat Daftar Kasur)
router.get('/beds', masterController.getAllBeds);

module.exports = router;