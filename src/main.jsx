import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function layoutVisitantes() {
  return (
    <div>
      <header style={{ background: '#0284c7', color: 'white', padding: '15px' }}>
        <h2>Portal de Notícias - Escola</h2>
      </header>
      <main style={{ padding: '20px' }}><Outlet /></main> {/* As páginas dos pais entram aqui */}
    </div>
  );
}

function layoutAdmin() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', background: '#1e293b', color: 'white', minHeight: '100vh', padding: '20px' }}>
        <h3>Painel Aluno</h3>
        <nav><ul><li>Escrever Notícia</li></ul></nav>
      </aside>
      <main style={{ padding: '20px', flex: 1 }}><Outlet /></main> {/* As páginas do admin entram aqui */}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)