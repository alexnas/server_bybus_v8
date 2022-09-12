require('dotenv').config();
const jwt = require('jsonwebtoken');
const accessToken_secret = require('../config/auth.config');

class TokenService {
	generateAccessToken(payload) {
		return jwt.sign(payload, accessToken_secret, {expiresIn: '15m'})
	} 
}

module.exports = new TokenService();
