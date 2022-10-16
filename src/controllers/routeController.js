const { Op } = require('sequelize');
const ApiError = require('../errors/ApiError');
const {
  Route, 
	Company, 
	City,
} = require('../models/models');


class RouteController {
	  async create(req, res, next) {
		try {
			let {
				name,
				start_time,
				end_time,
				price,
				distance,
				description,
				startCityId,
				endCityId,
				companyId,
			} = req.body;

			const startCity = await City.findOne({where: {id: startCityId}})
			if (!startCity) {
				return next(ApiError.badRequest('This route startCity is not registered'))
			}

			const endCity = await City.findOne({where: {id: endCityId}})
			if (!endCity) {
				return next(ApiError.badRequest('This route endCity is not registered'))
			}

			const company = await Company.findOne({where: {id: companyId}})
			if (!company) {
				return next(ApiError.badRequest('This route company is not registered'))
			}
			
			const busRoute = await Route.create({
				name,
				start_time,
				end_time,
				price,
				distance,
				description,
				startCityId,
				endCityId,
				companyId,
			});

			return res.json({...busRoute.dataValues, name: `${startCity.name}-${endCity.name}`, startCity, endCity, company});

			return res.json(busRoute);
		} catch (e) {
			return next(ApiError.internal('Unforseen server error'))
		}
  }

  async getAll(req, res) {
    const busRoutes = await Route.findAll();
    return res.json(busRoutes);
  }	

	async getOne(req, res, next) {
		const {id} = req.params
		try {
			const route = await Route.findOne({where: {id}})
			if (!route) {
				return next(ApiError.badRequest('This route is not registered'))
			}
			res.json(route)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}


	async delete(req, res, next) {
		const {id} = req.params
		try {
			const route = await Route.findOne({where: {id}})
			if (!route) {
				return next(ApiError.badRequest('There is no such route registered'))
			}
			await route.destroy()
			res.json(id)			
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

}

module.exports = new RouteController()
