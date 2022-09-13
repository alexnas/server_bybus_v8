const bcrypt = require('bcrypt');
const ApiError = require('../errors/ApiError')
const { Role, User } = require('../models/models')
const tokenService = require('./tokenService');
const { DEFAULT_ROLE } = require('../constants/authConstants');

class AuthService {
	userObj(user) {
		return {
			id: user.id, 
			name: user.name, 
			email: user.email, 
		}
	}

	async getSignupRoleIds(requestRoles, next) {
		try {
			const defaultRole = await Role.findOne({where: {name: DEFAULT_ROLE}})
			if (!defaultRole) {
				return next(ApiError.wrongValue('Default Role Error'))
			}

			const allRoles = await Role.findAll()
			const roles = requestRoles ? JSON.parse(requestRoles) : [DEFAULT_ROLE]
			const roleIds = allRoles.filter(role => roles.includes(role.name)).map(role => +role.id)
			const roleNames = allRoles.filter(role => roles.includes(role.name)).map(role => role.name)
			return {roleIds, roleNames}
		} catch (e) {
			return next(ApiError.wrongValue('Signup Error'))
		}
	}

	async signup(name, email, password, roleIds, next) {
		try {
			const hashPassword = await bcrypt.hash(password, 5)
			const user = await User.create({email, name, password: hashPassword})
			user.setRoles(roleIds)
			const tokens = tokenService.generateTokens({email: user.email})
			return {...tokens, user: this.userObj(user)}
		} catch (e) {
			return next(ApiError.wrongValue('Signup Error'))
		}
	}
}

module.exports = new AuthService()