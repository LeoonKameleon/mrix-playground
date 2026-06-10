FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    libpq5 \
    docker.io\
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN useradd -m -u 1000 django-user

COPY --chown=django-user:django-user . .

RUN uv sync --frozen

ENV PATH="/app/.venv/bin:$PATH"

USER django-user

CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]