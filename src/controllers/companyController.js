const { cloudinary } = require('../config/cloudinary.config');
const ApiError = require('../errors/ApiError')
const { Company } = require('../models/models')
const {uploadImageService, 	destroyImageService, extractPublicId, searchCloudinaryImgByExpression} = require('../services/uploadImageService/index')

class CompanyController {
	async create(req, res, next) {
		let {name, fullname, logo, rating, description} = req.body
		try {
			if (!name || name.trim() === '') {
				return next(ApiError.wrongValue('Name is not defined'))
			}
			const candidate = await Company.findOne({where: {name}})
			if (candidate) {
				return next(ApiError.wrongValue('This company name is already registered'))
			}

			// Upload image file into Cloud File Server
			logo = logo || 'LOGO'
			if (req.files && req.files.file) {
				const {url} = await uploadImageService(next, req.files.file)
				logo = url
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
					return next(ApiError.badRequest('This company is not registered'))
			}
			
			// Destroy old image on Cloud File Server
			if (req.files && req.files.file && company.logo) {
				const imageDestroyResponse = await destroyImageService(next, company.logo)
				console.log('====================== imageDestroyResponse__OUTSIDE =========', imageDestroyResponse);
			}

			// Upload new image file into Cloud File Server
			let logo = 'LOGO'
			if (req.files && req.files.file) {
				let {url} = await uploadImageService(next, req.files.file)
				logo = url
			}

			await company.update({name, fullname, logo, rating, description})
			res.json(company)
		} catch (e) {
			console.log(e);
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
			if (company.logo) {
				const imageDestroyResponse = await destroyImageService(next, company.logo)
				console.log('====================== imageDestroyResponse__OUTSIDE =========', imageDestroyResponse);
			}
			await company.destroy()
			res.json(id)
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}

	// Clean waste images from Cloudinary servics and from db Company items
	async cleanWasteImages(req, res, next) {
		try {
			// find all images in the db == gbbDbImages[]
			const companies = await Company.findAll()
			let gbbDbImageUrls = companies.map(item => item.logo).filter(logo => logo.indexOf("res.cloudinary.com"))
			let gbbDbImagePublicIds = gbbDbImageUrls.map(url => extractPublicId(url))

			// find all images in the proper Cloudinary folder (.expression('folder:gobybus')) == cloudinaryImages[]
			const { resources } = await cloudinary.search
				.expression('folder:gobybus')
				.sort_by('public_id', 'asc')
				.max_results(30)
				.execute();
				
			const cloudinaryPublicIds = resources.map((file) => file.public_id);

			// Cloudinary images to CLEAN (DESTROY) == all images present in the Cloudinary but absent in the db (map): 
			let cloudinaryPublicIdsToDestroy = cloudinaryPublicIds.filter(item => !gbbDbImagePublicIds.includes(item))

			//  DB images to CLEAN (DELETE) == all images present in DB but absent in the Cloudinary (map): 
			let gbbDbImagesToDestroy = gbbDbImagePublicIds.filter(item => !cloudinaryPublicIds.includes(item))
			
			// Destroy all waste images from the cloudinaryPublicIdsToDestroy array
			const destroyUnusedCloudinaryImages = async (cloudinaryPublicIdsToDestroy) => {
				await cloudinaryPublicIdsToDestroy.map(publicId => {
					const res = cloudinary.uploader.destroy(publicId);
				})
			}
			if (cloudinaryPublicIdsToDestroy.length > 0) {
				destroyUnusedCloudinaryImages(cloudinaryPublicIdsToDestroy)
			}

			// Destroy all waste images from DB (gbbDbImagesToDestroy array)
			const filterUnusedGbbDbImages = (gbbDbImagesToDestroy) => {
				return companies.filter(company => gbbDbImagesToDestroy.includes(extractPublicId(company.logo)))
			}

			if (gbbDbImagesToDestroy.length > 0) {
				const companiesToUpdate = filterUnusedGbbDbImages(gbbDbImagesToDestroy)
				await companiesToUpdate.forEach(companyToUpdate => {
					const logo = 'LOGO'
					// companyToUpdate.update({logo})
				})
			}

			res.json({gbbDbImagePublicIds, cloudinaryPublicIds, gbbDbImagesToDestroy, cloudinaryPublicIdsToDestroy})
		} catch (e) {
			return next(ApiError.internal('Server error'))
		}
	}



}

module.exports = new CompanyController()