-- CreateTable
CREATE TABLE "contas_doadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doador_id" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contas_doadores_doador_id_fkey" FOREIGN KEY ("doador_id") REFERENCES "doadores" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "enderecos_doadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "doador_id" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "preferencial" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "enderecos_doadores_doador_id_fkey" FOREIGN KEY ("doador_id") REFERENCES "doadores" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "contas_doadores_doador_id_key" ON "contas_doadores"("doador_id");
