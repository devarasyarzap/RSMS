const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Billing = sequelize.define('Billing', {
    invoice_number: {
        type: DataTypes.STRING,
        unique: true // Contoh: INV-20231027-001
    },
    total_amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'paid'),
        defaultValue: 'pending'
    },
    payment_method: {
        type: DataTypes.STRING, // Cash, Transfer, BPJS, dll
        allowNull: true
    }
}, { timestamps: true });

module.exports = Billing;