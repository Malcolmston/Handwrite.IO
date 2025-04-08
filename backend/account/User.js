const  sequelize = require('./db');
const School = require('./School');
const { DataTypes, Model } = require('sequelize');
const { hashPassword, comparePassword } = require('./password');
const Subscription = require('./Subscriber');


const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    googleId: {
      type: DataTypes.STRING,
      allowNull: true
    },

    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('basic', 'student', 'admin'),
      defaultValue: 'basic'
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    username: {
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    schoolId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    avatar: {
      type: DataTypes.BLOB,
      allowNull: true
    },

    payId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    pro: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    lastPsw: {
      type: DataTypes.DATE,
      defaultValue: null
    },

    totpSecret: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    },
    totpEnabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    totpTempSecret: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true,
    paranoid: true,
    hooks: {
      beforeCreate: async (user) => {
        const userType = user.get("type");
        const schoolId = user.get("schoolId");
        const password = user.get("password");
        const payId = user.get("payId");
        const isStudent = userType === "student";

        // Set pro flag based on payId
        if (payId) {
          user.pro = true;
        }

        // Student validation
        if (isStudent) {
          if (!schoolId) {
            throw new Error("Students must have a schoolId");
          }
          if (password) {
            console.warn("Students should not have a password, and it will be overridden");
            const school = await School.findByPk(schoolId);
            if (!school) {
              throw new Error("Invalid school ID provided");
            }
            user.password = school.get("password");
          }
        }
        // Non-student validation
        else {
          if (schoolId) {
            throw new Error("Only students can have a schoolId");
          }
          // Allow users with googleId to skip password
          if (!password && !user.get("googleId")) {
            throw new Error("Users must have a password or sign in with Google");
          }
          if (password) {
            user.password = hashPassword(password);
          }
        }
      },

      beforeUpdate: async (user) => {
        // Update pro status if payId changes
        if (user.changed('payId')) {
          user.pro = !!user.get('payId');
        }

        if (user.changed('password') && user.get('password')) {
          const hash = hashPassword(user.get('password'));
          user.password = hash;
          user.lastPsw = new Date();
        }
      },

      afterUpdate: async (user) => {
        // If pro status is manually set to false, cancel any active pro subscriptions
        if (user.changed('pro') && !user.pro) {
          await Subscription.update(
            { didPay: false },
            {
              where: {
                userId: user.id,
                type: 'pro',
                didPay: true
              }
            }
          );
        }
      },

      beforeDestroy: async (user, options) => {
        // When a user is deleted, ensure all their subscriptions are cleaned up
        await Subscription.destroy({
          where: { userId: user.id },
          transaction: options.transaction
        });
      }
    }
  }
);

module.exports = User;
