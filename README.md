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
$ docker compose up -d
# Migrate database
$ npx prisma migrate dev --name init
# Seed database
$ npx prisma migrate reset
```

## Running the app

```bash
$ npm start
```

## Using

- Create order

```
POST http://localhost:3000/api/orders
# Example
{
    "user_id": 1,
    "product_ids": [1, 2, 3]
}
```

- Get an order by id

```
GET http://localhost:3000/api/orders/{id}
```

- Get all orders

```
GET http://localhost:3000/api/orders
```

- Get all campaigns

```
GET http://localhost:3000/api/campaigns
```

- Get all users

```
GET http://localhost:3000/api/users
```
