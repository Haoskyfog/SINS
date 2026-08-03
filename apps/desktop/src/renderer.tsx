import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './renderer/app/App';
import './renderer/app/app.css';

const root = document.getElementById('app');

if (!root) throw new Error('Renderer root element was not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
