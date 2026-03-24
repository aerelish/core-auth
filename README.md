# core-auth

JWT authentication system built from scratch — no auth libraries. Full token lifecycle: issuance, rotation, reuse detection, and revocation.

## Development

### Prerequisites

- Docker and Docker Compose installed

### Running locally

1. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your MySQL credentials
```

2. Start the application and database ( or db only ):

```bash
docker compose up -d

# run db only ( when doing dev on local )
docker compose up db -d
```

3. App will be available at `http://localhost:3000`

### Useful commands

- View logs: `docker compose logs -f`
- Stop everything: `docker compose down`
- Fresh restart (delete database): `docker compose down -v && docker compose up -d`
