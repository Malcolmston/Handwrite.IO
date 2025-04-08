const { Sequelize } = require('sequelize');

require('dotenv').config();

// Environment variables
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const DB_PORT = process.env.DB_PORT || 5432; // Default Postgres port

// Configure Sequelize with critical logs only
const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: "postgres",
  benchmark: true,
  logQueryParameters: true,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    // Set SSL if needed (for production)
    // ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false
  }
});

// Test the connection and log the result
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    // Optionally log stack trace for debugging
    console.debug(error.stack);
  }
};

// Run the connection test
testConnection();

module.exports = sequelize;
