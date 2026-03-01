# Gaming Arena Master

Local development uses Docker Compose for the app, Postgres, and Redis.

## Quick start

1) Start the stack

```
docker compose up -d --build
```

2) Initialize the database schema

```
docker compose --profile tools up drizzle
```

3) Open the app

- http://localhost:5001

## Player login and register

- Register: http://localhost:5001/register
- Login: http://localhost:5001/login
- After login, you land on http://localhost:5001/dashboard

## Admin login

- Admin entry: http://localhost:5001/admin
- Seeded credentials (local only):
  - username: admin
  - password: admin

## Notes

- The compose file maps host port 5001 to container port 5000.
- Local auth is enabled via `LOCAL_AUTH=true` in `.env.docker`.
- Copy `.env.docker.example` to `.env.docker` if you want to reset env values.
