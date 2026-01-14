const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WardClass = sequelize.define('WardClass', {
    class_name: {
        type: DataTypes.STRING, 
        allowNull: false
    },
    price_per_day: {
        type: DataTypes.INTEGER, 
        allowNull: false
    }
}, { timestamps: false });

module.exports = WardClass;