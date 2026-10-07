import { Link } from 'react-router-dom';

export default function Jogos() {
  // Lista de jogos simulados (Você pode trocar o 'url' pelos links reais depois)
  const listaJogos = [
    {
      id: 1,
      titulo: "🧩 Quebra-Cabeça Escolar",
      descricao: "Monte os blocos e descubra a imagem misteriosa da fachada da nossa escola.",
      url: "https://exemplo-jogo1.com" 
    },
    {
      id: 2,
      titulo: "🧠 Jogo da Memória",
      descricao: "Encontre os pares corretos das matérias (Matemática, História, Ciências) antes que o tempo acabe.",
      url: "https://exemplo-jogo2.com"
    },
    {
      id: 3,
      titulo: "✏️ Palavras Cruzadas",
      descricao: "Desafie seus conhecimentos sobre a história do nosso colégio e dos professores orientadores.",
      url: "https://exemplo-jogo3.com"
    },
    {
      id: 4,
      titulo: "📐 Quiz de Conhecimentos Gerais",
      descricao: "Responda às perguntas rápidas criadas pelo Grêmio Estudantil e teste seu QI.",
      url: "https://exemplo-jogo4.com"
    }
  ];

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px', fontFamily: 'sans-serif' }}>
      
      {/* Botão de navegação para voltar */}
      <Link to="/" style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold', fontSize: '0.95rem' }}>
        ← Voltar para a Página Inicial
      </Link>

      {/* Cabeçalho da Página */}
      <header style={{ marginTop: '20px', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '2.2rem', color: '#111', margin: '0 0 8px 0' }}>🎮 Espaço de Jogos</h1>
        <p style={{ color: '#666', margin: 0, fontSize: '1.05rem' }}>Divirta-se e teste suas habilidades nos minijogos educativos.</p>
      </header>

      {/* Grid de Cards de Jogos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '20px' 
      }}>
        {listaJogos.map((jogo) => (
          <a 
            key={jogo.id}
            href={jogo.url}
            target="_blank" // Abre o link do jogo em uma nova aba do navegador
            rel="noopener noreferrer" // Medida de segurança recomendada pelo React ao abrir links externos
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              padding: '20px', 
              background: '#ffffff', 
              border: '1px solid #e0e0e0', 
              borderRadius: '12px', 
              textDecoration: 'none', 
              color: 'inherit',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
              e.currentTarget.style.borderColor = '#007bff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
              e.currentTarget.style.borderColor = '#e0e0e0';
            }}
          >
            <div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', color: '#111' }}>
                {jogo.titulo}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#555', lineHeight: '1.4' }}>
                {jogo.descricao}
              </p>
            </div>

            <span style={{ 
              display: 'inline-block', 
              textAlign: 'center',
              padding: '10px', 
              background: '#007bff', 
              color: 'white', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              fontSize: '0.95rem' 
            }}>
              🕹️ Jogar Agora
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
