const Patient = require('../models/Patient');

// 1. Ambil Semua Data Pasien
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.findAll();
        res.status(200).json({ status: 'success', data: patients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Tambah Pasien Baru
exports.createPatient = async (req, res) => {
    try {
        // Ambil data dari input user (body)
        const { nik, full_name, birth_date, gender, address, phone_number } = req.body;

        const count = await Patient.count();
        const rmNumber = `RM-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const newPatient = await Patient.create({
            medical_record_number: rmNumber,
            nik, full_name, birth_date, gender, address, phone_number
        });

        res.status(201).json({ 
            status: 'success', 
            message: 'Pasien berhasil didaftarkan',
            data: newPatient 
        });

    } catch (error) {
        res.status(400).json({ message: 'Gagal mendaftar: ' + error.message });
    }
};