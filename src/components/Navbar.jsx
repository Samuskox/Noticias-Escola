import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [aberto, setAberto] = useState(false);

  return (
    <nav style={{ padding: '12px 20px', borderBottom: '1px solid #ddd' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Jornal Escolar</h2>
        {/* Botão com as 3 barrinhas */}
        <button 
          onClick={() => setAberto(!aberto)} 
          style={{ fontSize: '20px', cursor: 'pointer', background: 'none', border: 'none' }}
        >
            <img src="src\assets\hamburgueMenu.png" alt="" width="50" />
        </button>
      </div>


      {aberto && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          <Link to="/" onClick={() => setAberto(false)}>Início</Link>
          <Link to="/sobre" onClick={() => setAberto(false)}>Sobre nós</Link>
          <Link to="/escola" onClick={() => setAberto(false)}>Nossa escola</Link>
          <Link to="/colaboradores" onClick={() => setAberto(false)}>Todos os colaboradores</Link>
          <hr />
          <Link to="/admin" onClick={() => setAberto(false)}>Área de Postagem (Admin)</Link>
        </div>
      )}
    </nav>
  );
}