import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CommentProvider from './assets/context/CommentContext.jsx'
import ModalProvider from './assets/context/ModalContext.jsx'



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CommentProvider>
      <ModalProvider>
        <App />
      </ModalProvider>
    </CommentProvider>
  </StrictMode>
)
