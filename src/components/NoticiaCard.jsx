import { Link } from 'react-router-dom';

import './NoticiaCard.css';


export default function NoticiaCard({ noticia }) {

    const temImagem = noticia.imagens && noticia.imagens.length > 0;
    const primeiraImagem = temImagem ? noticia.imagens[0] : null;

     const dataFormatada = new Date(noticia.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });



  return (
 <Link to={`/noticia/${noticia.id}`} className="card-noticia-link">
      
      {/* LADO ESQUERDO: Miniatura da Imagem */}
      {temImagem && (
        <div className="card-noticia-imagem-wrapper">
          <img 
            src={primeiraImagem} 
            alt={`Capa da notícia: ${noticia.titulo}`} 
            className="card-noticia-img"
          />
        </div>
      )}

      {/* LADO DIREITO: Textos Informativos */}
      <div className="card-noticia-conteudo">
        
        {/* Metadados: Autor e Data */}
        <div className="card-noticia-meta">
          <span>Escrito por: {noticia.autor}</span>
          <span>• {dataFormatada}</span>
        </div>

        {/* Título */}
        <h3 className="card-noticia-titulo">
          {noticia.titulo}
        </h3>

        {/* Resumo/Prévia */}
        <p className="card-noticia-resumo">
          {noticia.resumo}
        </p>
        
        {/* Link indicativo estilizado */}
        <span className="card-noticia-action">
          Ler matéria completa →
        </span>
      </div>
    </Link>
  );
}