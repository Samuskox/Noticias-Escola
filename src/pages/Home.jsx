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

  // Busca os dados da API ao carregar o componente
  useEffect(() => {
    const buscarNoticiasDoBanco = async () => {
      try {
        const { data, error } = await supabase.from('NOTICIAS').select('*').order('DATA', { ascending: false });

        if (error) throw error;

        const noticiasFormatadas = data.map((item) => ({
          id: item.ID_NOTICIAS.toString(), // Converte o ID numérico SERIAL para String
          titulo: item.TITULO,
          resumo: item.RESUMO,
          conteudo: item.CONTEUDO,
          autores: item.AUTORES,
          videoUrl: item.URL_VIDEO,
          imagens: item.IMAGENS || [], // Se for null, vira um array vazio []
          data: item.DATA
        }));

        const { data: muralData } = await supabase
          .from('MURAL_HOME')
          .select('*')
          .order('ORDEM', { ascending: true })
          .order('DATA_CRIACAO', { ascending: true });

        if (muralData) {
          setMuralBlocos(muralData);
        }

        console.log(noticiasFormatadas)

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
        <h1>O Clarim da Escola</h1>
        <p><strong>Professor Orientador:</strong> Lucas Alaric Angelo</p>
        <p><strong>Redação: </strong>Aluno 1, Aluno 2, Aluno 3, Aluno 4 e Aluno 5</p>
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
      <section>
        <h2>Últimas Notícias</h2>
        
        {carregando && <p style={{ color: '#666' }}>Carregando matérias recentes...</p>}
        
        {!carregando && listaNoticias.length === 0 && (
          <p style={{ color: '#777' }}>Nenhuma notícia publicada ainda no mural.</p>
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