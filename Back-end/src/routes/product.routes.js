const router = require('express-promise-router')();
const productController = require('../controllers/product.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/products' ,authMiddleware, productController.createProduct);
router.get('/products/:id',authMiddleware, productController.getProductById);
router.post('/products/filter', productController.listAllProducts);
router.post('/products/search', productController.searchProducts);
router.delete('/products/delete/:id',authMiddleware, productController.deleteProducts);
router.put('/products/active/:id',authMiddleware, productController.activeProducts);
router.post('/products/related/:id', productController.relatedProducts);
router.put('/products/:id',authMiddleware, productController.updateProduct);

module.exports = router;