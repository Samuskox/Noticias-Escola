import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Noticia() {
 const { item: id } = useParams(); 

  const [noticia, setNoticia] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarNoticiaUnica = async () => {
      try {
        const resposta = await fetch(`http://localhost:3001/api/noticias/${id}`);
        if (resposta.ok) {
          const dados = await resposta.json();
          setNoticia(dados);
        } else {
          console.error('Erro ao buscar a matéria');
        }
      } catch (erro) {
        console.error('Erro na conexão com o servidor:', erro);
      } finally {
        setCarregando(false);
      }
    };

    buscarNoticiaUnica();
  }, [id]);

  if (carregando) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Carregando matéria...</p>;
  if (!noticia) return <p style={{ textAlign: 'center', marginTop: '40px', color: 'red' }}>Notícia não encontrada!</p>;
  return (
    <article style={{ maxWidth: '700px', margin: '20px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px' }}>{noticia.titulo}</h1>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Por <strong>{noticia.autor}</strong> em {new Date(noticia.data).toLocaleDateString('pt-BR')}
        </p>
        <p style={{ fontSize: '1.1rem', color: '#444', fontStyle: 'italic', marginTop: '12px' }}>{noticia.resumo}</p>
      </header>

      {/* Renderiza todas as imagens vinculadas se existirem */}
      {noticia.imagens && noticia.imagens.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
          {noticia.imagens.map((caminho, index) => (
            <img 
              key={index}
              src={caminho.startsWith('http') ? caminho : `http://localhost:3001/${caminho}`} 
              alt={`Foto ${index + 1} da matéria`} 
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} 
            />
          ))}
        </div>
      )}

      {/* Conteúdo em texto da matéria */}
      <div style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#222', whiteSpace: 'pre-line' }}>
        {noticia.conteudo}
      </div>

      {/* Se houver vídeo cadastrado do YouTube, renderiza o Player */}
      {noticia.url_video && (
        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <h4 style={{ marginBottom: '12px' }}>Vídeo Anexo:</h4>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
            <iframe 
              src={noticia.url_video.replace('watch?v=', 'embed/')} // Converte link normal do youtube em link embed
              title="Player do Vídeo" 
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        </div>
      )}
    </article>
  );
}