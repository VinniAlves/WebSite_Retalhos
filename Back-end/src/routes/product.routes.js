const router = require('express-promise-router')();
const productController = require('../controllers/product.controller');

router.post('/products', productController.createProduct);
// So precisa passar false ou true, pois vai ser o mesmo retorno
router.post('/products/filter', productController.listAllProducts);
router.delete('/products/delete/:id', productController.deleteProducts);
router.put('/products/active/:id', productController.activeProducts);

module.exports = router;