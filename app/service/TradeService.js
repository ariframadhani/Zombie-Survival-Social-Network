const {Constant} = require("../core/Constant");
const {ErrorValidation} = require("../core/ErrorValidation");

class TradeService {

  static setItemTotalToInteger(input) {
    input.waterTotalSeller = input.waterTotalSeller * 1;
    input.foodTotalSeller = input.foodTotalSeller * 1;
    input.medicationTotalSeller = input.medicationTotalSeller * 1;
    input.ammunitionTotalSeller = input.ammunitionTotalSeller * 1;
    input.waterTotalBuyer = input.waterTotalBuyer * 1;
    input.foodTotalBuyer = input.foodTotalBuyer * 1;
    input.medicationTotalBuyer = input.medicationTotalBuyer * 1;
    input.ammunitionTotalBuyer = input.ammunitionTotalBuyer * 1;
  }

  static getItemPoints = (
    waterTotal,
    foodTotal,
    medicationTotal,
    ammunitionTotal
  ) => {
    const waterPoints = (Constant.ITEM_POINTS.WATER * waterTotal);
    const foodPoints = (Constant.ITEM_POINTS.FOOD * foodTotal);
    const medicationPoints = (Constant.ITEM_POINTS.MEDICATION * medicationTotal);
    const ammunitionPoints = (Constant.ITEM_POINTS.AMMUNITION * ammunitionTotal);

    return waterPoints + foodPoints + medicationPoints + ammunitionPoints;
  }

  static validateItemPoints(input) {
    const itemPointsSeller = TradeService.getItemPoints(
      input.waterTotalSeller,
      input.foodTotalSeller,
      input.medicationTotalSeller,
      input.ammunitionTotalSeller
    )

    const itemPointsBuyer = TradeService.getItemPoints(
      input.waterTotalBuyer,
      input.foodTotalBuyer,
      input.medicationTotalBuyer,
      input.ammunitionTotalBuyer
    )

    if (itemPointsSeller !== itemPointsBuyer) {
      console.table([
        'validateItemPoints',
        `itemPointsSeller:${itemPointsSeller}`,
        `itemPointsBuyer:${itemPointsBuyer}`
      ])
      throw new ErrorValidation('Trade failed. Item points not satisfied');
    }

    return true;
  }
}

exports.TradeService = TradeService;
