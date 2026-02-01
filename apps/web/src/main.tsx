import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AdminApp from './admin/App'
import ClientApp from './client/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/client/:merchantId" element={<ClientApp />} />
        <Route path="/" element={<div>Bienvenue sur Qreta</div>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)