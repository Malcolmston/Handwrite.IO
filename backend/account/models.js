const User = require('./User');
const School = require('./School');
const Key = require('./Key');
const Subscriber = require('./Subscriber');
const SchoolUser = require('./SchoolUser');
const Cloud = require('./Cloud');

const sequelize = require('./db');

// Define associations
const defineAssociations = () => {
  // User <-> Key associations
  User.hasOne(Key, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  Key.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  Cloud.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  // User <-> Subscriber associations
  User.hasMany(Subscriber, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  Subscriber.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE'
  });

  // School <-> User many-to-many relationship through SchoolUser
  User.belongsToMany(School, {
    through: SchoolUser,
    foreignKey: 'userId',
    otherKey: 'schoolId',
    as: 'Schools'
  });

  School.belongsToMany(User, {
    through: SchoolUser,
    foreignKey: 'schoolId',
    otherKey: 'userId',
    as: 'Users'
  });

  // Additional associations to make it easier to include related models
  SchoolUser.belongsTo(User, {
    foreignKey: 'userId'
  });

  SchoolUser.belongsTo(School, {
    foreignKey: 'schoolId'
  });

  // These help with eager loading and queries
  User.hasMany(SchoolUser, {
    foreignKey: 'userId'
  });

  School.hasMany(SchoolUser, {
    foreignKey: 'schoolId'
  });
};

// Initialize database connection
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Define associations before syncing
    defineAssociations();

    // Sync all models at once to ensure proper order
    await sequelize.sync({ force: false, alter: true });
    console.log('All models were synchronized successfully.');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

// Execute initialization
initializeDatabase().catch(error => {
  console.error('Database initialization failed:', error);
  process.exit(1);
});

module.exports = { User, School, Key, Subscriber, SchoolUser, Cloud};
