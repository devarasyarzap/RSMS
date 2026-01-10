const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// GET /api/doctor/queue (Lihat antrean)
router.get('/queue', doctorController.getMyQueue);

// POST /api/doctor/examine (Simpan diagnosa)
router.post('/examine', doctorController.submitExamination);

module.exports = router;