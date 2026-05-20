const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Food = sequelize.define('Food', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.ENUM('kg', 'g', 'L', 'ml', 'piezas'),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('frutas', 'verduras', 'lacteos', 'carnes', 'granos', 'enlatados', 'bebidas', 'otros'),
    allowNull: false,
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  autoExpiration: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'true if expiration was calculated automatically (fruits/vegetables)',
  },
});

User.hasMany(Food, { foreignKey: 'userId', onDelete: 'CASCADE' });
Food.belongsTo(User, { foreignKey: 'userId' });

module.exports = Food;
