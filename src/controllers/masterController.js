const { Polyclinic, Doctor, User, WardClass, Bed  } = require('../models/associations');
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

exports.createWardClass = async (req, res) => {
    try {
        const { class_name, price_per_day } = req.body;

        const newClass = await WardClass.create({
            class_name,
            price_per_day
        });

        res.status(201).json({
            message: 'Kelas Kamar berhasil dibuat',
            data: newClass
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Tambah Bed / Kasur
exports.createBed = async (req, res) => {
    try {
        const { bed_number, ward_class_id } = req.body;

        // Cek dulu apakah kelas kamarnya ada?
        const wardClass = await WardClass.findByPk(ward_class_id);
        if (!wardClass) {
            return res.status(404).json({ message: 'ID Kelas Kamar tidak ditemukan' });
        }

        const newBed = await Bed.create({
            bed_number,       // Contoh: "VIP-01"
            ward_class_id,    // ID dari WardClass
            status: 'available'
        });

        res.status(201).json({
            message: 'Bed berhasil ditambahkan',
            data: newBed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Lihat Semua Bed (Opsional, untuk cek data)
exports.getAllBeds = async (req, res) => {
    try {
        const beds = await Bed.findAll({
            include: [{ model: WardClass }] // Supaya terlihat ini bed kelas apa
        });
        res.json(beds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};