const router = require('express-promise-router')();
const categoryController = require('../controllers/category.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/category',authMiddleware, categoryController.createCategory);
router.get('/category', categoryController.listAllCategories);
router.put('/category/:id',authMiddleware, categoryController.uptadeCategories);
router.delete('/category/delete/:id',authMiddleware, categoryController.deleteCategories);
router.put('/category/active/:id',authMiddleware, categoryController.activeCategories);

module.exports = router;