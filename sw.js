/* Service Worker — Desenvolvimento Studyo4
   Fica registrado no navegador e recebe os pushes mesmo com o site fechado. */

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

// Chegou um push do servidor
self.addEventListener('push', (event) => {
  let dados = {};
  try {
    dados = event.data ? event.data.json() : {};
  } catch (e) {
    dados = { titulo: 'Studyo4', corpo: event.data ? event.data.text() : '' };
  }

  const titulo = dados.titulo || 'Studyo4';
  const opcoes = {
    body: dados.corpo || '',
    tag: dados.tag || undefined,        // agrupa notificações do mesmo assunto
    renotify: !!dados.tag,
    requireInteraction: false,
    data: { url: dados.url || './index.html' }
  };
  event.waitUntil(self.registration.showNotification(titulo, opcoes));
});

// Clicou na notificação: foca a aba existente ou abre uma nova
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const destino = (event.notification.data && event.notification.data.url) || './index.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((abas) => {
      for (const aba of abas) {
        if ('focus' in aba) { aba.navigate(destino); return aba.focus(); }
      }
      return self.clients.openWindow(destino);
    })
  );
});
