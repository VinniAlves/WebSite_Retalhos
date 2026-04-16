const router = require('express-promise-router')();
const markController = require('../controllers/marca.controller')
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/mark',authMiddleware, markController.createMark);
router.get('/mark', markController.listAllMark);
router.put('/mark/:id',authMiddleware, markController.uptadeMark);
router.delete('/mark/delete/:id',authMiddleware, markController.deleteMark);
router.put('/mark/active/:id',authMiddleware ,markController.activeMark);

module.exports = router;