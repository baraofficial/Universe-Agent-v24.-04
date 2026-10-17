import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';


// Handle unhandled auth/network-request-failed in sandboxed iframe previews
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    if (
      reason?.code === 'auth/network-request-failed' ||
      reason?.message?.includes('network-request-failed') ||
      reason?.message?.includes('auth/')
    ) {
      console.warn('Caught unhandled Firebase Auth rejection in preview:', reason);
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

