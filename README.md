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
$ npm run start:prod
```

## Using

- Create order

```
POST /api/orders
# Example
{
    "user_id": 1,
    "product_ids": [1, 2, 3]
}
```

- Get an order by id

```
GET /api/orders/{id}
```

- Get all orders

```
GET /api/orders
```

- Get all campaigns

```
GET /api/campaigns
```

- Get all users

```
GET /api/users
```
