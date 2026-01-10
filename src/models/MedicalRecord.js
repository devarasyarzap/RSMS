const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    symptoms: {
        type: DataTypes.TEXT // Gejala yang dirasakan
    },
    notes: {
        type: DataTypes.TEXT // Catatan tambahan dokter
    },
    prescription: {
        type: DataTypes.TEXT // Resep obat (nanti bisa kita upgrade jadi tabel terpisah)
    }
}, { timestamps: true });

module.exports = MedicalRecord;