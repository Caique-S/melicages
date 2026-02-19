const Motorista = require('../models/Motorista');

// Registrar chegada
exports.registrarChegada = async (req, res) => {
    console.log('📝 Iniciando registro de chegada...');
    console.log('Body recebido:', req.body);
    
    try {
        const { nome } = req.body;
        
        if (!nome) {
            console.log('❌ Erro: Nome não fornecido');
            return res.status(400).json({ erro: 'Nome é obrigatório' });
        }

        console.log(`✅ Nome válido: ${nome}`);

        const agora = new Date();
        console.log('🕒 Timestamp atual:', agora);

        const motorista = new Motorista({
            nome,
            dataChegada: agora.toLocaleDateString('pt-BR'),
            horaChegada: agora.toLocaleTimeString('pt-BR'),
            timestampChegada: agora,
            status: 'aguardando'
        });

        console.log('📦 Motorista a ser salvo:', motorista);

        const motoristaSalvo = await motorista.save();
        console.log('✅ Motorista salvo com sucesso! ID:', motoristaSalvo._id);

        res.status(201).json({
            success: true,
            message: 'Chegada registrada com sucesso',
            data: motoristaSalvo
        });

    } catch (error) {
        console.error('❌ Erro ao registrar chegada:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            erro: 'Erro interno do servidor',
            detalhes: error.message 
        });
    }
};

// Iniciar descarga
exports.iniciarDescarga = async (req, res) => {
    console.log('🔄 Iniciando processo de descarga...');
    console.log('ID do motorista:', req.params.id);
    
    try {
        const { id } = req.params;
        
        if (!id) {
            console.log('❌ Erro: ID não fornecido');
            return res.status(400).json({ erro: 'ID do motorista é obrigatório' });
        }

        console.log('🔍 Buscando motorista...');
        const motorista = await Motorista.findById(id);
        
        if (!motorista) {
            console.log('❌ Motorista não encontrado. ID:', id);
            return res.status(404).json({ erro: 'Motorista não encontrado' });
        }

        console.log('✅ Motorista encontrado:', motorista.nome);
        console.log('Status atual:', motorista.status);

        if (motorista.status !== 'aguardando') {
            console.log('❌ Status inválido para iniciar descarga:', motorista.status);
            return res.status(400).json({ 
                erro: 'Motorista não está aguardando',
                statusAtual: motorista.status
            });
        }

        const agora = new Date();
        motorista.status = 'descarregando';
        motorista.timestampInicioDescarga = agora;
        motorista.tempoFila = Math.floor((agora - motorista.timestampChegada) / 1000);

        console.log('⏱️ Tempo em fila:', motorista.tempoFila, 'segundos');

        const motoristaAtualizado = await motorista.save();
        console.log('✅ Descarga iniciada com sucesso!');

        res.json({
            success: true,
            message: 'Descarga iniciada com sucesso',
            data: motoristaAtualizado
        });

    } catch (error) {
        console.error('❌ Erro ao iniciar descarga:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            erro: 'Erro interno do servidor',
            detalhes: error.message 
        });
    }
};

// Finalizar descarga
exports.finalizarDescarga = async (req, res) => {
    console.log('🏁 Finalizando descarga...');
    console.log('ID do motorista:', req.params.id);
    
    try {
        const { id } = req.params;
        
        const motorista = await Motorista.findById(id);
        
        if (!motorista) {
            console.log('❌ Motorista não encontrado');
            return res.status(404).json({ erro: 'Motorista não encontrado' });
        }

        if (motorista.status !== 'descarregando') {
            console.log('❌ Status inválido para finalizar descarga:', motorista.status);
            return res.status(400).json({ 
                erro: 'Motorista não está descarregando',
                statusAtual: motorista.status
            });
        }

        const agora = new Date();
        motorista.status = 'descarregado';
        motorista.timestampFimDescarga = agora;
        motorista.tempoDescarga = Math.floor((agora - motorista.timestampInicioDescarga) / 1000);

        console.log('⏱️ Tempo de descarga:', motorista.tempoDescarga, 'segundos');

        const motoristaAtualizado = await motorista.save();
        console.log('✅ Descarga finalizada com sucesso!');

        res.json({
            success: true,
            message: 'Descarga finalizada com sucesso',
            data: motoristaAtualizado
        });

    } catch (error) {
        console.error('❌ Erro ao finalizar descarga:', error);
        res.status(500).json({ 
            erro: 'Erro interno do servidor',
            detalhes: error.message 
        });
    }
};

// Listar motoristas
exports.listarMotoristas = async (req, res) => {
    console.log('📋 Listando motoristas...');
    console.log('Query params:', req.query);
    
    try {
        const { status } = req.query;
        const filtro = status ? { status } : {};
        
        console.log('🔍 Filtro aplicado:', filtro);

        const motoristas = await Motorista.find(filtro)
            .sort({ timestampChegada: -1 })
            .limit(100);

        console.log(`✅ Encontrados ${motoristas.length} motoristas`);

        res.json({
            success: true,
            count: motoristas.length,
            data: motoristas
        });

    } catch (error) {
        console.error('❌ Erro ao listar motoristas:', error);
        res.status(500).json({ 
            erro: 'Erro interno do servidor',
            detalhes: error.message 
        });
    }
};

// Obter um motorista específico
exports.obterMotorista = async (req, res) => {
    console.log('🔍 Buscando motorista específico...');
    console.log('ID:', req.params.id);
    
    try {
        const motorista = await Motorista.findById(req.params.id);
        
        if (!motorista) {
            console.log('❌ Motorista não encontrado');
            return res.status(404).json({ erro: 'Motorista não encontrado' });
        }

        console.log('✅ Motorista encontrado:', motorista.nome);
        res.json({
            success: true,
            data: motorista
        });

    } catch (error) {
        console.error('❌ Erro ao buscar motorista:', error);
        res.status(500).json({ 
            erro: 'Erro interno do servidor',
            detalhes: error.message 
        });
    }
};