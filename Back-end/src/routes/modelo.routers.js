const router = require('express-promise-router')();
const modelController = require('../controllers/modelo.controller')
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/model',authMiddleware, modelController.createModel);
router.get('/model',modelController.listAllModel);
router.put('/model/:id',authMiddleware, modelController.uptadeModel);
router.delete('/model/delete/:id',authMiddleware, modelController.deleteModel);
router.put('/model/active/:id',authMiddleware, modelController.activeModel);

module.exports = router;