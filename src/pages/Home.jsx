import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticiaCard from '../components/NoticiaCard';
import { supabase } from '../supabaseClient';

import './Home.css';

// Exemplo de lista de notícias (depois pode vir de uma API ou LocalStorage)
// const listaNoticias = [
//   { id: '1', titulo: 'Feira de Ciências foi um sucesso', resumo: 'Confira as fotos dos projetos...' },
//   { id: '2', titulo: 'Vídeo da final do campeonato de futsal', resumo: 'Veja os melhores momentos...' }
// ];

export default function Home() {

  const [listaNoticias, setListaNoticias] = useState([]);
  const [muralBlocos, setMuralBlocos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [autoresMural, setAutoresMural] = useState('Carregando autores...');

  // Busca os dados da API ao carregar o componente
  useEffect(() => {
    const buscarNoticiasDoBanco = async () => {
      try {
        const { data, error } = await supabase.from('NOTICIAS').select(
          `ID_NOTICIAS,
        TITULO,
        RESUMO,
        CONTEUDO,
        URL_VIDEO,
        IMAGENS,
        DATA, 
        NOTICIA_AUTOR_TEM (
          AUTORES ( NOME )
        )`).order('DATA', { ascending: false });

        if (error) throw error;

        const noticiasFormatadas = data.map((item) => {
          const listaNomes = item.NOTICIA_AUTOR_TEM
            ?.map(pivo => pivo.AUTORES?.NOME)
            .filter(Boolean) || [];
          return {
            id: item.ID_NOTICIAS.toString(),
            titulo: item.TITULO,
            resumo: item.RESUMO,
            conteudo: item.CONTEUDO,
            autor: listaNomes.length > 0 ? listaNomes.join(', ') : 'Redação', // ✨ Exibe todos os autores juntos!
            videoUrl: item.URL_VIDEO,
            imagens: item.IMAGENS || [],
            data: item.DATA
          };
        });

        const { data: muralData } = await supabase
          .from('MURAL_HOME')
          .select('*')
          .order('ORDEM', { ascending: true })
          .order('DATA_CRIACAO', { ascending: true });

        if (muralData) {
          setMuralBlocos(muralData);
        }

        const { data: autoresData } = await supabase
          .from('AUTORES')
          .select('NOME')
          .order('NOME', { ascending: true });

        if(autoresData && autoresData.length > 0){
          const nomesFormatados = autoresData.map(auth => auth.NOME).join(', ');
          setAutoresMural(nomesFormatados);
        } else {
          setAutoresMural('Redação Escolar');
        }

        setListaNoticias(noticiasFormatadas);

      } catch (erro) {
        console.error('Não foi possível conectar ao servidor backend:', erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarNoticiasDoBanco();
  }, []);


  return (
<div className="home-container">

  <header className="home-header">
    <h1>Jornal do Sarah</h1>
    <p><strong>Professor Orientador:</strong> Lucas Alaric Angelo</p>
    <p><strong>Redação: </strong>{autoresMural}</p>
  </header>

  {/* Seção dos blocos do mural */}
  <section className="mural-grid">
    {muralBlocos.map((bloco) => (
      <div key={bloco.ID} className="mural-bloco">
        <h3>{bloco.TITULO}</h3>
        <p>{bloco.CONTEUDO}</p>
      </div>
    ))}
  </section>

  {/* Seção das notícias */}
  <section className="noticias-secao">
    <h2>Últimas Notícias</h2>

    {carregando && <p className="mensagem-status">Carregando matérias recentes...</p>}

    {!carregando && listaNoticias.length === 0 && (
      <p className="mensagem-status">Nenhuma notícia publicada ainda no mural.</p>
    )}

    {!carregando && listaNoticias.slice(0, 2).map((item) => (
      <NoticiaCard key={item.id} noticia={item} />
    ))}
  </section>

  {/* Botão dinâmico para ver o acervo de todas as notícias */}
  {!carregando && listaNoticias.length > 2 && (
    <div className="botao-acervo-container">
      <Link to="/todasNoticias" className="botao-acervo">
        📚 Ver Todas as Notícias Antigas ({listaNoticias.length})
      </Link>
    </div>
  )}
</div>

  );
}