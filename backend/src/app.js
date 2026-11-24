import express from 'express'
import cors from 'cors'
import { setupSwagger } from './swagger.js'
import prisma from './lib/prisma.js'

import dashboardRoutes from './routes/dashboardRoutes.js'
import doadorRoutes from './routes/doadorRoutes.js'
import equipamentoRoutes from './routes/equipamentoRoutes.js'
import authRoutes from './routes/authRoutes.js'
import acompanhamentoRoutes from './routes/acompanhamentoRoutes.js'
import doadorAuthRoutes from './routes/doadorAuthRoutes.js'
import perfilDoadorRoutes from './routes/perfilDoadorRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

setupSwagger(app)

app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'))

app.get('/', async (req, res) => {
  try {
    await prisma.equipamento.count()
    return res.status(200).json({
      sucesso: true,
      mensagem: 'API E-Ciclo online e conectada ao banco.',
    })
  } catch (error) {
    console.error('Erro na verificação da API:', error)
    return res.status(500).json({ sucesso: false, mensagem: 'API indisponível.' })
  }
})

app.use('/', authRoutes)
app.use('/doador-auth', doadorAuthRoutes)
app.use('/doadores/me', perfilDoadorRoutes)
app.use('/doadores', doadorRoutes)
app.use('/equipamentos', equipamentoRoutes)
app.use('/dashboard', dashboardRoutes)
app.use('/acompanhamento', acompanhamentoRoutes)

export default app
