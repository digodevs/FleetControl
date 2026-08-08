# FleetControl

![Versão](https://img.shields.io/badge/versão-1.0.0-0ea5e9)
![Java](https://img.shields.io/badge/Java-25-red)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791)
![Docker](https://img.shields.io/badge/Docker-pronto-2496ed)
![Licença](https://img.shields.io/badge/licenca-MIT-white)

FleetControl é um sistema profissional de gestão de frotas desenvolvido como projeto full-stack de portfolio para GitHub. A versão `v1.0.0` entrega uma API Spring Boot segura, banco PostgreSQL com migrations Flyway, autenticação JWT, gestão de veículos, painel executivo e interface administrativa responsiva em React.

## Objetivo

Fornecer uma base limpa e orientada a produção para operações de frota, com persistencia real em banco de dados, documentação de API, validações automatizadas, execução com Docker e frontend refinado para apresentação profissional no GitHub.

## Capturas De Tela

As imagens devem ser adicionadas depois da publicação dos assets do repositorio.

| Painel | Veículos |
| --- | --- |
| `docs/screenshots/dashboard.png` | `docs/screenshots/vehicles.png` |

## Arquitetura

FleetControl está organizado como monorepo:

```text
.
|-- backend/                 # API REST Spring Boot
|-- frontend/                # SPA React + TypeScript
|-- docs/                    # Documentação e screenshots
|-- docker-compose.yml       # PostgreSQL + backend + frontend
|-- .env.example             # Referencia de variaveis de ambiente
`-- README.md
```

Camadas do backend:

```text
config        OpenAPI, seguranca e configuração da aplicação
controller    Endpoints REST
dto           Contratos de requisição e resposta
entity        Entidades JPA e enums
exception     Tratamento de exceções de domínio e API
mapper        Mapeamento entre entidade e DTO
repository    Repositórios Spring Data e consultas otimizadas
security      Filtro JWT, servico de token e detalhes do usuário
service       Casos de uso de negocio
```

Camadas do frontend:

```text
components    Componentes reutilizaveis de UI e features
contexts      Estado de autenticação e notificações
hooks         Hooks de UI e TanStack Query
layouts       Estrutura administrativa
pages         Telas de dashboard e veículos
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
- Ações do GitHub

## Funcionalidades

- Login JWT, token de renovação, logout e endpoint de usuário autenticado.
- Controle de acesso por roles `ADMIN` e `EMPLOYEE`.
- CRUD de veículos com validação, paginação, filtros, ordenação e verificação de duplicidade.
- Painel executivo com dados reais do PostgreSQL.
- Swagger/OpenAPI com suporte a bearer JWT.
- UI administrativa dark com sidebar, header, breadcrumb, gráficos, tabela de veículos, modais, paginação, skeletons, estados vazios e toasts.
- Stack Dockerizada com PostgreSQL, backend e frontend.

## Variaveis De Ambiente

Copie o arquivo de exemplo e ajuste os valores locais:

```bash
cp .env.example .env
```

Variaveis obrigatórias:

| Variável | Descrição |
| --- | --- |
| `POSTGRES_DB` | Nome do banco PostgreSQL |
| `POSTGRES_USER` | Usuário do PostgreSQL |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL |
| `POSTGRES_PORT` | Porta do PostgreSQL no host |
| `BACKEND_PORT` | Porta da aplicação backend |
| `SPRING_PROFILES_ACTIVE` | Profile Spring, normalmente `dev` |
| `SPRING_DATASOURCE_URL` | URL JDBC para execução local do backend |
| `SPRING_DATASOURCE_USERNAME` | Usuário do banco usado pelo backend |
| `SPRING_DATASOURCE_PASSWORD` | Senha do banco usada pelo backend |
| `APP_CORS_ALLOWED_ORIGINS` | Origens permitidas do frontend |
| `JWT_SECRET` | Segredo JWT forte com pelo menos 32 bytes |
| `JWT_ACCESS_EXPIRATION` | Duração do token de acesso em milissegundos |
| `JWT_REFRESH_EXPIRATION` | Duração do token de renovação em milissegundos |
| `FRONTEND_PORT` | Porta do container frontend no host |
| `VITE_API_BASE_URL` | URL base publica da API usada na compilação do frontend |

Nunca versione segredos reais, senhas de produção ou arquivos `.env` privados.

## Execução Local

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

URLs padrão:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api/v3/api-docs`

## Execução Com Docker

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

O Flyway é responsável pela criação e versionamento do schema. O Hibernate está configurado com `ddl-auto=validate`, portanto a aplicação valida o schema em vez de gerá-lo.

Migrations atuais:

- `V1__create_database_foundation.sql`
- `V2__create_authentication_tables.sql`
- `V3__create_vehicle_table.sql`

## Autenticação

A autenticação usa tokens de acesso JWT e tokens de renovação.

Endpoints principais:

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Cadastrar usuário |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/refresh` | Renovar token de acesso |
| `POST` | `/api/auth/logout` | Logout |
| `GET` | `/api/auth/me` | Usuário autenticado atual |

Endpoints protegidos exigem:

```text
Authorization: Bearer <access-token>
```

## Módulos Da API

| Modulo | Endpoint | Acesso |
| --- | --- | --- |
| Dashboard | `GET /api/dashboard` | `ADMIN`, `EMPLOYEE` |
| Veículos | `/api/vehicles` | leitura: `ADMIN`, `EMPLOYEE`; escrita: `ADMIN` |
| Auth | `/api/auth/*` | fluxos públicos e autenticados |

## Swagger / OpenAPI

O Swagger UI fica disponivel depois que o backend inicia:

```text
http://localhost:8080/api/swagger-ui.html
```

Use o botao `Autorizar` do Swagger e cole um token de acesso JWT para testar endpoints protegidos.

## Verificações De Qualidade

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

## Integração E Entrega Continua

As Ações do GitHub executam em `push` e `pull_request` para `main`.

O workflow valida:

- Testes do backend com Java 25 e Maven Wrapper.
- Package do backend.
- Instalação de dependências do frontend.
- Build de produção do frontend com Node LTS.

## Próximas Etapas

Módulos planejados para etapas futuras:

- Motoristas
- Manutenções
- Abastecimentos
- Despesas
- Multas
- Documentos
- Relatórios avançados
- Profiles de deploy
- Testes end-to-end

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte `LICENSE`.

## Autor

FleetControl foi construido como projeto full-stack profissional para portfolio no GitHub.
