#FROM node:latest
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node

WORKDIR /workspace
COPY assets/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT [ "docker-entrypoint.sh" ]

