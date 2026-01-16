const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedicalRecord = sequelize.define('MedicalRecord', {
    diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    symptoms: {
        type: DataTypes.TEXT 
    },
    notes: {
        type: DataTypes.TEXT 
    },
    prescription: {
        type: DataTypes.TEXT ,
        allowNull: true
    },
    pharmacy_status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending'
    },    
}, { timestamps: true });

module.exports = MedicalRecord;