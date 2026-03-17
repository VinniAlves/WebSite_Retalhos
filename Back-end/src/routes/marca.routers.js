const router = require('express-promise-router')();
const markController = require('../controllers/marca.controller')

router.post('/mark', markController.createMark);
router.get('/mark', markController.listAllMark);
router.put('/mark/:id', markController.uptadeMark);
router.delete('/mark/delete/:id', markController.deleteMark);
router.put('/mark/active/:id', markController.activeMark);

module.exports = router;