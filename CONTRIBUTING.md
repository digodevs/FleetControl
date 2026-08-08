# Contribuindo

Obrigado pelo interesse no FleetControl.

## Fluxo De Desenvolvimento

1. Faca um fork do repositorio.
2. Crie uma branch a partir da `main`.
3. Mantenha as alteracoes focadas e alinhadas ao roadmap atual.
4. Execute as verificacoes obrigatorias antes de abrir um pull request.
5. Abra um pull request com resumo claro e notas de validacao.

## Verificacoes Obrigatorias

Backend:

```bash
cd backend
./mvnw clean test
./mvnw clean package
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

## Padroes De Codigo

- Nao versione segredos reais ou credenciais locais.
- Prefira DTOs em vez de expor entidades nas respostas da API.
- Mantenha o Flyway responsavel pela evolucao do schema.
- Mantenha o acesso a API no frontend dentro de services e hooks.
- Evite adicionar modulos fora do roadmap aprovado.
- Adicione ou atualize testes para mudancas de comportamento.

## Diretrizes De Pull Request

Inclua:

- O que mudou.
- Por que mudou.
- Como foi testado.
- Screenshots para mudancas no frontend quando aplicavel.
