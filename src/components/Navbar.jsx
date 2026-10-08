import { useState } from 'react';
import { Link } from 'react-router-dom';

import Home from '../pages/Home';
import './Navbar.css';
import iconeHamburguer from '../assets/hamburgueMenu.png';

export default function Navbar() {
  const [aberto, setAberto] = useState(false);

  return (
   <nav className="navbar-header">
      <div className="navbar-topo">

        <a href="/" className="navbar-logo-link">
          <h2>Jornal Escolar</h2>
        </a>
       
        {/* Botão com as 3 barrinhas */}
        <button 
          onClick={() => setAberto(!aberto)} 
          className="btn-hamburguer"
        >
          <img src={iconeHamburguer} alt="Menu" />
        </button>
      </div>

      {/* A div fica sempre na árvore, mas ganha a classe ".aberto" dinamicamente */}
      <div className={`navbar-menu-container ${aberto ? 'aberto' : ''}`}>
        <Link to="/" className="navbar-link-item" onClick={() => setAberto(false)}>Início</Link>
        <Link to="/sobre" className="navbar-link-item" onClick={() => setAberto(false)}>Sobre nós</Link>
        <Link to="/escola" className="navbar-link-item" onClick={() => setAberto(false)}>Nossa escola</Link>
        <Link to="/todasNoticias" className="navbar-link-item" onClick={() => setAberto(false)}>Todas as Notícias</Link>
        <Link to="/jogos" className="navbar-link-item" onClick={() => setAberto(false)}>Jogos</Link>

        <hr className="navbar-divisor" />
        
        <Link to="/login" className="navbar-link-admin" onClick={() => setAberto(false)}>
          🔒 Área de Postagem (Admin)
        </Link>
      </div>
    </nav>
  );
}