require('dotenv').config();
const jwt = require('jsonwebtoken');
const {accessToken_secret, refreshToken_secret} = require('../config/auth.config');
const { ACCESS_TIMEOUT, REFRESH_TIMEOUT } = require('../constants/authConstants');

class TokenService {
	generateAccessToken(payload) {
		return jwt.sign(payload, accessToken_secret, {expiresIn: ACCESS_TIMEOUT})
	}

	generateTokens(payload) {
		const accessToken = jwt.sign(payload, accessToken_secret, {expiresIn: ACCESS_TIMEOUT})
		const refreshToken = jwt.sign(payload, refreshToken_secret, {expiresIn: REFRESH_TIMEOUT})
		return {
			accessToken,
			refreshToken
		}
	}
}

module.exports = new TokenService();
