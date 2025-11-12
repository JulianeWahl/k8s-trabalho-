# Usa Node 18 como base
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências com versões fixas
RUN npm ci

# Copia o restante do código
COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o app
CMD ["node", "server.js"]
