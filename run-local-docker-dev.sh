#!/usr/bin/env sh

if [ " ${*} " = " --help " ] || [ " ${*} " = " -h " ]; then
  echo "Usage: run-local-docker-dev.sh [name] [local_port]"
  echo "  name:        name of the container"
  echo "  local_port:  port to expose the container on the host"
  echo
  exit 0
fi

NAME="${1:-${NAME:-hlscg}}"
PORT="${PORT:-9090}"
NODE_ENV="${NODE_ENV:-development}"
LOCAL_PORT="${2:-${LOCAL_PORT:-9090}}"

podman stop -t 0 "${NAME}" || true
podman rm -vf "${NAME}" || true

podman run \
  -v "$(pwd):/opt/nodecg/bundles/handball-liveshow-spain" \
  -p "${LOCAL_PORT}:${PORT}" \
  -e PORT \
  -e NODE_ENV \
  -d \
  --name "${NAME}" \
  ghcr.io/nodecg/nodecg:2
