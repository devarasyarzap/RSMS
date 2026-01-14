const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicine = sequelize.define('Medicine', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    price: {
        type: DataTypes.INTEGER, 
        defaultValue: 0
    },
    unit: {
        type: DataTypes.STRING 
    }
}, { timestamps: true });

module.exports = Medicine;