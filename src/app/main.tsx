import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { registerServiceWorker } from './pwa/registerServiceWorker'
import { AppProviders } from './providers/AppProviders'
import { router } from './router/router'
import './styles/global.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
)

registerServiceWorker()
