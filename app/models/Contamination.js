const Database = require('../core/Database');
const {DataTypes, Model} = require('sequelize');

class Contamination extends Model {}
Contamination.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fromSurvivorId: {
    type: DataTypes.INTEGER
  },
  fromSurvivorName: {
    type: DataTypes.STRING
  },
  toSurvivorId: {
    type: DataTypes.INTEGER
  },
  toSurvivorName: {
    type: DataTypes.STRING
  },
  createdAt: {
    type: DataTypes.DATE
  }
}, {
  timestamps: false,
  sequelize: Database.sequelizeInstance(),
  modelName: 'Contamination'
});

exports.Contamination = Contamination;