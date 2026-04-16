
const router = require('express-promise-router')();
const imageController = require('../controllers/image.controller');
const { uploadImages } = require("../middleware/multer");
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/image/:id',authMiddleware ,uploadImages.array('imagens'), imageController.createImage);
router.get('/image/:id', imageController.viewImage);
router.delete('/image/delete/:id',authMiddleware, imageController.deleteImage);
router.put('/image/active/:id',authMiddleware, imageController.activeImage);

module.exports = router;






