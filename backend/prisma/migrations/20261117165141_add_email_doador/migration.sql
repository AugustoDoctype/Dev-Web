/*
  Warnings:

  - Added the required column `email` to the `doadores` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_doadores" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "new_doadores" (
    "id",
    "nome",
    "email",
    "whatsapp",
    "bairro",
    "criado_em"
)
SELECT
    "id",
    "nome",
    'legacy-' || "id" || '@example.invalid',
    "whatsapp",
    "bairro",
    "criado_em"
FROM "doadores";

DROP TABLE "doadores";
ALTER TABLE "new_doadores" RENAME TO "doadores";
CREATE UNIQUE INDEX "doadores_email_key" ON "doadores"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
