const {
  Polyclinic,
  Doctor,
  User,
  WardClass,
  Bed,
} = require("../models/associations");

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
