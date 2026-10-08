
import './Sobre.css';

export default function Noticia() {
    return (
<div className="sobre-container">
  <h1>Sobre Nós</h1>
  
  <p className="sobre-texto">
    Olá meu caro leitor, seja bem-vindo ao nosso <strong>Jornal do Sarah</strong>! Aqui você encontra notícias, curiosidades e muito mais sobre a nossa escola!
  </p>

  <div className="sobre-destaque-box">
    <p>
      🏫 O projeto foi idealizado e orientado pelo Monitor de Informática: <strong>Lucas Santiago Angelo</strong> junto dos alunos do 4° Ano: <strong>Julia Faria, Bruno Carvalho, Arthur Pereira e Lorena Caetano</strong>.
    </p>
    <p>
      🎯 Nosso Objetivo é trazer, de forma simples e divertida, notícias sobre o que acontece em nossa escola, <strong>Emeb Sarah Salomão</strong>!
    </p>
  </div>

  <h3 className="sobre-lista-titulo">Teremos notícias sobre:</h3>
  <div className="sobre-grid-tags">
    <span className="sobre-tag">⚽ Esportes</span>
    <span className="sobre-tag">🎨 Cultura</span>
    <span className="sobre-tag">📚 Aprendizado</span>
    <span className="sobre-tag">🎉 Eventos</span>
    <span className="sobre-tag">✨ Novidades</span>
    <span className="sobre-tag">📢 Recados</span>
  </div>

  {/* SEÇÃO DO DESENVOLVEDOR DO SISTEMA */}
  <section className="dev-section">
    <h2>💻 Desenvolvimento do Sistema</h2>
    <div className="dev-card">
      <h3 className="dev-nome">Samuel Oliveira Lopes</h3>
      <p className="dev-cargo">Técnico em Desenvolvimento de Sistemas</p>
      <p className="dev-formacao">Formando em Ciência da Computação</p>
      
      {/* Link direto para abrir seu WhatsApp */}
      <a 
        href="https://wa.me" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="dev-contato-btn"
      >
        📞 Entrar em Contato (15) 99696-0426
      </a>
    </div>
  </section>

  <p className="sobre-rodape">
    Acompanhe essa jornada com a gente! 🌟
  </p>
</div>

    );
}