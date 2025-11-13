Frontend (React CRA) for DynamicNFC

Run locally (requires Node + npm):

  cd frontend
  npm install
  npm start

Or build and run in Docker (no local Node needed):

  cd frontend
  docker build -t dynamicnfc-frontend:latest .
  docker run --rm -p 3000:80 dynamicnfc-frontend:latest

The app expects backend at http://localhost:8080 (API base: /api).
