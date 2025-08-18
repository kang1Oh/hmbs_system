import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // React 18 root creation
import './index.css';  // Import global styles (if any)
import App from './App.jsx';  // Import App component

// Render the App component into the root element of the HTML
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
