import { describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import app from '../app.js'
import prisma from '../lib/prisma.js'
import { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } from '../config/jwt.js'

describe('Segurança da API administrativa', () => {
  it('não permite criar administrador sem autenticação', async () => {
    const resposta = await request(app).post('/admins').send({
      nome: 'Exemplo Admin',
      email: 'admin-exemplo@teste.com',
      senha: 'uma-senha-forte-de-teste',
    })
    expect(resposta.status).toBe(401)
  })

  it('não aceita token inventado em rota protegida', async () => {
    const resposta = await request(app)
      .get('/equipamentos')
      .set('Authorization', 'Bearer token-falso')

    expect(resposta.status).toBe(403)
  })

  it('não aceita token assinado sem audience e issuer corretos', async () => {
    const token = jwt.sign({ id: 'admin-teste' }, JWT_SECRET, { algorithm: 'HS256' })
    const resposta = await request(app)
      .get('/equipamentos')
      .set('Authorization', `Bearer ${token}`)

    expect(resposta.status).toBe(403)
  })

  it('retorna 401 para credenciais erradas', async () => {
    const consulta = vi.spyOn(prisma.admin, 'findUnique').mockResolvedValue(null)
    try {
      const resposta = await request(app).post('/login').send({
        email: 'inexistente@teste.com',
        senha: 'senha-invalida',
      })
      expect(resposta.status).toBe(401)
      expect(resposta.body).not.toHaveProperty('token')
    } finally {
      consulta.mockRestore()
    }
  })

  it('realiza login válido com token assinado conforme a configuração', async () => {
    const senhaHash = await bcrypt.hash('senha-de-teste-com-12-caracteres', 4)
    const consulta = vi.spyOn(prisma.admin, 'findUnique').mockResolvedValue({
      id: 'admin-teste',
      nome: 'Administrador Teste',
      email: 'admin@teste.com',
      senhaHash,
    })

    try {
      const resposta = await request(app).post('/login').send({
        email: 'admin@teste.com',
        senha: 'senha-de-teste-com-12-caracteres',
      })
      expect(resposta.status).toBe(200)
      expect(resposta.body.token).toBeTypeOf('string')
      const payload = jwt.verify(resposta.body.token, JWT_SECRET, {
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
        algorithms: ['HS256'],
      })
      expect(payload.id).toBe('admin-teste')
    } finally {
      consulta.mockRestore()
    }
  })

  it('limita tentativas de consulta pública excessivas', async () => {
    // A chave por IP vale por janela de 15 minutos.
    // 60 solicitações são permitidas; após isso deve retornar 429.
    const respostas = []
    for (let i = 0; i < 61; i++) {
      const resposta = await request(app)
        .get('/acompanhamento/NAO-EXISTE')
      respostas.push(resposta.status)
    }
    expect(respostas).toContain(429)
  })
})
