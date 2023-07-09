const bcrypt = require('bcrypt');
const ApiError = require('../errors/ApiError');
const { User, Role } = require('../models/models');
const userService = require('../services/userService');

class UserController {
  async create(req, res, next) {
    let { name, email, password, roleId, isActive } = req.body;
    const hashPassword = await bcrypt.hash(password, 5);

    try {
      if (!name || name.trim() === '' || email.trim() === '') {
        return next(ApiError.wrongValue('Name or email is not defined'));
      }
      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return next(ApiError.wrongValue('This user name is already registered'));
      }

      let choosenRole;
      if (roleId && typeof roleId == 'number') {
        choosenRole = await Role.findOne({ where: { id: roleId } });
      }
      if (!choosenRole) roleId = null;

      const user = await User.create({ name, email, roleId, isActive, password: hashPassword });
      res.json(user);
    } catch (e) {
      return next(ApiError.internal('Server error during User creation'));
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (e) {
      return next(e);
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    let { name, email, roleId, isActive } = req.body;

    try {
      if (!name || name.trim() === '' || email.trim() === '') {
        return next(ApiError.wrongValue('Name is not defined'));
      }
      const candidate = await User.findOne({ where: { email } });
      if (candidate && candidate.id !== +id) {
        return next(ApiError.wrongValue('This user name is already registered'));
      }

      const user = await User.findOne({ where: { id } });
      if (!user) {
        return next(ApiError.badRequest('There is no such user registered'));
      }

      let choosenRole;
      if (roleId && typeof roleId == 'number') {
        choosenRole = await Role.findOne({ where: { id: roleId } });
      }
      if (!choosenRole) roleId = null;

      await user.update({ name, email, roleId, isActive });
      res.json(user);
    } catch (e) {
      return next(ApiError.internal('Server error'));
    }
  }

  async checkConnection(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json({ isDbConnected: true, dbConnectionMsg: 'Db is connected' });
    } catch (e) {
      return next(e);
    }
  }

  async checkUserExist(req, res, next) {
    let { email } = req.query;
    try {
      if (email.trim() === '') {
        return next(ApiError.wrongValue('Email is not defined'));
      }

      const user = await User.findOne({ where: { email } });
      res.json(user);
    } catch (e) {
      return next(ApiError.internal('Server error'));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      const user = await User.findOne({ where: { id } });
      if (!user) {
        return next(ApiError.badRequest('There is no such user registered'));
      }
      await user.destroy();
      res.json(id);
    } catch (e) {
      return next(ApiError.internal('Server error'));
    }
  }

  async allAccess(req, res, next) {
    res.status(200).json('Public Content.');
  }

  async userBoard(req, res, next) {
    res.status(200).json('User Content.');
  }

  async adminBoard(req, res, next) {
    res.status(200).json('Admin Content.');
  }

  async moderatorBoard(req, res, next) {
    res.status(200).json('Moderator Content.');
  }
}

module.exports = new UserController();
