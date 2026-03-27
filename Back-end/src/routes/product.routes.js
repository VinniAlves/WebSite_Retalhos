const router = require('express-promise-router')();
const productController = require('../controllers/product.controller');

router.post('/products', productController.createProduct);
router.get('/products/:id', productController.getProductById);
router.post('/products/filter', productController.listAllProducts);
router.post('/products/search', productController.searchProducts);
router.delete('/products/delete/:id', productController.deleteProducts);
router.put('/products/active/:id', productController.activeProducts);
router.post('/products/related/:id', productController.relatedProducts);
router.put('/products/:id', productController.updateProduct);

module.exports = router;