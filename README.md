# Teddy API

Teddy API é uma api desenvolvida para reduzir urls com as seguintes tecnologias:
- Node.js
- Nest.js
- Prisma
- PostgreSQL

Algumas instruções para rodar essa API utilizando o Docker

## Requisitos

- Docker
- Docker Compose (utilize: "docker-compose up --build" para rodar o container)

## Variáveis de ambiente (.env)

Antes de iniciar o container, crie um arquivo .env na raiz do projeto e inicie as seguintes variáveis:

```bash
POSTGRES_USER=user
POSTGRES_PASSWORD=password
DATABASE_PORT=5432
PORT=8000
JWT_SECRET_KEY='99eb92b3b4e6905ed5c03332314cfa629d51d2939f08769e9bd2f86028aa092b'