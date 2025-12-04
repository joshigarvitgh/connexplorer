## Deployment bundle (backend + frontend + data)

This folder contains the pieces needed to build a Docker image that serves the backend and the existing frontend bundle with local data included.

### Contents
- `backend/` — websocket backend code.
- `frontend/` — Elm source and assets (if you need to rebuild).
- `dist/` — current built frontend bundle.
- `data/` — atlas/matrix CSV/JSON and related files (large).
- `Pipfile`, `Pipfile.lock` — Python dependencies.
- `Dockerfile` — builds an image with the backend and bundled data.

### Build and run locally
Fast path (uses the helper script):
```bash
cd publication/deploy
./docker_install.sh        # builds connexplorer:local and runs on port 8001
IMAGE_NAME=yourname/connexplorer PORT=9001 ./docker_install.sh
```

Manual steps (equivalent to the script):
```bash
cd publication/deploy
docker build -t connexplorer:latest .
docker run -p 8001:8001 connexplorer:latest
# Frontend: serve dist/ separately (e.g., python -m http.server 8081)
```

### Deploy with Docker (Render “existing image”, Railway, etc.)
1) Build and push the image:
   ```bash
   docker build -t yourname/connexplorer:latest .
   docker push yourname/connexplorer:latest
   ```
2) In your hosting provider, create a service from that image; expose port `8001`.
3) Update `dist/index.html` to point the websocket to your hosted backend, e.g.:
   ```js
   var socket = new WebSocket('wss://your-backend.example.com');
   ```
   Then redeploy the static frontend (from `dist/`) to your static host.

### Notes
- The image includes `data/`; if the data is too large, consider mounting it as a volume instead of baking it into the image.
- If you rebuild Elm, regenerate `dist/elm.js` and copy the updated `dist/` here before rebuilding the image.
- Cache bust: `index.html` references `elm.js?v=cachebust-2`; bump that if you want to force browsers to fetch new JS.
