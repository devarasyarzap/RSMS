const { Registration, Patient, MedicalRecord } = require('../models/associations');

// 1. Lihat Antrean Pasien (Khusus Dokter yang Login)
exports.getMyQueue = async (req, res) => {
    try {
        const queue = await Registration.findAll({
            where: { 
                // Di real project, cari doctor_id berdasarkan req.user.id dulu
                status: ['queued', 'processing'] 
            },
            include: [{ model: Patient, attributes: ['full_name', 'medical_record_number'] }],
            order: [['queue_number', 'ASC']]
        });

        res.json({ data: queue });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Simpan Pemeriksaan (Diagnosa) & Selesaikan Kunjungan
exports.submitExamination = async (req, res) => {
    try {
        const { registration_id, diagnosis, symptoms, notes, prescription } = req.body;

        // Cek data registrasi
        const reg = await Registration.findByPk(registration_id);
        if (!reg) return res.status(404).json({ message: 'Data registrasi tidak ditemukan' });

        // Simpan Rekam Medis
        const record = await MedicalRecord.create({
            registration_id,
            diagnosis,
            symptoms,
            notes,
            prescription
        });

        // Update Status Antrean jadi 'completed'
        reg.status = 'completed';
        await reg.save();

        res.status(201).json({ 
            message: 'Pemeriksaan Selesai', 
            data: record 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};