const ApiError = require('../errors/ApiError')
const { Company } = require('../models/models')

class CompanyController {
	async create(req, res, next) {
		const {name, fullname, logo, rating, description} = req.body
		try {
			if (!name || name.trim() === '') {
				return next(ApiError.wrongValue('Name is not defined'))
			}
			const candidate = await Company.findOne({where: {name}})
			if (candidate) {
				return next(ApiError.wrongValue('This company name is already registered'))
			}
						
			const company = await Company.create({name, fullname, logo, rating, description})
			res.json(company)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		} 
	}

	async getAll(req, res) {
		const companies = await Company.findAll()
		res.json(companies)
	}

	async getOne(req, res, next) {
		const {id} = req.params
		try {
			const company = await Company.findOne({where: {id}})
			if (!company) {
				return next(ApiError.badRequest('This company is not registered'))
			}
			res.json(company)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async update(req, res, next) {
		const {id} = req.params
		let {name, fullname, logo, rating, description} = req.body
		try {
			if (!name || name.trim() === '') {
				return next(ApiError.wrongValue('Name is not defined'))
			}
			const candidate = await Company.findOne({where: {name}})
			if (candidate && (candidate.id !== +id)) {
				return next(ApiError.wrongValue('This company name is already registered'))
			}

			let company = await Company.findOne({where: {id}})
			if (!company) {
					return next(ApiError.badRequest('There is no such company registered'))
			}

			await company.update({name, fullname, logo, rating, description})
			res.json(company)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async delete(req, res, next) {
		const {id} = req.params
		try {
			const company = await Company.findOne({where: {id}})
			if (!company) {
				return next(ApiError.badRequest('This company is not registered'))
			}
			await company.destroy()
			res.json(id)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}
}

module.exports = new CompanyController()