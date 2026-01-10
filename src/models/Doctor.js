const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Doctor = sequelize.define('Doctor', {
    sip_number: {
        type: DataTypes.STRING,
        unique: true
    },
    specialization: {
        type: DataTypes.STRING // Misal: "Spesialis Bedah"
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, { timestamps: true });

module.exports = Doctor;