const {app} = require("../App");
const {successResponse, errorResponse} = require("../core/ApiUtil");
const {SurvivorService} = require("../service/SurvivorService");
const {TradeService} = require("../service/TradeService");
const {Constant} = require("../core/Constant");

app.post(`/trade`,
  async (
    req,
    res,
    next
  ) => {
    try {
      const input = req.body;
      TradeService.setItemTotalToInteger(input);

      const survivors = await SurvivorService.getSurvivorDetails(
        input.sellerSurvivorId,
        input.buyerSurvivorId
      );

      if ([
        survivors.sellerDetails.isInfected,
        survivors.buyerDetails.isInfected
      ].includes(Constant.SURVIVOR_IS_INFECTED_Y)) {
        return res.json(errorResponse('Cannot trade. Survivor infected.'));
      }

      SurvivorService.validateStockItem(
        input.waterTotalSeller,
        input.foodTotalSeller,
        input.medicationTotalSeller,
        input.ammunitionTotalSeller,
        survivors.sellerDetails
      );

      SurvivorService.validateStockItem(
        input.waterTotalBuyer,
        input.foodTotalBuyer,
        input.medicationTotalBuyer,
        input.ammunitionTotalBuyer,
        survivors.buyerDetails
      );

      TradeService.validateItemPoints(input);
      const sellerItem = {
        id: survivors.sellerDetails.id,
        swapId: survivors.buyerDetails.id,
        waterTotal: input.waterTotalSeller * 1,
        foodTotal: input.foodTotalSeller * 1,
        medicationTotal: input.medicationTotalSeller * 1,
        ammunitionTotal: input.ammunitionTotalSeller * 1,
      }

      const buyerItem = {
        id: survivors.buyerDetails.id,
        swapId: survivors.sellerDetails.id,
        waterTotal: input.waterTotalBuyer * 1,
        foodTotal: input.foodTotalBuyer * 1,
        medicationTotal: input.medicationTotalBuyer * 1,
        ammunitionTotal: input.ammunitionTotalBuyer * 1,
      }

      await SurvivorService.swapItem(
        sellerItem,
        buyerItem,
      )
      res.json(successResponse('Trade success'));
    } catch (e) {
      next(e);
    }
  });

