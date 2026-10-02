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
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
          <h3>🍱 Almoço do Dia</h3>
          <p>Arroz, feijão, frango grelhado e salada tropical.</p>
        </div>
        <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
          <h3>💡 Curiosidade da Semana</h3>
          <p>Você sabia que a biblioteca da nossa escola tem mais de 3.000 livros?</p>
        </div>
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