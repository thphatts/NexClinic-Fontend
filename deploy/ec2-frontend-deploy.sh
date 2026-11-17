#!/usr/bin/env bash
set -Eeuo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/opt/nexclinic}"
STACK_DIR="${STACK_DIR:-/home/ubuntu/clinic-portal-deploy}"
IMAGE="${1:?Usage: ec2-frontend-deploy.sh ghcr.io/owner/repo@sha256:digest}"
[[ "$IMAGE" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]] || { echo 'Invalid frontend GHCR digest' >&2; exit 1; }

exec 9>"$DEPLOY_DIR/frontend-deploy.lock"
flock -n 9 || { echo 'Another frontend deployment is running' >&2; exit 1; }

# Use the job token only for this deployment, preserving the server's registry credentials.
if [[ -n "${2:-}" ]]; then
  registry_config=$(mktemp -d)
  trap 'rm -rf -- "$registry_config"' EXIT
  docker --config "$registry_config" login ghcr.io -u "$2" --password-stdin
  export DOCKER_CONFIG="$registry_config"
fi

compose_files=(-f "$STACK_DIR/compose.yaml")
for file in compose.override.yaml compose.proxy-network.yaml; do
  [[ ! -f "$STACK_DIR/$file" ]] || compose_files+=(-f "$STACK_DIR/$file")
done
compose_files+=(-f "$DEPLOY_DIR/frontend.compose.yml")
export FRONTEND_IMAGE="$IMAGE"
compose() {
  docker compose --project-name clinic-portal-deploy --project-directory "$STACK_DIR" \
    --env-file "$STACK_DIR/.env" "${compose_files[@]}" "$@"
}

compose config --quiet
container=$(compose ps -q frontend)
[[ -n "$container" ]] || { echo 'Existing frontend container not found' >&2; exit 1; }
OLD_IMAGE=$(docker inspect --format '{{.Image}}' "$container")
# Keep the first deployment's local image available even when its tag is replaced.
docker image tag "$OLD_IMAGE" nexclinic-frontend:rollback
compose pull frontend
REVISION=$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$IMAGE")
[[ "$REVISION" =~ ^[a-f0-9]{40}$ ]] || { echo 'Missing frontend revision label' >&2; exit 1; }

reload_proxy() {
  compose exec -T proxy nginx -t
  compose exec -T proxy nginx -s reload
}

rollback() {
  local result=$?
  trap - ERR
  echo 'Frontend release failed; restoring previous image.' >&2
  compose logs --tail=60 frontend >&2 || true
  export FRONTEND_IMAGE=nexclinic-frontend:rollback
  if compose up -d --no-build --pull never --no-deps --wait --wait-timeout 120 frontend && reload_proxy; then
    echo 'Previous frontend restored.' >&2
  else
    echo 'FRONTEND ROLLBACK FAILED: operator action required.' >&2
  fi
  exit "$result"
}

trap rollback ERR
compose up -d --no-build --pull never --no-deps --wait --wait-timeout 120 frontend
reload_proxy
for ((attempt=0; attempt<10; attempt++)); do
  if compose exec -T proxy wget -q -T 5 -O /dev/null http://127.0.0.1/ &&
    [[ "$(compose exec -T proxy wget -q -T 5 -O - http://127.0.0.1/release.txt)" == "$REVISION" ]]; then
    printf 'FRONTEND_IMAGE=%s\n' "$IMAGE" > "$DEPLOY_DIR/frontend-release.env"
    trap - ERR
    printf 'Frontend deployed: %s\n' "$IMAGE"
    exit 0
  fi
  sleep 2
done
echo 'Frontend is not responding through Nginx' >&2
false
