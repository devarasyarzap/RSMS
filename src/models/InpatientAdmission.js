const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InpatientAdmission = sequelize.define('InpatientAdmission', {
    admission_number: {
        type: DataTypes.STRING, 
        unique: true
    },
    check_in_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    check_out_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'discharged'),
        defaultValue: 'active'
    },
    initial_diagnosis: {
        type: DataTypes.TEXT
    }
}, { timestamps: true });

module.exports = InpatientAdmission;