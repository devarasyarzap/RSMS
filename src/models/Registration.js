const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registration = sequelize.define('Registration', {
    registration_number: {
        type: DataTypes.STRING, 
        unique: true // Misal: "REG-20231027-001"
    },
    complaint: {
        type: DataTypes.TEXT // Keluhan awal pasien
    },
    status: {
        type: DataTypes.ENUM('queued', 'processing', 'completed', 'cancelled'),
        defaultValue: 'queued'
    },
    queue_number: {
        type: DataTypes.INTEGER // Urutan antrean (1, 2, 3...)
    }
}, { timestamps: true });

module.exports = Registration;