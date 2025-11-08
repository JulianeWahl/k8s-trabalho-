console.log("PORT:", process.env.PORT);
console.log("Teste de deploy ponta-a-ponta");

const express = require('express');
const client = require('prom-client');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'frontend')));

const requestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP recebidas'
});

const responseTimeSummary = new client.Summary({
  name: 'http_response_time_seconds',
  help: 'Tempo de resposta das requisições HTTP em segundos'
});

const activeUsers = new client.Gauge({
  name: 'active_users',
  help: 'Número de usuários conectados'
});

const responseHistogram = new client.Histogram({
  name: 'http_response_duration_seconds',
  help: 'Distribuição do tempo de resposta HTTP',
  buckets: [0.1, 0.5, 1, 2, 5]
});

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

app.get('/login', (req, res) => {
  activeUsers.inc();
  res.send('Login realizado com sucesso. Usuário conectado.');
});

app.get('/logout', (req, res) => {
  activeUsers.dec();
  res.send('Logout realizado. Usuário desconectado.');
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/ping', (req, res) => {
  res.send('pong');
});

app.listen(port, () => {
  console.log(`✅ Servidor rodando na porta ${port}`);
});
