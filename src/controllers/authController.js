// require('dotenv').config();
const bcrypt = require('bcrypt');
const ApiError = require('../errors/ApiError');
const { User, Role } = require('../models/models');
const { generateAccessToken } = require('../services/tokenService');
const { DEFAULT_ROLE } = require('../constants/authConstants');

class AuthController {
	async signup(req, res, next) {
		try {
			let {name, email, password} = req.body
			const allRoles = await Role.findAll()
			const defaultRole = await Role.findOne({where: {name: DEFAULT_ROLE}})
			if (!defaultRole) {
				return next(ApiError.internal('Default Role Error'))
			}
			let roles = [DEFAULT_ROLE]
			if (req.body.roles) {
				const rolesRaw = req.body.roles
				roles = JSON.parse(rolesRaw)	
			}

			const rolesIdx = allRoles.filter(role => roles.includes(role.name)).map(role => +role.id)

			const hashPassword = await bcrypt.hash(password, 5)
			const user = await User.create({email, name, password: hashPassword})
			user.setRoles(rolesIdx)
			
			const token = generateAccessToken({email})
			res.json({token})
			
		} catch (e) {
			return next(ApiError.internal('Unforseen error during signup'))
		}
	}

	async login(req, res) {

	}

	async check(req, res, next) {
		const {id} = req.query
		if (!id) {
			return next(ApiError.wrongValue('ID is not defined'))
		}
		res.status(200).json({message: `ID = ${id}`})
	}	
}

module.exports = new AuthController()