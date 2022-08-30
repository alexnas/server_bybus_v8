const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const provinceRouter = require('./provinceRouter')
const cityRouter = require('./cityRouter')
const companyRouter = require('./companyRouter')

router.use('/user', userRouter)
router.use('/province', provinceRouter)
router.use('/city', cityRouter)
router.use('/company', companyRouter)

module.exports = router
