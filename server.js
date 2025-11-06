const express = require('express');
const client = require('prom-client');
const path = require('path');


const app = express();
const port = 3000;


// Serve os arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));


// Contador de requisições HTTP recebidas
const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas'
});


// Sumário para medir tempo de resposta das requisições
const responseTimeSummary = new client.Summary({
  name: 'http_response_time_seconds',
  help: 'Tempo de resposta das requisições HTTP em segundos'
});


// Gauge para monitorar número de usuários conectados
const activeUsers = new client.Gauge({
  name: 'active_users',
  help: 'Número de usuários conectados'
});


// Histograma para distribuição do tempo de resposta
const responseHistogram = new client.Histogram({
  name: 'http_response_duration_seconds',
  help: 'Distribuição do tempo de resposta HTTP',
  buckets: [0.1, 0.5, 1, 2, 5]
});


// Middleware para registrar métricas em cada requisição
app.use((req, res, next) => {
  requestCounter.inc();


  const endSummary = responseTimeSummary.startTimer();
  const endHistogram = responseHistogram.startTimer();


  res.on('finish', () => {
    endSummary();
    endHistogram();
  });


  next();
});


// Simula login de usuário
app.get('/login', (req, res) => {
  activeUsers.inc();
  res.send('Login realizado com sucesso. Usuário conectado.');
});


// Simula logout de usuário
app.get('/logout', (req, res) => {
  activeUsers.dec();
  res.send('Logout realizado. Usuário desconectado.');
});


// Endpoint para Prometheus coletar as métricas
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});


// Inicializa o servidor
app.listen(port, () => {
  console.log(`✅ Servidor rodando na porta ${port}`);
});
