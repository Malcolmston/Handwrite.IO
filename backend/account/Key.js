const sequelize = require('./db');
const { DataTypes } = require('sequelize');


const Key = sequelize.define("Key", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  externalId: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  Key: {
    type: DataTypes.BLOB,  // Changed to BLOB to store binary key data
    allowNull: false
  },



  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'Key',
  timestamps: false,
  paranoid: false,
  indexes: [{
    unique: true,
    fields: ['userId'],
    name: 'keys_user_id'  // Explicitly name the index
  }]
});

module.exports = Key;
