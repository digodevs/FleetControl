# Politica De Seguranca

## Versoes Suportadas

| Versao | Suportada |
| --- | --- |
| 1.0.x | Sim |

## Relato De Vulnerabilidades

Nao abra issues publicas para vulnerabilidades de seguranca.

Relate vulnerabilidades de forma privada ao mantenedor do projeto. Inclua:

- Versao ou commit afetado.
- Passos para reproduzir.
- Impacto e componentes afetados.
- Mitigacao sugerida, se conhecida.

## Praticas De Seguranca

- Nunca versione senhas reais de banco, segredos JWT, chaves de API ou arquivos `.env` de producao.
- Use segredos JWT fortes com pelo menos 32 bytes.
- Rotacione credenciais apos exposicao acidental.
- Mantenha dependencias atualizadas.
- Revise cuidadosamente mudancas de autenticacao, autorizacao e validacao.
