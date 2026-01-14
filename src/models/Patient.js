const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
    medical_record_number: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    nik: {
        type: DataTypes.STRING,
        unique: true
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('M', 'F')
    },
    address: {
        type: DataTypes.TEXT
    },
    phone_number: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'patients', 
    timestamps: true       
});

module.exports = Patient;