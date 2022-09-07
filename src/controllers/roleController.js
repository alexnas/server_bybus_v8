const ApiError = require('../errors/ApiError')
const { Role } = require('../models/models')

class RoleController {
	async create(req, res, next) {
		const {name, description} = req.body
		try {
			if (!name || name.trim() === '') {
				return next(ApiError.wrongValue('Name is not defined'))
			}
			const candidate = await Role.findOne({where: {name}})
			if (candidate) {
				return next(ApiError.wrongValue('This role name is already registered'))
			}

		console.log('CREATE', name, description);
			const role = await Role.create({name, description})
			res.json(role)
		} catch (e) {
			return next(ApiError.internal('Unforseen error'))
		}
	}

	async getAll(req, res) {
		console.log('GET ALL ==========');
		const roles = await Role.findAll()
		res.json(roles)
	}

	async getOne(req, res, next) {
		const {id} = req.params
		try {
			const role = await Role.findOne({where: {id}})
			if (!role) {
				return next(ApiError.badRequest('This role is not registered'))
			}
			res.json(role)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async update(req, res, next) {
		const {id} = req.params
		const {name, description} = req.body
		try {
			if (!name || name.trim() === '') {
				return next(ApiError.wrongValue('Name is not defined'))
			}
			const candidate = await Role.findOne({where: {name}})
			if (candidate && (candidate.id !== +id)) {
				return next(ApiError.wrongValue('This role name is already registered'))
			}

			const role = await Role.findOne({where: {id}})
			if (!role) {
				return next(ApiError.badRequest('There is no such role registered'))
			}

			await role.update({name, description})
			res.json(role);
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	async delete(req, res, next) {
		const {id} = req.params
		try {
			const role = await Role.findOne({where: {id}})
			if (!role) {
				return next(ApiError.badRequest('There is no such role registered'))
			}
			await role.destroy()
			res.json(id)			
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}
}

module.exports = new RoleController()