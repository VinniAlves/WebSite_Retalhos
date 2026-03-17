const router = require('express-promise-router')();
const modelController = require('../controllers/modelo.controller')

router.post('/model', modelController.createModel);
router.get('/model',modelController.listAllModel);
router.put('/model/:id', modelController.uptadeModel);
router.delete('/model/delete/:id', modelController.deleteModel);
router.put('/model/active/:id', modelController.activeModel);

module.exports = router;