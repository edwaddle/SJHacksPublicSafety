import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Error boundary for the entire app
const ErrorBoundary = ({ children }) => {
  try {
    return children;
  } catch (error) {
    console.error('Error in app:', error);
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        color: 'red'
      }}>
        <h1>Something went wrong</h1>
        <p>Please refresh the page and try again</p>
      </div>
    );
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
