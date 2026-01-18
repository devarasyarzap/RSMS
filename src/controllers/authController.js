require("dotenv").config();

const { User, Patient } = require("../models/associations");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 1. Register User Baru
exports.register = async (req, res) => {
  try {
    const { username, password, role, full_name, email } = req.body;

    // Cek username
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    // Enkripsi Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan ke Database
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      full_name,
    });

    res.status(201).json({
      message: "User berhasil dibuat",
      data: { username: newUser.username, role: newUser.role },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Login (Mendapatkan Token)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari User
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }

    // Cek Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Username atau Password salah" });
    }
    console.log("SECRET KEY SAYA:", process.env.JWT_SECRET);
    // Buat Token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      message: "Login berhasil",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. pendafatran mandiri
exports.registerPatientSelf = async (req, res) => {
  try {
    const { email, password, name, nik, phone, address, gender, dob } =
      req.body;

    // 1. Cek apakah email sudah ada?
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    // 2. Buat Akun Login (User)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "pasien",
    });

    // 3. Buat Data Medis (Patient) yg terhubung ke User tadi
    const newPatient = await Patient.create({
      user_id: newUser.id,
      name,
      nik,
      phone,
      address,
      gender,
      date_of_birth: dob,
    });

    res.status(201).json({
      message: "Registrasi Berhasil! Silakan Login.",
      data: {
        user_id: newUser.id,
        patient_name: newPatient.name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
