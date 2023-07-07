const bcrypt = require('bcrypt');
const ApiError = require('../errors/ApiError');
const { Role, User } = require('../models/models');
const tokenService = require('./tokenService');
const { DEFAULT_ROLE } = require('../constants/authConstants');

class AuthService {
  async getSignupRoleIds(requestRoles, next) {
    try {
      const defaultRole = await Role.findOne({ where: { name: DEFAULT_ROLE } });
      if (!defaultRole) {
        return next(ApiError.wrongValue('Default Role Error'));
      }

      const allRoles = await Role.findAll();
      const roles = requestRoles ? JSON.parse(requestRoles) : [DEFAULT_ROLE];
      const roleIds = allRoles.filter((role) => roles.includes(role.name)).map((role) => +role.id);
      const roleNames = allRoles.filter((role) => roles.includes(role.name)).map((role) => role.name);
      return { roleIds, roleNames };
    } catch (e) {
      return next(ApiError.wrongValue('Signup Error'));
    }
  }

  async signupService(name, email, password, roleIds, next) {
    try {
      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({ email, name, password: hashPassword });
      await user.setRoles(roleIds);

      const userObj = await this.getUserObjWithRoles(user, next);

      const tokens = tokenService.generateTokens({ email: user.email });
      await tokenService.saveToken(next, user.id, tokens.refreshToken);

      return { user: userObj, ...tokens };
    } catch (e) {
      return next(ApiError.wrongValue('Signup Error'));
    }
  }

  async loginService(email, password, next) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return next(ApiError.forbidden('The user with this email was not found'));
      }

      let comparePasswords = bcrypt.compareSync(password, user.password);
      if (!comparePasswords) {
        return next(ApiError.forbidden('Authentication failed'));
      }

      const userObj = await this.getUserObjWithRoles(user, next);

      const tokens = tokenService.generateTokens({ email: user.email });
      await tokenService.saveToken(next, user.id, tokens.refreshToken);

      return { user: userObj, ...tokens };
    } catch (e) {
      return next(ApiError.wrongValue('Login Error'));
    }
  }

  async logoutService(refreshToken, next) {
    const token = await tokenService.removeToken(refreshToken, next);
    return token;
  }

  async getUserRoles(user, next) {
    try {
      const userRoles = await user.getRoles();
      return userRoles.map((role) => role.name);
    } catch (e) {
      return next(ApiError.wrongValue('Get UserRoles Error'));
    }
  }

  async getUserObjWithRoles(user, next) {
    try {
      const roles = await this.getUserRoles(user, next);
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles,
      };
    } catch (e) {
      return next(ApiError.wrongValue('User Roles Error'));
    }
  }

  async refreshService(refreshToken, next) {
    try {
      if (!refreshToken) {
        return next(ApiError.unAuthorized('User Is Not Authorized'));
      }
      const tokenData = tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb = await tokenService.findToken(refreshToken, next);
      if (!tokenData || !tokenFromDb) {
        return next(ApiError.unAuthorized('User Is Not Authorized'));
      }

      const user = await User.findOne({ where: { email: tokenData.email } });
      const userObj = await this.getUserObjWithRoles(user, next);

      const tokens = tokenService.generateTokens({ email: user.email });
      await tokenService.saveToken(next, user.id, tokens.refreshToken);

      return { user: userObj, ...tokens };
    } catch (e) {
      return next(ApiError.internal('Unforseen error in refresh service'));
    }
  }
}

module.exports = new AuthService();
