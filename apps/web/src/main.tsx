import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import AdminApp from './admin/App'
import ClientApp from './client/App'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/admin/*" element={<AdminApp/>}/>
                <Route path="/c/:storeId" element={<ClientApp/>}/>
                <Route path="/"
                       element={<div className="min-h-screen flex items-center justify-center">Welcome to Qreta</div>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)