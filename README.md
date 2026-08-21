# 🚀 Projeto Web (Front-end & Back-end)

Este é o repositório principal do projeto, estruturado no formato de *monorepo simples*, contendo o **Front-end** (React + Vite) e o **Back-end** (Node.js + Express) em pastas isoladas.

---

## 📁 Estrutura do Repositório

```text
.
├── frontend/             # Aplicação React + Vite
│   ├── src/              # Códigos fonte da interface
│   ├── public/           # Arquivos estáticos
│   ├── package.json      # Dependências do Front-end
│   └── vite.config.js    # Configurações do Vite
│
├── backend/              # API Node.js + Express
│   ├── src/              # Rotas e controladores da API
│   ├── index.js          # Ponto de entrada do servidor
│   └── package.json      # Dependências do Back-end
│
├── .gitignore            # Arquivos e pastas ignorados pelo Git
└── README.md             # Documentação do projeto
```

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (Versão **v18.x** ou superior, recomendado **v20+** ou **v22+**)
* [npm](https://www.npmjs.com/) (Gerenciador de pacotes do Node)
* [Git](https://git-scm.com/)

---

## ⚙️ Passo a Passo para Rodar o Projeto

Siga as instruções abaixo para clonar, instalar as dependências e executar o projeto localmente.

### 1. Clonar o Repositório

No seu terminal, clone o projeto e acesse a pasta raiz:

```bash
# Clonar o repositório
git clone <URL_DO_REPOSITORIO>

# Entrar na pasta do projeto
cd Dev-Web
```

---

### 2. Configurar e Executar o Back-end (Node.js)

Abra um terminal e execute os comandos abaixo para subir o servidor da API:

```bash
# 1. Entrar na pasta do backend
cd backend

# 2. Instalar as dependências do servidor
npm install

# 3. Iniciar o servidor em modo de desenvolvimento (com Nodemon)
npm run dev
```

> 🟢 O servidor do Back-end estará rodando em: `http://localhost:3001`

---

### 3. Configurar e Executar o Front-end (React + Vite)

Abra um **novo terminal** (sem fechar o terminal do backend) e execute:

```bash
# 1. Entrar na pasta do frontend
cd frontend

# 2. Instalar as dependências do React
npm install

# 3. Iniciar o servidor de desenvolvimento do React
npm run dev
```

> 🔵 O Front-end estará disponível no seu navegador em: `http://localhost:5173`

---

## 🛠️ Tecnologias Utilizadas

### **Front-end**
* **React:** Biblioteca para construção de interfaces.
* **Vite:** Ferramenta de build rápida para o desenvolvimento front-end.
* **Axios:** Cliente HTTP para comunicação com a API back-end.
* **ESLint:** Padronização e verificação de qualidade de código.

### **Back-end**
* **Node.js:** Ambiente de execução JavaScript no servidor.
* **Express:** Framework web para criação de rotas e APIs.
* **CORS:** Middleware para permitir requisições entre o front-end e back-end.
* **Dotenv:** Gerenciamento de variáveis de ambiente.
* **Nodemon:** Reinicialização automática do servidor durante o desenvolvimento.

---

## 📝 Padronização de Commits (Commits Semânticos)

Para manter o histórico do Git limpo e organizado, seguimos o padrão de **Commits Semânticos**:

| Tipo | Uso | Exemplo |
| :--- | :--- | :--- |
| `feat` | Nova funcionalidade no sistema | `feat(frontend): adiciona tela de login` |
| `fix` | Correção de um erro/bug | `fix(backend): corrige erro na rota de usuarios` |
| `chore` | Alteração de configurações ou instalação de bibliotecas | `chore: instala biblioteca axios no frontend` |
| `docs` | Alterações na documentação | `docs: atualiza instruções no README.md` |
| `style` | Formatação de código ou ajustes visuais (CSS) | `style(frontend): ajusta margens do botao` |
| `refactor` | Reestruturação de código sem alterar o comportamento final | `refactor(backend): reorganiza estrutura de rotas` |

---

## 👥 Contribuição

1. Crie uma branch para sua funcionalidade: `git checkout -b feat/nome-da-feature`
2. Faça os commits das suas alterações no padrão semântico: `git commit -m "feat: minha nova feature"`
3. Envie para o repositório remoto: `git push origin feat/nome-da-feature`
4. Abra um **Pull Request**.