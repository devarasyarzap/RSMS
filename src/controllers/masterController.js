const { Polyclinic, Doctor, User } = require('../models/associations');

// 1. Tambah Poliklinik Baru
exports.createPolyclinic = async (req, res) => {
    try {
        const { name, location } = req.body;
        const poli = await Polyclinic.create({ name, location });
        res.status(201).json({ message: 'Poli berhasil dibuat', data: poli });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Tambah Profil Dokter (Menghubungkan User -> Poli)
exports.createDoctorProfile = async (req, res) => {
    try {
        const { user_id, polyclinic_id, sip_number, specialization } = req.body;

        // Cek apakah user ada?
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ message: 'User ID tidak ditemukan' });

        // Buat Profil Dokter
        const newDoctor = await Doctor.create({
            user_id,
            polyclinic_id,
            sip_number,
            specialization
        });

        res.status(201).json({ message: 'Profil Dokter aktif!', data: newDoctor });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};