const jwt = require('jsonwebtoken');
const { accessToken_secret, refreshToken_secret } = require('../config/auth.config');
const ApiError = require('../errors/ApiError');
const { RefreshToken } = require('../models/models');
const { ACCESS_TIMEOUT, REFRESH_TIMEOUT, COOKIE_MAX_AGE } = require('../constants/authConstants');

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessToken_secret, { expiresIn: ACCESS_TIMEOUT });
    const refreshToken = jwt.sign(payload, refreshToken_secret, { expiresIn: REFRESH_TIMEOUT });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(next, userId, refreshToken) {
    try {
      const tokenData = await RefreshToken.findOne({ where: { userId } });
      if (tokenData) {
        await tokenData.update({ tokenValue: refreshToken });
        return { refreshToken: tokenData.tokenValue };
      }

      const newTokenData = await RefreshToken.create({ userId, tokenValue: refreshToken });
      return { refreshToken: newTokenData.tokenValue };
    } catch (e) {
      return next(ApiError.wrongValue('RefreshToken Error'));
    }
  }

  async removeToken(refreshToken, next) {
    try {
      if (!refreshToken) {
        return { isRemoveSuccess: false, message: 'The refreshToken was not recieved from client' };
      }

      const tokenToRemove = await RefreshToken.findOne({ where: { tokenValue: refreshToken } });
      if (tokenToRemove) {
        await tokenToRemove.destroy();
        return { isRemoveSuccess: true, message: 'RefreshToken is removed successfully' };
      } else {
        return { isRemoveSuccess: false, message: 'There is no such token registered' };
      }
    } catch (e) {
      return next(ApiError.wrongValue('RemoveToken Error'));
    }
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, accessToken_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, refreshToken_secret);
      return userData;
    } catch (e) {
      return null;
    }
  }

  async findToken(refreshToken, next) {
    try {
      const tokenData = await RefreshToken.findOne({ where: { tokenValue: refreshToken } });
      return tokenData;
    } catch (e) {
      return next(ApiError.unAuthorized('Authorization Error'));
    }
  }

  setCookieToken(res, refreshToken) {
    res.cookie('refreshToken', refreshToken, { maxAge: COOKIE_MAX_AGE, httpOnly: true });
  }

  clearCookieToken(res) {
    res.clearCookie('refreshToken');
  }
}

module.exports = new TokenService();
