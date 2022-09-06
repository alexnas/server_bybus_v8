const Router = require('express')
const router = new Router()
const companyController = require('../controllers/companyController')

router.get('/cleanwaste', companyController.cleanWasteImages);
router.get('/:id', companyController.getOne) 
router.get('/', companyController.getAll) 
router.post('/', companyController.create) 
router.put('/:id', companyController.update)	
router.delete('/:id', companyController.delete)	

module.exports = router