const { Op } = require('sequelize');
const ApiError = require('../errors/ApiError');
const { Route, Company, City, Province } = require('../models/models');

class RouteController {
  async create(req, res, next) {
    try {
      let { name, start_time, end_time, price, distance, description, startCityId, endCityId, viaCityId, companyId } = req.body;

      const startCity = await City.findOne({ where: { id: startCityId } });
      if (!startCity) {
        return next(ApiError.badRequest('This route startCity is not registered'));
      }

      const endCity = await City.findOne({ where: { id: endCityId } });
      if (!endCity) {
        return next(ApiError.badRequest('This route endCity is not registered'));
      }

      const viaCity = await City.findOne({ where: { id: viaCityId } });
      if (!viaCity) {
        return next(ApiError.badRequest('This route viaCity is not registered'));
      }

      const company = await Company.findOne({ where: { id: companyId } });
      if (!company) {
        return next(ApiError.badRequest('This route company is not registered'));
      }

      const busRoute = await Route.create({
        name,
        start_time,
        end_time,
        price,
        distance,
        description,
        startCityId,
        endCityId,
        viaCityId,
        companyId,
      });

      return res.json({ ...busRoute.dataValues, startCity, endCity, viaCity, company });

      return res.json(busRoute);
    } catch (e) {
      return next(ApiError.internal('Unforseen server error'));
    }
  }

  async getAll(req, res, next) {
    const { start_city, end_city, company_name } = req.body;

    try {
      const whereStatement = {};
      const startCityCandidate = start_city && (await City.findOne({ where: { name: start_city } }));
      const endCityCandidate = end_city && (await City.findOne({ where: { name: end_city } }));

      if (start_city && startCityCandidate) {
        whereStatement.startCityId = startCityCandidate.id;
      }
      if (end_city && endCityCandidate) {
        whereStatement.endCityId = endCityCandidate.id;
      }
      if (company_name) {
        whereStatement['$company.name$'] = { [Op.iLike]: company_name };
      }

      const busRoutes = await Route.findAll({
        where: whereStatement,
        include: [
          {
            model: Company,
          },
          {
            model: City,
            required: true,
            include: [
              {
                model: Province,
              },
            ],
          },
        ],
      });

      return res.json(busRoutes);
    } catch (e) {
      console.log(e);
      return next(ApiError.internal('Unforseen server error'));
    }
  }

  async getOne(req, res, next) {
    const { id } = req.params;
    try {
      const route = await Route.findOne({ where: { id } });
      if (!route) {
        return next(ApiError.badRequest('This route is not registered'));
      }
      res.json(route);
    } catch (e) {
      return next(ApiError.internal('Server error'));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { name, start_time, end_time, price, distance, description, startCityId, endCityId, viaCityId, companyId } = req.body;

    const routeDataToUpdate = {};

    try {
      const route = await Route.findOne({ where: { id } });
      if (!route) {
        return next(ApiError.badRequest('There is no such route registered'));
      }

      const startCity = await City.findOne({ where: { id: startCityId || route.startCityId } });
      if (!startCity) {
        return next(ApiError.badRequest('This route startCity is not registered'));
      }

      const endCity = await City.findOne({ where: { id: endCityId || route.endCityId } });
      if (!endCity) {
        return next(ApiError.badRequest('This route endCity is not registered'));
      }

      const company = await Company.findOne({ where: { id: companyId } });
      if (!company) {
        return next(ApiError.badRequest('This route company is not registered'));
      }


      await route.update({
        name,
        start_time,
        end_time,
        price,
        distance,
        description,
        startCityId,
        endCityId,
        viaCityId,
        companyId,
      });
      res.json(route);
    } catch (e) {
      return next(ApiError.internal('Server error'));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;
    try {
      const route = await Route.findOne({ where: { id } });
      if (!route) {
        return next(ApiError.badRequest('There is no such route registered'));
      }
      await route.destroy();
      res.json(id);
    } catch (e) {
      return next(ApiError.internal('Server error'));
    }
  }
}

module.exports = new RouteController();
