const router = require('express-promise-router')();
const productController = require('../controllers/product.controller');
// ==> Definindo as rotas do CRUD - 'Product':
// ==> Rota responsável por criar um novo 'Product': (POST): localhost:3000/api/products
router.post('/products', productController.createProduct);
router.get('/products', productController.listAllProducts);
router.get('/product-emphasis',productController.listProductsDestaque);

module.exports = router;