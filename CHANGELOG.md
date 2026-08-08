# Changelog

Todas as mudanças relevantes do FleetControl são documentadas neste arquivo.

O formato é baseado em Keep a Changelog, e este projeto segue Versionamento Semantico.

## [1.0.0] - 2026-08-07

### Adicionado

- API REST Spring Boot com PostgreSQL, migrations Flyway, validação JPA e tratamento padronizado de erros.
- Autenticação JWT com refresh tokens, hash de senha BCrypt, logout e acesso baseado em roles.
- API de gestão de veículos com paginação, filtros, ordenação, criação, atualização e exclusão.
- API de dashboard executivo com KPIs de veículos e dados agregados prontos para gráficos.
- Frontend com React, TypeScript, Tailwind, TanStack Query, Axios e Recharts.
- Layout administrativo dark com sidebar, header, breadcrumb, dashboard, tabela de veículos, modais, paginação, skeletons, estados vazios e toasts.
- Stack Docker Compose para PostgreSQL, backend e frontend.
- Documentação Swagger/OpenAPI com suporte a bearer JWT.
- Workflow GitHub Actions para validação de backend e frontend.
