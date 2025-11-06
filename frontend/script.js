async function fetchMetrics() {
  const res = await fetch('/metrics');
  const text = await res.text();

  const lines = text.split('\n');
  const getValue = (name) => {
    const line = lines.find(l => l.startsWith(name));
    return line ? line.split(' ').pop() : 'N/A';
  };

  document.getElementById('requests').textContent = 'Requisições: ' + getValue('http_requests_total');
  document.getElementById('users').textContent = 'Usuários conectados: ' + getValue('active_users');
  document.getElementById('responseTime').textContent = 'Tempo de resposta: ' + getValue('http_response_time_seconds');
}

function simulateLogin() {
  fetch('/login').then(fetchMetrics);
}

function simulateLogout() {
  fetch('/logout').then(fetchMetrics);
}

setInterval(fetchMetrics, 5000);
