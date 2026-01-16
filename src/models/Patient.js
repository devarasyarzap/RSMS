const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Sesuaikan path config Anda

const Patient = sequelize.define('Patient', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nik: {
        type: DataTypes.STRING,
        unique: true
    },
    phone: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.TEXT
    },
    gender: {
        type: DataTypes.ENUM('L', 'P')
    },
    date_of_birth: {
        type: DataTypes.DATEONLY
    }
}, { 
    timestamps: true 
});

module.exports = Patient;