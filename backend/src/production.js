// Entrada exclusiva para o Railway: React estático e API no mesmo domínio.
// O app Express existente continua inalterado para execução local.
import express from 'express'
import path from 'node:path'
import app from './app.js'

const server = express()
const publicDir = path.resolve(process.cwd(), '../frontend/dist')
const uploadsDir = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads')

// Todas as chamadas do frontend usam VITE_API_URL=/api em produção.
server.use('/api', app)
server.use('/api', (_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }))

// Compatibilidade com URLs de fotos previamente retornadas pela API.
server.use('/uploads', express.static(uploadsDir))
server.use(express.static(publicDir, { index: false }))

// React Router: recarregar /login, /meu-perfil e outras páginas funciona.
server.get('*', (_req, res) => res.sendFile(path.join(publicDir, 'index.html')))

const port = Number(process.env.PORT || 3001)
server.listen(port, '0.0.0.0', () => {
  console.log(`E-Ciclo em execução na porta ${port}`)
})
