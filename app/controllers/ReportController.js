const {app} = require("../App");
const {SurvivorService} = require("../service/SurvivorService");
const {successResponse} = require("../core/ApiUtil");

const prefixRoute = '/report';
app.get(`${prefixRoute}/percentage-survivor`,
  async (req, res) => {
  const percentageSurvivor = await SurvivorService.getSurvivorPercentage();
  const averageAmountItems = await SurvivorService.getAverageAmountItems();
  const pointLost = await SurvivorService.getPointLost();

  return res.json(successResponse({
    ...percentageSurvivor,
    ...averageAmountItems,
    pointLost,
  }))
});

