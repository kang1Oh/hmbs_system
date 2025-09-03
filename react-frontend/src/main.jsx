import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client'; // React 18 root creation
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // Import global styles (if any)
import App from './App.jsx';  // Import App component
import axios from 'axios';
import { CartProvider } from './context/CartContext.jsx';

// Enable requests to carry cookies 
axios.defaults.withCredentials = true;

// Render the App component into the root element of the HTML, wrapped in StrictMode for highlighting potential issues, and CartProvider for cart state management
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
