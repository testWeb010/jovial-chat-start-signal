import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Initialize Lenis globally
import { useLenis } from './hooks/useLenis'

const AppWithLenis = () => {
  useLenis(); // Initialize smooth scrolling
  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithLenis />
  </StrictMode>,
)
