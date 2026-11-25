-- Migração aditiva: preserva todas as tabelas e os dados existentes.
CREATE TABLE "pontos_coleta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "horario" TEXT NOT NULL DEFAULT '',
    "materiais" TEXT NOT NULL DEFAULT '[]',
    "categoria" TEXT NOT NULL DEFAULT 'Eletrônicos em geral',
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Ativo',
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);
