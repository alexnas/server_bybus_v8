const Router = require('express')
const router = new Router()
const cityController = require('../controllers/cityController')

router.post('/', cityController.create) 
router.get('/', cityController.getAll) 
router.get('/:id', cityController.getOne) 
router.put('/:id', cityController.update)	
router.delete('/:id', cityController.delete)	

module.exports = router