const express = require('express');
const cors = require('cors');
const motoristasRoutes = require('./routes/motoristas');
const localizacoesRoutes = require('./routes/localizacoes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/motoristas', motoristasRoutes,);
app.use('/api/localizacoes', localizacoesRoutes);

// Rota de saudação
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Logística funcionando!' });
});

module.exports = app;