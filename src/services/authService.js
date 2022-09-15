const bcrypt = require('bcrypt');
const ApiError = require('../errors/ApiError')
const { Role, User, RefreshToken } = require('../models/models')
const { generateTokens, saveToken, removeToken } = require('./tokenService');
const { DEFAULT_ROLE } = require('../constants/authConstants');
const tokenService = require('./tokenService');

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

	async signupService(name, email, password, roleIds, next) {
		try {
			const hashPassword = await bcrypt.hash(password, 5)
			const user = await User.create({email, name, password: hashPassword})
			await user.setRoles(roleIds)
			
			const userRoles = await user.getRoles()
			const roles = userRoles.map(role => role.name)
			const userObj = {...this.userObj(user), roles}
			
			const tokens = generateTokens({email: user.email})
			await saveToken(next, user.id, tokens.refreshToken);

			return {...tokens, user: userObj}
		} catch (e) {
			return next(ApiError.wrongValue('Signup Error'))
		}
	}

	async loginService(email, password, next) {
		try {
			const user = await User.findOne({where: {email}})
			if (!user) {
				return next(ApiError.forbidden('The user with this email was not found'))
			}

			let comparePasswords = bcrypt.compareSync(password, user.password)
			if(!comparePasswords) {
				return next(ApiError.forbidden('Authentication failed'))
			}

			const userRoles = await user.getRoles()
			const roles = userRoles.map(role => role.name)
			const userObj = {...this.userObj(user), roles}
			
			const tokens = generateTokens({email: user.email})
			await saveToken(next, userObj.id, tokens.refreshToken);
			
			return {...tokens, user: userObj}
		} catch (e) {
			return next(ApiError.wrongValue('Login Error'))
		}
	}

	async logoutService(refreshToken, next) {
		const token = await removeToken(refreshToken, next)
		return token
	}

	async refreshService(refreshToken, next) {
		try {
			if (!refreshToken) {
				return next(ApiError.unAuthorized('Authorization Error'))
			}
			const userData = tokenService.validateRefreshToken(refreshToken)
			const tokenFromDb = await tokenService.findToken(refreshToken, next)
			if (!userData || !tokenFromDb) {
				return next(ApiError.unAuthorized('Authorization Error'))
			}

			const user = await User.findOne({where: {email: userData.email}})

			const userRoles = await user.getRoles()
			const roles = userRoles.map(role => role.name)
			const userObj = {...this.userObj(user), roles}
			
			const tokens = generateTokens({email: user.email})
			await saveToken(next, userObj.id, tokens.refreshToken);

			return {...tokens, user: userObj}
		} catch (e) {
			return next(ApiError.internal('Unforseen error in refresh service'))
		}
	}
}

module.exports = new AuthService()