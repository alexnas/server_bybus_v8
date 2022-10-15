const { Op } = require('sequelize');
const ApiError = require('../errors/ApiError');
const {
  Route,
  StartCity,
  EndCity,
  City,
  Province,
  Company,
} = require('../models/models');
const {create: StartCityCreate} = require('./startCityController')
const {create: EndCityCreate} = require('./endCityController')


class RouteController {
	  async create(req, res, next) {
    const {
      name,
      start_time,
      end_time,
      price,
      distance,
      description,
      startcityId,
      endcityId,
      companyId,
    } = req.body;

    const busRoute = await Route.create({
      name,
      start_time,
      end_time,
      price,
      distance,
      description,
      companyId,
    });

		const startCityCreated = await StartCityCreate(startcityId, busRoute.id, next)
		if(!startCityCreated) {
			return next(ApiError.wrongValue('StartCity is not defined'))
		}

		const endCityCreated = await EndCityCreate(endcityId, busRoute.id, next)
		if(!endCityCreated) {
			return next(ApiError.wrongValue('EndCity is not defined'))
		}

    return res.json({...busRoute.dataValues, name: `${startCityCreated.name}-${endCityCreated.name}`, startCity: startCityCreated, endCity: endCityCreated});
  }
}

module.exports = new RouteController()
