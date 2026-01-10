const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,     // Nama Database
    process.env.DB_USER,     // Username (biasanya 'postgres')
    process.env.DB_PASS,     // Password DB
    {
        host: process.env.DB_HOST, // 'localhost'
        dialect: 'postgres',
        logging: false,      // Matikan log SQL di console agar bersih
    }
);

module.exports = sequelize;