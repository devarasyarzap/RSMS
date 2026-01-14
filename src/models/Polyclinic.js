const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Polyclinic = sequelize.define('Polyclinic', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING 
    }
}, { timestamps: false });

module.exports = Polyclinic;