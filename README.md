# Teddy API

Teddy API é uma api desenvolvida para reduzir urls com as seguintes tecnologias:
- Node.js
- Nest.js
- Prisma
- PostgreSQL

Algumas instruções para rodar essa API utilizando o Docker

## Requisitos

- Docker
- Docker Compose

## Variáveis de ambiente (.env)

Antes de iniciar o container, crie um arquivo .env na raiz do projeto e inicie as seguintes variáveis:

```bash
POSTGRES_USER=user
POSTGRES_PASSWORD=password
DATABASE_PORT=5432
PORT=8000
JWT_SECRET_KEY='99eb92b3b4e6905ed5c03332314cfa629d51d2939f08769e9bd2f86028aa092b'
```

> **Note:** As variáveis `POSTGRES_USER` and `POSTGRES_PASSWORD` é o usuario e senha padrão para a imagem do docker PostgreSQL.

## Executando a API

1. **Clone the repository:**

   ```bash
   git clone https://github.com/CarlosSiiqueira/teddy-api
   cd <your-project-directory>
   ```

2. **Build and start the Docker containers:**

   ```bash
   docker-compose up --build
   ```

   Esse comando vai subir os containers da api e o banco

3. **Access the API:**

   Quando o container estiver rodando, a URL padrão da API será: `http://localhost:${PORT}`.

## Commands

A `teddy-api` executará os seguintes comandos ao iniciar:

- `npx prisma generate` - Gera o client do prisma.
- `npx prisma migrate deploy` - Aplica migrations pendentes na base.
- `npm run start:dev` - Inicia a API em dev mode.

## Stopping the Application

To stop the application, you can run:

```bash
docker-compose down
```

Esse comando vai parar e remover os containers, mas vai presevar os dados da sua base no volume do Docker

## Acknowledgments

- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
