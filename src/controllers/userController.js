class UserController {
	async register(req, res) {

	}

	async login(req, res) {

	}

	async check(req, res) {
		res.status(200).json({message: 'User controller wotks!'})
	}
}

module.exports = new UserController()