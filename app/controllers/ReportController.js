const {app} = require("../App");
const {SurvivorService} = require("../service/SurvivorService");
const {successResponse} = require("../core/ApiUtil");

const prefixRoute = '/report';
app.get(`${prefixRoute}/survivor-percentage`,
  async (req, res) => {
  const percentageSurvivor = await SurvivorService.getSurvivorPercentage();

  return res.json(successResponse({
    ...percentageSurvivor,
  }))
});

app.get(`${prefixRoute}/average-amount-item`,
  async (req, res) => {
    const averageAmountItems = await SurvivorService.getAverageAmountItems();
    return res.json(successResponse({
      ...averageAmountItems
    }))
  }
)

app.get(`${prefixRoute}/point-lost`, async (req, res) => {
  const pointLost = await SurvivorService.getPointLost();
  return res.json(
    successResponse(pointLost)
  )
});

