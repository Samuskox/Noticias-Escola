import { Link } from 'react-router-dom';


export default function NoticiaCard({ noticia }) {
  return (
    <div style={{ border: '1px solid #ddd', margin: '10px 0', padding: '12px', borderRadius: '6px' }}>
      <h3>{noticia.titulo}</h3>
      <p>{noticia.resumo}</p>
      
      {/* Link para a rota dinâmica usando o ID da notícia */}
      <Link to={`/noticia/${noticia.id}`} style={{ color: 'blue', fontWeight: 'bold' }}>
        Ler matéria completa →
      </Link>
    </div>
  );
}