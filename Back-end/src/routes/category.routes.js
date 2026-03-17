const router = require('express-promise-router')();
const categoryController = require('../controllers/category.controller')

router.post('/category', categoryController.createCategory);
router.get('/category', categoryController.listAllCategories);
router.put('/category/:id', categoryController.uptadeCategories);
router.delete('/category/delete/:id', categoryController.deleteCategories);
router.put('/category/active/:id', categoryController.activeCategories);

module.exports = router;