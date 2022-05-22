const {app} = require("../App");
const {Survivor} = require('../models/Survivor');
const {successResponse, errorResponse} = require("../core/ApiUtil");
const {Contamination} = require("../models/Contamination");
const {Constant} = require("../core/Constant");

const prefixRoute = '/contamination';
app.post(`${prefixRoute}/report-survivor`,
  async (req, res) => {
    const input = req.body;
    const survivors = await Survivor.findAll({
      where: {
        id: [
          input.fromSurvivorId,
          input.toSurvivorId
        ]
      },
      attributes: [
        'id', 'name',
        'reportedAsContaminatedTotal',
        'isInfected'
      ]
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

    if (
      toSurvivorDetails.isInfected === Constant.SURVIVOR_IS_INFECTED_Y
    ) {
      return res.json(successResponse('Survivor already reported as infected'));
    }

    const check = await Contamination.findOne({
      attributes: ['id'],
      where: {
        fromSurvivorId: input.fromSurvivorId,
        toSurvivorId: input.toSurvivorId
      }
    })

    if (check) {
      return res.json(errorResponse('You already reported this survivor'))
    }

    await Contamination.create({
      fromSurvivorId: fromSurvivorDetails.id,
      fromSurvivorName: fromSurvivorDetails.name,
      toSurvivorId: toSurvivorDetails.id,
      toSurvivorName: toSurvivorDetails.name,
      createdAt: new Date()
    });

    if (toSurvivorDetails.reportedAsContaminatedTotal < 3) {
      if (toSurvivorDetails.reportedAsContaminatedTotal === 2) {
        toSurvivorDetails.isInfected = Constant.SURVIVOR_IS_INFECTED_Y;
        await toSurvivorDetails.save();
      }
      await toSurvivorDetails.increment(
        'reportedAsContaminatedTotal',
        {by: 1}
      );
    }
    res.json(successResponse('success'));
});