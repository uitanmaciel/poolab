# Agenda Fácil Acadêmica

Aplicação web para estudantes da UCSal solicitarem atendimento com professores, coordenações ou a Central de Relacionamento com Aluno (CRA).
O estudante escolhe o tipo de atendimento, seleciona um responsável (quando aplicável), escolhe um horário disponível e revisa os dados.
Ao confirmar, recebe um código de agendamento identificável (`AGD-AAAA-NNN`).
Também é possível listar, cancelar e reagendar os próprios agendamentos.
É um MVP acadêmico (projeto POOALAB): os dados são fictícios e não há integração com sistemas da UCSal.

## Problema, público e proposta de valor

**Problema:** para estudantes da UCSal que precisam conversar com professores, coordenações ou a CRA, encontrar um horário e concluir o agendamento pode ser difícil quando as opções de atendimento e a forma de solicitar uma vaga não estão claras ou centralizadas. Isso pode gerar demora, trocas de mensagens e incerteza sobre a confirmação do atendimento.

**Público:** estudantes da UCSal.

**Proposta de valor:** ajudar o estudante a concluir uma solicitação de atendimento por meio de uma sequência simples: escolher o tipo de atendimento, selecionar um responsável quando aplicável, escolher um horário disponível, revisar os dados e receber uma confirmação identificável.

## Integrantes e turma

| Integrante | Curso |
|---|---|
| Arthur Martins Mota Correia | ADS |
| João Gabriel dos Santos Sena | ADS |
| Uitan Santos Maciel | ADS |

## Tecnologias e justificativas

| Camada | Tecnologia | Por quê |
|---|---|---|
| API | Java 21, Spring Boot 4.1.2 | Stack madura, com validação, segurança e JPA integrados. |
| Banco | PostgreSQL 18 + Flyway | Restrições de integridade (ex.: um horário não pode ser reservado duas vezes) e migrações versionadas. |
| Autenticação | Spring Security, JWT, BCrypt | Sessão sem estado e senhas armazenadas só como hash. |
| Documentação da API | springdoc-openapi (Swagger UI) | Contrato navegável e testável no navegador. |
| Frontend | React 19, Vite, TypeScript | Interface por etapas com tipagem e build rápido. |
| Estilo | Tailwind CSS 4, shadcn/ui (Radix) | Componentes acessíveis e consistentes. |
| Infra | Docker Compose | API e banco sobem com um comando. |
| Testes | JUnit + Testcontainers (backend), Vitest + Testing Library (frontend) | Testes de integração contra um PostgreSQL real e testes de componentes. |

Estrutura:

```
backend/    API REST (Java/Spring) e docker-compose.yml
frontend/   Interface (React/Vite)
```

## Pré-requisitos e versões

| Item | Versão |
|---|---|
| Java (JDK) | 21 |
| Docker com Docker Compose | recente (usa a imagem `postgres:18-alpine`) |
| Node.js | 24 (com npm) |
| Maven | não precisa instalar, o projeto usa `./mvnw` |

Portas livres necessárias: 5432 (banco), 8080 (API) e 5173 (frontend).

## Instalação e execução

Os comandos abaixo são para PowerShell, a partir da raiz do repositório.

**1. Backend (API + banco)**

```powershell
cd backend
copy .env.example .env
```

Edite `backend/.env` e troque os valores `troque-...`: `POSTGRES_PASSWORD`, `DB_PASSWORD` (o mesmo valor de `POSTGRES_PASSWORD`), `JWT_SECRET` (mínimo 32 bytes) e `DEMO_PASSWORD` (de 8 a 72 caracteres). Depois:

```powershell
docker compose up -d --build
```

A API fica em `http://localhost:8080/api/v1`. A cada inicialização, o banco é recriado com os dados de demonstração.
Swagger UI: `http://localhost:8080/swagger-ui.html`.

*Alternativa para desenvolver sem container da API:* `docker compose up -d postgres` e, em seguida, `./mvnw spring-boot:run`.

**2. Frontend**

Em outro terminal:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Abra `http://localhost:5173`. O Vite encaminha as chamadas `/api` para a porta 8080.

## Credenciais fictícias e dados de teste

- Conta de demonstração: `demo.aluna@ucsal.edu.br`. A senha é a que você definiu em `DEMO_PASSWORD` no `backend/.env`. 
- Com `VITE_DEMO_EMAIL` no `frontend/.env`, a tela de acesso mostra o botão de conta demo.
- Também é possível criar uma conta nova na tela de acesso, com e-mail `@ucsal.edu.br` (só o formato é validado).
- Dados de demonstração recriados a cada inicialização: 3 cursos (Administração, Engenharia, Direito), 4 profissionais (Prof. Rafael Cardoso, Profa. Marina Seixas, Profa. Tânia Lima, Prof. Heitor Mendes) e horários gerados automaticamente.

## Como executar os testes

**Backend** (o Docker precisa estar rodando, pois o Testcontainers sobe um PostgreSQL):

```powershell
cd backend
./mvnw verify
```

**Frontend:**

```powershell
cd frontend
npm install
npm test
```

## Roteiro para reproduzir o fluxo principal

1. Suba backend e frontend conforme as instruções acima e abra `http://localhost:5173`.
2. Entre com a conta demo (`demo.aluna@ucsal.edu.br` e a senha de `DEMO_PASSWORD`).
3. Clique em **Novo agendamento**.
4. Escolha o tipo de atendimento (Coordenação, Professor ou CRA) e clique em **Continuar**.
5. Se o tipo exigir, selecione o responsável.
6. Escolha um dia e um horário disponível.
7. Revise os dados e clique em **Confirmar agendamento**.
8. A tela de sucesso mostra o código `AGD-AAAA-NNN`.
9. Em **Meus agendamentos**, confira o agendamento e, se quiser, reagende ou cancele.

## Limitações conhecidas e próximos passos

Limitações:

- Os horários são gerados automaticamente para a demonstração. Não há painel para o profissional gerenciar a própria agenda.
- Validar o domínio `@ucsal.edu.br` confere apenas o formato do e-mail, não a identidade do usuário. Não há login institucional.
- Não há envio de e-mail ou notificações.
- Os dados de demonstração são apagados e recriados a cada inicialização da API.

Próximos passos:

- Painel para professores, coordenações e CRA cadastrarem horários e acompanharem solicitações.
- Integração com o login institucional da UCSal.
- Notificações por e-mail ou aplicativo (confirmação e lembrete).

## Fontes, licenças, componentes de terceiros e uso de IA

- **Fontes:** o problema e o público foram definidos pelos integrantes para a disciplina. O contrato da API está em `docs/api.md` e os requisitos em `docs/prd.md`. Todos os dados são fictícios.
- **Licença:** o repositório não define licença própria. Trata-se de trabalho acadêmico, sem autorização de redistribuição além da disciplina.
- **Componentes de terceiros (código aberto):** Spring Boot, Spring Security, Spring Data JPA, Flyway, springdoc-openapi, PostgreSQL JDBC, Testcontainers, React, React Router, Vite, Tailwind CSS, shadcn/ui, Radix UI, Lucide, class-variance-authority, Vitest e Testing Library. Cada um mantém a licença original (em geral MIT ou Apache 2.0), conforme `backend/pom.xml` e `frontend/package.json`.
- **Uso de IA:** o Codex foi usado para gerar o contexto do projeto e o Claude Code (Anthropic) para a implementação. Os integrantes revisaram e são responsáveis pelo resultado.
