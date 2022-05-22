const Database = require('../core/Database');
const {DataTypes, Model} = require('sequelize');

class Trade extends Model {}
Trade.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  code: {
    type: DataTypes.STRING
  },
  survivorId: {
    type: DataTypes.INTEGER
  },
  survivorName: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.STRING
  },
  waterTotal: {
    type: DataTypes.INTEGER
  },
  foodTotal: {
    type: DataTypes.INTEGER
  },
  medicationTotal: {
    type: DataTypes.INTEGER
  },
  ammunitionTotal: {
    type: DataTypes.INTEGER
  },
  description: {
    type: DataTypes.STRING
  },
  createdAt: {
    type: DataTypes.DATE
  },
}, {
  timestamps: false,
  sequelize: Database.sequelizeInstance(),
  modelName: 'Trade'
});

exports.Trade = Trade;