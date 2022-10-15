const ApiError = require('../errors/ApiError')
const { City, Route, RouteEndcity } = require('../models/models')

class EndCityController {
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

			// console.log(`CREATE endCity ==== == cityId, cityName, routeId, routeName ===========`,   cityId, cityCandidate['name'], routeId, routeCandidate['name']);
			const endCity = await RouteEndcity.create({cityId, routeId})
			if (endCity) {
				return {id: cityCandidate.id, name: cityCandidate.name}
			}
			return undefined
		} catch (e) {
			return e
		}
	}
}

module.exports = new EndCityController()