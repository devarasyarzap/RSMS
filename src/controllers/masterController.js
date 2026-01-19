const {
  Polyclinic,
  Doctor,
  User,
  WardClass,
  Bed,
  MedicalRecord,
} = require("../models/associations");
const bcrypt = require('bcryptjs'); // Pastikan import ini ada di paling atas file

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMedical = async (req, res) => {
  try {
    const medical = await MedicalRecord.findAll();
    res.status(200).json({ status: "success", data: medical });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWards = async (req, res) => {
  try {
    const wards = await WardClass.findAll();
    res.status(200).json({ status: "success", data: wards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 1. Tambah Poliklinik Baru
exports.createPolyclinic = async (req, res) => {
  try {
    const { name, location } = req.body;
    const poli = await Polyclinic.create({ name, location });
    res.status(201).json({ message: "Poli berhasil dibuat", data: poli });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Ambil Semua Poli (Untuk Dropdown Pendaftaran)
exports.getAllPolyclinics = async (req, res) => {
  try {
    const polyclinics = await Polyclinic.findAll({
      attributes: ["id", "name", "location"],
    });

    res.json({
      status: "success",
      data: polyclinics,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Ambil Detail Poli (Beserta Siapa Dokternya)
exports.getPolyclinicDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const poly = await Polyclinic.findByPk(id, {
      include: [
        {
          model: Doctor,
          attributes: ["id", "name", "specialization", "schedule"], // Tampilkan dokter di poli ini
        },
      ],
    });

    if (!poly) {
      return res.status(404).json({ message: "Poliklinik tidak ditemukan" });
    }

    res.json({
      status: "success",
      data: poly,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Tambah Profil Dokter (Menghubungkan User -> Poli)
exports.createDoctorProfile = async (req, res) => {
  try {
    const { user_id, polyclinic_id, sip_number, specialization } = req.body;

    // Cek apakah user ada?
    const user = await User.findByPk(user_id);
    if (!user)
      return res.status(404).json({ message: "User ID tidak ditemukan" });

    // Buat Profil Dokter
    const newDoctor = await Doctor.create({
      user_id,
      polyclinic_id,
      sip_number,
      specialization,
    });

    res.status(201).json({ message: "Profil Dokter aktif!", data: newDoctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Ambil Semua Dokter (Beserta Nama Polinya)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll({
      include: [
        {
          model: Polyclinic,
          attributes: ["name"],
        },
        {
          model: User,
          attributes: ["full_name"],
        },
      ],
      attributes: ["id", "sip_number", "specialization", "is_available"], // Field yang ada di model Doctor
    });

    // Format ulang data sedikit agar lebih rapi
    const formattedData = doctors.map((doc) => ({
      id: doc.id,
      name: doc.User ? doc.User.full_name : "Tidak Ada Nama",
      sip_number: doc.sip_number,
      specialization: doc.specialization,
      polyclinic: doc.Polyclinic ? doc.Polyclinic.name : "Tidak Ada Poli",
      is_available: doc.is_available,
    }));
    res.json({
      status: "success",
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findByPk(id, {
      include: [{ model: Polyclinic, attributes: ["name"] }],
    });

    if (!doctor) {
      return res.status(404).json({ message: "Dokter tidak ditemukan" });
    }

    res.json({
      status: "success",
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. buat kelas kamar
exports.createWardClass = async (req, res) => {
  try {
    const { class_name, price_per_day } = req.body;

    const newClass = await WardClass.create({
      class_name,
      price_per_day,
    });

    res.status(201).json({
      message: "Kelas Kamar berhasil dibuat",
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Tambah Bed / Kasur
exports.createBed = async (req, res) => {
  try {
    const { bed_number, ward_class_id } = req.body;

    // Cek dulu apakah kelas kamarnya ada?
    const wardClass = await WardClass.findByPk(ward_class_id);
    if (!wardClass) {
      return res
        .status(404)
        .json({ message: "ID Kelas Kamar tidak ditemukan" });
    }

    const newBed = await Bed.create({
      bed_number, // Contoh: "VIP-01"
      ward_class_id, // ID dari WardClass
      status: "available",
    });

    res.status(201).json({
      message: "Bed berhasil ditambahkan",
      data: newBed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. Lihat Semua Bed
exports.getAllBeds = async (req, res) => {
  try {
    const beds = await Bed.findAll({
      include: [{ model: WardClass }],
    });
    res.json(beds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePolyclinic = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const poli = await Polyclinic.findByPk(id);
    if (!poli) return res.status(404).json({ message: "Poliklinik tidak ditemukan" });

    await poli.update({ name, location });

    res.json({ message: "Data Poliklinik berhasil diupdate", data: poli });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. Edit Data Dokter (Misal ganti jadwal atau spesialisasi)
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const { sip_number, specialization, is_available, schedule } = req.body;

    const doctor = await Doctor.findByPk(id);
    if (!doctor) return res.status(404).json({ message: "Dokter tidak ditemukan" });

    await doctor.update({ 
        sip_number, 
        specialization, 
        is_available,
        user_id
    });

    res.json({ message: "Data Dokter berhasil diupdate", data: doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 11. Edit Kelas Kamar (Misal harga naik)
exports.updateWardClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_name, price_per_day } = req.body;

    const ward = await WardClass.findByPk(id);
    if (!ward) return res.status(404).json({ message: "Kelas Kamar tidak ditemukan" });

    await ward.update({ class_name, price_per_day });

    res.json({ message: "Data Kelas Kamar berhasil diupdate", data: ward });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 12. Edit Status/Nomor Bed
exports.updateBed = async (req, res) => {
  try {
    const { id } = req.params;
    const { bed_number, status } = req.body; // status: 'available', 'occupied', 'maintenance'

    const bed = await Bed.findByPk(id);
    if (!bed) return res.status(404).json({ message: "Bed tidak ditemukan" });

    await bed.update({ bed_number, status });

    res.json({ message: "Data Bed berhasil diupdate", data: bed });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 13. Ambil Semua Data Kasir
exports.getAllCashiers = async (req, res) => {
  try {
    const cashiers = await User.findAll({
      where: { role: 'kasir' }, // Atau 'cashier' jika Anda membedakan rolenya
      attributes: ['id', 'username', 'email', 'full_name', 'role', 'is_active']
    });
    res.json({ status: "success", data: cashiers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 14. Ambil Semua Data Apoteker
exports.getAllPharmacists = async (req, res) => {
  try {
  
    const pharmacists = await User.findAll({
      where: { role: 'apoteker' }, 
      attributes: ['id', 'username', 'email', 'full_name', 'role', 'is_active']
    });
    res.json({ status: "success", data: pharmacists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 15. Tambah User Staff Baru (Kasir/Apoteker) Manual oleh Admin
// (Alternatif jika tidak ingin lewat menu Register biasa)

exports.createStaffUser = async (req, res) => {
  try {
    const { username, email, password, full_name, role } = req.body;

    // Validasi role agar hanya bisa buat staff
    if (!['kasir', 'apoteker'].includes(role)) {
        return res.status(400).json({ message: "Role harus kasir atau apoteker" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        full_name,
        role: role,
        is_active: true
    });

    res.status(201).json({ 
        message: `User ${role} berhasil dibuat`, 
        data: { id: newUser.id, username: newUser.username, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 16. Edit User (Bisa dipakai untuk edit profil Kasir/Apoteker/Admin)
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, is_active } = req.body;

        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        await user.update({ full_name, email, is_active });

        res.json({ message: "Data User berhasil diupdate", data: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};