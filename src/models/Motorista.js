const mongoose = require('mongoose');

const MotoristaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  status: {
    type: String,
    enum: ['aguardando', 'descarregando', 'descarregado'],
    default: 'aguardando'
  },
  dataChegada: { type: String }, // formato DD/MM/AAAA
  horaChegada: { type: String }, // formato HH:MM:SS
  timestampChegada: { type: Date, default: Date.now },
  tempoFila: { type: Number, default: 0 }, // segundos
  tempoDescarga: { type: Number, default: 0 },
  timestampInicioDescarga: { type: Date },
  timestampFimDescarga: { type: Date },
});

module.exports = mongoose.model('Motorista', MotoristaSchema, 'melicages_motoristas');