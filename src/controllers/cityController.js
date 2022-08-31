const ApiError = require('../errors/ApiError');
const { City, Province } = require('../models/models');

class CityController {
	async create(req, res, next) {
		let {name, description, provinceId} = req.body
		try {
			if (!name || name.trim() === '') {
				return next(ApiError.wrongValue('Name is not defined'))
			}
			const candidate = await City.findOne({where: {name}})
			if (candidate) {
				return next(ApiError.wrongValue('This city name is already registered'))
			}

			let choosenProvince
			if (provinceId && (typeof provinceId == 'number')) {
				choosenProvince = await Province.findOne({where: {id: provinceId}})
			}
			if (!choosenProvince) provinceId = null

			const city = await City.create({name, description, provinceId})
			res.json({city})
			
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async getAll(req, res) {
		const cities = await City.findAll()
		res.json(cities)
	}

	async getOne(req, res, next) {
		const {id} = req.params
		try {
			const city = await City.findOne({where: {id}})
			if (!city) {
				return next(ApiError.badRequest('This city is not registered'))
			}
			res.json(city)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async update(req, res, next) {
		const {id} = req.params
		let {name, description, provinceId} = req.body
		try {
			if (!name || name.trim() === '') {
				return next(ApiError.wrongValue('Name is not defined'))
			}
			const city = await City.findOne({where: {id}})
			if (!city) {
					return next(ApiError.badRequest('There is no such city registered'))
			}

			let choosenProvince
			if (provinceId && (typeof provinceId == 'number')) {
				choosenProvince = await Province.findOne({where: {id: provinceId}})
			}
			if (!choosenProvince) provinceId = null

			city.update({name, description, provinceId})
			res.json(city);
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async delete(req, res, next) {
		const {id} = req.params
		try {
			const city = await City.findOne({where: {id}})
			if (!city) {
				return next(ApiError.badRequest('There is no such city registered'))
			}
			const deleted = await city.destroy()
			res.json({id})
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}
}

module.exports = new CityController()