# Agenda Fácil Acadêmico

MVP acadêmico do POOALAB. Permite que estudantes da UCSal escolham um tipo de atendimento (Coordenação, Professor ou CRA), escolham um horário disponível, revisem os dados e recebam um código de agendamento no formato `AGD-AAAA-NNN`. Também é possível listar, cancelar e reagendar os próprios agendamentos.

Os dados são fictícios e de demonstração. Não há integração com sistemas ou autenticação institucional da UCSal.

## Estrutura

```
backend/    API REST: Java 21, Spring Boot, PostgreSQL 18 (API e banco via Docker Compose)
frontend/   Interface: React, Vite, TypeScript, Tailwind e shadcn/ui
```

## Pré-requisitos

- Java 21
- Docker (com Docker Compose)
- Node.js 24 e npm

## Backend

1. Crie o arquivo de variáveis a partir do exemplo e preencha os valores:

   ```powershell
   cd backend
   copy .env.example .env
   ```

   Defina `JWT_SECRET` e `DEMO_PASSWORD` com valores próprios. Nenhum segredo fica no código. A senha precisa ter 8 dígitos.

2. Suba a API e o PostgreSQL com Docker Compose (API na porta 8080):

   ```powershell
   docker compose up -d --build
   ```

   Para desenvolver sem container da API, suba só o banco e rode a API pelo Maven:

   ```powershell
   docker compose up -d postgres
   ./mvnw spring-boot:run
   ```

   A cada inicialização, o banco é recriado com os dados de demonstração. A conta demo usa o e-mail `demo.aluna@ucsal.edu.br` e a senha definida em `DEMO_PASSWORD`.

Para testar a API, use `http://localhost:8080/api/v1`. O contrato completo está em `docs/api.md`.

O Swagger UI fica em `http://localhost:8080/swagger-ui.html` (JSON OpenAPI em `/v3/api-docs`). Para chamar rotas autenticadas, faça `POST /api/v1/auth/login`, clique em **Authorize** e cole o token JWT, sem o prefixo `Bearer`.

### Testes do backend

Os testes de integração usam Testcontainers, então o Docker precisa estar rodando.

```powershell
cd backend
./mvnw verify
```

## Frontend

1. Instale as dependências e crie o arquivo de variáveis:

   ```powershell
   cd frontend
   npm install
   copy .env.example .env
   ```

   O `.env` com `VITE_DEMO_EMAIL` faz o botão de conta demo aparecer na tela de acesso.

2. Rode o servidor de desenvolvimento:

   ```powershell
   npm run dev
   ```

   Abra a URL que o Vite mostrar no terminal (normalmente `http://localhost:5173`). As chamadas `/api` são encaminhadas para o backend na porta 8080 pelo proxy do Vite.

### Testes do frontend

```powershell
cd frontend
npm test
```

## Ordem para rodar tudo

1. `docker compose up -d --build` (em `backend/`): sobe PostgreSQL e API
2. `npm run dev` (em `frontend/`)

## Limitações

- Os horários são gerados automaticamente para a demonstração. Não há painel para o profissional gerenciar a própria agenda.
- Validar o domínio `@ucsal.edu.br` confere apenas o formato do e-mail, não a identidade do usuário.
- Não há envio de e-mail ou notificações.

## Uso de IA

Utilizado Codex para gerar o contexto do projeto e Claude Code para implementação.
