const {Constant} = require("../core/Constant");
const {rawQuery} = require("../core/Database");

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

    return {
      infectedSurvivorPercentage: (
        (infected / totalSurvivor[0][0].total) * 100
      ).toFixed(2),
      notInfectedSurvivorPercentage: (
        (notInfected / totalSurvivor[0][0].total) * 100
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
      waterAverage: data[0][0].waterAverage.toFixed(2),
      foodAverage: data[0][0].foodAverage.toFixed(2),
      medicationAverage: data[0][0].medicationAverage.toFixed(2),
      ammunitionAverage: data[0][0].ammunitionAverage.toFixed(2),
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
    return stockInsufficient;
  }

  static async updateItemAfterTrade(type, updatedSurvivorItem) {
    const operator = type === Constant.SURVIVOR_ITEM_INCREASE ? '+' : '-';
    await rawQuery(`
        update survivor
        set waterTotal = waterTotal ${operator} ${updatedSurvivorItem.waterTotal},
            foodTotal = foodTotal ${operator} ${updatedSurvivorItem.foodTotal},
            medicationTotal = medicationTotal ${operator} ${updatedSurvivorItem.medicationTotal},
            ammunitionTotal = ammunitionTotal ${operator} ${updatedSurvivorItem.ammunitionTotal}
        where id = ${updatedSurvivorItem.id}
    `);
  }
}

exports.SurvivorService = SurvivorService;