# Dockerfile
FROM node:18

# Define o diretório de trabalho
WORKDIR /app

# Copia o código para dentro do container
COPY server.js ./

# Instala as dependências
RUN npm install express prom-client

# Expõe a porta 3000
EXPOSE 3000

# Comando para iniciar o app
CMD ["node", "server.js"]
