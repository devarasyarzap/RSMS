const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

// ==========================================
// 1. MANAJEMEN USER & STAFF (Admin, Kasir, Apoteker)
// ==========================================
// Lihat semua user
router.get('/users', masterController.getAllUsers);
// Edit User (Aktif/Nonaktif, Ganti Nama)
router.put('/users/:id', masterController.updateUser); 

// Khusus Staff (Kasir & Apoteker)
router.post('/staff', masterController.createStaffUser); // Buat Staff Baru
router.get('/cashiers', masterController.getAllCashiers); // Lihat Kasir
router.get('/pharmacists', masterController.getAllPharmacists); // Lihat Apoteker

// ==========================================
// 2. MANAJEMEN POLIKLINIK
// ==========================================
router.post('/polys', masterController.createPolyclinic);
router.get('/polys', masterController.getAllPolyclinics);
// PERBAIKAN: Tambahkan '/' sebelum ':id'
router.get('/polys/:id', masterController.getPolyclinicDetail);
router.put('/polys/:id', masterController.updatePolyclinic); // Edit Poli

// ==========================================
// 3. MANAJEMEN DOKTER
// ==========================================
router.post('/doctors', masterController.createDoctorProfile);
router.get('/doctors', masterController.getAllDoctors);
// PERBAIKAN: Tambahkan '/' sebelum ':id'
router.get('/doctors/:id', masterController.getDoctorById); 
router.put('/doctors/:id', masterController.updateDoctor); // Edit Dokter

// ==========================================
// 4. MANAJEMEN KAMAR & KASUR (Rawat Inap)
// ==========================================
// Kelas Kamar (Ward Class)
router.get('/ward-classes', masterController.getWards);
router.post('/ward-classes', masterController.createWardClass);
router.put('/ward-classes/:id', masterController.updateWardClass); // Edit Kelas

// Kasur (Bed)
router.post('/beds', masterController.createBed);
router.get('/beds', masterController.getAllBeds);
router.put('/beds/:id', masterController.updateBed); // Edit Kasur

module.exports = router;