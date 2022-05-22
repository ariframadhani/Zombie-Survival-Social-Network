const {app} = require("../App");
const {Survivor} = require('../models/Survivor');
const {successResponse, errorResponse} = require("../core/ApiUtil");
const {SurvivorService} = require("../service/SurvivorService");
const {TradeService} = require("../service/TradeService");
const {Constant} = require("../core/Constant");

const prefixRoute = '/trade';
app.post(`${prefixRoute}/register`,
  async (req, res) => {
    const input = req.body;
    input.waterTotalToSurvivor = input.waterTotalToSurvivor*1;
    input.foodTotalToSurvivor = input.foodTotalToSurvivor*1;
    input.medicationTotalToSurvivor = input.medicationTotalToSurvivor*1;
    input.ammunitionTotalToSurvivor = input.ammunitionTotalToSurvivor*1;
    input.waterTotalToSurvivor = input.waterTotalToSurvivor*1;
    input.foodTotalToSurvivor = input.foodTotalToSurvivor*1;
    input.medicationTotalToSurvivor = input.medicationTotalToSurvivor*1;
    input.ammunitionTotalToSurvivor = input.ammunitionTotalToSurvivor*1;

    const survivors = await Survivor.findAll({
      where: {
        id: [
          input.fromSurvivorId,
          input.toSurvivorId
        ]
      }
    });

    const fromSurvivorDetails = survivors.find(
      x => x.id === input.fromSurvivorId
    );
    if (!fromSurvivorDetails) {
      return res.json(errorResponse('From survivor details not found'));
    }

    const toSurvivorDetails = survivors.find(
      x => x.id === input.toSurvivorId
    );
    if (!toSurvivorDetails) {
      return res.json(errorResponse('To survivor details not found'));
    }

    if ([fromSurvivorDetails.isInfected, toSurvivorDetails.isInfected].includes(Constant.SURVIVOR_IS_INFECTED_Y)) {
      return res.json(errorResponse('Cannot trade. Survivor infected.'));
    }

    const checkStockFromSurvivor = SurvivorService.validateStockItem(
      input.waterTotalFromSurvivor,
      input.foodTotalFromSurvivor,
      input.medicationTotalFromSurvivor,
      input.ammunitionTotalFromSurvivor,
      fromSurvivorDetails
    );
    if (checkStockFromSurvivor.length > 0) {
      return res.json(errorResponse(`${checkStockFromSurvivor.join(',')} insufficient`));
    }
    
    const checkStockToSurvivor = SurvivorService.validateStockItem(
      input.waterTotalToSurvivor,
      input.foodTotalToSurvivor,
      input.medicationTotalToSurvivor,
      input.ammunitionTotalToSurvivor,
      toSurvivorDetails
    );

    if (checkStockToSurvivor.length > 0) {
      return res.json(errorResponse(`${checkStockToSurvivor.join(',')} insufficient`));
    }

    const itemPointsFromSurvivor = TradeService.getItemPoints(
      input.waterTotalFromSurvivor,
      input.foodTotalFromSurvivor,
      input.medicationTotalFromSurvivor,
      input.ammunitionTotalFromSurvivor
    )

    const itemPointsToSurvivor = TradeService.getItemPoints(
      input.waterTotalToSurvivor,
      input.foodTotalToSurvivor,
      input.medicationTotalToSurvivor,
      input.ammunitionTotalToSurvivor
    )

    if (itemPointsFromSurvivor !== itemPointsToSurvivor) {
      return res.json(errorResponse('Trade failed. Item points not satisfied'))
    }

    const fromSurvivorItem = {
      id: fromSurvivorDetails.id,
      name: fromSurvivorDetails.name,
      waterTotal: input.waterTotalFromSurvivor*1,
      foodTotal: input.foodTotalFromSurvivor*1,
      medicationTotal: input.medicationTotalFromSurvivor*1,
      ammunitionTotal: input.ammunitionTotalFromSurvivor*1,
    }
    const toSurvivorItem = {
      id: toSurvivorDetails.id,
      name: toSurvivorDetails.name,
      waterTotal: input.waterTotalToSurvivor*1,
      foodTotal: input.foodTotalToSurvivor*1,
      medicationTotal: input.medicationTotalToSurvivor*1,
      ammunitionTotal: input.ammunitionTotalToSurvivor*1,
    }
    await TradeService.createTradeItem(
      fromSurvivorItem,
      toSurvivorItem,
    );

    await SurvivorService.updateItemAfterTrade(Constant.SURVIVOR_ITEM_DECREASE, fromSurvivorItem);
    await SurvivorService.updateItemAfterTrade(Constant.SURVIVOR_ITEM_INCREASE, toSurvivorItem);
    res.status(200).json(successResponse('Trade success'));
  });

