import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticiaCard from '../components/NoticiaCard';
import { supabase } from '../supabaseClient';

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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Cabeçalho pedido pelo professor */}
      <header style={{ marginBottom: '24px', borderBottom: '2px solid #eee', paddingBottom: '12px' }}>
        <h1>O Clarim da Escola</h1>
        <p><strong>Professor Orientador:</strong> Lucas Alaric Angelo</p>
        <p><strong>Redação: </strong>Aluno 1, Aluno 2, Aluno 3, Aluno 4 e Aluno 5</p>
      </header>

      {/* Destaques rápidos */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', // Se adapta de forma bonita se tiver 1, 2, 3 ou mais blocos
        gap: '16px',
        marginBottom: '32px'
      }}>
        {muralBlocos.map((bloco) => (
          <div
            key={bloco.ID}
            style={{
              background: '#f8f9fa',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.15rem', color: '#222' }}>{bloco.TITULO}</h3>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#444', lineHeight: '1.4', whiteSpace: 'pre-line' }}>
              {bloco.CONTEUDO}
            </p>
          </div>
        ))}
      </section>

      {/* Lista de notícias */}
      <section>
        {carregando && <p style={{ color: '#666' }}>Carregando matérias recentes da nuvem...</p>}

        {!carregando && listaNoticias.length === 0 && (
          <p style={{ color: '#777' }}>Nenhuma notícia publicada ainda no mural.</p>
        )}

        {/* Ajustado: Usando item.id na key em vez do índice 'i' */}
        {!carregando && listaNoticias.slice(0, 3).map((item) => (
          <NoticiaCard key={item.id} noticia={item} />
        ))}

      </section>
    </div>
  );
}