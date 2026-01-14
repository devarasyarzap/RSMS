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
        type: DataTypes.TEXT 
    }
}, { timestamps: true });

module.exports = MedicalRecord;