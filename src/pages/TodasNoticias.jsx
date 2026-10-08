import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import NoticiaCard from '../components/NoticiaCard';

import './TodasNoticias.css';

export default function TodasNoticias() {
  const [listaCompleta, setListaCompleta] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarAcervoCompleto = async () => {
      try {
        // Busca TODAS as notícias do banco, da mais nova para a mais antiga
        const { data, error } = await supabase
          .from('NOTICIAS')
          .select(`
            ID_NOTICIAS,
            TITULO,
            RESUMO,
            CONTEUDO,
            URL_VIDEO,
            IMAGENS,
            DATA,
            NOTICIA_AUTOR_TEM (
              AUTORES ( NOME )
            )
            `)
          .order('DATA', { ascending: false });

        if (error) throw error;


        const formatadas = data.map((item) => {

          const listaNomes = item.NOTICIA_AUTOR_TEM
            ?.map(pivo => pivo.AUTORES?.NOME)
            .filter(Boolean) || [];

          return {
            id: item.ID_NOTICIAS.toString(),
            titulo: item.TITULO,
            resumo: item.RESUMO,
            conteudo: item.CONTEUDO,
            autor: listaNomes.length > 0 ? listaNomes.join(', ') : 'Redação',
            videoUrl: item.URL_VIDEO,
            imagens: item.IMAGENS || [],
            data: item.DATA
          }

        });



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
     <div className="acervo-container">
      <header className="acervo-header">
        <Link to="/" className="btn-voltar">
          ← Voltar para a Página Inicial
        </Link>
        <h1>Acervo de Matérias</h1>
        <p className="acervo-subtitulo">Consulte todas as notícias já publicadas no Clarim da Escola.</p>
      </header>

      <section className="acervo-lista">
        {carregando && <p className="acervo-status">Carregando histórico do jornal...</p>}

        {!carregando && listaCompleta.length === 0 && (
          <p className="acervo-vazio">Nenhuma notícia encontrada no arquivo histórico.</p>
        )}

        {!carregando && listaCompleta.map((item) => (
          <NoticiaCard key={item.id} noticia={item} />
        ))}
      </section>
    </div>
  );
}
