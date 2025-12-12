# Docker Setup für Study Dashboard

## Voraussetzungen
- Docker installiert
- Docker Compose installiert

## Lokal starten

Alle Services (Backend, Frontend, PostgreSQL) starten:

```bash
docker-compose up --build
```

Dann öffne:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **PostgreSQL**: localhost:5432

## Einzelne Services bauen

Backend Image:
```bash
cd backend
docker build -t study-dashboard-backend:latest .
```

Frontend Image:
```bash
cd frontend
docker build -t study-dashboard-frontend:latest .
```

## Nur Backend starten (ohne Frontend/DB)

```bash
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://localhost:5432/study_dashboard \
  -e DB_USERNAME=lucas \
  -e DB_PASSWORD=lucas_password \
  -e JWT_SECRET_KEY=qwertyuiopasdfghjklzxcvbnm123456== \
  study-dashboard-backend:latest
```

## Logs anschauen

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## Container stoppen

```bash
docker-compose down
```

Datenbank-Volume löschen (alle Daten weg):
```bash
docker-compose down -v
```

## Environment Variables für Production

In `docker-compose.yml` die `environment` Sektion anpassen mit echten Werten:
- `DB_PASSWORD` → starkes Passwort
- `JWT_SECRET_KEY` → mit `openssl rand -base64 32` generieren
- `NEXT_PUBLIC_API_URL` → produktive Backend-URL
