const Router = require('express')
const router = new Router()
const routeController = require('../controllers/routeController')

router.post('/', routeController.create) 
router.get('/', routeController.getAll) 
// router.get('/:id', routeController.getOne) 
// router.put('/:id', routeController.update)	
// router.delete('/:id', routeController.delete)	

module.exports = router