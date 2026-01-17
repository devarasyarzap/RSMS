const { Op } = require("sequelize");
const { Patient, User } = require("../models/associations");

// 1. Ambil Semua Data Pasien (Untuk Admin/Staff)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll({
      include: [
        {
          model: User,
          attributes: ["email"], // Tampilkan email jika dia punya akun online
        },
      ],
      order: [["createdAt", "DESC"]], // Urutkan dari yang terbaru
    });
    res.status(200).json({ status: "success", data: patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Tambah Pasien Manual (Oleh Admin/Resepsionis di Meja Depan)
exports.createPatientOffline = async (req, res) => {
  try {
    // Sesuaikan nama field dengan model Anda
    const {
      nik,
      name,
      date_of_birth,
      gender,
      address,
      phone,
      user_id = null,
    } = req.body;

    // Cek duplikasi NIK
    const existingPatient = await Patient.findOne({ where: { nik } });
    if (existingPatient) {
      return res
        .status(400)
        .json({ message: "Pasien dengan NIK ini sudah terdaftar" });
    }

    // Generate No RM (Logic sederhana)
    const count = await Patient.count();
    const rmNumber = `RM-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, "0")}`;

    const newPatient = await Patient.create({
      user_id, // Null karena ini daftar offline (belum punya akun login)
      medical_record_number: rmNumber, // Pastikan kolom ini ada di Model Patient Anda
      nik,
      name, // Pastikan di model namanya 'name' atau 'full_name' (sesuaikan)
      date_of_birth,
      gender,
      address,
      phone,
    });

    res.status(201).json({
      status: "success",
      message: "Pasien Offline berhasil didaftarkan",
      data: newPatient,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 3. Cari Pasien (Penting untuk Pendaftaran)
exports.searchPatient = async (req, res) => {
  try {
    const { keyword } = req.query;

    // Jika tidak ada keyword, kembalikan error atau array kosong
    if (!keyword) {
      return res
        .status(400)
        .json({ message: "Mohon masukkan keyword pencarian" });
    }

    const patients = await Patient.findAll({
      where: {
        // Mencari kemiripan (LIKE) di Nama ATAU NIK
        [Op.or]: [
          { name: { [Op.iLike]: `%${keyword}%` } }, // iLike = Case Insensitive (Postgres)
          { nik: { [Op.like]: `%${keyword}%` } },
        ],
      },
    });

    res.json({
      status: "success",
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
