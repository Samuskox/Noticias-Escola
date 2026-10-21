import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './GerenciarNoticias.css';

export default function GerenciarNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const adminLogado = localStorage.getItem('adminLogado');
    if (!adminLogado) {
      navigate('/login');
    } else {
      buscarNoticias();
    }
  }, [navigate]);

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
      console.error('Erro ao buscar notícias:', error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluirNoticia = async (id, arrayImagens) => {
    const confirmar = window.confirm('🚨 Tem certeza absoluta que deseja excluir esta notícia? Essa ação apagará as fotos e o texto para sempre!');
    if (!confirmar) return;

    try {
      if (arrayImagens && arrayImagens.length > 0) {
        const caminhosArquivos = arrayImagens.map((url) => {
          const partes = url.split('/noticias-imagens/');
          return partes[1];
        }).filter(Boolean);

        if (caminhosArquivos.length > 0) {
          const { error: storageError } = await supabase.storage
            .from('noticias-imagens')
            .remove(caminhosArquivos);

          if (storageError) console.warn('Aviso do Storage:', storageError.message);
        }
      }

      const { error: dbError } = await supabase
        .from('NOTICIAS')
        .delete()
        .eq('ID_NOTICIAS', id);

      if (dbError) throw dbError;

      alert('🗑️ Notícia removida com sucesso!');
      buscarNoticias(); 
    } catch (error) {
      alert('Erro ao excluir notícia: ' + error.message);
    }
  };

  return (
    <div className="gerenciar-noticias-container">
      <button onClick={() => navigate('/dashboard')} className="btn-voltar-painel">
        ← Voltar ao Painel
      </button>

      <header className="gerenciar-noticias-header">
        <h2>📰 Gerenciar Notícias</h2>
        <p>Aqui você pode ver, alterar ou excluir as matérias do jornal.</p>
        
        {/* Botão de Adicionar que redireciona para a tela que você já possui */}
        <Link to="/admin" className="btn-adicionar-noticia-atalho">
          ➕ Escrever Nova Notícia
        </Link>
      </header>

      <section className="lista-noticias-admin-secao">
        <h3>Publicações Ativas ({noticias.length})</h3>
        
        {carregando && <p className="status-carregando">Carregando acervo do jornal...</p>}
        
        <div className="grid-noticias-admin">
          {noticias.map((item) => (
            <div key={item.ID_NOTICIAS} className="card-noticia-admin">
              <div className="info-noticia-admin">
                <strong>{item.TITULO}</strong>
                <span>📅 {new Date(item.DATA).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="botoes-acoes-admin">
                {/* Redireciona para uma rota de edição que podemos estruturar se necessário */}
                <button 
                  onClick={() => navigate(`/editar-noticia/${item.ID_NOTICIAS}`)} 
                  className="btn-acao-editar"
                >
                  ✏️ Alterar
                </button>
                <button 
                  onClick={() => handleExcluirNoticia(item.ID_NOTICIAS, item.IMAGENS)}
                  className="btn-acao-excluir"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))}

          {!carregando && noticias.length === 0 && (
            <p className="status-vazio">Nenhuma notícia encontrada para gerenciar.</p>
          )}
        </div>
      </section>
    </div>
  );
}
