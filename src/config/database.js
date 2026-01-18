const { Sequelize } = require('sequelize');
require('dotenv').config();

// Deteksi apakah ada DATABASE_URL dari Railway?
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // PENTING: Supaya tidak error certificate di Railway
            }
        },
        logging: false // Matikan log query biar console bersih
      })
    : new Sequelize(
        process.env.DB_NAME, 
        process.env.DB_USER, 
        process.env.DB_PASS, 
        {
            host: process.env.DB_HOST,
            dialect: 'postgres',
            logging: false
        }
      );

module.exports = sequelize;