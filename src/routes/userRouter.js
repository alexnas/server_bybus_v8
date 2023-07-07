const Router = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { isModeratorMiddleware, isAdminMiddleware } = require('../middleware/roleMiddleware');
const router = new Router();

router.get('/', [authMiddleware], userController.getUsers);
router.get('/test/user', [authMiddleware], userController.userBoard);
router.get('/test/mod', [authMiddleware, isModeratorMiddleware], userController.moderatorBoard);
router.get('/test/admin', [authMiddleware, isAdminMiddleware], userController.adminBoard);

module.exports = router;
