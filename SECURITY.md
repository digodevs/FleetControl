# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| 1.0.x | Yes |

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Report vulnerabilities privately to the project maintainer. Include:

- Affected version or commit.
- Steps to reproduce.
- Impact and affected components.
- Suggested mitigation, if known.

## Security Practices

- Never commit real database passwords, JWT secrets, API keys, or production `.env` files.
- Use strong JWT secrets with at least 32 bytes.
- Rotate credentials after accidental exposure.
- Keep dependencies updated.
- Review authentication, authorization, and validation changes carefully.
