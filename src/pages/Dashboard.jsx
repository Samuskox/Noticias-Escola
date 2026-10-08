import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if(!adminLogado){
      navigate('/login')
    }else{
      buscarNoticias(); 
    } 
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
<div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Painel do Administrador</h1>
          <p>Bem-vindo(a), <strong>{nomeAdmin}</strong></p>
        </div>
        <button onClick={handleSair} className="btn-sair">
          Sair
        </button>
      </header>

      {/* Grid de botões principais */}
      <div className="dashboard-menu-grid">
        <Link to="/admin" className="menu-card escrever">
          Escrever
        </Link>
        <Link to="/" className="menu-card ver-site">
          Ver o Site (Home)
        </Link>
        <Link to="/mural" className="menu-card mural">
          Gerenciar Mural
        </Link>
        <Link to="/autores" className="menu-card autores">
          Gerenciar Autores
        </Link>
      </div>

      {/* Seção das postagens abaixo */}
      <section className="publicacoes-section">
        <h3>Publicações Ativas ({noticias.length})</h3>
        
        {carregando && <p className="publicacoes-status-msg">Carregando acervo de controle...</p>}
        
        <div className="publicacoes-lista">
          {noticias.map((item) => (
            <div key={item.ID_NOTICIAS} className="publicacao-item">
              <div className="publicacao-info">
                <strong>{item.TITULO}</strong>
                <span>
                  {new Date(item.DATA).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <button 
                onClick={() => handleExcluirNoticia(item.ID_NOTICIAS, item.IMAGENS)}
                className="btn-excluir-noticia"
              >
                🗑️ Excluir
              </button>
            </div>
          ))}

          {!carregando && noticias.length === 0 && (
            <p className="publicacoes-vazio">Nenhuma notícia encontrada para gerenciar.</p>
          )}
        </div>
      </section>
    </div>
  );
}
