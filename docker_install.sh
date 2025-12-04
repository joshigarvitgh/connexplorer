#!/usr/bin/env bash
#
# Build a Docker image from the bundled backend/frontend/data and run it locally.
# Usage:
#   ./docker_install.sh               # builds image connexplorer:local and runs on 8001
#   IMAGE_NAME=myrepo/conn:latest ./docker_install.sh   # custom tag
#   PORT=9001 ./docker_install.sh     # custom host port
#
set -euo pipefail

IMAGE_NAME="${IMAGE_NAME:-connexplorer:local}"
PORT="${PORT:-8001}"

echo "Building image ${IMAGE_NAME}..."
docker build -t "${IMAGE_NAME}" .

echo "Running ${IMAGE_NAME} on host port ${PORT} -> container 8001 ..."
docker run --rm -it -p "${PORT}:8001" "${IMAGE_NAME}"

# Notes:
# - The container starts the backend; serve the frontend separately from dist/
#   (e.g., python -m http.server 8081 in publication/deploy/dist).
# - If you need to point the frontend to a different backend URL, edit dist/index.html
#   and change the WebSocket endpoint before serving.
