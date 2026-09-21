import { useParams } from 'react-router-dom';

export default function Noticia() {
  const { id } = useParams();

  // Exemplo simulado de conteúdo carregado pelo ID
  return (
    <article style={{ maxWidth: '700px', margin: '20px auto', padding: '0 16px' }}>
      <h1>Notícia #{id}</h1>
      <p>Texto completo da matéria escrito pelos alunos...</p>

      {/* Se tiver imagem */}
      <img 
        src="https://placehold.co/600x300" 
        alt="Foto da matéria" 
        style={{ width: '100%', borderRadius: '8px', margin: '16px 0' }} 
      />

      {/* Se tiver vídeo do YouTube */}
      <div style={{ marginTop: '16px' }}>
        <h4>Vídeo da Notícia:</h4>
        <iframe 
          width="100%" 
          height="315" 
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
          title="YouTube video player" 
          allowFullScreen
          style={{ border: 0, borderRadius: '8px' }}
        />
      </div>
    </article>
  );
}