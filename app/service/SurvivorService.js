const {Constant} = require("../core/Constant");
const {rawQuery, sequelizeInstance} = require("../core/Database");
const {Survivor} = require("../models/Survivor");
const {ErrorValidation} = require("../core/ErrorValidation");

class SurvivorService {
  static async getSurvivorPercentage() {
    const getData = await Promise.all([
      rawQuery(`
          select isInfected, count(1) as total
          from survivor
          group by isInfected;
      `),
      rawQuery(
        `select count(1) as total
         from survivor
        `)
    ]);

    const survivor = getData[0];
    const totalSurvivor = getData[1];

    let infected = 0;
    let notInfected = 0;
    for (const item of survivor[0]) {
      if (item.isInfected === Constant.SURVIVOR_IS_INFECTED_Y) {
        infected = item.total;
      }
      if (item.isInfected === Constant.SURVIVOR_IS_INFECTED_N) {
        notInfected = item.total;
      }
    }

    const total = totalSurvivor[0][0].total;
    return {
      infectedSurvivorPercentage: total <= 0 ? 0 : (
        (infected / total) * 100
      ).toFixed(2),
      notInfectedSurvivorPercentage: total <= 0 ? 0 : (
        (notInfected / total) * 100
      ).toFixed(2)
    }
  }

  static async getAverageAmountItems() {
    const data = await rawQuery(`
        select avg(waterTotal)      as waterAverage,
               avg(foodTotal)       as foodAverage,
               avg(medicationTotal) as medicationAverage,
               avg(ammunitionTotal) as ammunitionAverage
        from survivor
        where isInfected = '${Constant.SURVIVOR_IS_INFECTED_N}'
    `);

    return {
      waterAverage: data[0][0].waterAverage ?
      data[0][0].waterAverage : 0,
      foodAverage: data[0][0].foodAverage ?
      data[0][0].foodAverage : 0,
      medicationAverage: data[0][0].medicationAverage ?
      data[0][0].medicationAverage : 0,
      ammunitionAverage: data[0][0].ammunitionAverage ?
      data[0][0].ammunitionAverage : 0,
    }
  }

  static async getPointLost() {
    const data = await rawQuery(`
        select sum(waterTotal)      as waterTotal,
               sum(foodTotal)       as foodTotal,
               sum(medicationTotal) as medicationTotal,
               sum(ammunitionTotal) as ammunitionTotal
        from survivor
        where isInfected = '${Constant.SURVIVOR_IS_INFECTED_Y}'
    `);

    return (
      ((data[0][0].waterTotal * 1) * Constant.ITEM_POINTS.WATER) +
      ((data[0][0].foodTotal * 1) * Constant.ITEM_POINTS.FOOD) +
      ((data[0][0].medicationTotal * 1) * Constant.ITEM_POINTS.MEDICATION) +
      ((data[0][0].ammunitionTotal * 1) * Constant.ITEM_POINTS.AMMUNITION)
    );
  }

  static validateGender(gender) {
    return [
      Constant.SURVIVOR_GENDER_MALE,
      Constant.SURVIVOR_GENDER_FEMALE
    ].includes(gender);
  }

  static validateStockItem(
    waterTotal,
    foodTotal,
    medicationTotal,
    ammunitionTotal,
    survivor
  ) {
    const stockInsufficient = [];
    if (survivor.waterTotal < waterTotal) {
      stockInsufficient.push(Constant.ITEM_TO_TRADE.WATER)
    }
    if (survivor.foodTotal < foodTotal) {
      stockInsufficient.push(Constant.ITEM_TO_TRADE.FOOD)
    }
    if (survivor.medicationTotal < medicationTotal) {
      stockInsufficient.push(Constant.ITEM_TO_TRADE.MEDICATION)
    }
    if (survivor.ammunitionTotal < ammunitionTotal) {
      stockInsufficient.push(Constant.ITEM_TO_TRADE.AMMUNITION)
    }

    if (stockInsufficient.length > 0) {
      throw new ErrorValidation(`${stockInsufficient.join(',')} insufficient`);
    }
    return stockInsufficient;
  }

  static async updateItemAfterTrade(
    type,
    updatedSurvivorItem,
    sequelizeTransaction
  ) {
    const operator = type === Constant.SURVIVOR_ITEM_INCREASE ? '+' : '-';
    await rawQuery(`
        update survivor
        set waterTotal = waterTotal ${operator} ${updatedSurvivorItem.waterTotal},
            foodTotal = foodTotal ${operator} ${updatedSurvivorItem.foodTotal},
            medicationTotal = medicationTotal ${operator} ${updatedSurvivorItem.medicationTotal},
            ammunitionTotal = ammunitionTotal ${operator} ${updatedSurvivorItem.ammunitionTotal}
        where id = ${updatedSurvivorItem.id}
    `, {transaction: sequelizeTransaction});
  }

  static async swapItem(seller, buyer) {
    const transaction = await sequelizeInstance().transaction();
    try {
      await SurvivorService.updateItemAfterTrade(
        Constant.SURVIVOR_ITEM_INCREASE,
        seller,
        transaction
      );
      await SurvivorService.updateItemAfterTrade(
        Constant.SURVIVOR_ITEM_INCREASE,
        buyer,
        transaction
      );

      buyer.id = buyer.swapId
      seller.id = seller.swapId;

      await SurvivorService.updateItemAfterTrade(
        Constant.SURVIVOR_ITEM_DECREASE,
        buyer,
        transaction
      );
      await SurvivorService.updateItemAfterTrade(
        Constant.SURVIVOR_ITEM_DECREASE,
        seller,
        transaction
      );

      await transaction.commit();
    } catch (e) {
      console.log(e)
      await transaction.rollback();
    }
  }

  static async getSurvivorDetails(
    sellerSurvivorId,
    buyerSurvivorId,
  ) {
    const survivors = await Survivor.findAll({
      where: {
        id: [
          sellerSurvivorId,
          buyerSurvivorId
        ]
      }
    })

    const sellerDetails = survivors.find(
      x => x.id === sellerSurvivorId
    );
    if (!sellerDetails) {
      throw new ErrorValidation('Seller details not found');
    }

    const buyerDetails = survivors.find(
      x => x.id === buyerSurvivorId
    );
    if (!buyerDetails) {
      throw new ErrorValidation('Buyer details not found');
    }

    return {
      sellerDetails,
      buyerDetails
    };
  }
}

exports.SurvivorService = SurvivorService;