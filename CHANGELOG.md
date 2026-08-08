# Changelog

Todas as mudancas relevantes do FleetControl sao documentadas neste arquivo.

O formato e baseado em Keep a Changelog, e este projeto segue Versionamento Semantico.

## [1.0.0] - 2026-08-07

### Adicionado

- API REST Spring Boot com PostgreSQL, migrations Flyway, validacao JPA e tratamento padronizado de erros.
- Autenticacao JWT com refresh tokens, hash de senha BCrypt, logout e acesso baseado em roles.
- API de gestao de veiculos com paginacao, filtros, ordenacao, criacao, atualizacao e exclusao.
- API de dashboard executivo com KPIs de veiculos e dados agregados prontos para graficos.
- Frontend com React, TypeScript, Tailwind, TanStack Query, Axios e Recharts.
- Layout administrativo dark com sidebar, header, breadcrumb, dashboard, tabela de veiculos, modais, paginacao, skeletons, estados vazios e toasts.
- Stack Docker Compose para PostgreSQL, backend e frontend.
- Documentacao Swagger/OpenAPI com suporte a bearer JWT.
- Workflow GitHub Actions para validacao de backend e frontend.
