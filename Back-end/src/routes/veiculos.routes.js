const router = require('express-promise-router')();
const vehicleController = require('../controllers/veiculos.controller')

router.post('/vehicle', vehicleController.createVehicle);
router.get('/vehicle',vehicleController.listAllVehicle);
router.put('/vehicle/:id', vehicleController.uptadeVehicle);
router.delete('/vehicle/delete/:id', vehicleController.deleteVehicle);
router.put('/vehicle/active/:id', vehicleController.activeVehicle);

module.exports = router;