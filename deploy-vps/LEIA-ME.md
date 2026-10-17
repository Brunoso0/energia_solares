# Deploy via GitHub (git push -> git pull na VPS)

Fluxo do dia a dia:
    # no seu PC
    git add . && git commit -m "ajuste" && git push
    # na VPS
    /root/sites/deploy.sh            # ou: deploy.sh energia | deploy.sh araponga

O build (npm ci + vite build) roda dentro do Docker na VPS, por isso o `dist/` não precisa ir pro git.

## A. No seu PC (uma vez)
1. **energia_solares**: já tem repo. Faça commit/push do `Dockerfile`, `nginx.conf` e `.dockerignore` novos.
2. **solaresv2** (ainda sem git):
       cd C:\sites\solaresv2
       git init -b main
       git add . && git commit -m "feat: site Vila Araponga"
       git remote add origin https://github.com/Brunoso0/NOME-DO-REPO.git
       git push -u origin main
   (crie o repo vazio no GitHub antes; sugiro privado.)
   Confira antes do `git add` que as imagens usadas pelo site (jpeg/png na raiz e em `public/`) estão sendo incluídas.

## B. Na VPS (uma vez)
1. Passos 1 e 2 do guia (atualizar + Docker). Atalho: `curl -fsSL https://get.docker.com | sh`
2. Pasta e clones:
       mkdir -p /root/sites && cd /root/sites
       git clone https://github.com/Brunoso0/energia_solares.git
       git clone https://github.com/Brunoso0/NOME-DO-REPO.git vila-araponga
   **Repo privado?** Gere uma deploy key na VPS: `ssh-keygen -t ed25519 -f ~/.ssh/id_deploy -N ""`,
   cadastre `~/.ssh/id_deploy.pub` em *Settings > Deploy keys* de cada repo (somente leitura)
   e clone por SSH (`git@github.com:...`). Para 2 repos, use uma chave por repo + `~/.ssh/config`.
3. Copie `docker-compose.yml` e `deploy.sh` desta pasta para `/root/sites/` e dê `chmod +x deploy.sh`.
4. Suba tudo: `docker compose up -d --build`

## C. DNS + Proxy Manager
- Zona DNS na Hostinger: registro **A** (domínio e www) de cada site -> IP da VPS.
- Painel `http://IP:81` (login inicial `admin@example.com` / `changeme`, troque logo).
- Proxy Hosts > Add, um por site, scheme `http`:
  | Site | Forward Hostname | Porta |
  |---|---|---|
  | energia | `solares-energia` | 80 |
  | Vila Araponga | `vila-araponga` | 80 |
- Aba SSL: Request new certificate + Force SSL + HTTP/2.
- Depois feche a porta 81 pro público (firewall da Hostinger) e use `ssh -L 81:localhost:81 root@IP` pra acessar.

## D. (Opcional) Deploy automático no push
GitHub Actions que faz SSH na VPS e roda `/root/sites/deploy.sh energia` a cada push na `main`.
Precisa de uma chave SSH dedicada nos *Secrets* do repo. Dá pra montar depois se quiser.
