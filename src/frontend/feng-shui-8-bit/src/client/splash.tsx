import './index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SplashPage } from './pages/SplashPage';

/**
 * Splash 入口 - Feed Card (Inline View)
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SplashPage />
  </StrictMode>
);