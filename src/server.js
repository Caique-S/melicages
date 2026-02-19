require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const os = require('os');

const PORT = process.env.PORT || 3003;

// Função para obter o IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Conectar ao banco de dados
connectDB().catch(err => {
    console.error('❌ Falha na conexão com MongoDB:', err);
    process.exit(1);
});

const server = app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('\n=================================');
    console.log('✅ Servidor rodando!');
    console.log('=================================');
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`🌐 Rede: http://${localIP}:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
    console.log('=================================\n');
});

// Tratamento de erros do servidor
server.on('error', (error) => {
    console.error('❌ Erro no servidor:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`⚠️ Porta ${PORT} já está em uso. Tente outra porta.`);
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM recebido. Encerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor encerrado.');
        mongoose.connection.close();
    });
});