import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('qc_tech')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

ServiceWorkerRegistration.register();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/src/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.log('Service Worker registration failed:', error);
    });

  // Check for service worker updates
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Refresh the page to update to the latest version
    window.location.reload();
  });
}