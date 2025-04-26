const request = require('supertest');
const app = require('../index');

describe('API Health', () => {
  it('GET / should return backend status', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/FURIA Fan Chat/);
  });
});

describe('GET /api/jogos', () => {
  it('should return jogos with status 200', async () => {
    const res = await request(app).get('/api/jogos');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('jogos');
  });
});
