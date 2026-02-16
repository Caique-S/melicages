const express = require('express');
const router = express.Router();
const motoristaController = require('../controllers/motoristaController');

router.post('/chegada', motoristaController.registrarChegada);
router.put('/:id/iniciar-descarga', motoristaController.iniciarDescarga);
router.put('/:id/finalizar-descarga', motoristaController.finalizarDescarga);
router.get('/', motoristaController.listarMotoristas);
router.get('/:id', motoristaController.obterMotorista);

module.exports = router;