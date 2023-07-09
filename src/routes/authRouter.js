const Router = require('express');
const router = new Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { checkDuplicates, checkRolesValid } = require('../middleware/VerifySignupMiddleware');

router.post(
  '/signup',
  [
    checkDuplicates,
    // checkRolesValid
  ],
  body('name').isLength({ min: 3, max: 50 }),
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 50 }),
  authController.signup
);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/refresh', authController.refresh);
router.get('/auth', authController.check);

module.exports = router;
