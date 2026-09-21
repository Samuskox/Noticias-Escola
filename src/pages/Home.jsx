import { Link } from 'react-router-dom';

// Exemplo de lista de notícias (depois pode vir de uma API ou LocalStorage)
const listaNoticias = [
  { id: '1', titulo: 'Feira de Ciências foi um sucesso', resumo: 'Confira as fotos dos projetos...' },
  { id: '2', titulo: 'Vídeo da final do campeonato de futsal', resumo: 'Veja os melhores momentos...' }
];

export default function Home() {
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
        <h2>Últimas Notícias</h2>
        {listaNoticias.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '12px', borderRadius: '6px' }}>
            <h3>{item.titulo}</h3>
            <p>{item.resumo}</p>
            {/* Link para a rota dinâmica */}
            <Link to={`/noticia/${item.id}`} style={{ color: 'blue', fontWeight: 'bold' }}>
              Ler matéria completa →
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}