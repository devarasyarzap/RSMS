const { Registration, Patient, Doctor, Polyclinic, User } = require('../models/associations');

exports.registerVisit = async (req, res) => {
    try {
        const { patient_id, doctor_id, complaint } = req.body;

        // 1. Validasi Data
        const doctor = await Doctor.findByPk(doctor_id);
        if (!doctor) return res.status(404).json({ message: 'Dokter tidak ditemukan' });

        // 2. Hitung Nomor Antrean untuk Dokter tersebut HARI INI
        const countToday = await Registration.count({ where: { doctor_id } });
        const newQueueNumber = countToday + 1;

        // 3. Generate No Registrasi Unik
        const regNumber = `REG-${Date.now()}`;

        // 4. Simpan ke Database
        const newReg = await Registration.create({
            registration_number: regNumber,
            patient_id,
            doctor_id,
            polyclinic_id: doctor.polyclinic_id, 
            complaint,
            queue_number: newQueueNumber,
            status: 'queued'
        });

        res.status(201).json({
            message: 'Pendaftaran Berhasil',
            data: {
                registration_number: regNumber,
                queue_number: newQueueNumber, 
                doctor_id: doctor_id
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fitur Tambahan: Lihat History Kunjungan
exports.getAllRegistrations = async (req, res) => {
    try {
        const data = await Registration.findAll({
            include: [ // JOIN TABLE
                { model: Patient, attributes: ['full_name', 'medical_record_number'] },
                { 
                    model: Doctor, 
                    include: [{ model: User, attributes: ['full_name'] }] // Ambil nama dokter dari tabel User
                },
                { model: Polyclinic, attributes: ['name'] }
            ]
        });
        res.json({ data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};