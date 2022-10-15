const ApiError = require('../errors/ApiError')
const { City, Route, RouteStartcity } = require('../models/models')

class StartCityController {
	async create(cityId, routeId, next) {
		try {
			if (!cityId) {
				return next(ApiError.wrongValue('City is not defined'))
			}
			const cityCandidate = await City.findOne({where: {id: cityId}})
			if (!cityCandidate) {
				return next(ApiError.wrongValue('City does not found'))
			}

			if (!routeId) {
				return next(ApiError.wrongValue('RouteId is not defined'))
			}
			const routeCandidate = await Route.findOne({where: {id: routeId}})
			if (!routeCandidate) {
				return next(ApiError.wrongValue('Route does not found'))
			}

			// console.log(`CREATE startCity ==== == cityId, cityName, routeId, routeName ===========`,  cityId, cityCandidate['name'], routeId, routeCandidate['name']);
			const startCity = await RouteStartcity.create({cityId, routeId})
			if (startCity) {
				return {id: cityCandidate.id, name: cityCandidate.name}
			}
			return undefined
		} catch (e) {
			return e
		}
	}
}

module.exports = new StartCityController()