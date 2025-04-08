const sequelize = require('./db');
const School = require('./School');
const User = require('./User');
const { DataTypes, Model } = require('sequelize');

// Option 1: Use your existing column names and explicitly set the foreign keys
const SchoolUser = sequelize.define('SchoolUser', {
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
    allowNull: true
  }

}, {
  tableName: 'SchoolUsers'
});


module.exports = SchoolUser;
