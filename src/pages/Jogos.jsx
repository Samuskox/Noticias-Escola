import { Link } from 'react-router-dom';
import { useParams,useNavigate } from 'react-router-dom';
import './Jogos.css';

export default function Jogos() {

  const navigate = useNavigate();
  const categoriasDeJogos = [
    {
      titulo: "📐 Jogos de Matemática",
      corClasse: "cat-azul",
      links: [
        { nome: "Matemagica", url: "https://hvirtua.com/jogoseducativos/matemagica/" },
        { nome: "Pac-Mática Subtração", url: "https://hvirtua.com/jogoseducativos/pac-matica-subtracao/" },
        { nome: "Matemática Divertida", url: "https://hvirtua.com/jogoseducativos/matematica-divertida/" },
        { nome: "Mais jogos de Matemática...", url: "https://hvirtua.com/jogoseducativos/category/destaque/"}
      ]
    },
    {
      titulo: "✏️ Jogos de Português",
      corClasse: "cat-rosa",
      links: [
        { nome: "Pula Alfabeto", url: "https://hvirtua.com/jogoseducativos/pula-alfabeto/" },
        { nome: "Ordene as Letras", url: "https://hvirtua.com/jogoseducativos/ordene-as-letras-palavras-natalinas/" },
        { nome: "Caça Palavras - Casa", url: "https://hvirtua.com/jogoseducativos/caca-palavras-casa/" },
        { nome: "Mais jogos de Português...", url: "https://hvirtua.com/jogoseducativos/category/destaque/"},
      ]
    },
    {
      titulo: "🧠 Jogos de Raciocínio",
      corClasse: "cat-verde",
      links: [
        { nome: "Quebra Ovos", url: "https://hvirtua.com/jogoseducativos/quebra-ovos/" },
        { nome: "Ligue as Cores", url: "https://hvirtua.com/jogoseducativos/ligue-as-cores/" },
        { nome: "Palavra Secreta 2", url: "https://hvirtua.com/jogoseducativos/palavra-secreta-2/" },
        { nome: "Empurre a Caixa 2", url: "https://hvirtua.com/jogoseducativos/empurre-a-caixa-2/" },
      ]
    },
    {
      titulo: "🎈 Jogos Divertidos",
      corClasse: "cat-amarelo",
      links: [
        { nome: "Super Missão", url: "https://www.escolagames.com.br/diversao/super-missao" },
        { nome: "Gire e Escape", url: "https://www.escolagames.com.br/diversao/gire-e-escape" },
        { nome: "Aventuras do Dino", url: "https://www.escolagames.com.br/diversao/aventuras-do-dino" },
        { nome: "Super Nerd", url: "https://www.escolagames.com.br/diversao/super-nerd" },
      ]
    },
    {
      titulo: "🎨 Jogos de Colorir",
      corClasse: "cat-rosa",
      links: [
        { nome: "Hora de pintar Números", url: "https://www.escolagames.com.br/jogos/hora-de-pintar-numeros" },
        { nome: "Hora de pintar Frutas", url: "https://www.escolagames.com.br/jogos/hora-de-pintar-frutas" },
        { nome: "Livro de colorir animais", url: "https://www.escolagames.com.br/diversao/livro-de-colorir-animais" },
        { nome: "Hora de pintar alfabeto", url: "https://www.escolagames.com.br/jogos/hora-de-pintar-alfabeto" },
      ]
    },
    {
      titulo: "🎲 Jogos de Tabuleiro",
      corClasse: "cat-azul",
      links: [
        { nome: "Xadrez", url: "https://www.escolagames.com.br/diversao/xadrez" },
        { nome: "4 Cores", url: "https://www.escolagames.com.br/diversao/4-cores" },
        { nome: "Jogo de Damas", url: "https://www.escolagames.com.br/diversao/jogo-de-damas" },
        { nome: "Resta um", url: "https://www.escolagames.com.br/diversao/resta-um" },
      ]
    },
    {
      titulo: "🏎️ Jogos de Corrida",
      corClasse: "cat-verde",
      links: [
        { nome: "Hora do rush", url: "https://www.escolagames.com.br/diversao/hora-do-rush" },
        { nome: "Sistema Solar", url: "https://www.escolagames.com.br/jogos/sistema-solar" },
        { nome: "Heróis dos mares", url: "https://www.escolagames.com.br/jogos/herois-dos-mares" },
        { nome: "Mapa-Múndi", url: "https://www.escolagames.com.br/jogos/mapa-mundi" },
      ]
    },
    {
      titulo: "👗 Jogos de Moda",
      corClasse: "cat-amarelo",
      links: [
        { nome: "Garota Fashion", url: "https://www.escolagames.com.br/diversao/garota-fashion" },
        { nome: "Casal Fashion", url: "https://www.escolagames.com.br/diversao/casal-fashion" },
        { nome: "Cores da moda em inglês", url: "https://www.escolagames.com.br/jogos/cores-da-moda-em-ingles" },
      ]
    }
  ];


  return (
    <div className="jogos-container">
      <button onClick={() => navigate(-1)} className="btn-voltar-home">
        ↩ Voltar para a página anterior
      </button>

      <header className="jogos-header">
        <h1>🎮 Fliperama do Sarah</h1>
        <p>Escolha uma categoria e divirta-se com os melhores jogos escolares!</p>
      </header>

      {/* Grid das Categorias de Jogos */}
      <div className="jogos-grid">
        {categoriasDeJogos.map((cat, index) => (
          <div key={index} className={`categoria-card ${cat.corClasse}`}>
            <h3>{cat.titulo}</h3>
            
            {/* Lista dos 5 links de jogos */}
            <div className="links-jogos-lista">
              {cat.links.map((link, lIndex) => (
                <a 
                  key={lIndex} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="link-jogo-botao"
                >
                  {link.nome}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
