import { randomBytes } from 'node:crypto'
import prisma from '../lib/prisma.js'

// Localiza os equipamentos antigos sem código.
async function executar() {
  const equipamentos = await prisma.equipamento.findMany({
    where: {
      codigoAcompanhamento: null,
    },
    select: {
      id: true,
      categoria: true,
    },
  })

  for (const equipamento of equipamentos) {
    const codigo = randomBytes(16)
      .toString('hex')
      .toUpperCase()

    await prisma.equipamento.update({
      where: { id: equipamento.id },
      data: {
        codigoAcompanhamento: codigo,
      },
    })

    console.log(
      `${equipamento.categoria}: ${codigo}`
    )
  }

  console.log(
    `${equipamentos.length} equipamento(s) atualizado(s).`
  )
}

try {
  await executar()
} catch (error) {
  console.error('Erro ao preencher códigos:', error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
