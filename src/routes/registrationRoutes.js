const express = require('express');
const router = express.Router();
const regController = require('../controllers/registrationController');

// Semua route ini harus dilindungi middleware auth
// GET /api/registrations
router.get('/', regController.getAllRegistrations);

// POST /api/registrations (Daftar berobat)
router.post('/', regController.registerVisit);

module.exports = router;