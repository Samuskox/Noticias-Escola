import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Noticia() {
  const parametros = useParams();
  console.log("Parâmetros da URL:", parametros);
 const { id } = useParams(); 

  const [noticia, setNoticia] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarNoticiaUnica = async () => {
      if(!id) return;
      try {
       const {data, error} = await supabase
       .from('NOTICIAS')
       .select('*')
       .eq('ID_NOTICIAS', id)
       .single();

       if(error) throw error;

       setNoticia({
        id: data.ID_NOTICIAS.toString(),
        titulo: data.TITULO,
        resumo: data.RESUMO,
        conteudo: data.CONTEUDO,
        autores: data.AUTORES,
        videoUrl: data.URL_VIDEO,
        imagens: data.IMAGENS || [],
        data: data.DATA
       });
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
          Por <strong>{noticia.autores}</strong> em {new Date(noticia.data).toLocaleDateString('pt-BR')}
        </p>
        <p style={{ fontSize: '1.1rem', color: '#444', fontStyle: 'italic', marginTop: '12px' }}>{noticia.resumo}</p>
      </header>

      {noticia.imagens && noticia.imagens.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '24px 0' }}>
          {noticia.imagens.map((url, index) => (
            <img 
              key={index}
              src={url} 
              alt={`Mídia ${index + 1} da matéria`} 
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} 
            />
          ))}
        </div>
      )}

      {/* Conteúdo em texto da matéria */}
      <div style={{ lineHeight: '1.6', fontSize: '1.1rem', color: '#222', whiteSpace: 'pre-line', marginBottom: '40px', textAlign:'left' }}>
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