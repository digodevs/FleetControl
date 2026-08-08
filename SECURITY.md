# Política De Segurança

## Versoes Suportadas

| Versão | Suportada |
| --- | --- |
| 1.0.x | Sim |

## Relato De Vulnerabilidades

Não abra issues publicas para vulnerabilidades de seguranca.

Relate vulnerabilidades de forma privada ao mantenedor do projeto. Inclua:

- Versão ou commit afetado.
- Passos para reproduzir.
- Impacto e componentes afetados.
- Mitigação sugerida, se conhecida.

## Praticas De Segurança

- Nunca versione senhas reais de banco, segredos JWT, chaves de API ou arquivos `.env` de produção.
- Use segredos JWT fortes com pelo menos 32 bytes.
- Rotacione credenciais após exposicao acidental.
- Mantenha dependências atualizadas.
- Revise cuidadosamente mudanças de autenticação, autorização e validação.
