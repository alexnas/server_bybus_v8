const Router = require('express')
const provinceController = require('../controllers/provinceController')
const router = new Router()

router.post('/', provinceController.create) 
router.get('/', provinceController.getAll) 
router.get('/:id', provinceController.getOne) 
router.put('/:id', provinceController.update)	
router.delete('/:id', provinceController.delete)	

module.exports = router