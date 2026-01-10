require('dotenv').config();

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // 1. Ambil token dari Header (Format: "Bearer <token>")
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Akses ditolak! Token tidak ditemukan.' });
    }

    // Pisahkan kata "Bearer" dan token aslinya
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Format token salah.' });
    }

    try {
        // 2. Verifikasi Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Simpan data user ke dalam object request agar bisa dipakai di controller
        req.user = decoded; 
        
        next(); // Lanjut ke proses berikutnya
    } catch (error) {
        res.status(403).json({ message: 'Token tidak valid atau sudah kadaluwarsa.' });
    }
};