const jwt = require('jsonwebtoken');
const {accessToken_secret, refreshToken_secret} = require('../config/auth.config');
const ApiError = require('../errors/ApiError');
const { RefreshToken } = require('../models/models')

const { ACCESS_TIMEOUT, REFRESH_TIMEOUT } = require('../constants/authConstants');

class TokenService {
	generateTokens(payload) {
		const accessToken = jwt.sign(payload, accessToken_secret, {expiresIn: ACCESS_TIMEOUT})
		const refreshToken = jwt.sign(payload, refreshToken_secret, {expiresIn: REFRESH_TIMEOUT})
		return {
			accessToken,
			refreshToken
		}
	}

	async saveToken(next, userId, refreshToken) {
		try {
			const tokenData = await RefreshToken.findOne({where: {userId}})
			if (tokenData) {
				tokenData.update({ userId, tokenValue: refreshToken })
				return {refreshToken: tokenData.tokenValue}
			}

			const newTokenData = await RefreshToken.create({ userId, tokenValue: refreshToken })
			return  {refreshToken: newTokenData.tokenValue}
		} catch (e) {
			return next(ApiError.wrongValue('RefreshToken Error'))
		}
	}

	async removeToken(refreshToken, next) {
		try {
			const tokenToRemove = await RefreshToken.findOne({where: {tokenValue: refreshToken}})
			if (!tokenToRemove) {
				return next(ApiError.badRequest('There is no such token registered'))
			}
			const tokenData = await tokenToRemove.destroy()

			return {message: 'RefreshToken is removed successfully'}
		} catch (e) {
			return next(ApiError.wrongValue('RemoveToken Error'))
		}
	}
}

module.exports = new TokenService();
