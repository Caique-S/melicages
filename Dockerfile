# 1. Escolhe a versão do Node.js que vamos usar (a mesma que você usa localmente)
FROM node:20

# 2. Define a pasta de trabalho dentro do container
WORKDIR /app

# 3. Copia os arquivos de configuração primeiro (para aproveitar o cache do Docker)
COPY package*.json ./

# 4. Instala as dependências do projeto
RUN npm install

# 5. Copia todo o resto do projeto para dentro do container
COPY . .


# 7. Comando para iniciar a aplicação quando o container rodar
CMD ["node", "src/server.js"]