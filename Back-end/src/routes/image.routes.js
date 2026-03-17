
const router = require('express-promise-router')();
const imageController = require('../controllers/image.controller');
const { uploadImages } = require("../middleware/multer");

router.post('/image/:id', uploadImages.array('imagens'), imageController.createImage);
router.get('/image/:id', imageController.viewImage);

module.exports = router;






