# FleetControl

![Versao](https://img.shields.io/badge/versao-1.0.0-0ea5e9)
![Java](https://img.shields.io/badge/Java-25-red)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791)
![Docker](https://img.shields.io/badge/Docker-pronto-2496ed)
![Licenca](https://img.shields.io/badge/licenca-MIT-white)

FleetControl e um sistema profissional de gestao de frotas desenvolvido como projeto full-stack de portfolio para GitHub. A versao `v1.0.0` entrega uma API Spring Boot segura, banco PostgreSQL com migrations Flyway, autenticacao JWT, gestao de veiculos, painel executivo e interface administrativa responsiva em React.

## Objetivo

Fornecer uma base limpa e orientada a producao para operacoes de frota, com persistencia real em banco de dados, documentacao de API, validacoes automatizadas, execucao com Docker e frontend refinado para apresentacao profissional no GitHub.

## Capturas De Tela

As imagens devem ser adicionadas depois da publicacao dos assets do repositorio.

| Painel | Veiculos |
| --- | --- |
| `docs/screenshots/dashboard.png` | `docs/screenshots/vehicles.png` |

## Arquitetura

FleetControl esta organizado como monorepo:

```text
.
|-- backend/                 # API REST Spring Boot
|-- frontend/                # SPA React + TypeScript
|-- docs/                    # Documentacao e screenshots
|-- docker-compose.yml       # PostgreSQL + backend + frontend
|-- .env.example             # Referencia de variaveis de ambiente
`-- README.md
```

Camadas do backend:

```text
config        OpenAPI, seguranca e configuracao da aplicacao
controller    Endpoints REST
dto           Contratos de requisicao e resposta
entity        Entidades JPA e enums
exception     Tratamento de excecoes de dominio e API
mapper        Mapeamento entre entidade e DTO
repository    Repositorios Spring Data e consultas otimizadas
security      Filtro JWT, servico de token e detalhes do usuario
service       Casos de uso de negocio
```

Camadas do frontend:

```text
components    Componentes reutilizaveis de UI e features
contexts      Estado de autenticacao e notificacoes
hooks         Hooks de UI e TanStack Query
layouts       Estrutura administrativa
pages         Telas de dashboard e veiculos
services      Clientes Axios para API
types         Contratos TypeScript compartilhados
```

## Tecnologias

Backend:

- Java 25
- Spring Boot 3.5
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate Validator
- PostgreSQL
- Flyway
- JSON Web Token
- Springdoc OpenAPI
- Maven Wrapper
- JUnit 5, Mockito, Spring Boot Test

Frontend:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- TanStack Query
- Recharts
- Lucide React

Infraestrutura:

- Docker
- Docker Compose
- Nginx
- Acoes do GitHub

## Funcionalidades

- Login JWT, token de renovacao, logout e endpoint de usuario autenticado.
- Controle de acesso por roles `ADMIN` e `EMPLOYEE`.
- CRUD de veiculos com validacao, paginacao, filtros, ordenacao e verificacao de duplicidade.
- Painel executivo com dados reais do PostgreSQL.
- Swagger/OpenAPI com suporte a bearer JWT.
- UI administrativa dark com sidebar, header, breadcrumb, graficos, tabela de veiculos, modais, paginacao, skeletons, estados vazios e toasts.
- Stack Dockerizada com PostgreSQL, backend e frontend.

## Variaveis De Ambiente

Copie o arquivo de exemplo e ajuste os valores locais:

```bash
cp .env.example .env
```

Variaveis obrigatorias:

| Variavel | Descricao |
| --- | --- |
| `POSTGRES_DB` | Nome do banco PostgreSQL |
| `POSTGRES_USER` | Usuario do PostgreSQL |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL |
| `POSTGRES_PORT` | Porta do PostgreSQL no host |
| `BACKEND_PORT` | Porta da aplicacao backend |
| `SPRING_PROFILES_ACTIVE` | Profile Spring, normalmente `dev` |
| `SPRING_DATASOURCE_URL` | URL JDBC para execucao local do backend |
| `SPRING_DATASOURCE_USERNAME` | Usuario do banco usado pelo backend |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco usada pelo backend |
| `APP_CORS_ALLOWED_ORIGINS` | Origens permitidas do frontend |
| `JWT_SECRET` | Segredo JWT forte com pelo menos 32 bytes |
| `JWT_ACCESS_EXPIRATION` | Duracao do token de acesso em milissegundos |
| `JWT_REFRESH_EXPIRATION` | Duracao do token de renovacao em milissegundos |
| `FRONTEND_PORT` | Porta do container frontend no host |
| `VITE_API_BASE_URL` | URL base publica da API usada na compilacao do frontend |

Nunca versione segredos reais, senhas de producao ou arquivos `.env` privados.

## Execucao Local

Requisitos:

- Java 25
- Node.js LTS
- Docker Desktop ou engine Docker compativel

Subir o PostgreSQL:

```bash
docker compose up -d postgres
```

Executar o backend:

```bash
cd backend
./mvnw spring-boot:run
```

No Windows:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Executar o frontend:

```bash
cd frontend
npm install
npm run dev
```

URLs padrao:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api/v3/api-docs`

## Execucao Com Docker

Build e subida da stack completa:

```bash
docker compose up --build
```

Executar em segundo plano:

```bash
docker compose up --build -d
```

Parar a stack:

```bash
docker compose down
```

Remova o volume persistente do PostgreSQL apenas quando quiser resetar os dados locais:

```bash
docker compose down -v
```

Servicos Docker:

- `postgres`: PostgreSQL 17 com volume persistente e healthcheck.
- `backend`: API Spring Boot construida com Maven e Java 25.
- `frontend`: Build Vite servido por Nginx com fallback de SPA.

## Banco De Dados

O Flyway e responsavel pela criacao e versionamento do schema. O Hibernate esta configurado com `ddl-auto=validate`, portanto a aplicacao valida o schema em vez de gera-lo.

Migrations atuais:

- `V1__create_database_foundation.sql`
- `V2__create_authentication_tables.sql`
- `V3__create_vehicle_table.sql`

## Autenticacao

A autenticacao usa tokens de acesso JWT e tokens de renovacao.

Endpoints principais:

| Metodo | Endpoint | Descricao |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Cadastrar usuario |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/refresh` | Renovar token de acesso |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Usuario autenticado atual |

Endpoints protegidos exigem:

```text
Authorization: Bearer <access-token>
```

## Modulos Da API

| Modulo | Endpoint | Acesso |
| --- | --- | --- |
| Dashboard | `GET /api/dashboard` | `ADMIN`, `EMPLOYEE` |
| Veiculos | `/api/vehicles` | leitura: `ADMIN`, `EMPLOYEE`; escrita: `ADMIN` |
| Auth | `/api/auth/*` | fluxos publicos e autenticados |

## Swagger / OpenAPI

O Swagger UI fica disponivel depois que o backend inicia:

```text
http://localhost:8080/api/swagger-ui.html
```

Use o botao `Autorizar` do Swagger e cole um token de acesso JWT para testar endpoints protegidos.

## Verificacoes De Qualidade

Backend:

```bash
cd backend
./mvnw clean test
./mvnw clean package
```

Windows:

```powershell
cd backend
.\mvnw.cmd clean test
.\mvnw.cmd clean package
```

Frontend:

```bash
cd frontend
npm install
npm run build
```

Docker:

```bash
docker compose up --build
```

## Integracao E Entrega Continua

As Acoes do GitHub executam em `push` e `pull_request` para `main`.

O workflow valida:

- Testes do backend com Java 25 e Maven Wrapper.
- Package do backend.
- Instalacao de dependencias do frontend.
- Build de producao do frontend com Node LTS.

## Proximas Etapas

Modulos planejados para etapas futuras:

- Motoristas
- Manutencoes
- Abastecimentos
- Despesas
- Multas
- Documentos
- Relatorios avancados
- Profiles de deploy
- Testes end-to-end

## Licenca

Este projeto esta licenciado sob a Licenca MIT. Consulte `LICENSE`.

## Autor

FleetControl foi construido como projeto full-stack profissional para portfolio no GitHub.
