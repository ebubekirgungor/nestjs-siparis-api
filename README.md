# Book order api written in Nest.js

## Installation

- Clone repository
```bash
$ git clone https://github.com/ebubekirgungor/nestjs-siparis-api.git
```
- Change environment variables in .env file
- Run
```bash
# Install dependencies
$ npm install
# Run PostgreSql and Redis using docker
$ docker compose up
# Migrate database
$ npx prisma migrate dev --name init
# Seed database
$ npx prisma migrate reset
```

## Running the app

```bash
$ npm start
```
