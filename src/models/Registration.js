const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Registration = sequelize.define('Registration', {
    registration_number: {
        type: DataTypes.STRING, 
        unique: true 
    },
    complaint: {
        type: DataTypes.TEXT 
    },
    status: {
        type: DataTypes.ENUM('queued', 'processing', 'completed', 'cancelled'),
        defaultValue: 'queued'
    },
    queue_number: {
        type: DataTypes.INTEGER 
    }
}, { timestamps: true });

module.exports = Registration;