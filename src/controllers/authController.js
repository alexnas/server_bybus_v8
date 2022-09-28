const {validationResult} = require('express-validator');
const ApiError = require('../errors/ApiError');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');

class AuthController {
	async signup(req, res, next) {
		try {
			const errors = validationResult(req)
			if (!errors.isEmpty()) {
				return next(ApiError.wrongValue(`Singup validation error: ${errors.array()[0].msg} of ${errors.array()[0].param}`))
			}

			let {name, email, password, roles} = req.body
			const {roleIds} = await authService.getSignupRoleIds(roles, next)
			let userData = await authService.signupService(name, email, password, roleIds, next)
			tokenService.setCookieToken(res, userData.refreshToken)

			return res.json({userData})
		} catch (e) {
			return next(ApiError.internal('Unforseen error during signup'))
		}
	}

	async login(req, res, next) {
		try {
			const {email, password} = req.body
			let userData = await authService.loginService(email, password, next) 
			tokenService.setCookieToken(res, userData.refreshToken)

			return res.json({user: userData.user, token: userData.accessToken})			
		} catch (e) {
			return next(ApiError.internal('Unforseen error during login'))
		}
	}

	async logout(req, res, next) {
		try {
			const {refreshToken} = req.cookies
			const token = await authService.logoutService(refreshToken, next)
			tokenService.clearCookieToken(res)
			
			res.json({message: 'Logout is successful'})
		} catch (e) {
			return next(ApiError.internal('Unforseen error during logout'))
		}
	}

	async refresh(req, res, next) {
		try {
			const { refreshToken } = req.cookies
			let userData = await authService.refreshService(refreshToken, next) 
			tokenService.setCookieToken(res, userData.refreshToken)

			return res.json({userData})			
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