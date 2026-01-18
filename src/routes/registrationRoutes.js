const express = require('express');
const router = express.Router();
const regController = require('../controllers/registrationController');

// GET /api/registrations
router.get('/', regController.getAllRegistrations);

router.get('/self', regController.getAllRegistrations);

// POST /api/registrations (Daftar berobat)
router.post('/', regController.registerVisit);

router.post('/self', regController.createSelfRegistration);

module.exports = router;