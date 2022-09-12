const bcrypt = require('bcrypt');
const ApiError = require('../errors/ApiError')
const { Role, User } = require('../models/models')
const { DEFAULT_ROLE } = require('../constants/authConstants')

class AuthService {
	async getSignupRoleIds(requestRoles, next) {
		try {
			const defaultRole = await Role.findOne({where: {name: DEFAULT_ROLE}})
			if (!defaultRole) {
				return next(ApiError.wrongValue('Default Role Error'))
			}

			const allRoles = await Role.findAll()
			const roles = requestRoles ? JSON.parse(requestRoles) : [DEFAULT_ROLE]
			return allRoles.filter(role => roles.includes(role.name)).map(role => +role.id)
		} catch (e) {
			return next(ApiError.wrongValue('Signup Error'))
		}
	}

	async signup(name, email, password, roleIds, next) {
		try {
			const hashPassword = await bcrypt.hash(password, 5)
			const user = await User.create({email, name, password: hashPassword})
			user.setRoles(roleIds)
			return user
		} catch (e) {
			return next(ApiError.wrongValue('Signup Error'))
		}
	}
}

module.exports = new AuthService()