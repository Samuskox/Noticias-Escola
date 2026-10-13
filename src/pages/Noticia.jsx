import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

import './Noticia.css';

export default function Noticia() {
  const parametros = useParams();
 const { id } = useParams(); 

  const [noticia, setNoticia] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const obterLinkEmbedYoutube = (url) => {
    if (!url) return null;

    // Expressão regular super segura que captura apenas o ID de 11 caracteres do vídeo
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const resultado = url.match(regex);

    // Se encontrou o ID de 11 caracteres, monta o link perfeito
    if (resultado && resultado[1]) {
      const idVideo = resultado[1];
      return "https://youtube.com/embed/" + idVideo;
    }

    // Se o link colado já for um embed perfeito, retorna ele mesmo
    if (url.includes('/embed/')) {
      return url;
    }

    return null; // Retorna null para não quebrar o iframe se o link for inválido
  };

  useEffect(() => {
    const buscarNoticiaUnica = async () => {
      if(!id) return;
      try {
       const {data, error} = await supabase
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
       .eq('ID_NOTICIAS', id)
       .single();

       if(error) throw error;

       if(data){
        const listaNomes = data.NOTICIA_AUTOR_TEM
            ?.map(pivo => pivo.AUTORES?.NOME)
            .filter(Boolean) || [];

        setNoticia({
        id: data.ID_NOTICIAS.toString(),
        titulo: data.TITULO,
        resumo: data.RESUMO,
        conteudo: data.CONTEUDO,
        autor: listaNomes.length > 0 ? listaNomes.join(', ') : 'Redação',
        videoUrl: data.URL_VIDEO,
        imagens: data.IMAGENS || [],
        data: data.DATA
       });
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
    <article className="noticia-artigo">
      <header className="noticia-header">
        <h1 className="noticia-titulo">{noticia.titulo}</h1>
        <p className="noticia-metadados">
          Por <strong>{noticia.autor}</strong> em {new Date(noticia.data).toLocaleDateString('pt-BR')}
        </p>
        <p className="noticia-resumo">{noticia.resumo}</p>
      </header>

      {noticia.imagens && noticia.imagens.length > 0 && (
        <div className="noticia-galeria">
          {noticia.imagens.map((url, index) => (
            <img 
              key={index}
              src={url} 
              alt={`Mídia ${index + 1} da matéria`} 
              className="noticia-imagem"
            />
          ))}
        </div>
      )}

      {/* Conteúdo em texto da matéria */}
      <div className="noticia-conteudo">
        {noticia.conteudo}
      </div>

      {/* Se houver vídeo cadastrado do YouTube, renderiza o Player */}
      {noticia.videoUrl && (
        <div className="noticia-video-secao">
          <h4>Vídeo Anexo:</h4>
          <div className="video-wrapper">
            <iframe 
              src={obterLinkEmbedYoutube(noticia.videoUrl)} // Converte link normal do youtube em link embed
              title="Player do Vídeo" 
              allowFullScreen
              className="video-iframe"
            />
          </div>
        </div>
      )}
    </article>
  );
}