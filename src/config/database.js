const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔄 Conectando ao MongoDB...');
        
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI não está definida no arquivo .env');
        }

        console.log('📦 URI do MongoDB:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Esconde a senha

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'brj_transportes',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
            socketTimeoutMS: 45000, // Socket timeout de 45 segundos
        });

        console.log('✅ MongoDB conectado com sucesso!');
        console.log(`📊 Banco de dados: ${conn.connection.name}`);
        console.log(`🖥️ Host: ${conn.connection.host}`);
        
        // Eventos de conexão
        mongoose.connection.on('error', (err) => {
            console.error('❌ Erro na conexão MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ MongoDB desconectado');
        });

        return conn;
    } catch (error) {
        console.error('❌ Erro ao conectar ao MongoDB:', error);
        console.error('Detalhes do erro:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;