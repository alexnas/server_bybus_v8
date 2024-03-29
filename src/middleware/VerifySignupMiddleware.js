const ApiError = require('../errors/ApiError');
const { User, Role } = require('../models/models');

const checkDuplicates = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    if (!(name && email && password)) {
      return next(ApiError.wrongValue('Enter correct name, email and password'));
    }

    const emailCandidate = await User.findOne({ where: { email: req.body.email } });
    if (emailCandidate) {
      return next(ApiError.wrongValue(`This email is already used`));
    }

    next();
  } catch (e) {
    return next(ApiError.internal('Unforseen server error'));
  }
};

const checkRolesValid = async (req, res, next) => {
  try {
    if (req.body.roles) {
      const reqRoles = req.body.roles;
      if (reqRoles && reqRoles.length > 0) {
        const allRoles = await Role.findAll();
        const allRoleNames = allRoles.map((item) => item.name);

        reqRoles.forEach((role) => {
          if (!allRoleNames.includes(role)) {
            return next(ApiError.wrongValue(`Failed! Role that does not exist = ${role}`));
          }
        });
      }
    }
    next();
  } catch (e) {
    return next(ApiError.internal('Unforseen server error during auth checks'));
  }
};

module.exports = {
  checkDuplicates,
  checkRolesValid,
};
