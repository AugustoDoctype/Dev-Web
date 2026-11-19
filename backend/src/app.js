
import express from 'express'
import cors from 'cors'
import { setupSwagger } from './swagger.js'
import prisma from './lib/prisma.js'

import dashboardRoutes from './routes/dashboardRoutes.js'
import doadorRoutes from './routes/doadorRoutes.js'
import equipamentoRoutes from './routes/equipamentoRoutes.js'
import authRoutes from './routes/authRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

setupSwagger(app)

app.use('/uploads', express.static('uploads'))

app.get('/', async (req, res) => {
  try {
    const equipamentos = await prisma.equipamento.findMany()

    return res.json({
      sucesso: true,
      mensagem: 'API rodando e conectada ao banco com sucesso! 🚀',
      totalEquipamentos: equipamentos.length,
      dados: equipamentos
    })
  } catch (erro) {
    return res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao conectar no banco de dados',
      erro: erro.message
    })
  }
})

app.use('/', authRoutes)
app.use('/doadores', doadorRoutes)
app.use('/equipamentos', equipamentoRoutes)
app.use('/dashboard', dashboardRoutes)

export default app
