import { describe, expect, it, vi } from 'vitest'
import request from 'supertest'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import app from '../app.js'
import prisma from '../lib/prisma.js'
import { JWT_SECRET, JWT_ISSUER, JWT_AUDIENCE } from '../config/jwt.js'
import { JWT_DOADOR_AUDIENCE, criarTokenDoador } from '../config/jwtDoador.js'

describe('Conta de doador', () => {
  it('exige login para ler o perfil', async () => {
    const resposta = await request(app).get('/doadores/me')
    expect(resposta.status).toBe(401)
  })

  it('não permite usar JWT administrativo na área de doadores', async () => {
    const token = jwt.sign({ id: 'admin-123' }, JWT_SECRET, {
      algorithm: 'HS256', issuer: JWT_ISSUER, audience: JWT_AUDIENCE,
    })
    const resposta = await request(app).get('/doadores/me')
      .set('Authorization', `Bearer ${token}`)
    expect(resposta.status).toBe(403)
  })

  it('não permite usar JWT de doador em rota administrativa', async () => {
    const token = criarTokenDoador({ id: 'doador-123' })
    const resposta = await request(app).get('/equipamentos')
      .set('Authorization', `Bearer ${token}`)
    expect(resposta.status).toBe(403)
  })

  it('não vincula uma conta nova a um doador antigo somente pelo e-mail', async () => {
    const consulta = vi.spyOn(prisma.doador, 'findUnique').mockResolvedValue({ id: 'doador-antigo' })
    const criacao = vi.spyOn(prisma.doador, 'create')
    try {
      const resposta = await request(app).post('/doador-auth/cadastro').send({
        nome: 'Usuário Exemplo', email: 'antigo@exemplo.com',
        whatsapp: '92999999999', bairro: 'Centro', senha: 'SenhaDeTesteForte123!',
      })
      expect(resposta.status).toBe(409)
      expect(criacao).not.toHaveBeenCalled()
    } finally {
      consulta.mockRestore()
      criacao.mockRestore()
    }
  })


  it('cria doador e conta em uma única operação aninhada', async () => {
    const consulta = vi.spyOn(prisma.doador, 'findUnique').mockResolvedValue(null)
    const criacao = vi.spyOn(prisma.doador, 'create').mockResolvedValue({
      id: 'doador-novo', nome: 'Doador Novo', email: 'novo@exemplo.com',
      whatsapp: '92999999999', bairro: 'Centro',
    })
    try {
      const resposta = await request(app).post('/doador-auth/cadastro').send({
        nome: 'Doador Novo', email: 'novo@exemplo.com',
        whatsapp: '92999999999', bairro: 'Centro', senha: 'SenhaDeTesteForte123!',
      })
      expect(resposta.status).toBe(201)
      expect(resposta.body.token).toBeTypeOf('string')
      expect(criacao).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          email: 'novo@exemplo.com',
          conta: { create: { senhaHash: expect.any(String) } },
        }),
      }))
    } finally {
      consulta.mockRestore()
      criacao.mockRestore()
    }
  })

  it('não permite editar endereço de outro doador', async () => {
    const consulta = vi.spyOn(prisma.enderecoDoador, 'findFirst').mockResolvedValue(null)
    try {
      const resposta = await request(app)
        .put('/doadores/me/enderecos/endereco-de-outra-pessoa')
        .set('Authorization', `Bearer ${criarTokenDoador({ id: 'doador-123' })}`)
        .send({ numero: '25' })
      expect(resposta.status).toBe(404)
    } finally {
      consulta.mockRestore()
    }
  })

  it('autentica doador válido com token separado do administrador', async () => {
    const senha = 'SenhaDeTesteForte123!'
    const senhaHash = await bcrypt.hash(senha, 4)
    const consulta = vi.spyOn(prisma.doador, 'findUnique').mockResolvedValue({
      id: 'doador-123', nome: 'Doador Teste', email: 'doador@exemplo.com',
      whatsapp: '92999999999', bairro: 'Centro', conta: { senhaHash },
    })
    try {
      const resposta = await request(app).post('/doador-auth/login').send({
        email: 'doador@exemplo.com', senha,
      })
      expect(resposta.status).toBe(200)
      expect(resposta.body.dados).not.toHaveProperty('senhaHash')
      const payload = jwt.verify(resposta.body.token, JWT_SECRET, {
        algorithms: ['HS256'], issuer: JWT_ISSUER, audience: JWT_DOADOR_AUDIENCE,
      })
      expect(payload.id).toBe('doador-123')
      expect(payload.tipo).toBe('DOADOR')
    } finally {
      consulta.mockRestore()
    }
  })

  it('retorna perfil autenticado sem expor senha', async () => {
    const consulta = vi.spyOn(prisma.doador, 'findUnique').mockResolvedValue({
      id: 'doador-123', nome: 'Doador Teste', email: 'doador@exemplo.com',
      whatsapp: '92999999999', bairro: 'Centro', enderecos: [],
    })
    try {
      const resposta = await request(app).get('/doadores/me')
        .set('Authorization', `Bearer ${criarTokenDoador({ id: 'doador-123' })}`)
      expect(resposta.status).toBe(200)
      expect(resposta.body.dados.nome).toBe('Doador Teste')
      expect(resposta.body.dados).not.toHaveProperty('senhaHash')
    } finally {
      consulta.mockRestore()
    }
  })

  it('recusa cadastrar equipamento próprio sem autenticação', async () => {
    const resposta = await request(app).post('/doadores/me/equipamentos').send({
      categoria: 'Monitores e telas', descricao: 'Monitor de teste',
    })
    expect(resposta.status).toBe(401)
  })

  it('ignora identidade escolhida pelo navegador: não aceita doadorId ou status', async () => {
    const token = criarTokenDoador({ id: 'doador-123' })
    const resposta = await request(app).post('/doadores/me/equipamentos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        categoria: 'Monitores e telas', descricao: 'Monitor de teste',
        doadorId: 'outro-doador', status: 'CONCLUIDO',
        enderecoId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
      })
    expect(resposta.status).toBe(400)
  })

  it('cadastra equipamento com snapshot de endereço do titular e status pendente', async () => {
    const token = criarTokenDoador({ id: 'doador-123' })
    const enderecoId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
    const endereco = {
      cep: '69000000', logradouro: 'Rua das Flores', numero: '123',
      bairro: 'Centro', cidade: 'Manaus', estado: 'AM',
    }
    const consultaDoador = vi.spyOn(prisma.doador, 'findUnique').mockResolvedValue({ id: 'doador-123' })
    const consultaEndereco = vi.spyOn(prisma.enderecoDoador, 'findFirst').mockResolvedValue(endereco)
    const consultaDuplicado = vi.spyOn(prisma.equipamento, 'findFirst').mockResolvedValue(null)
    const criacao = vi.spyOn(prisma.equipamento, 'create').mockResolvedValue({
      id: 'eq-123', categoria: 'Monitores e telas', descricao: 'Monitor de teste',
      status: 'PENDENTE', codigoAcompanhamento: 'A'.repeat(32),
    })
    try {
      const resposta = await request(app).post('/doadores/me/equipamentos')
        .set('Authorization', `Bearer ${token}`)
        .send({ categoria: 'Monitores e telas', descricao: 'Monitor de teste', enderecoId })
      expect(resposta.status).toBe(201)
      expect(consultaEndereco).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: enderecoId, doadorId: 'doador-123' },
      }))
      expect(resposta.body.dados.codigoAcompanhamento).toHaveLength(32)
      expect(criacao).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          doadorId: 'doador-123', status: 'PENDENTE',
          codigoAcompanhamento: expect.stringMatching(/^[A-F0-9]{32}$/),
          enderecoColetaCep: '69000000',
          enderecoColetaLogradouro: 'Rua das Flores',
          enderecoColetaNumero: '123',
          enderecoColetaBairro: 'Centro',
          enderecoColetaCidade: 'Manaus',
          enderecoColetaEstado: 'AM',
        }),
      }))
    } finally {
      consultaDoador.mockRestore()
      consultaEndereco.mockRestore()
      consultaDuplicado.mockRestore()
      criacao.mockRestore()
    }
  })

  it('recusa cadastrar equipamento sem endereço selecionado', async () => {
    const resposta = await request(app).post('/doadores/me/equipamentos')
      .set('Authorization', `Bearer ${criarTokenDoador({ id: 'doador-123' })}`)
      .send({ categoria: 'Monitores e telas', descricao: 'Monitor de teste' })
    expect(resposta.status).toBe(400)
  })

  it('impede usar endereço de outro doador no cadastro', async () => {
    const enderecoId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'
    const consultaDoador = vi.spyOn(prisma.doador, 'findUnique').mockResolvedValue({ id: 'doador-123' })
    const consultaEndereco = vi.spyOn(prisma.enderecoDoador, 'findFirst').mockResolvedValue(null)
    const criacao = vi.spyOn(prisma.equipamento, 'create')
    try {
      const resposta = await request(app).post('/doadores/me/equipamentos')
        .set('Authorization', `Bearer ${criarTokenDoador({ id: 'doador-123' })}`)
        .send({ categoria: 'Monitores e telas', descricao: 'Monitor de teste', enderecoId })
      expect(resposta.status).toBe(404)
      expect(consultaEndereco).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: enderecoId, doadorId: 'doador-123' },
      }))
      expect(criacao).not.toHaveBeenCalled()
    } finally {
      consultaDoador.mockRestore()
      consultaEndereco.mockRestore()
      criacao.mockRestore()
    }
  })

  it('não permite consultar endereços sem token', async () => {
    const resposta = await request(app).get('/doadores/me/enderecos')
    expect(resposta.status).toBe(401)
  })
})
