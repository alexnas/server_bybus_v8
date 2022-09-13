const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator');
const ApiError = require('../errors/ApiError');
const { User } = require('../models/models');
const { generateTokens } = require('../services/tokenService');
const authService = require('../services/authService');
const { userObj } = require('../services/authService');
const { COOKIE_MAX_AGE } = require('../constants/authConstants');

class AuthController {
	async signup(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.wrongValue(`Singup validation error: ${errors.array()[0].msg} of ${errors.array()[0].param}`))
			}

			let {name, email, password, roles} = req.body
			const {roleIds, roleNames} = await authService.getSignupRoleIds(roles, next)
			let {accessToken, refreshToken, user} = await authService.signup(name, email, password, roleIds, next)
			res.cookie('refreshToken', refreshToken, {maxAge: COOKIE_MAX_AGE, httpOnly: true})

			return res.json({userData: {user: {...user, roles: roleNames}, accessToken}})
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

			const {accessToken} = generateTokens({email: user.email})
			const userRoles = await user.getRoles()
			const roles = userRoles.map(role => role.name)
			const userObject = userObj(user)

			return res.json({
				userData: {
					user: {...userObject, roles},
					accessToken
				}
			})			
		} catch (e) {
			return next(ApiError.internal('Unforseen error during login'))
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