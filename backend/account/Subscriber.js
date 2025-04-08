// Subscription.js
const sequelize = require('./db');
const { DataTypes, Model } = require('sequelize');

const Subscription = sequelize.define('Subscription', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM("pro", "other"),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  price: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: 0.00
    }
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  didPay: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Subscription',
  hooks: {
    afterCreate: async (subscription, options) => {
      // Find associated user and update their pro status when subscription is created
      const User = require('./User'); // Import here to avoid circular dependency
      const user = await User.findByPk(subscription.userId);
      if (user && subscription.type === 'pro') {
        await user.update({
          pro: true,
          payId: subscription.id
        }, { transaction: options.transaction });
      }
    },

    afterUpdate: async (subscription, options) => {
      // Update user's pro status if payment status changes
      if (subscription.changed('didPay')) {
        const User = require('./User');
        const user = await User.findByPk(subscription.userId);
        if (user) {
          await user.update({
            pro: subscription.didPay && subscription.type === 'pro'
          }, { transaction: options.transaction });
        }
      }
    },

    beforeDestroy: async (subscription, options) => {
      // Remove pro status from user if their pro subscription is deleted
      if (subscription.type === 'pro') {
        const User = require('./User');
        const user = await User.findByPk(subscription.userId);
        if (user) {
          await user.update({
            pro: false,
            payId: null
          }, { transaction: options.transaction });
        }
      }
    }
  }
});

module.exports = Subscription;
