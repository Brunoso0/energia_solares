# Uso (PowerShell, na pasta deploy-vps):
#   .\deploy.ps1 -Ip 123.45.67.89
# Faz o build dos 2 sites e envia o dist de cada um para a VPS.
param([Parameter(Mandatory=$true)][string]$Ip)

$sites = @{
  "C:\sites\energia_solares" = "solares-energia"
  "C:\sites\solaresv2"       = "vila-araponga"
}

foreach ($kv in $sites.GetEnumerator()) {
  Write-Host "==> Build $($kv.Value)"
  Push-Location $kv.Key
  npm run build
  if ($LASTEXITCODE -ne 0) { Pop-Location; throw "Build falhou: $($kv.Key)" }
  Pop-Location

  Write-Host "==> Enviando $($kv.Value)"
  ssh root@$Ip "mkdir -p /root/sites/$($kv.Value) && rm -rf /root/sites/$($kv.Value)/*"
  scp -r "$($kv.Key)\dist\*" "root@${Ip}:/root/sites/$($kv.Value)/"
}
Write-Host "Pronto. Sites atualizados (sem precisar reiniciar nada)."
