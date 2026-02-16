const Localizacao = require('../models/Localizacao');

// Receber localização
exports.receberLocalizacao = async (req, res) => {
  try {
    const { motorista, latitude, longitude, timestamp } = req.body;

    if (!motorista || !latitude || !longitude) {
      return res.status(400).json({ erro: 'Campos obrigatórios: motorista, latitude, longitude' });
    }

    const localizacao = new Localizacao({
      motorista,
      latitude,
      longitude,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    });

    await localizacao.save();
    res.status(201).json(localizacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Listar localizações de um motorista
exports.listarLocalizacoes = async (req, res) => {
  try {
    const { motorista } = req.params;
    const localizacoes = await Localizacao.find({ motorista }).sort({ timestamp: -1 }).limit(100);
    res.json(localizacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};