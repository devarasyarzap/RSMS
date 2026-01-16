const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

// GET /api/pharmacy/medicines (Cek Stok)
router.get('/medicines', pharmacyController.getAllMedicines);

// POST /api/pharmacy/medicines (Tambah Stok Awal)
router.post('/medicines', pharmacyController.addMedicine);

// GET /api/pharmacy/queue (Melihat Inbox Resep)
router.get('/queue', pharmacyController.getPrescriptionQueue);

// POST /api/pharmacy/dispense (Keluarkan Obat untuk Pasien)
router.post('/dispense', pharmacyController.dispenseMedicine);

module.exports = router;