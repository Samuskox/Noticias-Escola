import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if (!adminLogado) navigate('/login');
  }, [navigate]);

  const handleSair = () => {
    localStorage.removeItem('adminLogado');
    navigate('/login');
  };

   const buscarNoticias = async () => {

    try {
      setCarregando(true);

      
      const { data, error } = await supabase
        .from('NOTICIAS')
        .select('ID_NOTICIAS, TITULO, DATA, IMAGENS')
        .order('DATA', { ascending: false });

      if (error) throw error;
      setNoticias(data || []);
    } catch (error) {
      console.error('Erro ao buscar notícias para o admin:', error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluirNoticia = async (id, arrayImagens) => {
    const confirmar = window.confirm('Tem certeza absoluta que deseja excluir esta notícia? Esta ação não pode ser desfeita!');
    if (!confirmar) return;

    try {
      //Limpa os arquivos físicos do Storage se houver imagens vinculadas
      if (arrayImagens && arrayImagens.length > 0) {
        // Extrai apenas os nomes dos arquivos a partir da URL pública salva
        const caminhosArquivos = arrayImagens.map((url) => {
          const partes = url.split('/noticias-imagens/');
          return partes[1]; // Retorna algo como "1790851630670-images.jpg"
        }).filter(Boolean);

        if (caminhosArquivos.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('noticias-imagens')
            .remove(caminhosArquivos);

          if (storageError) console.warn('Aviso ao limpar mídias do Storage:', storageError.message);
        }
      }
       const { error: dbError } = await supabase
        .from('NOTICIAS')
        .delete()
        .eq('ID_NOTICIAS', id);

      if (dbError) throw dbError;

      alert('Notícia removida com sucesso!');
      buscarNoticias(); // Atualiza a lista na tela automaticamente
    } catch (error) {
      alert('Erro ao excluir notícia: ' + error.message);
    }
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

      <section>
        <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px', marginBottom: '16px' }}>Publicações Ativas ({noticias.length})</h3>
        
        {carregando && <p style={{ color: '#666' }}>Carregando acervo de controle...</p>}
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {noticias.map((item) => (
            <div key={item.ID_NOTICIAS} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', border: '1px solid #eee', borderRadius: '8px', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div style={{ paddingRight: '12px' }}>
                <strong style={{ display: 'block', fontSize: '1.1rem', color: '#222' }}>{item.TITULO}</strong>
                <span style={{ fontSize: '0.82rem', color: '#777' }}>
                  📅 {new Date(item.DATA).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <button 
                onClick={() => handleExcluirNoticia(item.ID_NOTICIAS, item.IMAGENS)}
                style={{ background: '#e63946', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.88rem', flexShrink: 0, transition: 'background 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#bd2130'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#e63946'}
              >
                🗑️ Excluir
              </button>
            </div>
          ))}

          {!carregando && noticias.length === 0 && (
            <p style={{ color: '#777', fontStyle: 'italic', textAlign: 'center', marginTop: '10px' }}>Nenhuma notícia encontrada para gerenciar.</p>
          )}
        </div>
      </section>
    </div>
  );
}
