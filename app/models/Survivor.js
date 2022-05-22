const Database = require('../core/Database');
const {DataTypes, Model} = require('sequelize');

class Survivor extends Model {}
Survivor.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER
  },
  gender: {
    type: DataTypes.STRING
  },
  latitude: {
    type: DataTypes.INTEGER
  },
  longitude: {
    type: DataTypes.INTEGER
  },
  isInfected: {
    type: DataTypes.INTEGER
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
  reportedAsContaminatedTotal: {
    type: DataTypes.INTEGER
  }
}, {
  timestamps: false,
  sequelize: Database.sequelizeInstance(),
  modelName: 'Survivor'
});

exports.Survivor = Survivor;