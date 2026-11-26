#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

MODE="${1:-deploy}"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Error: docker compose is not available." >&2
  exit 1
fi

if [[ ! -f .env ]]; then
  if [[ -f .env.local ]]; then
    cp .env.local .env
  elif [[ -f .env.example ]]; then
    cp .env.example .env
  fi
  echo "Created .env from local environment — review it before deploying."
fi

mkdir -p .deploy

active=""
if [[ -f .deploy/active ]]; then
  active="$(cat .deploy/active)"
fi

if [[ -z "$active" && "$MODE" == "rollback" ]]; then
  echo "Error: nothing has been deployed yet." >&2
  exit 1
fi

if [[ "$active" == "blue" ]]; then
  target="green"
else
  target="blue"
fi

sha="$(git rev-parse --short HEAD 2>/dev/null || echo latest)"
export BLUE_TAG="blue-${sha}"
export GREEN_TAG="green-${sha}"

write_proxy_config() {
  local upstream="$1"
  cat > .deploy/nginx.conf <<EOF
map \$http_upgrade \$connection_upgrade {
    default upgrade;
    '' close;
}
upstream flips_app {
    server web-${upstream}:3000;
}
server {
    listen 80;
    server_name _;
    client_max_body_size 10m;
    location / {
        proxy_pass http://flips_app;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
    }
}
EOF
}

wait_healthy() {
  local name="flips_web_$1"
  local status=""
  for _ in $(seq 1 60); do
    status="$(docker inspect --format '{{.State.Health.Status}}' "$name" 2>/dev/null || true)"
    if [[ "$status" == "healthy" ]]; then
      return 0
    fi
    sleep 2
  done
  echo "Error: $name did not become healthy (last status: ${status:-unknown})." >&2
  docker logs --tail 50 "$name" >&2 || true
  exit 1
}

if [[ "$MODE" == "rollback" ]]; then
  if ! docker ps --format '{{.Names}}' | grep -qx "flips_web_${target}"; then
    docker compose start "web-${target}"
  fi
else
  echo "Building and starting ${target} (${sha})..."
  docker compose up -d --build --no-deps "web-${target}"
fi

wait_healthy "$target"

write_proxy_config "$target"

if docker ps --format '{{.Names}}' | grep -qx flips_proxy; then
  docker compose exec -T proxy nginx -s reload
else
  docker compose up -d proxy
fi

if command -v curl >/dev/null 2>&1; then
  host_port="${PORT:-3088}"
  for _ in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:${host_port}/" >/dev/null 2>&1; then
      break
    fi
    sleep 1
  done
fi

echo "$target" > .deploy/active

if [[ -n "$active" && "$active" != "$target" ]]; then
  docker compose stop "web-${active}"
fi

echo "Live: ${target} on port ${PORT:-3088}"
docker compose ps
