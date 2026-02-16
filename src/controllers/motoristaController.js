const Motorista = require('../models/Motorista');

// Registrar chegada
exports.registrarChegada = async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: 'Nome é obrigatório' });
    }

    const agora = new Date();
    const motorista = new Motorista({
      nome,
      dataChegada: agora.toLocaleDateString('pt-BR'),
      horaChegada: agora.toLocaleTimeString('pt-BR'),
      timestampChegada: agora,
    });

    await motorista.save();
    res.status(201).json(motorista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Iniciar descarga
exports.iniciarDescarga = async (req, res) => {
  try {
    const { id } = req.params;
    const motorista = await Motorista.findById(id);
    if (!motorista) {
      return res.status(404).json({ erro: 'Motorista não encontrado' });
    }
    if (motorista.status !== 'aguardando') {
      return res.status(400).json({ erro: 'Motorista não está aguardando' });
    }

    const agora = new Date();
    motorista.status = 'descarregando';
    motorista.timestampInicioDescarga = agora;
    motorista.tempoFila = Math.floor((agora - motorista.timestampChegada) / 1000);

    await motorista.save();
    res.json(motorista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Finalizar descarga
exports.finalizarDescarga = async (req, res) => {
  try {
    const { id } = req.params;
    const motorista = await Motorista.findById(id);
    if (!motorista) {
      return res.status(404).json({ erro: 'Motorista não encontrado' });
    }
    if (motorista.status !== 'descarregando') {
      return res.status(400).json({ erro: 'Motorista não está descarregando' });
    }

    const agora = new Date();
    motorista.status = 'descarregado';
    motorista.timestampFimDescarga = agora;
    motorista.tempoDescarga = Math.floor((agora - motorista.timestampInicioDescarga) / 1000);

    await motorista.save();
    res.json(motorista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Listar motoristas (com filtro opcional por status)
exports.listarMotoristas = async (req, res) => {
  try {
    const { status } = req.query;
    const filtro = status ? { status } : {};
    const motoristas = await Motorista.find(filtro).sort({ timestampChegada: 1 });
    res.json(motoristas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};

// Obter um motorista específico
exports.obterMotorista = async (req, res) => {
  try {
    const motorista = await Motorista.findById(req.params.id);
    if (!motorista) {
      return res.status(404).json({ erro: 'Motorista não encontrado' });
    }
    res.json(motorista);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
};