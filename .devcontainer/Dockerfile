FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

USER root


RUN groupadd docker --gid 138 \
    && usermod -aG docker node

USER node