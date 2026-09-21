import React, { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h2 style={{ color: '#f43f5e', fontSize: '20px', marginBottom: '12px' }}>Studio Runtime Error:</h2>
          <pre style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', overflow: 'auto', border: '1px solid #ef4444', color: '#fca5a5' }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ background: '#1e293b', padding: '16px', borderRadius: '8px', overflow: 'auto', marginTop: '12px', fontSize: '12px', opacity: 0.8 }}>
            {this.state.error?.stack}
          </pre>
          <button 
            onClick={() => {
              localStorage.removeItem('iconderry_selected_asset');
              window.location.reload();
            }}
            style={{ marginTop: '16px', padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Reset &amp; Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// Register service worker for PWA browser installation & offline asset caching
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.debug('ServiceWorker registration optional:', err);
    });
  });
}

// Add native capacitor flag class to root element for status bar safe-area insets (ONLY IN NATIVE APK)
if (typeof window !== 'undefined') {
  const isNative = window.Capacitor?.isNativePlatform?.() || (window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform());
  if (isNative) {
    document.documentElement.classList.add('is-native-capacitor');
  }
}




