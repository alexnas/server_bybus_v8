const ApiError = require('../errors/ApiError')

class UserController {
	async register(req, res) {

	}

	async login(req, res) {

	}

	async check(req, res, next) {
		const {id} = req.query
		if (!id) {
			return next(ApiError.valueNotDefined('ID is not defined'))
		}
		res.status(200).json({message: `ID = ${id}`})
	}	
}

module.exports = new UserController()