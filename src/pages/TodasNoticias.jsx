import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NoticiaCard from '../components/NoticiaCard';

export default function TodasNoticias() {
  const [listaCompleta, setListaCompleta] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarAcervoCompleto = async () => {
      try {
        // Busca TODAS as notícias do banco, da mais nova para a mais antiga
        const { data, error } = await supabase
          .from('NOTICIAS')
          .select('*')
          .order('DATA', { ascending: false });

        if (error) throw error;

        const formatadas = data.map((item) => ({
          id: item.ID_NOTICIAS.toString(),
          titulo: item.TITULO,
          resumo: item.RESUMO,
          conteudo: item.CONTEUDO,
          autor: item.AUTOR || 'Redação',
          videoUrl: item.URL_VIDEO,
          imagens: item.IMAGENS || [],
          data: item.DATA
        }));

        setListaCompleta(formatadas);
      } catch (erro) {
        console.error('Erro ao buscar acervo:', erro.message);
      } finally {
        setCarregando(false);
      }
    };

    buscarAcervoCompleto();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '24px', borderBottom: '2px solid #eee', paddingBottom: '12px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold', fontSize: '0.95rem' }}>
          ← Voltar para a Página Inicial
        </Link>
        <h1 style={{ marginTop: '16px', fontSize: '2rem', color: '#111' }}>Acervo de Matérias</h1>
        <p style={{ color: '#666', margin: 0 }}>Consulte todas as notícias já publicadas no Clarim da Escola.</p>
      </header>

      <section style={{ marginTop: '30px' }}>
        {carregando && <p style={{ color: '#666' }}>Carregando histórico do jornal...</p>}
        
        {!carregando && listaCompleta.length === 0 && (
          <p style={{ color: '#777', fontStyle: 'italic' }}>Nenhuma notícia encontrada no arquivo histórico.</p>
        )}

        {!carregando && listaCompleta.map((item) => (
          <NoticiaCard key={item.id} noticia={item} />
        ))}
      </section>
    </div>
  );
}
