const {app} = require("../App");
const {Survivor} = require('../models/Survivor');
const {successResponse, errorResponse} = require("../core/ApiUtil");
const {SurvivorService} = require("../service/SurvivorService");

const prefixRoute = '/survivor';
app.post(`${prefixRoute}/register`,
  async (req, res) => {
  const input = req.body;
  const isGenderValid = SurvivorService.validateGender(input.gender);
  if (!isGenderValid) {
    return res.json(errorResponse('Gender not valid'))
  }

  const survival = await Survivor.create({
    name: input.name.trim(),
    age: input.age,
    gender: input.gender,
    waterTotal: input.waterTotal,
    foodTotal: input.foodTotal,
    medicationTotal: input.medicationTotal,
    ammunitionTotal: input.ammunitionTotal
  });

  res.json(successResponse(survival));
});

app.patch(`${prefixRoute}/:survivorId/update-location`,
  async (req, res) => {
    const input = req.body;
    const survivorId = req.params.survivorId;
    const survivor = await Survivor.findByPk(survivorId,
      {attributes: ['id']}
    );

    if (!survivor) {
      return res.json(errorResponse('Survivor not exists'));
    }

    survivor.latitude = input.latitude;
    survivor.longitude = input.longitude;
    await survivor.save();

    return res.json(successResponse('Location updated'));
});

