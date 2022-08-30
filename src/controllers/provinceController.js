const ApiError = require('../errors/ApiError')
const { Province } = require('../models/models')

class ProvinceController {
	async create(req, res, next) {
		const {name, description} = req.body
		try {
			if (!name || name.trim() === '') {
				return next(ApiError.wrongValue('Name is not defined'))
			}
			const candidate = await Province.findOne({where: {name}})
			if (candidate) {
				return next(ApiError.wrongValue('Province with the same name is registered'))
			}
			const province = await Province.create({name, description})
			res.json(province)
		} catch (e) {
			return next(ApiError.internal('Unforseen error'))
		}
	}

	async getAll(req, res) {
		const provinces = await Province.findAll()
		res.json(provinces)
	}

	async getOne(req, res, next) {
		const {id} = req.params
		try {
			const province = await Province.findOne({where: {id}})
			if (!province) {
				return next(ApiError.badRequest('There is no such province registered'))
			}
			res.json(province)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async update(req, res, next) {
		const {id} = req.params
		const newItem = req.body
		try {
			const province = await Province.findOne({where: {id}})
			if (!province) {
				return next(ApiError.badRequest('There is no such province registered'))
			}
			province.update(newItem)
			res.json(province);
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async delete(req, res, next) {
		const {id} = req.params
		try {
			const province = await Province.findOne({where: {id}})
			if (!province) {
				return next(ApiError.badRequest('There is no such province registered'))
			}
			await province.destroy()
			res.json(province)			
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}
}

module.exports = new ProvinceController()