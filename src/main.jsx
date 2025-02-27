import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import {HeroUIProvider} from '@heroui/react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <HeroUIProvider>
        <App />
      </HeroUIProvider>
    </HashRouter>
  </StrictMode>,
)
