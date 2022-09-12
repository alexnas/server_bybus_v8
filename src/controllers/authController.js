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
			return res.json({token})
		} catch (e) {
			return next(ApiError.internal('Unforseen error during signup'))
		}
	}

	async login(req, res, next) {
		try {
			const {email, password} = req.body
			const user = await User.findOne({where: {email}})
			if (!user) {
				return next(ApiError.forbidden('The user with this email was not found'))
			}

			let comparePasswords = bcrypt.compareSync(password, user.password)
			if(!comparePasswords) {
				return next(ApiError.forbidden('Authentication failed'))
			}

			const token = generateAccessToken({email})
			const userRoles = await user.getRoles()
			const roles = userRoles.map(role => role.name)

			return res.json({
				id: user.id, 
				name: user.name, 
				email: user.email, 
				roles, 
				accessToken: token
			})			
		} catch (e) {
			
		}


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