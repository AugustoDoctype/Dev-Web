/*
  Warnings:

  - A unique constraint covering the columns `[codigo_acompanhamento]` on the table `equipamentos` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "equipamentos" ADD COLUMN "codigo_acompanhamento" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "equipamentos_codigo_acompanhamento_key" ON "equipamentos"("codigo_acompanhamento");
