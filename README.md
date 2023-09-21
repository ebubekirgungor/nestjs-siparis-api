# Book order api written in Nest.js

## Installation

With docker: 

- Change environment variables in .env file \
- Run \
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
