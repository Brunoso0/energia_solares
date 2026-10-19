# Chatbot: Evolution API + Typebot (self-host)

| Subdomínio | Serviço | Container:porta (no Proxy Manager) |
|---|---|---|
| api.solarescorporativa.com.br | Evolution API | evolution-api:8080 |
| typebot.solarescorporativa.com.br | Typebot builder | typebot-builder:3000 |
| bot.solarescorporativa.com.br | Typebot viewer | typebot-viewer:3000 |

Passos: DNS (registros A dos 3 -> IP da VPS) -> `./gen-env.sh email` -> preencher SMTP no `.env`
-> `docker compose up -d` -> Proxy Hosts com SSL -> criar instância na Evolution -> QR Code (só com o fluxo pronto).

Notas:
- O Typebot entra por link no e-mail (SMTP) ou OAuth. Sem SMTP não há login.
- Depois de criar o primeiro usuário, mude `TYPEBOT_DISABLE_SIGNUP=true` e rode `docker compose up -d`.
- Fixe as versões das imagens (troque `latest`) depois do primeiro teste.
- O painel de atendimento (seu) conversa com a Evolution por REST (envio) e webhook (recebimento).
- `.env` nunca vai para o git.
