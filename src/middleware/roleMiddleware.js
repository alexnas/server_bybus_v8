const ApiError = require('../errors/ApiError');
const { User } = require('../models/models');

const isAdminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return next(ApiError.forbidden('Admin Role required'));
    }
    const roles = await user.getRoles();
    if (!roles || !(roles.filter((role) => role.name === 'admin').length > 0)) {
      return next(ApiError.forbidden('Admin Role required'));
    }
    next();
    return;
  } catch (e) {
    return next(ApiError.forbidden(`Failed! Entrance forbidden`));
  }
};

const isModeratorMiddleware = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return next(ApiError.forbidden('Moderator Role required'));
    }
    const roles = await user.getRoles();
    if (!roles || !roles.filter((role) => (role.name === 'moderator').length > 0)) {
      return next(ApiError.forbidden('Moderator Role required'));
    }
    next();
  } catch (e) {
    return next(ApiError.forbidden(`Failed! Entrance forbidden`));
  }
};

const isModeratorOrAdminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.user.email } });
    if (!user) {
      return next(ApiError.forbidden('Admin or Moderator Role required'));
    }
    const roles = await user.getRoles();
    if (!roles || !(roles.filter((role) => role.name === 'admin' || role.name === 'moderator').length > 0)) {
      return next(ApiError.forbidden('Admin or Moderator Role required'));
    }
    next();
  } catch (e) {
    return next(ApiError.forbidden(`Failed! Entrance forbidden`));
  }
};

module.exports = {
  isAdminMiddleware,
  isModeratorMiddleware,
  isModeratorOrAdminMiddleware,
};
