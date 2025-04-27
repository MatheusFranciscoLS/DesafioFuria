Write-Host "=== Diagnóstico de Estrutura de Rotas ==="
$rotas = @(
    "routes\curiosidades.js",
    "routes\elenco.js",
    "routes\estatisticas.js",
    "routes\jogos.js",
    "routes\modalidades.js",
    "routes\noticias.js",
    "routes\placares.js"
)
foreach ($rota in $rotas) {
    if (Test-Path $rota) {
        Write-Host "[OK] $rota encontrado"
    } else {
        Write-Host "[ERRO] $rota NÃO encontrado"
    }
}

Write-Host "`n=== Testando importação das rotas no Node.js ==="
foreach ($rota in $rotas) {
    Write-Host "Testando require('./$rota')..."
    node -e "require('./$rota'); console.log('Importação OK: ./$rota')" 2>&1
}

Write-Host "`n=== Testando início do servidor ==="
try {
    Start-Process -NoNewWindow -FilePath "node" -ArgumentList "index.js" -PassThru
    Start-Sleep -Seconds 3
    Write-Host "Servidor iniciado? Veja o terminal principal para mensagens de erro."
} catch {
    Write-Host "[ERRO] Falha ao iniciar o servidor: $_"
}