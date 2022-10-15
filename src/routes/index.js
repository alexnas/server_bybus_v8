const Router = require('express')
const router = new Router()
const authRouter = require('./authRouter')
const userRouter = require('./userRouter')
const provinceRouter = require('./provinceRouter')
const cityRouter = require('./cityRouter')
const companyRouter = require('./companyRouter')
const roleRouter = require('./roleRouter')
const routeRouter = require('./routeRouter')

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/role', roleRouter)
router.use('/province', provinceRouter)
router.use('/city', cityRouter)
router.use('/company', companyRouter)
router.use('/route', routeRouter)

module.exports = router
