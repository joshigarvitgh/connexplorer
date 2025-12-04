FROM python:3.11-slim

WORKDIR /app

# Install system deps you may need; add more as required.
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl ca-certificates git \
 && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY backend ./backend
COPY data ./data
COPY dist ./dist
COPY frontend ./frontend
COPY Pipfile Pipfile.lock ./

# Install Python deps via pipenv into system site-packages
RUN pip install --no-cache-dir pipenv && \
    PIPENV_YES=1 PIPENV_IGNORE_VIRTUALENVS=1 pipenv install --deploy --system

# Expose backend port
ENV PORT=8001
EXPOSE 8001

# Start the backend (adjust args if needed)
CMD ["python", "-m", "backend.conview_backend.main"]
