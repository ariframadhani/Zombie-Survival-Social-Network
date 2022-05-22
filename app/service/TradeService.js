const {Constant} = require("../core/Constant");
const {Trade} = require("../models/Trade");

class TradeService {
  static getItemPoints = (
    waterTotal,
    foodTotal,
    medicationTotal,
    ammunitionTotal
  ) => {
    waterTotal = waterTotal*1;
    foodTotal = foodTotal*1;
    medicationTotal = medicationTotal*1;
    ammunitionTotal = ammunitionTotal*1;

    const waterPoints = (Constant.ITEM_POINTS.WATER * waterTotal);
    const foodPoints = (Constant.ITEM_POINTS.FOOD * foodTotal);
    const medicationPoints = (Constant.ITEM_POINTS.MEDICATION * medicationTotal);
    const ammunitionPoints = (Constant.ITEM_POINTS.AMMUNITION * ammunitionTotal);

    return waterPoints + foodPoints + medicationPoints + ammunitionPoints;
  }

  static async createTradeItem(
    fromSurvivorData,
    toSurvivorData
  ) {
    const createdAt = new Date();
    const code = this.getNewReferenceCode(
      fromSurvivorData,
      toSurvivorData
    );

    const description = 'Trade ' + this.getTradeDescription(
      fromSurvivorData.waterTotal,
      fromSurvivorData.foodTotal,
      fromSurvivorData.medicationTotal,
      fromSurvivorData.ammunitionTotal,
    ) + ' with ' + this.getTradeDescription(
      toSurvivorData.waterTotal,
      toSurvivorData.foodTotal,
      toSurvivorData.medicationTotal,
      toSurvivorData.ammunitionTotal,
    );

    const tradeFrom = {
      code,
      survivorId: fromSurvivorData.id,
      survivorName: fromSurvivorData.name,
      type: Constant.TRADE_TYPE_OUT,
      waterTotal: fromSurvivorData.waterTotal,
      foodTotal: fromSurvivorData.foodTotal,
      medicationTotal: fromSurvivorData.medicationTotal,
      ammunitionTotal: fromSurvivorData.ammunitionTotal,
      description,
      createdAt
    }
    const tradeTo = {
      code,
      survivorId: toSurvivorData.id,
      survivorName: toSurvivorData.name,
      type: Constant.TRADE_TYPE_IN,
      waterTotal: toSurvivorData.waterTotal,
      foodTotal: toSurvivorData.foodTotal,
      medicationTotal: toSurvivorData.medicationTotal,
      ammunitionTotal: toSurvivorData.ammunitionTotal,
      description,
      createdAt
    }

    await Trade.bulkCreate([
      tradeFrom, tradeTo
    ])
  }

  static getTradeDescription(
    waterTotal,
    foodTotal,
    medicationTotal,
    ammunitionTotal
  ) {
    const stockInsufficient = [];
    if (waterTotal > 0) {
      stockInsufficient.push(
        `${waterTotal} ${Constant.ITEM_TO_TRADE.WATER}`
      )
    }
    if (foodTotal > 0) {
      stockInsufficient.push(
        `${foodTotal} ${Constant.ITEM_TO_TRADE.FOOD}`
      )
    }
    if (medicationTotal > 0) {
      stockInsufficient.push(
        `${medicationTotal} ${Constant.ITEM_TO_TRADE.MEDICATION}`
      )
    }
    if (ammunitionTotal > 0) {
      stockInsufficient.push(
        `${ammunitionTotal} ${Constant.ITEM_TO_TRADE.AMMUNITION}`
      )
    }

    return stockInsufficient.length > 0 ?
      stockInsufficient.join(',') :
      '';
  }

  static getNewReferenceCode(
    fromSurvivorData,
    toSurvivorData,
  ) {
    const date = new Date();
    const code = [
      date.getMonth()+1,
      date.getDate(),
      date.getFullYear(),
      Math.floor(100000000 + Math.random() * 900000000)
    ].join('');
    return `FROM_${fromSurvivorData.id}_TO_${toSurvivorData.id}_${code}`;
  }
}

exports.TradeService = TradeService;
