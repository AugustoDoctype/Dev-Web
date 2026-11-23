-- Registros existentes não recebem modalidade arbitrária.
ALTER TABLE "equipamentos" ADD COLUMN "modalidade_entrega" TEXT NOT NULL DEFAULT 'NAO_INFORMADA';
