import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../app.js'

describe('API E-Ciclo', () => {
  it('deve retornar 404 para uma rota inexistente', async () => {
    const resposta = await request(app)
      .get('/rota-inexistente')

    expect(resposta.status).toBe(404)
  })
})
