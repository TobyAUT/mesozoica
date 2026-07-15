import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Self-hosted, licence-free (OFL) variable fonts — bundled at build time, no external CDN request
// (DSGVO-friendly). Three families for visual variety: Fraunces (serif display headings), Inter
// (sans body), Space Grotesk (eyebrows / UI labels).
import '@fontsource-variable/fraunces';
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
import App from './app/App';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
