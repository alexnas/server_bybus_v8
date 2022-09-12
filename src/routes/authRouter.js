const Router = require('express')
const router = new Router()
const authController = require('../controllers/authController')
const { checkDuplicates, checkRolesValid } = require('../middleware/VerifySignupMiddleware')

router.post('/signup', [checkDuplicates, checkRolesValid], authController.signup)
router.post('/login', authController.login)
router.get('/auth', authController.check)

module.exports = router