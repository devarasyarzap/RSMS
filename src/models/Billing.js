const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Billing = sequelize.define('Billing', {
    invoice_number: {
        type: DataTypes.STRING,
        unique: true 
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
        type: DataTypes.STRING,
        allowNull: true
    }
}, { timestamps: true });

module.exports = Billing;