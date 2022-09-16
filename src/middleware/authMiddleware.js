const ApiError = require('../errors/ApiError')
const tokenService = require('../services/tokenService')

module.exports = function (req, res, next) {
	try {
		const authorizationHeader = req.headers.authorization
		if (!authorizationHeader) {
			return next(ApiError.unAuthorized('User Is Not Authorized 1'))
		}

		const accessToken = authorizationHeader.split(' ')[1]
		if (!accessToken) {
			return next(ApiError.unAuthorized('User Is Not Authorized 2 '))
		}

		const userData = tokenService.validateAccessToken(accessToken)
		if (!userData) {
			return next(ApiError.unAuthorized('User Is Not Authorized 3'))
		}

		req.user = userData
		next()
	} catch (e) {
		return next(ApiError.unAuthorized('User Is Not Authorized 4'))
	}
}