import { Link } from 'react-router-dom';
import './Jogos.css';

export default function Jogos() {
  // Lista de jogos simulados (Você pode trocar o 'url' pelos links reais depois)
  const listaJogos = [
    {
      id: 1,
      titulo: "Quebra-Cabeça Escolar",
      descricao: "Monte os blocos e descubra a imagem misteriosa da fachada da nossa escola.",
      url: "https://exemplo-jogo1.com" 
    },
    {
      id: 2,
      titulo: "Jogo da Memória",
      descricao: "Encontre os pares corretos das matérias (Matemática, História, Ciências) antes que o tempo acabe.",
      url: "https://exemplo-jogo2.com"
    },
    {
      id: 3,
      titulo: "Palavras Cruzadas",
      descricao: "Desafie seus conhecimentos sobre a história do nosso colégio e dos professores orientadores.",
      url: "https://exemplo-jogo3.com"
    },
    {
      id: 4,
      titulo: "Quiz de Conhecimentos Gerais",
      descricao: "Responda às perguntas rápidas criadas pelo Grêmio Estudantil e teste seu QI.",
      url: "https://exemplo-jogo4.com"
    }
  ];

  return (
    <div className="jogos-container">
      
      {/* Botão de navegação para voltar */}
      <Link to="/" className="btn-voltar-home">
        ← Voltar para a Página Inicial
      </Link>

      {/* Cabeçalho da Página */}
      <header className="jogos-header">
        <h1>🎮 Espaço de Jogos</h1>
        <p>Divirta-se e teste suas habilidades nos minijogos educativos.</p>
      </header>

      {/* Grid de Cards de Jogos */}
      <div className="jogos-grid">
        {listaJogos.map((jogo) => (
          <a 
            key={jogo.id}
            href={jogo.url}
            target="_blank" 
            rel="noopener noreferrer" 
            className="jogo-card"
          >
            <div>
              <h3>{jogo.titulo}</h3>
              <p>{jogo.descricao}</p>
            </div>

            <span className="btn-jogar">
              🕹️ Jogar Agora
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
