#!/usr/bin/env bash
# Na VPS, dentro de /root/sites/chatbot:  ./gen-env.sh admin@email.com
# Gera o .env com senhas aleatórias (não imprime nenhuma) e não sobrescreve um .env existente.
set -euo pipefail
[ -e .env ] && { echo ".env já existe, nada feito."; exit 0; }
ADMIN="${1:?uso: ./gen-env.sh email-do-admin-typebot}"
umask 077
cat > .env <<ENV
BASE_DOMAIN=solarescorporativa.com.br
EVOLUTION_IMAGE=evoapicloud/evolution-api:latest
EVOLUTION_API_KEY=$(openssl rand -hex 24)
EVOLUTION_DB_PASSWORD=$(openssl rand -hex 20)
TYPEBOT_DB_PASSWORD=$(openssl rand -hex 20)
TYPEBOT_ENCRYPTION_SECRET=$(openssl rand -base64 24)
TYPEBOT_ADMIN_EMAIL=$ADMIN
TYPEBOT_DISABLE_SIGNUP=false
# SMTP: o Typebot faz login por link enviado por e-mail, então precisa de um SMTP.
SMTP_FROM=
SMTP_HOST=
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=
SMTP_SECURE=false
ENV
echo ".env criado com chaves aleatórias. Preencha o bloco SMTP e rode: docker compose up -d"
