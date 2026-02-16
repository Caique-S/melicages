const express = require('express');
const router = express.Router();
const localizacaoController = require('../controllers/localizacaoController');

router.post('/', localizacaoController.receberLocalizacao);
router.get('/:motorista', localizacaoController.listarLocalizacoes);

module.exports = router;