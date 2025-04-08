const sequelize = require('./db');
const { DataTypes } = require('sequelize');

const Cloud = sequelize.define('Cloud', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  file: {
    type: DataTypes.BLOB,
    allowNull: false
  },

  text: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
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
  modelName: 'cloud',
  timestamps: false,
  paranoid: false
})

module.exports =  Cloud;
