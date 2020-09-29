#!/bin/bash
set -e

INIT_FILE=/dev/shm/INIT_FILE
USERNAME=node
WORKDIR=/workspace

if [ ${UID} -eq 0 ]; then
    if [ ! -e "${INIT_FILE}" ]; then
        touch "${INIT_FILE}"
        chown -R "${USERNAME}:${USERNAME}" "${WORKDIR}"
    fi
    # Force execution with non-root user
    exec runuser -u "${USERNAME}" "$0" -- "$@"
fi

exec "$@"
