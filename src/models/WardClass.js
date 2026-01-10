const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WardClass = sequelize.define('WardClass', {
    class_name: {
        type: DataTypes.STRING, // Contoh: "VIP", "Kelas 1", "ICU"
        allowNull: false
    },
    price_per_day: {
        type: DataTypes.INTEGER, // Contoh: 500000
        allowNull: false
    }
}, { timestamps: false });

module.exports = WardClass;