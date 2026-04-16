const router = require('express-promise-router')();
const vehicleController = require('../controllers/veiculos.controller')
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/vehicle',authMiddleware, vehicleController.createVehicle);
router.get('/vehicle',vehicleController.listAllVehicle);
router.put('/vehicle/:id',authMiddleware, vehicleController.uptadeVehicle);
router.delete('/vehicle/delete/:id',authMiddleware, vehicleController.deleteVehicle);
router.put('/vehicle/active/:id',authMiddleware ,vehicleController.activeVehicle);

module.exports = router;