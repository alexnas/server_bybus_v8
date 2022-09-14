const {validationResult} = require('express-validator');
const ApiError = require('../errors/ApiError');
const authService = require('../services/authService');
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
			let {accessToken, refreshToken, user} = await authService.signupService(name, email, password, roleIds, next)
			res.cookie('refreshToken', refreshToken, {maxAge: COOKIE_MAX_AGE, httpOnly: true})

			return res.json({
				userData: {
					user,
					accessToken,
					refreshToken
				}
			})
		} catch (e) {
			return next(ApiError.internal('Unforseen error during signup'))
		}
	}

	async login(req, res, next) {
		try {
			const {email, password} = req.body
			let {accessToken, refreshToken, user} = await authService.loginService(email, password, next) 
			res.cookie('refreshToken', refreshToken, {maxAge: COOKIE_MAX_AGE, httpOnly: true})

			return res.json({
				userData: {
					user,
					accessToken,
					refreshToken
				}
			})			
		} catch (e) {
			return next(ApiError.internal('Unforseen error during login'))
		}
	}

	async logout(req, res, next) {
		try {
			const {refreshToken} = req.cookies
			const token = await authService.logoutService(refreshToken, next)
			res.clearCookie('refreshToken')
			
			res.json(token)
		} catch (e) {
			return next(ApiError.internal('Unforseen error during logout'))
		}
	}

	async refresh(req, res, next) {
		try {

			res.json('Refresh token operation')
		} catch (e) {
			return next(ApiError.internal('Unforseen error during refresh'))
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