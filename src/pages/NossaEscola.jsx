
import './NossaEscola.css';

export default function Noticia() {
    return (
<div className="escola-container">
  <h1>Nossa Escola</h1>
  
  <p className="escola-paragrafo">
    A <strong>EMEB Sarah Salomão</strong> faz parte da história da educação de São João da Boa Vista e, ao longo dos anos, vem construindo sua trajetória por meio do trabalho de muitas pessoas: alunos, professores, gestores, funcionários, famílias e toda a comunidade escolar.
  </p>

  <p className="escola-paragrafo">
    Localizada no Jardim Primavera, a escola atende atualmente alunos da Educação Infantil e do Ensino Fundamental, sendo um espaço dedicado à aprendizagem, à convivência e ao desenvolvimento de nossas crianças.
  </p>

  {/* Bloco de memória histórica em destaque */}
  <div className="escola-memoria-box">
    <h3>📖 Resgatando Nossa História</h3>
    <p>
      A trajetória da Sarah Salomão também é marcada por experiências que valorizam a criatividade e o protagonismo dos estudantes. Em 2015, por exemplo, alunos dos 4º anos participaram de um projeto em parceria com o Instituto Federal de São Paulo – Campus São João da Boa Vista, criando suas próprias histórias a partir da leitura de <em>Chapeuzinhos Coloridos</em>. Esse registro mostra como, há anos, a escola vem incentivando a imaginação, a leitura e a produção dos próprios alunos.
    </p>
  </div>

  <p className="escola-paragrafo">
    Hoje, a EMEB Sarah Salomão continua escrevendo sua história todos os dias. Cada criança que passa por seus espaços deixa uma lembrança, cada professor contribui com um ensinamento e cada família participa da construção de uma comunidade escolar mais forte.
  </p>

  <p className="escola-paragrafo">
    Mais do que um lugar onde se aprende, a Sarah Salomão é um lugar de encontros, descobertas, amizades, sonhos e memórias.
  </p>

  <div className="escola-destaque-final">
    ✨ E é assim que nossa história continua: com muitas pessoas, muitas histórias e um futuro que ainda está sendo escrito.
  </div>
</div>
    

    );
}