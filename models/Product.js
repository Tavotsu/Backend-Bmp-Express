'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.OrderItem, { foreignKey: 'productId', as: 'orderItems' });
    }
  }
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'General'
    }
  }, {
    sequelize,
    modelName: 'Product',
    tableName: 'Products'
  });
  return Product;
};