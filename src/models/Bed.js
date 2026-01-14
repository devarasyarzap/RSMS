const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bed = sequelize.define('Bed', {
    bed_number: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('available', 'occupied', 'maintenance'),
        defaultValue: 'available'
    }
}, { timestamps: true });

module.exports = Bed;