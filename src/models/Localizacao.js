const mongoose = require('mongoose');

const LocalizacaoSchema = new mongoose.Schema({
  motorista: { type: String, required: true }, // nome do motorista
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Localizacao', LocalizacaoSchema,'melicages_localizacoes');