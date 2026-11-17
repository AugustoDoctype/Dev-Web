# ♻️ E-Ciclo

**Plataforma web para registro de doações e orientação sobre descarte responsável de resíduos eletrônicos.**

O E-Ciclo reúne informações sobre descarte de eletrônicos, permite cadastrar doadores e equipamentos e oferece uma interface administrativa para acompanhar os registros. O projeto está em desenvolvimento e utiliza um **monorepo** com frontend e backend separados.

> **Estado do projeto:** ambiente de desenvolvimento validado com Docker Compose em duas máquinas Linux. Algumas telas e integrações ainda estão em desenvolvimento; os pontos de coleta exibidos no mapa incluem dados demonstrativos e não devem ser tratados como locais reais verificados.

## Funcionalidades

- Interface pública com informações sobre descarte responsável de eletrônicos.
- Cadastro de doadores e registro de equipamentos, com envio opcional de foto pela API.
- Listagem e atualização de equipamentos e painel de indicadores com autenticação administrativa.
- Mapa interativo de pontos de coleta, atualmente com dados demonstrativos e armazenamento local de pontos personalizados.
- Telas para acompanhamento de doações, ainda dependentes de integração com endpoints não presentes no backend atual.
- Documentação interativa de parte da API usando Swagger UI.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, React Leaflet / Leaflet |
| Backend | Node.js 22, Express, Prisma ORM, Zod, Multer, JWT |
| Banco de dados | SQLite |
| Infraestrutura de desenvolvimento | Docker, Docker Compose |
| Integração contínua | GitHub Actions (workflows de frontend e backend) |

## Estrutura do repositório

```text
Dev-Web/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── schemas/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── uploads/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── package.json
├── .github/workflows/
├── docker-compose.yml
└── README.md
```

## Executando com Docker (recomendado)

### Pré-requisitos

- **Git**;
- **Docker Engine** (ou Docker Desktop com o engine ativo);
- **Docker Compose V2**, disponível pelo comando `docker compose`.

> Não é necessário instalar Node.js, npm ou Prisma diretamente no computador para executar o ambiente via Docker. A instalação e o funcionamento do engine de containers continuam sendo pré-requisitos.

### 1. Clonar o repositório

Para testar a configuração em desenvolvimento desta branch:

```bash
git clone -b feature/docker-setup https://github.com/AugustoDoctype/Dev-Web.git
cd Dev-Web
```

> Após a integração da branch à `main`, substitua o comando acima pelo clone padrão do repositório.

### 2. Construir e iniciar os serviços

Na raiz do projeto:

```bash
docker compose up --build
```

Na primeira execução, o Docker instala as dependências, constrói as imagens e inicia os serviços. O backend executa `prisma migrate deploy` antes de iniciar a API, aplicando migrations pendentes ao SQLite.

### 3. Acessar os serviços

| Serviço | Endereço local |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend / verificação básica do banco | http://localhost:3001 |
| Documentação Swagger da API | http://localhost:3001/api-docs |

Essas portas são as definidas no `docker-compose.yml` e precisam estar disponíveis no computador. Os endereços `localhost` pressupõem acesso pelo mesmo computador que executa os containers.

### 4. Verificar a execução

Em outro terminal, na raiz do projeto:

```bash
docker compose ps
curl http://localhost:3001
curl -I http://localhost:5173
docker compose exec backend npx prisma migrate status
```

Espera-se encontrar os serviços em execução, resposta da API, resposta HTTP do frontend e migrations atualizadas.

## Comandos úteis

Todos devem ser executados na raiz do repositório.

| Comando | Finalidade |
| --- | --- |
| `docker compose up --build` | Construir e iniciar os serviços |
| `docker compose up -d --build` | Iniciar em segundo plano |
| `docker compose ps` | Consultar o estado dos serviços |
| `docker compose logs -f backend` | Acompanhar logs do backend |
| `docker compose logs -f frontend` | Acompanhar logs do frontend |
| `docker compose down` | Parar e remover containers e rede do projeto |
| `docker compose exec backend npx prisma migrate status` | Verificar o histórico de migrations |

**Cuidado:** não utilize comandos de remoção de volumes ou exclusão do banco de dados sem entender suas consequências. Eles podem causar perda de dados.

## Banco de dados e arquivos enviados

O backend utiliza **Prisma com SQLite**. A variável `DATABASE_URL` é definida no Compose como `file:./dev.db`, com o arquivo do banco localizado no diretório `backend/prisma/` na configuração atual.

O Compose utiliza bind mounts (`./backend:/app` e `./frontend:/app`), adequados ao fluxo de desenvolvimento. Assim, as alterações do código local ficam disponíveis nos containers e o banco SQLite e os arquivos em `backend/uploads/` permanecem no computador após `docker compose down`.

- As migrations versionadas ficam em `backend/prisma/migrations/`.
- O backend aplica migrations existentes automaticamente na inicialização (`prisma migrate deploy`).
- Arquivos de banco (`*.db`) e novos uploads devem permanecer fora do controle de versão.
- Migrations novas devem ser adicionadas ao Git para que outros ambientes recebam a mesma estrutura.

> **Atenção ao atualizar bancos existentes:** a migration `add_email_doador` adiciona uma coluna obrigatória sem valor padrão. Ela foi validada em um banco limpo, mas pode exigir uma estratégia de migração de dados antes de ser aplicada a um banco que já contenha doadores. Não redefina um banco com dados importantes sem backup.

## API

A API Express disponibiliza, entre outras, as rotas abaixo:

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/` | Verifica a API e consulta equipamentos no SQLite |
| `POST` | `/doadores` | Cadastra ou retorna um doador existente pelo e-mail |
| `GET` | `/doadores` | Lista doadores (requer autenticação administrativa) |
| `POST` | `/equipamentos` | Cadastra equipamento; aceita foto via `multipart/form-data` |
| `GET` | `/equipamentos` | Lista equipamentos (requer autenticação administrativa) |
| `PUT` | `/equipamentos/:id` | Atualiza um equipamento (requer autenticação administrativa) |
| `DELETE` | `/equipamentos/:id` | Exclui um equipamento (requer autenticação administrativa) |
| `POST` | `/admins` | Cadastra administrador |
| `POST` | `/login` | Autentica administrador e retorna token |
| `GET` | `/dashboard` | Retorna indicadores (requer autenticação administrativa) |

A documentação Swagger está disponível em `/api-docs`. Consulte o código das rotas para detalhes de campos, autenticação e respostas; parte da documentação da API ainda pode precisar de atualização.

## Situação do desenvolvimento

O projeto **não deve ser considerado pronto para produção** com a configuração atual. Entre os pontos que ainda precisam de revisão estão:

- Integração de telas do frontend com endpoints ainda não implementados ou não alinhados ao backend.
- Segurança e gestão de segredos da autenticação administrativa.
- Estratégia de migrations para bancos com dados existentes.
- Configuração de produção, persistência e backup fora dos bind mounts de desenvolvimento.
- Ampliação dos testes automatizados e dos checks de integração contínua.

## Integração contínua

O repositório contém workflows em `.github/workflows/` para verificações separadas de frontend e backend, acionados em pushes e pull requests direcionados às branches `main` ou `master`.

O workflow do frontend executa o build do Vite. O workflow do backend instala dependências, gera o Prisma Client e executa `npm test`; atualmente, o script de teste do backend é um placeholder, não uma suíte de testes funcionais.

## Contribuindo

1. Atualize sua branch a partir da base de trabalho acordada pela equipe.
2. Crie uma branch com nome descritivo, como `feat/nova-funcionalidade`, `fix/correcao` ou `docs/documentacao`.
3. Faça mudanças pequenas e verificáveis; execute as verificações relevantes antes de enviar.
4. Registre as alterações com commits semânticos.
5. Envie a branch ao GitHub e abra um Pull Request para revisão antes de integrar à `main`.

### Padrão de commits

| Tipo | Quando usar | Exemplo |
| --- | --- | --- |
| `feat` | Nova funcionalidade | `feat(frontend): adiciona pagina de consulta` |
| `fix` | Correção de comportamento | `fix(backend): corrige validacao de doador` |
| `docs` | Documentação | `docs: atualiza README do projeto` |
| `chore` | Configurações e manutenção | `chore: adiciona dockerignore` |
| `refactor` | Reorganização sem alterar comportamento | `refactor(backend): organiza rotas` |
| `style` | Ajustes de apresentação/formatação | `style(frontend): ajusta espacamentos` |
| `test` | Testes | `test(backend): adiciona testes de cadastro` |

---

**E-Ciclo** — tecnologia e responsabilidade ambiental para um descarte mais consciente.
