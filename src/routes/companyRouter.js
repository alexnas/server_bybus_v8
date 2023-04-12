const Router = require('express');
const router = new Router();
const multer = require('multer');
const companyController = require('../controllers/companyController');

const upload = multer({ dest: 'tmp/' });

router.get('/cleanwaste', companyController.cleanWasteImages);
router.get('/:id', companyController.getOne);
router.get('/', companyController.getAll);
router.post('/', upload.array('files'), companyController.create);
router.put('/:id', companyController.update);
router.delete('/:id', companyController.delete);

module.exports = router;
