import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if (!adminLogado) navigate('/login');
  }, [navigate]);

  const handleSair = () => {
    localStorage.removeItem('adminLogado');
    navigate('/login');
  };

  const admin = JSON.parse(localStorage.getItem('adminLogado') || '{}');
  const nomeAdmin = admin.NOME_ADMINISTRADOR || 'Administrador';

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #333', paddingBottom: '12px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Painel do Administrador</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>Bem-vindo(a), <strong>{nomeAdmin}</strong></p>
        </div>
        <button onClick={handleSair} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Sair
        </button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Link to="/admin" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#007bff', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          Escrever
        </Link>
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#6c757d', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          Ver o Site (Home)
        </Link>

        <Link to="/mural" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#6c757d', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
          Gerenciar Mural
        </Link>

      </div>
    </div>
  );
}
