const Localizacao = require('../models/Localizacao');

// Receber localização
exports.receberLocalizacao = async (req, res) => {
    console.log('📍 Recebendo localização...');
    console.log('Body:', req.body);
    
    try {
        const { motorista, latitude, longitude, timestamp } = req.body;

        // Validações
        if (!motorista) {
            console.log('❌ Erro: motorista não fornecido');
            return res.status(400).json({ erro: 'Campo obrigatório: motorista' });
        }

        if (latitude === undefined || latitude === null) {
            console.log('❌ Erro: latitude não fornecida');
            return res.status(400).json({ erro: 'Campo obrigatório: latitude' });
        }

        if (longitude === undefined || longitude === null) {
            console.log('❌ Erro: longitude não fornecida');
            return res.status(400).json({ erro: 'Campo obrigatório: longitude' });
        }

        // Validação de tipos
        if (isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
            console.log('❌ Erro: latitude ou longitude inválidas');
            return res.status(400).json({ erro: 'Latitude e longitude devem ser números válidos' });
        }

        console.log(`✅ Dados válidos - Motorista: ${motorista}, Lat: ${latitude}, Long: ${longitude}`);

        const localizacao = new Localizacao({
            motorista,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            timestamp: timestamp ? new Date(timestamp) : new Date(),
        });

        console.log('📦 Salvando localização...');
        const localizacaoSalva = await localizacao.save();
        console.log('✅ Localização salva com sucesso! ID:', localizacaoSalva._id);

        res.status(201).json({
            success: true,
            message: 'Localização recebida com sucesso',
            data: localizacaoSalva
        });

    } catch (error) {
        console.error('❌ Erro ao salvar localização:', error);
        console.error('Stack trace:', error.stack);
        res.status(500).json({ 
            erro: 'Erro interno do servidor',
            detalhes: error.message 
        });
    }
};

// Listar localizações de um motorista
exports.listarLocalizacoes = async (req, res) => {
    console.log('📋 Listando localizações...');
    console.log('Motorista:', req.params.motorista);
    
    try {
        const { motorista } = req.params;
        
        if (!motorista) {
            console.log('❌ Erro: motorista não especificado');
            return res.status(400).json({ erro: 'Nome do motorista é obrigatório' });
        }

        console.log('🔍 Buscando localizações...');
        const localizacoes = await Localizacao.find({ motorista })
            .sort({ timestamp: -1 })
            .limit(100);

        console.log(`✅ Encontradas ${localizacoes.length} localizações`);

        res.json({
            success: true,
            count: localizacoes.length,
            data: localizacoes
        });

    } catch (error) {
        console.error('❌ Erro ao listar localizações:', error);
        res.status(500).json({ 
            erro: 'Erro interno do servidor',
            detalhes: error.message 
        });
    }
};