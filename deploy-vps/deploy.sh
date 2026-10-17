#!/usr/bin/env bash
# Na VPS: /root/sites/deploy.sh  -> puxa o git e reconstrói só o que mudou.
# Uso: ./deploy.sh            (os dois sites)
#      ./deploy.sh energia    (só energia_solares)
#      ./deploy.sh araponga   (só vila-araponga)
set -euo pipefail
cd /root/sites

case "${1:-all}" in
  energia)  repos=(energia_solares);              svcs=(solares-energia) ;;
  araponga) repos=(vila-araponga);                svcs=(vila-araponga) ;;
  *)        repos=(energia_solares vila-araponga); svcs=(solares-energia vila-araponga) ;;
esac

for r in "${repos[@]}"; do
  echo "==> git pull $r"
  git -C "$r" pull --ff-only
done

echo "==> build + restart"
docker compose up -d --build "${svcs[@]}"
docker image prune -f >/dev/null
echo "Pronto."
