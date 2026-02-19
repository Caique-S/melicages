const express = require('express');
const cors = require('cors');
const motoristasRoutes = require('./routes/motoristas');
const localizacoesRoutes = require('./routes/localizacoes');

const app = express();

// Middlewares - Configuração CORS mais permissiva para debug
app.use(cors({
    origin: '*', // Permite todas as origens em desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para log de todas as requisições
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/motoristas', motoristasRoutes);
app.use('/api/localizacoes', localizacoesRoutes);

// Rota de saudação
app.get('/', (req, res) => {
    console.log('✅ Rota raiz acessada');
    res.json({ 
        mensagem: 'API de Logística funcionando!',
        timestamp: new Date().toISOString(),
        status: 'online'
    });
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Middleware de erro global
app.use((err, req, res, next) => {
    console.error('❌ Erro global:', err);
    res.status(500).json({ 
        erro: 'Erro interno do servidor',
        detalhes: err.message 
    });
});

module.exports = app;