const ApiError = require('../errors/ApiError')
const userService = require('../services/userService')

class UserController {
	async getUsers(req, res, next) {
		try {
			const users = await userService.getAllUsers()
			res.json(users)
		} catch (e) {
			return next(e)
		}

	}
}

module.exports = new UserController()