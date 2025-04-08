const sequelize = require('./db');
const { DataTypes, Model } = require('sequelize');
const { hashPassword, generatePassword } = require('./password');
const { v4: uuidv4 } = require('uuid');

const School = sequelize.define(
  'School',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    password: {
      type: DataTypes.STRING
    },

    adminId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Schools',
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (school) => {
        if (!school.get("password")) {
          school.password = generatePassword();
        }
        const hash = hashPassword(school.password);
        school.password = hash;

        school.uuid = uuidv4();
      },

      beforeUpdate: async (school) => {
        if (school.changed("password")) {
          school.password = hashPassword(school.password);
        }
      }
    }
  }
);

module.exports = School;
