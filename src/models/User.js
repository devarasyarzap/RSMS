const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    password: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('admin', 'dokter', 'apoteker', 'kasir', 'pasien'),
        defaultValue: 'pasien'
    },
    full_name: {
        type: DataTypes.STRING
    }
}, 
{
    timestamps: true
});

module.exports = User;