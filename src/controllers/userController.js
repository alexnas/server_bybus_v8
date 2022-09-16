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

	async allAccess(req, res, next) {
  	res.status(200).json("Public Content.");
	}

	async userBoard(req, res, next) {
  	res.status(200).json("User Content.");
	}

	async adminBoard(req, res, next) {
  	res.status(200).json("Admin Content.");
	}

	async moderatorBoard(req, res, next) {
  	res.status(200).json("Moderator Content.");
	}
}

module.exports = new UserController()