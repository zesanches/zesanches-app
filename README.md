# José Sanches Portfolio

Um portfólio minimalista e moderno desenvolvido para apresentar projetos, experiências e conteúdos de José Sanches, Senior Front-end React Engineer.

## 🎯 Sobre o Projeto

Este projeto é uma aplicação web single-page que serve como portfólio pessoal, incluindo:

- **Sobre**: Apresentação pessoal e informações profissionais
- **Experiência**: Histórico profissional e projetos desenvolvidos
- **Blog**: Artigos e conteúdos técnicos
- **Livros**: Recomendações de leitura

## 🚀 Tecnologias Utilizadas

### Core
- **[React](https://react.dev/)** (v19.2.3) - Biblioteca JavaScript para construção de interfaces
- **[TypeScript](https://www.typescriptlang.org/)** (v5.8.2) - Superset JavaScript com tipagem estática
- **[Vite](https://vitejs.dev/)** (v6.2.0) - Build tool e dev server de alta performance

### Roteamento
- **[React Router DOM](https://reactrouter.com/)** (v7.11.0) - Gerenciamento de rotas da aplicação

### UI/UX
- **[@phosphor-icons/react](https://phosphoricons.com/)** (v2.1.10) - Biblioteca de ícones moderna e flexível

### DevTools
- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react)** - Plugin oficial do React para Vite
- **@types/react** & **@types/node** - Definições de tipos TypeScript

## 📦 Instalação

### Pré-requisitos

- **Node.js** (versão 18 ou superior recomendada)
- **npm** ou **yarn**

### Passos

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd zesanchesdev-app
```

2. Instale as dependências:
```bash
npm install
```

3. (Opcional) Configure variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto se necessário:
```env
GEMINI_API_KEY=sua-chave-api
```

## 🔧 Scripts Disponíveis

### Desenvolvimento
```bash
npm run dev
```
Inicia o servidor de desenvolvimento na porta 3000. A aplicação estará disponível em `http://localhost:3000`

### Build de Produção
```bash
npm run build
```
Cria uma build otimizada para produção na pasta `dist/`

### Preview da Build
```bash
npm run preview
```
Visualiza a build de produção localmente

## 🏗️ Estrutura do Projeto

```
zesanchesdev-app/
├── components/      # Componentes React reutilizáveis
├── contexts/        # Contextos React (AppContext)
├── pages/          # Páginas da aplicação
│   ├── About.tsx
│   ├── Experience.tsx
│   ├── Blog.tsx
│   └── Books.tsx
├── App.tsx         # Componente principal
├── index.tsx       # Ponto de entrada
├── index.html      # Template HTML
├── constants.ts    # Constantes da aplicação
├── types.ts        # Definições de tipos TypeScript
└── vite.config.ts  # Configuração do Vite
```

## ⚙️ Configurações

### Vite
- Servidor rodando na porta 3000
- Alias `@/` configurado para o diretório raiz
- Hot Module Replacement (HMR) habilitado

### TypeScript
- Target: ES2022
- Module: ESNext
- JSX: react-jsx
- Paths configurados para importações absolutas

## 📝 Licença

Este é um projeto privado de portfólio pessoal.

## 👨‍💻 Autor

**José Sanches** - Senior Front-end React Engineer

---

Desenvolvido com ❤️ usando React e TypeScript
