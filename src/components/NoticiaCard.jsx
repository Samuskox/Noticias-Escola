import { Link } from 'react-router-dom';


export default function NoticiaCard({ noticia }) {

    const temImagem = noticia.imagens && noticia.imagens.length > 0;
    const primeiraImagem = temImagem ? noticia.imagens[0] : null;

     const dataFormatada = new Date(noticia.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });



  return (
    <Link 
      to={`/noticia/${noticia.id}`} 
      style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        gap: '20px', 
        background: '#fff', 
        border: '1px solid #e0e0e0', 
        borderRadius: '12px', 
        padding: '16px', 
        marginBottom: '20px', 
        textDecoration: 'none', 
        color: 'inherit',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer'
      }}
      // Efeito sutil ao passar o mouse por cima do card
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
      }}
    >
      {/* LADO ESQUERDO: Miniatura da Imagem (Só aparece se houver imagem) */}
      {temImagem && (
        <div style={{ width: '200px', height: '140px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden' }}>
          <img 
            src={primeiraImagem} 
            alt={`Capa da notícia: ${noticia.titulo}`} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      )}

      {/* LADO DIREITO: Textos Informativos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center', width: '100%' }}>
        
        {/* Metadados: Autor e Data */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#757575', fontWeight: '500' }}>
          <span>Escrito por: {noticia.autores}</span>
          <span>-{dataFormatada}</span>
        </div>

        {/* Título */}
        <h3 style={{ margin: 0, fontSize: '1.35rem', color: '#111', lineHeight: '1.3', fontWeight: 'bold' }}>
          {noticia.titulo}
        </h3>

        {/* Resumo/Prévia */}
        <p style={{ margin: 0, fontSize: '0.98rem', color: '#444', lineHeight: '1.4' }}>
          {noticia.resumo}
        </p>
        
        {/* Link indicativo */}
        <span style={{ fontSize: '0.9rem', color: '#007bff', fontWeight: '600', alignSelf: 'flex-start', marginTop: '4px' }}>
          Ler matéria completa →
        </span>
      </div>
    </Link>
  );
}