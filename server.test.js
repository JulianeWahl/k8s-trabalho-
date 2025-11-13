const request = require('supertest');
const express = require('express');

const app = express();
app.get('/ping', (req, res) => res.send('pong'));

describe('Testes da rota /ping', () => {
  it('deve retornar pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('pong');
  });
});
